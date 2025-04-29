
export interface TestCase {
  title: string;
  summary: string;
  preconditions: string;
  steps: string[];
  expectedResults: string[];
  importance: "Low" | "Medium" | "High";
  executionType: "Manual" | "Automated";
}

export interface UserStoryInput {
  userStory: string;
  additionalContext: string;
  language: "en" | "fr";  // Added language option
}

export type Language = "en" | "fr";

export const languageLabels: Record<Language, string> = {
  en: "English",
  fr: "Français"
};

