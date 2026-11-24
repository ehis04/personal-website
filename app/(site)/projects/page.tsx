import { ProjectStrip } from "@/components/studio/project-strip";

export const metadata = { title: "Projects", alternates: { canonical: "/projects" } };

export default function ProjectsPreview() {
  return <ProjectStrip />;
}
