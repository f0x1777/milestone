"use client";

import { useState, useTransition, type FormEvent } from "react";
import { Loader2, Wallet } from "lucide-react";
import { mockCredentials, supportedWalletProviders } from "@/lib/mock-auth";
import { connectFreighterWallet } from "@/lib/stellar-wallet";

export function AuthForm({ nextPath }: { nextPath: string }) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function submitPassword(formData: FormData) {
    setError(null);
    const response = await fetch("/api/mock-auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "password",
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
        nextPath
      })
    });

    if (!response.ok) {
      const payload = (await response.json()) as { error?: string };
      setError(payload.error ?? "Could not authenticate.");
      return;
    }

    window.location.href = nextPath || "/dashboard";
  }

  function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => {
      void submitPassword(formData);
    });
  }

  async function submitWallet(walletLabel: string, walletAddress?: string) {
    setError(null);
    const response = await fetch("/api/mock-auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "wallet",
        walletLabel,
        walletAddress,
        nextPath
      })
    });

    if (!response.ok) {
      const payload = (await response.json()) as { error?: string };
      setError(payload.error ?? "Wallet login placeholder failed.");
      return;
    }

    window.location.href = nextPath || "/dashboard";
  }

  function handleWalletConnect() {
    startTransition(() => {
      void (async () => {
        try {
          const { address } = await connectFreighterWallet();
          await submitWallet("Freighter", address);
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Freighter connection failed.";
          setError(message);
        }
      })();
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <form onSubmit={handlePasswordSubmit} className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-halo backdrop-blur-xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand-300/20 bg-brand-400/10 px-3 py-1 text-xs font-medium text-brand-100">
          <Wallet className="h-3.5 w-3.5" />
          Mock auth enabled for the MVP scaffold
        </div>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-white">
          Sign in to Milestone
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-white/68">
          Use hardcoded credentials for now or stub a wallet connection. The
          actual wallet signature and Stellar session layer will replace this in
          the next iteration.
        </p>

        <div className="mt-6 space-y-4">
          <div className="grid gap-2">
            <label className="text-sm text-white/70" htmlFor="email">
              Generic email
            </label>
            <input
              id="email"
              name="email"
              placeholder="team@milestone.app"
              className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition placeholder:text-white/28 focus:border-brand-300/50"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm text-white/70" htmlFor="password">
              Generic password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="milestone-demo"
              className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition placeholder:text-white/28 focus:border-brand-300/50"
            />
          </div>
        </div>

        {error ? (
          <p className="mt-4 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
            {error}
          </p>
        ) : null}

        <div className="mt-6 flex items-center gap-3">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full bg-brand-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-brand-300 disabled:opacity-60"
            disabled={isPending}
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Enter with credentials
          </button>
          <span className="text-xs text-white/45">
            Email: {mockCredentials.email}
          </span>
        </div>
      </form>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-halo backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.3em] text-brand-200/70">
          Wallet login
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-white">
          Freighter-first flow for the Stellar demo
        </h2>
        <p className="mt-3 text-sm leading-6 text-white/64">
          This path uses Stellar Wallets Kit with Freighter as the visible
          hackathon wallet. The generic login remains available so judges can
          still inspect the dashboard even if the extension is not installed.
        </p>

        <div className="mt-6 grid gap-3">
          <button
            type="button"
            onClick={handleWalletConnect}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 text-left text-sm text-white transition hover:border-brand-300/30 hover:bg-slate-950/70"
          >
            <span>{supportedWalletProviders[0]}</span>
            <span className="text-xs text-white/38">
              connect with extension
            </span>
          </button>
        </div>

        <div className="mt-6 rounded-2xl border border-dashed border-white/12 bg-black/20 p-4 text-sm text-white/64">
          Wallet sessions should eventually derive from a signed challenge and
          the Stellar account. This scaffold already preserves the Freighter
          path while the generic fallback keeps the demo moving.
        </div>
      </div>
    </div>
  );
}
