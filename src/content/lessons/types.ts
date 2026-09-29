// Prevention lessons are editorial content, versioned in git rather than stored in the database.
// Lessons must not include statistics or factual claims about real people or institutions;
// anything factual belongs in the verified database with citations.

export type ChoiceAssessment = "constructive" | "limited" | "counterproductive";

export type ScenarioChoice = {
  id: string;
  label: string;
  /** What is likely to happen, and why. Explain; don't lecture. */
  explanation: string;
  assessment: ChoiceAssessment;
};

export type Scenario = {
  id: string;
  situation: string;
  question: string;
  choices: ScenarioChoice[];
  takeaway: string;
};

export type LessonSection = { heading: string; paragraphs: string[] };

export type Lesson = {
  slug: string;
  title: string;
  summary: string;
  /** "placeholder" lessons render a visible notice until editorial review is complete. */
  status: "placeholder" | "reviewed";
  sections: LessonSection[];
  scenarios: Scenario[];
};
