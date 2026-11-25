import { ProjectStrip } from "@/components/studio/project-strip";

export const metadata = {
  title: "Projects",
  description:
    "Projects by Ehis Oghina: xgGaffer football analytics, Trivium tournament analytics, Social Olympics, Little by Little grocery optimisation and a financial risk dashboard.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPreview() {
  return <ProjectStrip />;
}
