export interface ResourceSubItem {
  name: string;
  detail?: string;
}

export interface ResourceItem {
  id: string;
  name: string;
  role: string;
  description: string;
  url?: string;
  linkLabel?: string;
  badge?: string;
  iconType: "agent" | "skill" | "rule" | "platform" | "terminal" | "code" | "cpu" | "shield" | "sparkles" | "git" | "database" | "globe";
  subItems?: (string | ResourceSubItem)[];
}

export interface ResourceCategory {
  id: string;
  number: string; // "01", "02", "03", "04"
  title: string;  // "CODING AGENTS", "SKILLS", "RULES & WORKFLOW", "PLATFORM / TOOLING"
  subtitle?: string;
  items: ResourceItem[];
}
