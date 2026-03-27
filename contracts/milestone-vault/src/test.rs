use super::{GrantStatus, MilestoneVault, MilestoneVaultClient};
use soroban_sdk::{
    testutils::{Address as _, Register as _},
    Address, Env, String,
};

fn setup() -> (Env, Address, Address, Address) {
    let env = Env::default();
    env.mock_all_auths();
    let sponsor = Address::generate(&env);
    let reviewer = Address::generate(&env);
    let beneficiary = Address::generate(&env);
    (env, sponsor, reviewer, beneficiary)
}

#[test]
fn grant_lifecycle_happy_path() {
    let (env, sponsor, reviewer, beneficiary) = setup();
    let contract_id = MilestoneVault.register(&env, None, ());
    let client = MilestoneVaultClient::new(&env, &contract_id);

    let grant_id = client.create_grant(
        &sponsor,
        &reviewer,
        &1_000u128,
        &String::from_str(&env, "meta-hash-001"),
    );

    let mut grant = client.get_grant(&grant_id);
    assert_eq!(grant.status, GrantStatus::Draft);
    assert_eq!(grant.total_amount, 1_000);
    assert_eq!(grant.funded_amount, 0);

    client.assign_beneficiary(&sponsor, &grant_id, &beneficiary);
    client.fund_grant(&sponsor, &grant_id, &600u128);
    client.record_decision_hash(
        &reviewer,
        &grant_id,
        &String::from_str(&env, "decision-hash-001"),
        &String::from_str(&env, "window 1 approved"),
    );
    client.release_partial(&reviewer, &grant_id, &250u128);

    grant = client.get_grant(&grant_id);
    assert_eq!(grant.status, GrantStatus::Active);
    assert_eq!(grant.beneficiary, Some(beneficiary.clone()));
    assert_eq!(grant.funded_amount, 600);
    assert_eq!(grant.released_amount, 250);
    assert_eq!(
        grant.decision_hash,
        Some(String::from_str(&env, "decision-hash-001"))
    );

    client.pause_grant(&reviewer, &grant_id, &String::from_str(&env, "risk flag"));
    grant = client.get_grant(&grant_id);
    assert_eq!(grant.status, GrantStatus::Paused);

    client.resume_grant(&sponsor, &grant_id);
    grant = client.get_grant(&grant_id);
    assert_eq!(grant.status, GrantStatus::Active);

    let reclaimed = client.reclaim_unused(&sponsor, &grant_id);
    assert_eq!(reclaimed, 350);

    grant = client.get_grant(&grant_id);
    assert_eq!(grant.status, GrantStatus::Closed);
    assert_eq!(grant.reclaimed_amount, 350);
}

#[test]
#[should_panic]
fn rejects_oversized_release() {
    let (env, sponsor, reviewer, beneficiary) = setup();
    let contract_id = MilestoneVault.register(&env, None, ());
    let client = MilestoneVaultClient::new(&env, &contract_id);

    let grant_id = client.create_grant(
        &sponsor,
        &reviewer,
        &500u128,
        &String::from_str(&env, "meta-hash-002"),
    );

    client.assign_beneficiary(&sponsor, &grant_id, &beneficiary);
    client.fund_grant(&sponsor, &grant_id, &200u128);
    client.release_partial(&reviewer, &grant_id, &300u128);
}

#[test]
#[should_panic]
fn rejects_unauthorized_manager_actions() {
    let (env, sponsor, reviewer, beneficiary) = setup();
    let contract_id = MilestoneVault.register(&env, None, ());
    let client = MilestoneVaultClient::new(&env, &contract_id);
    let outsider = Address::generate(&env);

    let grant_id = client.create_grant(
        &sponsor,
        &reviewer,
        &400u128,
        &String::from_str(&env, "meta-hash-003"),
    );

    client.assign_beneficiary(&outsider, &grant_id, &beneficiary);
}

#[test]
#[should_panic]
fn rejects_double_reclaim_after_closing() {
    let (env, sponsor, reviewer, beneficiary) = setup();
    let contract_id = MilestoneVault.register(&env, None, ());
    let client = MilestoneVaultClient::new(&env, &contract_id);

    let grant_id = client.create_grant(
        &sponsor,
        &reviewer,
        &500u128,
        &String::from_str(&env, "meta-hash-004"),
    );

    client.assign_beneficiary(&sponsor, &grant_id, &beneficiary);
    client.fund_grant(&sponsor, &grant_id, &500u128);
    let _ = client.reclaim_unused(&sponsor, &grant_id);
    client.reclaim_unused(&sponsor, &grant_id);
}
