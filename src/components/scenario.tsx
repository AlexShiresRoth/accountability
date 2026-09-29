"use client";

import { useState } from "react";
import type { ChoiceAssessment, Scenario } from "@/content/lessons/types";

// Deliberately not a quiz: no score, no right/wrong colors. Each choice is explained.
const assessmentLabel: Record<ChoiceAssessment, string> = {
  constructive: "A good option",
  limited: "Better than nothing, with limits",
  counterproductive: "Likely to make things worse",
};

export function ScenarioExercise({ scenario }: { scenario: Scenario }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const revealed = scenario.choices.filter((c) => showAll || c.id === selected);

  return (
    <section aria-labelledby={`${scenario.id}-q`} className="border border-rule bg-surface p-5 sm:p-7">
      <p className="text-sm font-medium uppercase tracking-wider text-ink-muted">Scenario</p>
      <p className="mt-3 text-lg">{scenario.situation}</p>
      <h3 id={`${scenario.id}-q`} className="mt-5 text-xl">
        {scenario.question}
      </h3>

      <ul className="mt-4 space-y-2">
        {scenario.choices.map((choice) => {
          const isSelected = choice.id === selected;
          return (
            <li key={choice.id}>
              <button
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelected(choice.id)}
                className={`w-full border px-4 py-3 text-left transition-colors ${
                  isSelected ? "border-accent bg-accent-soft" : "border-rule-strong hover:border-ink"
                }`}
              >
                {choice.label}
              </button>
            </li>
          );
        })}
      </ul>

      <div aria-live="polite" className="mt-5 space-y-4">
        {revealed.map((choice) => (
          <div key={choice.id} className="border-l-2 border-accent pl-4">
            {showAll && <p className="font-medium">{choice.label}</p>}
            <p className="text-sm font-semibold uppercase tracking-wider text-ink-muted">
              {assessmentLabel[choice.assessment]}
            </p>
            <p className="mt-1">{choice.explanation}</p>
          </div>
        ))}
        {selected && (
          <>
            <p className="font-serif text-lg">{scenario.takeaway}</p>
            {!showAll && (
              <button type="button" onClick={() => setShowAll(true)} className="text-accent underline underline-offset-4">
                See all options explained
              </button>
            )}
          </>
        )}
      </div>
    </section>
  );
}
