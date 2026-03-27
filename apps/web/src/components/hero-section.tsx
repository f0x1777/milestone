"use client";

import { motion } from "motion/react";
import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import { MilestoneLogo } from "./milestone-logo";

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover [transform:scaleY(-1)]"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260302_085640_276ea93b-d7da-4418-a09b-2aa5b490e838.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[26.416%] from-[rgba(255,255,255,0)] to-[66.943%] to-white" />
      </div>

      {/* Navigation */}
      <div className="relative z-20">
        <nav className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-6">
          <MilestoneLogo className="h-8 text-charcoal-800" />
          <div className="flex items-center gap-6">
            <Link
              href="/transparency"
              className="text-sm font-medium text-charcoal-600 transition-colors hover:text-charcoal-900"
            >
              Transparency
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-charcoal-600 transition-colors hover:text-charcoal-900"
            >
              Dashboard
            </Link>
            <Link
              href="/auth"
              className="rounded-full bg-charcoal-900 px-5 py-2.5 text-sm font-medium text-white shadow-cta-inset transition-all hover:bg-charcoal-950"
            >
              Sign in
            </Link>
          </div>
        </nav>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 mx-auto max-w-[1200px] px-6 pt-[290px]">
        <div className="flex flex-col gap-8">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-[800px] text-[80px] font-medium leading-[0.95] tracking-[-0.04em] text-charcoal-900"
          >
            Fund{" "}
            <span className="font-instrument italic text-[100px] text-milestone-400">
              outcomes
            </span>
            , not promises
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="max-w-[554px] text-lg leading-relaxed text-[#373a46]/80"
          >
            Milestone turns grants into controlled release flows on Stellar.
            Deposit funds, collect evidence, review decisions, and release
            payments — all with a verifiable audit trail.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex flex-col gap-5"
          >
            {/* Email Input */}
            <div className="flex w-full max-w-[520px] items-center gap-3 rounded-[40px] border border-charcoal-100 bg-[#fcfcfc] py-2 pl-6 pr-2 shadow-input">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 bg-transparent text-sm text-charcoal-800 outline-none placeholder:text-charcoal-300"
              />
              <Link
                href="/auth"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-charcoal-800 to-charcoal-950 px-6 py-3 text-sm font-semibold text-white shadow-cta-inset transition-all hover:from-charcoal-900 hover:to-black"
              >
                Start for Free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-charcoal-600">
                Trusted by grant programs worldwide
              </span>
              <div className="flex items-center gap-2 border-l border-charcoal-200 pl-3">
                <div className="flex -space-x-2">
                  {[
                    "bg-milestone-400",
                    "bg-charcoal-400",
                    "bg-milestone-600",
                    "bg-charcoal-600",
                  ].map((bg, i) => (
                    <div
                      key={i}
                      className={`h-6 w-6 rounded-full border-2 border-white ${bg}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
