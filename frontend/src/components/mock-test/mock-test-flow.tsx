"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  MAX_ATTEMPTS,
  PASS_PERCENT,
  QUESTION_COUNT,
  type MockQuestion,
  type MockTrackId,
  questionsForDisplay,
  scoreAnswers,
} from "@/data/mock-tests";
import { setMockTestCompleted } from "@/lib/pricing-access";

const STORAGE_ATTEMPTS = "goscale_mock_attempt_counts";

type AttemptCounts = Record<MockTrackId, number>;

function readAttempts(): AttemptCounts {
  if (typeof window === "undefined") return { nonTechnical: 0, technical: 0 };
  try {
    const raw = window.localStorage.getItem(STORAGE_ATTEMPTS);
    if (!raw) return { nonTechnical: 0, technical: 0 };
    const j = JSON.parse(raw) as Partial<AttemptCounts>;
    return {
      nonTechnical: typeof j.nonTechnical === "number" ? j.nonTechnical : 0,
      technical: typeof j.technical === "number" ? j.technical : 0,
    };
  } catch {
    return { nonTechnical: 0, technical: 0 };
  }
}

function writeAttempts(c: AttemptCounts) {
  window.localStorage.setItem(STORAGE_ATTEMPTS, JSON.stringify(c));
}

type Step =
  | "eligibility"
  | "education"
  | "track"
  | "test"
  | "result"
  | "ineligible";

export function MockTestFlow() {
  const [step, setStep] = useState<Step>("eligibility");
  const [twelfthStatus, setTwelfthStatus] = useState<"passed" | "in12" | null>(null);
  const [educationCtx, setEducationCtx] = useState<string>("");
  const [track, setTrack] = useState<MockTrackId | null>(null);
  const [questions, setQuestions] = useState<MockQuestion[]>([]);
  const [answers, setAnswers] = useState<(number | null)[]>(() => Array(QUESTION_COUNT).fill(null));
  const [score, setScore] = useState<number | null>(null);
  const [attempts, setAttempts] = useState<AttemptCounts>({ nonTechnical: 0, technical: 0 });

  const syncAttempts = useCallback(() => {
    setAttempts(readAttempts());
  }, []);

  useEffect(() => {
    syncAttempts();
  }, [syncAttempts]);

  const attemptsLeft = track ? MAX_ATTEMPTS - attempts[track] : MAX_ATTEMPTS;

  function startEducation() {
    if (twelfthStatus !== "passed") {
      setStep("ineligible");
      return;
    }
    setStep("education");
  }

  function continueToTrack() {
    setStep("track");
  }

  function chooseTrack(t: MockTrackId) {
    const counts = readAttempts();
    if (counts[t] >= MAX_ATTEMPTS) return;
    setTrack(t);
    setQuestions(questionsForDisplay(t));
    setAnswers(Array(QUESTION_COUNT).fill(null));
    setStep("test");
  }

  function submitTest() {
    if (!track || questions.length === 0) return;
    const unanswered = answers.some((a) => a === null);
    if (unanswered) {
      window.alert(`Please answer all ${QUESTION_COUNT} questions before submitting.`);
      return;
    }
    const correct = scoreAnswers(questions, answers);
    setScore(correct);
    const counts = readAttempts();
    counts[track] = (counts[track] ?? 0) + 1;
    writeAttempts(counts);
    setAttempts(counts);
    setMockTestCompleted();
    setStep("result");
  }

  const passed = score !== null && (score / QUESTION_COUNT) * 100 >= PASS_PERCENT;

  const byBand = useMemo(() => {
    if (questions.length === 0) return { easy: 0, medium: 0, hard: 0, easyT: 0, mediumT: 0, hardT: 0 };
    let easy = 0,
      medium = 0,
      hard = 0;
    let easyT = 0,
      mediumT = 0,
      hardT = 0;
    questions.forEach((q, i) => {
      const ok = answers[i] === q.correctAnswer;
      if (q.difficulty === "easy") {
        easyT++;
        if (ok) easy++;
      } else if (q.difficulty === "medium") {
        mediumT++;
        if (ok) medium++;
      } else {
        hardT++;
        if (ok) hard++;
      }
    });
    return { easy, medium, hard, easyT, mediumT, hardT };
  }, [questions, answers]);

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-16 pt-8">
      <div>
        <p className="section-eyebrow tracking-[0.2em]">
          Eligibility & aptitude
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
          Mock test (20 MCQs)
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Easy · Medium · Hard · 50% to pass · up to {MAX_ATTEMPTS} attempts per track (browser).
        </p>
      </div>

      {step === "eligibility" ? (
        <section className="glass rounded-2xl p-6 dark:border-white/10">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">1. Education eligibility</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            This program is open to candidates who have <strong className="text-slate-800 dark:text-slate-200">passed 12th</strong>{" "}
            (or equivalent). Graduation is not mandatory. If you are <strong>still in 12th</strong>, you are not eligible yet.
          </p>
          <div className="mt-4 space-y-3">
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900/80">
              <input
                type="radio"
                name="twelfth"
                checked={twelfthStatus === "passed"}
                onChange={() => setTwelfthStatus("passed")}
                className="mt-1"
              />
              <span className="text-sm text-slate-800 dark:text-slate-200">
                I have passed 12th class or equivalent (or higher).
              </span>
            </label>
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900/80">
              <input
                type="radio"
                name="twelfth"
                checked={twelfthStatus === "in12"}
                onChange={() => setTwelfthStatus("in12")}
                className="mt-1"
              />
              <span className="text-sm text-slate-800 dark:text-slate-200">I am currently studying in 12th (not passed yet).</span>
            </label>
          </div>
          <button
            type="button"
            onClick={startEducation}
            disabled={!twelfthStatus}
            className="btn-accent-sm mt-6 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continue
          </button>
        </section>
      ) : null}

      {step === "ineligible" ? (
        <section className="glass rounded-2xl border-amber-200/80 bg-amber-50/90 p-6 dark:border-amber-500/30 dark:bg-amber-950/40">
          <h2 className="text-lg font-semibold text-amber-950 dark:text-amber-100">Not eligible yet</h2>
          <p className="mt-2 text-sm text-amber-900/90 dark:text-amber-200/90">
            Once you pass 12th (or equivalent), you can return and take this mock test. Focus on your board exams first.
          </p>
          <Link href="/" className="btn-secondary mt-6 inline-flex text-sm">
            Back to home
          </Link>
        </section>
      ) : null}

      {step === "education" ? (
        <section className="glass rounded-2xl p-6 dark:border-white/10">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">2. Your background (optional)</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Helps us understand you — employed, studying, or exploring. Does not block the test.
          </p>
          <select
            value={educationCtx}
            onChange={(e) => setEducationCtx(e.target.value)}
            className="mt-4 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="">Select…</option>
            <option value="employed">Working / employed</option>
            <option value="ug">Pursuing UG (B.Tech / B.Sc / etc.)</option>
            <option value="drop">Career break / exploring</option>
            <option value="other">Other</option>
          </select>
          <button type="button" onClick={continueToTrack} className="btn-accent-sm mt-6">
            Continue to test type
          </button>
        </section>
      ) : null}

      {step === "track" ? (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">3. Choose your track</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Non-technical: mindset, goals, basic AI & digital literacy. Technical: CS fundamentals for people with some IT
            background.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => chooseTrack("nonTechnical")}
              disabled={attempts.nonTechnical >= MAX_ATTEMPTS}
              className="glass glass-hover rounded-2xl border border-slate-200 p-5 text-left transition dark:border-white/10"
            >
              <p className="font-semibold text-slate-900 dark:text-slate-50">Non-technical aptitude</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                12th+ , no CS background required. Goals, discipline, basic IT & AI awareness.
              </p>
              <p className="mt-3 text-xs text-slate-500">
                Attempts left: {MAX_ATTEMPTS - attempts.nonTechnical} / {MAX_ATTEMPTS}
              </p>
            </button>
            <button
              type="button"
              onClick={() => chooseTrack("technical")}
              disabled={attempts.technical >= MAX_ATTEMPTS}
              className="glass glass-hover rounded-2xl border border-slate-200 p-5 text-left transition dark:border-white/10"
            >
              <p className="font-semibold text-slate-900 dark:text-slate-50">Technical / experienced</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                For candidates with CS, coding, or IT work exposure.
              </p>
              <p className="mt-3 text-xs text-slate-500">
                Attempts left: {MAX_ATTEMPTS - attempts.technical} / {MAX_ATTEMPTS}
              </p>
            </button>
          </div>
        </section>
      ) : null}

      {step === "test" && questions.length > 0 ? (
        <section className="space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-500">
            <span>
              Track: <strong className="text-slate-300">{track === "technical" ? "Technical" : "Non-technical"}</strong>
            </span>
            <span>
              Attempts used after submit will count · {attemptsLeft} left before this attempt
            </span>
          </div>

          {(["easy", "medium", "hard"] as const).map((band) => {
            const qs = questions.filter((q) => q.difficulty === band);
            if (qs.length === 0) return null;
            const label = band === "easy" ? "Easy (Q1–7)" : band === "medium" ? "Medium (Q8–14)" : "Hard (Q15–20)";
            return (
              <div key={band} className="space-y-4">
                <h3 className="section-eyebrow w-full text-left text-sm tracking-wide">{label}</h3>
                {qs.map((q) => {
                  const idx = questions.findIndex((x) => x.id === q.id);
                  return (
                    <fieldset key={q.id} className="glass rounded-xl p-4 dark:border-white/10">
                      <legend className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        Q{q.id}. {q.question}
                      </legend>
                      <div className="mt-3 space-y-2">
                        {q.options.map((opt, oi) => (
                          <label
                            key={oi}
                            className="flex cursor-pointer items-start gap-3 rounded-lg border border-transparent px-2 py-2 hover:bg-slate-100/80 dark:hover:bg-white/5"
                          >
                            <input
                              type="radio"
                              name={`q-${idx}`}
                              checked={answers[idx] === oi}
                              onChange={() => {
                                const next = [...answers];
                                next[idx] = oi;
                                setAnswers(next);
                              }}
                              className="mt-1"
                            />
                            <span className="text-sm text-slate-700 dark:text-slate-300">{opt}</span>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  );
                })}
              </div>
            );
          })}

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={submitTest} className="btn-accent text-sm">
              Submit answers
            </button>
            <button
              type="button"
              onClick={() => {
                setStep("track");
                setTrack(null);
              }}
              className="btn-secondary text-sm"
            >
              Back
            </button>
          </div>
        </section>
      ) : null}

      {step === "result" && score !== null ? (
        <section className="glass rounded-2xl p-6 dark:border-white/10">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Your result</h2>
          <p className="mt-4 text-4xl font-bold text-slate-900 dark:text-slate-50">
            {score} / {QUESTION_COUNT}{" "}
            <span className="text-2xl font-semibold text-slate-500">
              ({Math.round((score / QUESTION_COUNT) * 100)}%)
            </span>
          </p>
          <p className={`mt-4 text-lg font-semibold ${passed ? "text-brand-sunset dark:text-brand-onDark" : "text-red-600 dark:text-red-400"}`}>
            {passed ? "Pass — you met the 50% bar." : "Not there yet — you need at least 50% to pass this attempt."}
          </p>
          {!passed ? (
            <div className="mt-6 rounded-2xl border border-brand-sunset/25 bg-brand-sunset/10 p-5 shadow-sm dark:border-brand-sunset/35 dark:bg-slate-900 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
              <p className="text-base font-semibold leading-snug text-brand-berry dark:text-brand-onDarkStrong">
                Nothing is impossible.
              </p>
              <p className="mt-3 text-base leading-relaxed text-slate-800 dark:text-slate-200">
                One score does not define you. Take a breath, then ask honestly:{" "}
                <span className="italic text-slate-900 dark:text-slate-100">
                  what went wrong — time, focus, or gaps in basics?
                </span>{" "}
                Adjust your method, not your worth. Think positively, but also think{" "}
                <span className="font-semibold text-slate-950 dark:text-white">beyond this one test</span> — the world is
                wider than a single number on a screen.
              </p>
              <p className="mt-4 border-l-[3px] border-brand-sunset/70 pl-4 text-sm leading-relaxed text-slate-700 dark:border-brand-sunset/60 dark:text-slate-300">
                “Get out of the well and look at the sky.” A well feels like the whole world until you climb — then you
                see options, paths, and people who failed once and still built something meaningful. Try again with a
                cooler head; you are allowed to grow in public.
              </p>
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
                Read:{" "}
                <Link
                  href="/career-comparison"
                  className="font-semibold text-brand-sunset underline-offset-2 hover:text-brand-berry hover:underline dark:text-brand-onDark dark:hover:text-brand-onDarkStrong"
                >
                  Business vs private IT vs government — perspective
                </Link>
              </p>
            </div>
          ) : null}
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Breakdown — Easy: {byBand.easy}/{byBand.easyT} · Medium: {byBand.medium}/{byBand.mediumT} · Hard: {byBand.hard}/
            {byBand.hardT}
          </p>
          {track ? (
            <p className="mt-2 text-xs text-slate-500">
              Attempts used on this track: {attempts[track]} / {MAX_ATTEMPTS}
            </p>
          ) : null}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/eligibility" className="btn-accent-sm">
              Continue to apply
            </Link>
            <button
              type="button"
              onClick={() => {
                setStep("track");
                setScore(null);
                setTrack(null);
                setAnswers(Array(QUESTION_COUNT).fill(null));
                syncAttempts();
              }}
              className="btn-secondary text-sm"
              disabled={attempts.nonTechnical >= MAX_ATTEMPTS && attempts.technical >= MAX_ATTEMPTS}
            >
              {attempts.nonTechnical >= MAX_ATTEMPTS && attempts.technical >= MAX_ATTEMPTS
                ? "No attempts left on both tracks"
                : "Choose track again"}
            </button>
            <Link href="/" className="text-sm font-medium text-slate-500 underline-offset-4 hover:text-slate-800 hover:underline dark:hover:text-slate-300">
              Home
            </Link>
          </div>
        </section>
      ) : null}
    </div>
  );
}
