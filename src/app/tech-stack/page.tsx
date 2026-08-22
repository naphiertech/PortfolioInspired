import type { Metadata } from "next";
import { TechStackClient } from "./TechStackClient";

export const metadata: Metadata = {
  title: "Tech Stack | Naphier Awalie",
  description:
    "Explore the comprehensive tech stack, frameworks, tools, and platforms utilized by Naphier Awalie.",
};

export default function TechStackPage() {
  return <TechStackClient />;
}
