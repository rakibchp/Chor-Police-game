"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  createRound,
  roles,
  type RoleId,
  type RoundDeal,
} from "./roles";

type RoundResult = {
  correct: boolean;
  chorIndex: number;
  guessIndex: number;
};

const roleCardStyles: Record<RoleId, string> = {
  raja: "border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-100 text-amber-800",
  mantri:
    "border-sky-200 bg-gradient-to-br from-sky-50 to-cyan-100 text-sky-800",
  police:
    "border-violet-200 bg-gradient-to-br from-violet-50 to-purple-100 text-violet-800",
  chor: "border-pink-200 bg-gradient-to-br from-pink-50 to-rose-100 text-pink-800",
};

function DealCards({
  deal,
  result,
  onChoose,
}: {
  deal: RoundDeal;
  result: RoundResult | null;
  onChoose: (index: number) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      {deal.roles.map((role, index) => {
        const isPossible = deal.hint.possibleIndices.includes(index);
        const isWrongGuess = result?.guessIndex === index && !result.correct;

        return (
          <button
            key={`${index}-${role.id}`}
            type="button"
            className={`group relative flex min-h-44 flex-col items-center justify-between overflow-hidden rounded-2xl border-2 p-3 text-center shadow-[0_8px_18px_-12px_rgba(70,38,116,0.5)] transition duration-200 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-pink-400 sm:min-h-52 sm:p-4 ${
              result
                ? `${roleCardStyles[role.id]} ${
                    result.chorIndex === index
                      ? "scale-[1.03] border-pink-400 shadow-[0_12px_28px_-10px_rgba(219,39,119,0.45)]"
                      : ""
                  } ${
                    isWrongGuess
                      ? "ring-4 ring-rose-300 ring-offset-2 ring-offset-white"
                      : ""
                  }`
                : "card-back border-violet-500 bg-gradient-to-br from-violet-700 via-purple-700 to-fuchsia-600 text-white hover:-translate-y-1 hover:shadow-[0_14px_24px_-12px_rgba(70,38,116,0.65)]"
            } ${!isPossible && !result ? "opacity-70" : ""} ${
              result ? "cursor-default" : "cursor-pointer"
            }`}
            onClick={() => onChoose(index)}
            disabled={result !== null || !deal.ready || !isPossible}
            aria-label={
              result
                ? `Card ${index + 1}: ${role.name}, ${role.points} points${
                    result.guessIndex === index ? ", your guess" : ""
                  }`
                : `Guess card ${index + 1}${
                    isPossible ? ", matches the clue" : ", ruled out by the clue"
                  }`
            }
            aria-pressed={result?.guessIndex === index}
          >
            {!result ? (
              <>
                <span className="flex w-full items-center justify-between text-[10px] font-bold tracking-[0.16em] text-white/75">
                  <span>CARD</span>
                  <span className="rounded-full bg-white/15 px-2 py-1">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </span>
                <span className="card-suit flex size-16 items-center justify-center rounded-full border border-white/35 bg-white/10 text-3xl shadow-inner transition group-hover:rotate-6 group-hover:scale-105">
                  ✦
                </span>
                <span className="flex min-h-8 items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white/90">
                  {deal.ready ? (
                    isPossible ? (
                      <>
                        <span className="size-1.5 rounded-full bg-pink-200" />
                        Possible
                      </>
                    ) : (
                      "Not this one"
                    )
                  ) : (
                    "Shuffling..."
                  )}
                </span>
              </>
            ) : (
              <>
                <span className="flex w-full items-center justify-between text-[10px] font-bold tracking-[0.16em] opacity-65">
                  <span>CARD</span>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </span>
                <span className="text-4xl drop-shadow-sm" aria-hidden="true">
                  {role.icon}
                </span>
                <span>
                  <span className="block text-sm font-extrabold">
                    {role.name}
                  </span>
                  <span className="mt-0.5 block text-[11px] font-medium opacity-70">
                    {role.bengali}
                  </span>
                  <span className="mt-1.5 block text-[10px] font-bold uppercase tracking-[0.1em] opacity-65">
                    {role.points.toLocaleString()} pts
                  </span>
                </span>
              </>
            )}
          </button>
        );
      })}
    </div>
  );
}

function Scoreboard({ score, round }: { score: number; round: number }) {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <div className="min-w-24 rounded-2xl border border-pink-100 bg-pink-50/80 px-3 py-2 text-right sm:min-w-32 sm:px-4">
        <span className="block text-[9px] font-extrabold tracking-[0.16em] text-pink-500">
          YOUR SCORE
        </span>
        <span className="block text-lg font-black leading-tight text-violet-950 sm:text-xl">
          {score.toLocaleString()}{" "}
          <span className="text-xs font-bold text-violet-500">pts</span>
        </span>
      </div>
      <div className="min-w-20 rounded-2xl border border-violet-100 bg-violet-50/80 px-3 py-2 text-right sm:min-w-24">
        <span className="block text-[9px] font-extrabold tracking-[0.16em] text-violet-500">
          ROUND
        </span>
        <span className="block text-lg font-black leading-tight text-violet-950 sm:text-xl">
          {String(round).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}

function RoleLegend() {
  return (
    <section
      aria-labelledby="roles-heading"
      className="rounded-3xl border border-white bg-white/90 p-5 shadow-[0_12px_36px_-26px_rgba(70,38,116,0.35)] sm:p-6"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2
          id="roles-heading"
          className="text-base font-extrabold text-violet-950"
        >
          The roles
        </h2>
        <span className="text-xs font-semibold text-violet-400">and points</span>
      </div>
      <ul className="space-y-2.5">
        {roles.map((role) => (
          <li
            key={role.id}
            className="flex items-center gap-3 rounded-xl bg-violet-50/65 px-3 py-2.5"
          >
            <span className="text-xl" aria-hidden="true">
              {role.icon}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold text-violet-950">
                {role.name}
              </span>
              <span className="block text-xs text-violet-500">
                {role.bengali}
              </span>
            </span>
            <span className="text-xs font-extrabold text-violet-700">
              {role.points.toLocaleString()} pts
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-4 rounded-xl border border-pink-100 bg-pink-50/80 px-3 py-2.5 text-xs leading-relaxed text-pink-800">
        Guess the Chor to earn the Police reward: <strong>800 points.</strong>
      </p>
    </section>
  );
}

export default function Game() {
  const [deal, setDeal] = useState<RoundDeal>({
    roles,
    hint: { text: "Shuffling the cards...", possibleIndices: [] },
    ready: false,
  });
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState<RoundResult | null>(null);

  useEffect(() => {
    // Keep random values out of the server-rendered markup to avoid hydration mismatches.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDeal(createRound());
  }, []);

  function chooseCard(index: number) {
    if (!deal.ready || result || !deal.hint.possibleIndices.includes(index)) {
      return;
    }

    const chorIndex = deal.roles.findIndex((role) => role.id === "chor");
    const correct = deal.roles[index]?.id === "chor";

    setResult({ correct, chorIndex, guessIndex: index });
    if (correct) setScore((currentScore) => currentScore + 800);
  }

  function playNextRound() {
    setDeal(createRound());
    setResult(null);
    setRound((currentRound) => currentRound + 1);
  }

  const police = roles.find((role) => role.id === "police");

  return (
    <main className="page-backdrop relative min-h-dvh overflow-hidden px-4 pb-8 pt-5 sm:px-7 sm:pt-7 lg:px-10">
      <div className="pointer-events-none absolute -left-28 top-56 size-72 rounded-full bg-pink-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-20 size-96 rounded-full bg-violet-200/35 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <header className="flex items-center justify-between gap-4">
          <Link
            href="/"
            aria-label="Chor Police home"
            className="flex min-w-0 items-center gap-3 rounded-xl focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-pink-400"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-2xl text-white shadow-lg shadow-violet-200">
              ✦
            </span>
            <span className="min-w-0">
              <strong className="block text-sm font-black tracking-tight text-violet-950 sm:text-base">
                Chor Police
              </strong>
              <span className="block text-xs font-medium text-violet-500">
                চোর পুলিশ
              </span>
            </span>
          </Link>
          <div className="hidden rounded-full border border-violet-100 bg-white/75 px-4 py-2 text-xs font-semibold text-violet-600 shadow-sm sm:block">
            A little game of wit &amp; luck
          </div>
          <div className="rounded-full border border-pink-100 bg-white/80 px-3 py-2 text-[10px] font-extrabold tracking-[0.12em] text-pink-600 sm:hidden">
            ✦ CLASSIC GAME
          </div>
        </header>

        <section className="mb-7 mt-9 flex flex-col justify-between gap-5 sm:mb-8 sm:mt-12 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="mb-2 flex items-center gap-2 text-[10px] font-extrabold tracking-[0.2em] text-pink-600 sm:text-xs">
              <span className="text-sm">✳</span>
              THE CLASSROOM CLASSIC, REIMAGINED
            </p>
            <h1 className="text-4xl font-black leading-[1.05] tracking-[-0.045em] text-violet-950 sm:text-5xl lg:text-6xl">
              Can you catch
              <br className="sm:hidden" /> the{" "}
              <span className="bg-gradient-to-r from-fuchsia-600 to-pink-500 bg-clip-text text-transparent">
                Chor?
              </span>
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-6 text-violet-600 sm:text-base">
              Trust your instincts, Detective. Follow the clue, choose a card,
              and find the thief.
            </p>
          </div>
          <div className="flex w-fit items-center gap-2 rounded-full border border-pink-100 bg-white/85 px-4 py-2 text-xs font-bold text-violet-700 shadow-sm">
            <span className="text-pink-500" aria-hidden="true">
              ✳
            </span>
            ROUND {String(round).padStart(2, "0")}
          </div>
        </section>

        <section
          aria-label="Chor Police game"
          className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.8fr)] lg:gap-6"
        >
          <div className="overflow-hidden rounded-[1.75rem] border border-white bg-white/95 p-4 shadow-[0_20px_60px_-34px_rgba(69,36,113,0.45)] sm:rounded-[2rem] sm:p-7 lg:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-violet-100 pb-5">
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-violet-100 text-2xl">
                  {police?.icon}
                </span>
                <span>
                  <span className="block text-[9px] font-extrabold tracking-[0.17em] text-violet-400">
                    YOU ARE
                  </span>
                  <strong className="block text-sm font-extrabold text-violet-950">
                    Police <span className="text-violet-500">পুলিশ</span>
                  </strong>
                </span>
              </div>
              <Scoreboard score={score} round={round} />
            </div>

            <div className="pb-5 pt-6 sm:pb-6 sm:pt-8">
              <div className="mb-4">
                <h2 className="text-xl font-black tracking-tight text-violet-950 sm:text-2xl">
                  Who&apos;s hiding in the cards?
                </h2>
                <p className="mt-1 text-sm text-violet-500">
                  {result
                    ? "The roles are revealed. Ready for another round?"
                    : "Use your clue to narrow it down, then tap your guess."}
                </p>
              </div>

              <DealCards deal={deal} result={result} onChoose={chooseCard} />
            </div>

            {result ? (
              <div
                className={`flex flex-col gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 ${
                  result.correct
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-pink-100 bg-pink-50"
                }`}
                aria-live="polite"
                role="status"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-xl" aria-hidden="true">
                    {result.correct ? "🎉" : "🕵️"}
                  </span>
                  <span>
                    <strong
                      className={`block text-sm font-extrabold ${
                        result.correct ? "text-emerald-800" : "text-pink-800"
                      }`}
                    >
                      {result.correct
                        ? "You caught the Chor!"
                        : "The Chor got away!"}
                    </strong>
                    <span className="mt-0.5 block text-xs leading-relaxed text-violet-600">
                      {result.correct
                        ? "Brilliant detective work. You earned 800 points."
                        : `The Chor was hiding in card ${String(
                            result.chorIndex + 1,
                          ).padStart(2, "0")}. Try again next round!`}
                    </span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={playNextRound}
                  className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-xs font-extrabold text-white shadow-md shadow-violet-200 transition hover:bg-violet-800 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-pink-400"
                >
                  Play next round <span aria-hidden="true">→</span>
                </button>
              </div>
            ) : (
              <div
                className="flex items-start gap-3 rounded-2xl border border-violet-100 bg-violet-50/75 px-4 py-3.5"
                aria-live="polite"
              >
                <span className="mt-0.5 text-pink-500" aria-hidden="true">
                  ✦
                </span>
                <p className="text-xs leading-relaxed text-violet-700 sm:text-sm">
                  <strong className="font-extrabold text-violet-900">
                    {deal.ready ? "Clue:" : "One moment:"}
                  </strong>{" "}
                  {deal.hint.text}
                </p>
              </div>
            )}
          </div>

          <aside className="space-y-5">
            <section className="rounded-3xl border border-white bg-white/90 p-5 shadow-[0_12px_36px_-26px_rgba(70,38,116,0.35)] sm:p-6">
              <div className="mb-4 flex items-center gap-2">
                <span className="text-pink-500" aria-hidden="true">
                  ✳
                </span>
                <h2 className="text-base font-extrabold text-violet-950">
                  How to play
                </h2>
              </div>
              <ol className="space-y-3">
                {[
                  <>
                    You&apos;re the <strong>Police</strong> this round.
                  </>,
                  <>
                    Use the clue to find the two <strong>possible</strong>{" "}
                    cards.
                  </>,
                  <>
                    Pick the <strong>Chor</strong> to earn 800 points!
                  </>,
                ].map((instruction, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-sm leading-relaxed text-violet-700"
                  >
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-pink-100 text-[10px] font-extrabold text-pink-700">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="pt-0.5">{instruction}</p>
                  </li>
                ))}
              </ol>
              <div className="mt-5 flex items-start gap-2.5 rounded-2xl bg-violet-50 px-3.5 py-3">
                <span className="mt-0.5 text-pink-500" aria-hidden="true">
                  ✦
                </span>
                <p className="text-xs leading-relaxed text-violet-700">
                  Every round shuffles all four roles. The clue always leaves
                  two cards to investigate.
                </p>
              </div>
            </section>

            <RoleLegend />
            <p className="px-2 text-center text-xs font-medium text-violet-400">
              Made for little detectives <span className="text-pink-400">♥</span>
            </p>
          </aside>
        </section>

        <footer className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-violet-100/80 pt-5 text-center text-[10px] font-semibold tracking-wide text-violet-400 sm:flex-row sm:text-left">
          <span>CHOR POLICE · চোর পুলিশ</span>
          <span>A paper-slip classic, now a little more magical.</span>
        </footer>
      </div>
    </main>
  );
}
