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
        nextPath,
      }),
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
        nextPath,
      }),
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
            error instanceof Error
              ? error.message
              : "Freighter connection failed.";
          setError(message);
        }
      })();
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <form
        onSubmit={handlePasswordSubmit}
        className="rounded-3xl border border-charcoal-100 bg-white p-6 shadow-card"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-milestone-200 bg-milestone-50 px-3 py-1.5 text-xs font-semibold text-milestone-600">
          <Wallet className="h-3.5 w-3.5" />
          Demo credentials available
        </div>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-charcoal-900">
          Sign in to Milestone
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-charcoal-400">
          Access your grant dashboard to manage funds, review evidence, and
          track releases. Use the demo credentials below or connect your
          Stellar wallet.
        </p>

        <div className="mt-6 space-y-4">
          <div className="grid gap-2">
            <label
              className="text-sm font-medium text-charcoal-600"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              placeholder="team@milestone.app"
              className="rounded-xl border border-charcoal-200 bg-charcoal-50 px-4 py-3 text-charcoal-800 outline-none transition placeholder:text-charcoal-300 focus:border-milestone-400 focus:ring-2 focus:ring-milestone-100"
            />
          </div>
          <div className="grid gap-2">
            <label
              className="text-sm font-medium text-charcoal-600"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="team@milestone.app"
              className="rounded-xl border border-charcoal-200 bg-charcoal-50 px-4 py-3 text-charcoal-800 outline-none transition placeholder:text-charcoal-300 focus:border-milestone-400 focus:ring-2 focus:ring-milestone-100"
            />
          </div>
        </div>

        {error ? (
          <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
            {error}
          </p>
        ) : null}

        <div className="mt-6 flex items-center gap-3">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-charcoal-800 to-charcoal-950 px-6 py-3 text-sm font-semibold text-white shadow-cta-inset transition-all hover:from-charcoal-900 hover:to-black disabled:opacity-60"
            disabled={isPending}
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Sign in
          </button>
          <span className="text-xs text-charcoal-400">
            Demo: {mockCredentials.email}
          </span>
        </div>
      </form>

      <div className="rounded-3xl border border-charcoal-100 bg-white p-6 shadow-card">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-milestone-400">
          Wallet authentication
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-charcoal-900">
          Connect your Stellar wallet
        </h2>
        <p className="mt-3 text-sm leading-6 text-charcoal-400">
          Sign in with Freighter to access your grants with your Stellar
          identity. Wallet-based authentication ensures that sponsors and
          reviewers can sign transactions directly.
        </p>

        <div className="mt-6 grid gap-3">
          <button
            type="button"
            onClick={handleWalletConnect}
            className="flex items-center justify-between rounded-xl border border-charcoal-200 bg-charcoal-50 px-4 py-3.5 text-left text-sm text-charcoal-700 transition hover:border-milestone-300 hover:bg-milestone-50"
          >
            <span className="font-medium">
              {supportedWalletProviders[0]}
            </span>
            <span className="text-xs text-charcoal-400">
              connect wallet
            </span>
          </button>
        </div>

        <div className="mt-6 rounded-xl border border-dashed border-charcoal-200 bg-charcoal-50 p-4 text-sm text-charcoal-400">
          Wallet sessions will derive from a signed challenge using your
          Stellar account. The demo fallback login is available for reviewers
          who don&apos;t have the Freighter extension installed.
        </div>
      </div>
    </div>
  );
}
