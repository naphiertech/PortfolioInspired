"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface TechCategory {
  title: string;
  items: string[];
}

const categories: TechCategory[] = [
  {
    title: "Frontend",
    items: [
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Vue.js",
      "Tailwind CSS",
      "SCSS",
      "Styled Components",
      "Vite",
      "Webpack",
      "ESLint",
      "Prettier",
    ],
  },
  {
    title: "Backend",
    items: [
      "Node.js",
      "Python",
      "Java",
      "PHP",
      "Express.js",
      "NestJS",
      "FastAPI",
      "Spring Boot",
      "Laravel",
      "PostgreSQL",
      "MySQL",
      "MongoDB",
      "DynamoDB",
      "OAuth",
      "JWT",
      "LDAP",
      "REST",
      "GraphQL",
      "gRPC",
      "AWS Lambda",
    ],
  },
  {
    title: "DevOps & Cloud",
    items: [
      "AWS",
      "GCP",
      "Azure",
      "GitHub Actions",
      "Jenkins",
      "GitLab CI",
      "Terraform",
      "AWS CloudFormation",
      "Docker",
      "Kubernetes",
      "Prometheus",
      "Grafana",
      "Datadog",
    ],
  },
  {
    title: "AI & Machine Learning",
    items: [
      "TensorFlow",
      "PyTorch",
      "LangChain",
      "Transformers",
      "OpenAI",
      "Anthropic",
      "Mistral",
      "Hugging Face",
      "LlamaIndex",
      "AutoGPT",
    ],
  },
  {
    title: "Security & Identity",
    items: [
      "AWS IAM",
      "Azure AD",
      "Okta",
      "SAP CDC",
      "Auth0",
      "Cognito",
      "AES",
      "RSA",
      "SHA",
      "GDPR",
      "SOC 2",
      "ISO 27001",
    ],
  },
  {
    title: "CMS & No-Code",
    items: [
      "WordPress",
      "Strapi",
      "Bubble",
      "Webflow",
      "Microsoft Power Platform",
      "n8n",
    ],
  },
  {
    title: "Developer Tools",
    items: [
      "Git",
      "GitHub",
      "GitLab",
      "Bitbucket",
      "VS Code",
      "JetBrains IntelliJ",
      "PyCharm",
      "Slack",
      "Discord",
      "Teams",
      "JIRA",
      "Trello",
      "ClickUp",
    ],
  },
];

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const categoryVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as const,
      staggerChildren: 0.02,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 5 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut" as const,
    },
  },
};

export function TechStackClient() {
  return (
    <div className="min-h-screen bg-bg-primary dark:bg-dark-bg-primary text-text-primary dark:text-dark-text-primary pt-24 pb-32">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex items-center gap-6 mb-16"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back to Home
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary dark:text-dark-text-primary">
            Tech Stack
          </h1>
        </motion.div>

        {/* Categories Stack list */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12"
        >
          {categories.map((category) => (
            <motion.div
              key={category.title}
              variants={categoryVariants}
              className="flex flex-col gap-4"
            >
              <h2 className="text-lg font-bold tracking-tight text-text-primary dark:text-dark-text-primary">
                {category.title}
              </h2>
              <div className="flex flex-wrap gap-2">
                {category.items.map((item) => (
                  <motion.span
                    key={item}
                    variants={itemVariants}
                    className="inline-block px-3.5 py-1.5 text-sm rounded-md bg-white dark:bg-[#18181b] border border-border-default dark:border-dark-border text-text-secondary dark:text-dark-text-secondary hover:border-accent hover:text-accent dark:hover:border-accent dark:hover:text-accent hover:scale-[1.03] active:scale-[0.98] select-none transition-all duration-300 shadow-[0_1px_2px_rgba(0,0,0,0.02)] cursor-pointer"
                  >
                    {item}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default TechStackClient;
