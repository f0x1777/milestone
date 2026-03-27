#![no_std]

#[cfg(test)]
extern crate std;

use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, panic_with_error, Address, Env, String,
};

#[derive(Clone, Debug, Eq, PartialEq)]
#[contracttype]
pub enum GrantStatus {
    Draft,
    Active,
    Paused,
    Closed,
}

#[derive(Clone)]
#[contracttype]
pub struct Grant {
    pub id: u64,
    pub sponsor: Address,
    pub reviewer: Address,
    pub beneficiary: Option<Address>,
    pub total_amount: u128,
    pub funded_amount: u128,
    pub released_amount: u128,
    pub reclaimed_amount: u128,
    pub status: GrantStatus,
    pub metadata_hash: String,
    pub decision_hash: Option<String>,
    pub decision_note: Option<String>,
    pub pause_reason: Option<String>,
}

#[derive(Clone)]
#[contracttype]
pub struct GrantSummary {
    pub id: u64,
    pub sponsor: Address,
    pub reviewer: Address,
    pub beneficiary: Option<Address>,
    pub total_amount: u128,
    pub funded_amount: u128,
    pub released_amount: u128,
    pub reclaimed_amount: u128,
    pub available_amount: u128,
    pub status: GrantStatus,
    pub metadata_hash: String,
    pub decision_hash: Option<String>,
    pub pause_reason: Option<String>,
}

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    NextGrantId,
    Grant(u64),
}

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
#[contracterror]
#[repr(u32)]
pub enum MilestoneError {
    GrantNotFound = 1,
    Unauthorized = 2,
    InvalidStatus = 3,
    InvalidAmount = 4,
    MissingBeneficiary = 5,
    FundingOverflow = 6,
    InvalidParties = 7,
}

#[contract]
pub struct MilestoneVault;

#[contractimpl]
impl MilestoneVault {
    pub fn create_grant(
        env: Env,
        sponsor: Address,
        reviewer: Address,
        total_amount: u128,
        metadata_hash: String,
    ) -> u64 {
        if total_amount == 0 {
            panic_with_error!(&env, MilestoneError::InvalidAmount);
        }
        if sponsor == reviewer {
            panic_with_error!(&env, MilestoneError::InvalidParties);
        }

        sponsor.require_auth();

        let grant_id = Self::next_grant_id(&env);
        Self::set_next_grant_id(&env, grant_id + 1);

        let grant = Grant {
            id: grant_id,
            sponsor,
            reviewer,
            beneficiary: None,
            total_amount,
            funded_amount: 0,
            released_amount: 0,
            reclaimed_amount: 0,
            status: GrantStatus::Draft,
            metadata_hash,
            decision_hash: None,
            decision_note: None,
            pause_reason: None,
        };

        Self::write_grant(&env, &grant);
        grant_id
    }

    pub fn fund_grant(env: Env, sponsor: Address, grant_id: u64, amount: u128) {
        if amount == 0 {
            panic_with_error!(&env, MilestoneError::InvalidAmount);
        }
        sponsor.require_auth();

        let mut grant = Self::read_grant(&env, grant_id);
        Self::assert_sponsor(&env, &grant, &sponsor);
        Self::assert_active_or_draft(&env, &grant);

        let new_funded = grant
            .funded_amount
            .checked_add(amount)
            .unwrap_or_else(|| panic_with_error!(&env, MilestoneError::FundingOverflow));

        if new_funded > grant.total_amount {
            panic_with_error!(&env, MilestoneError::FundingOverflow);
        }

        grant.funded_amount = new_funded;
        if matches!(grant.status, GrantStatus::Draft) {
            grant.status = GrantStatus::Active;
        }

        Self::write_grant(&env, &grant);
    }

    pub fn assign_beneficiary(env: Env, actor: Address, grant_id: u64, beneficiary: Address) {
        actor.require_auth();
        let mut grant = Self::read_grant(&env, grant_id);
        Self::assert_manager(&env, &grant, &actor);

        grant.beneficiary = Some(beneficiary);
        Self::write_grant(&env, &grant);
    }

    pub fn record_decision_hash(
        env: Env,
        actor: Address,
        grant_id: u64,
        decision_hash: String,
        decision_note: String,
    ) {
        actor.require_auth();
        let mut grant = Self::read_grant(&env, grant_id);
        Self::assert_reviewer(&env, &grant, &actor);

        grant.decision_hash = Some(decision_hash);
        grant.decision_note = Some(decision_note);
        Self::write_grant(&env, &grant);
    }

    pub fn release_partial(env: Env, actor: Address, grant_id: u64, amount: u128) {
        if amount == 0 {
            panic_with_error!(&env, MilestoneError::InvalidAmount);
        }
        actor.require_auth();
        let mut grant = Self::read_grant(&env, grant_id);
        Self::assert_reviewer(&env, &grant, &actor);
        Self::assert_release_allowed(&env, &grant);

        if grant.beneficiary.is_none() {
            panic_with_error!(&env, MilestoneError::MissingBeneficiary);
        }

        let available = grant
            .funded_amount
            .checked_sub(grant.released_amount)
            .unwrap_or_else(|| panic_with_error!(&env, MilestoneError::InvalidAmount));

        if amount > available {
            panic_with_error!(&env, MilestoneError::InvalidAmount);
        }

        grant.released_amount = grant
            .released_amount
            .checked_add(amount)
            .unwrap_or_else(|| panic_with_error!(&env, MilestoneError::InvalidAmount));
        Self::write_grant(&env, &grant);
    }

    pub fn pause_grant(env: Env, actor: Address, grant_id: u64, reason: String) {
        actor.require_auth();
        let mut grant = Self::read_grant(&env, grant_id);
        Self::assert_manager(&env, &grant, &actor);
        if matches!(grant.status, GrantStatus::Closed) {
            panic_with_error!(&env, MilestoneError::InvalidStatus);
        }

        grant.status = GrantStatus::Paused;
        grant.pause_reason = Some(reason);
        Self::write_grant(&env, &grant);
    }

    pub fn resume_grant(env: Env, actor: Address, grant_id: u64) {
        actor.require_auth();
        let mut grant = Self::read_grant(&env, grant_id);
        Self::assert_manager(&env, &grant, &actor);
        if !matches!(grant.status, GrantStatus::Paused) {
            panic_with_error!(&env, MilestoneError::InvalidStatus);
        }

        grant.status = GrantStatus::Active;
        grant.pause_reason = None;
        Self::write_grant(&env, &grant);
    }

    pub fn reclaim_unused(env: Env, actor: Address, grant_id: u64) -> u128 {
        actor.require_auth();
        let mut grant = Self::read_grant(&env, grant_id);
        Self::assert_sponsor(&env, &grant, &actor);
        if matches!(grant.status, GrantStatus::Closed) {
            panic_with_error!(&env, MilestoneError::InvalidStatus);
        }

        let remaining = grant
            .funded_amount
            .checked_sub(grant.released_amount)
            .unwrap_or_else(|| panic_with_error!(&env, MilestoneError::InvalidAmount));

        grant.reclaimed_amount = grant
            .reclaimed_amount
            .checked_add(remaining)
            .unwrap_or_else(|| panic_with_error!(&env, MilestoneError::InvalidAmount));
        grant.status = GrantStatus::Closed;
        Self::write_grant(&env, &grant);
        remaining
    }

    pub fn get_grant(env: Env, grant_id: u64) -> Grant {
        Self::read_grant(&env, grant_id)
    }

    pub fn get_grant_summary(env: Env, grant_id: u64) -> GrantSummary {
        let grant = Self::read_grant(&env, grant_id);
        GrantSummary {
            available_amount: Self::available_amount(&env, &grant),
            id: grant.id,
            sponsor: grant.sponsor,
            reviewer: grant.reviewer,
            beneficiary: grant.beneficiary,
            total_amount: grant.total_amount,
            funded_amount: grant.funded_amount,
            released_amount: grant.released_amount,
            reclaimed_amount: grant.reclaimed_amount,
            status: grant.status,
            metadata_hash: grant.metadata_hash,
            decision_hash: grant.decision_hash,
            pause_reason: grant.pause_reason,
        }
    }

    fn next_grant_id(env: &Env) -> u64 {
        env.storage()
            .instance()
            .get(&DataKey::NextGrantId)
            .unwrap_or(1)
    }

    fn set_next_grant_id(env: &Env, next: u64) {
        env.storage().instance().set(&DataKey::NextGrantId, &next);
    }

    fn read_grant(env: &Env, grant_id: u64) -> Grant {
        env.storage()
            .instance()
            .get(&DataKey::Grant(grant_id))
            .unwrap_or_else(|| panic_with_error!(env, MilestoneError::GrantNotFound))
    }

    fn write_grant(env: &Env, grant: &Grant) {
        env.storage()
            .instance()
            .set(&DataKey::Grant(grant.id), grant);
    }

    fn available_amount(env: &Env, grant: &Grant) -> u128 {
        grant
            .funded_amount
            .checked_sub(grant.released_amount)
            .and_then(|amount| amount.checked_sub(grant.reclaimed_amount))
            .unwrap_or_else(|| panic_with_error!(env, MilestoneError::InvalidAmount))
    }

    fn assert_sponsor(env: &Env, grant: &Grant, actor: &Address) {
        if actor != &grant.sponsor {
            panic_with_error!(env, MilestoneError::Unauthorized);
        }
    }

    fn assert_reviewer(env: &Env, grant: &Grant, actor: &Address) {
        if actor != &grant.reviewer {
            panic_with_error!(env, MilestoneError::Unauthorized);
        }
    }

    fn assert_manager(env: &Env, grant: &Grant, actor: &Address) {
        if actor != &grant.sponsor && actor != &grant.reviewer {
            panic_with_error!(env, MilestoneError::Unauthorized);
        }
    }

    fn assert_active_or_draft(env: &Env, grant: &Grant) {
        if !matches!(grant.status, GrantStatus::Draft | GrantStatus::Active) {
            panic_with_error!(env, MilestoneError::InvalidStatus);
        }
    }

    fn assert_release_allowed(env: &Env, grant: &Grant) {
        if !matches!(grant.status, GrantStatus::Active) {
            panic_with_error!(env, MilestoneError::InvalidStatus);
        }
    }
}

#[cfg(test)]
mod test;
