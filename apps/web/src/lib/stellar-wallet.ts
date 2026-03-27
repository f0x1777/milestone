let initialized = false;

export async function connectFreighterWallet() {
  const [{ StellarWalletsKit }, { FreighterModule, FREIGHTER_ID }, { Networks }] =
    await Promise.all([
      import("@creit.tech/stellar-wallets-kit/sdk"),
      import("@creit.tech/stellar-wallets-kit/modules/freighter"),
      import("@creit.tech/stellar-wallets-kit/types")
    ]);

  if (!initialized) {
    StellarWalletsKit.init({
      modules: [new FreighterModule()],
      selectedWalletId: FREIGHTER_ID,
      network: Networks.TESTNET
    });
    initialized = true;
  } else {
    StellarWalletsKit.setWallet(FREIGHTER_ID);
    StellarWalletsKit.setNetwork(Networks.TESTNET);
  }

  return StellarWalletsKit.getAddress();
}
