import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { GrowthTimeline } from "@/components/story/growth-timeline";
import { NarrativeSection } from "@/components/story/narrative-section";
import { StoryCta } from "@/components/story/story-cta";
import { StoryHero } from "@/components/story/story-hero";
import { StoryMessage } from "@/components/story/story-message";

export const metadata: Metadata = {
  title: "Founder Story — Gopher Lab",
  description:
    "From ₹300/month to ₹1L+/month: Vikash Parashar’s journey — loss, responsibility, and growth. Gopher Lab — premium mentorship rooted in lived experience.",
};

export default function StoryPage() {
  return (
    <div className="noise min-h-screen bg-background bg-hero-radial dark:bg-hero-radial-dark">
      <SiteHeader />

      <main className="page-shell">
        <StoryHero />

        <NarrativeSection id="early-life" eyebrow="01 · Early life" title="When the world felt narrow before I understood why">
          <p className="text-slate-700 dark:text-slate-300">
            I lost my father when I was six. In an instant, childhood stopped being a promise of protection — it
            became a lesson in adjusting early.
          </p>
          <p>
            My mother carried the house on her shoulders. Love showed up as work: long hours, quiet sacrifices, and
            the stubborn refusal to let us feel like we were “less.” I watched money not as numbers, but as tension —
            as the difference between calm and chaos.
          </p>
          <p>
            Our household income lived between <strong className="font-medium text-slate-900 dark:text-slate-200">₹300–₹2200/month</strong>
            . That range is not a statistic to me; it is memory. It is counting possibilities before counting dreams.
          </p>
        </NarrativeSection>

        <NarrativeSection id="struggles" eyebrow="02 · Struggles" title="Responsibility does not ask if you are ready" variant="emphasis">
          <p className="text-slate-700 dark:text-slate-300">
            There was no stable map of “home” in the easy sense. Life moved. We moved with it — carrying hope like
            luggage that never gets lighter, only more familiar.
          </p>
          <p>
            Today, I stand responsible for my family — my mother, my wife, my daughters. That is not a complaint; it
            is gravity. It is the weight that either breaks you or teaches you to lift with better technique.
          </p>
          <p>
            There were personal losses along the way — the kind that do not trend on social media. Grief does not
            negotiate deadlines. You still show up.
          </p>
        </NarrativeSection>

        <NarrativeSection id="education" eyebrow="03 · Education" title="The system admired credentials; my reality needed cashflow">
          <p className="text-slate-700 dark:text-slate-300">
            I completed 12th standard. College should have been the next chapter — except the math of survival did
            not allow it.
          </p>
          <p>
            Financial pressure forced a dropout: not because education did not matter, but because{" "}
            <strong className="font-medium text-slate-900 dark:text-slate-200">responsibility arrived before opportunity</strong>. That
            decision still sits in my chest — not as shame, but as clarity about what privilege quietly assumes.
          </p>
        </NarrativeSection>

        <NarrativeSection id="turning-point" eyebrow="04 · Turning point" title="The boring truth is also the powerful truth">
          <p className="text-slate-700 dark:text-slate-300">
            There was no cinematic moment where the universe clapped. The turn was quieter — a stubborn belief that I
            could build a life that did not repeat the tightest edges of my childhood.
          </p>
          <p>
            Hard work was not motivation; it was default mode. And positivity was not denial — it was a{" "}
            <strong className="font-medium text-slate-900 dark:text-slate-200">survival strategy</strong> that doubled as a professional
            one: show up, learn, improve, repeat.
          </p>
        </NarrativeSection>

        <GrowthTimeline />

        <NarrativeSection id="english" eyebrow="05 · English" title="Fluent English was not my entry ticket — skills were">
          <p className="text-slate-700 dark:text-slate-300">
            I am not “naturally fluent” in English in the polished, effortless way people sometimes expect in tech
            rooms. I still found a way to work with a US company — because deliverables speak when words stumble.
          </p>
          <p>
            If there is a message I want you to internalize, it is this:{" "}
            <strong className="font-medium text-slate-900 dark:text-slate-200">skills compound louder than accents</strong>. Improve English
            — yes — but never let shame about language become an excuse to avoid building proof.
          </p>
        </NarrativeSection>

        <StoryMessage />
        <StoryCta />
      </main>

      <SiteFooter showBackToHome />
    </div>
  );
}
