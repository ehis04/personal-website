import { ExperienceStack } from "@/components/studio/experience-stack";

export const metadata = {
  title: "Experience",
  description:
    "NLP researcher at the University of Birmingham, founder of R.V. Uncovered, and software engineering and data science roles at Optum and EPAM Systems: Ehis Oghina's work experience.",
  alternates: { canonical: "/experience" },
};

export default function ExperiencePreview() {
  return <ExperienceStack />;
}
