import type { Metadata } from "next";
import { WorkClient } from "./WorkClient";

export const metadata: Metadata = {
  title: "Work & Availability | Naphier Awalie",
  description:
    "Explore Naphier Awalie's availability, capabilities, technical focus, and collaboration opportunities in software engineering and UI/UX development.",
};

export default function WorkPage() {
  return <WorkClient />;
}
