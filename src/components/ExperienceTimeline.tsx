import React from "react";
import { experiences } from "@/lib/data";

export function ExperienceTimeline() {
  return (
    <div className="gsap-timeline-section bento-card p-4 space-y-2 group flex-1">
      <h2 className="text-lg font-bold text-text-primary dark:text-dark-text-primary">
        Experience
      </h2>
      
      {/* Timeline items list */}
      <div className="relative space-y-4 mt-4">
        {/* Dashed background line */}
        <div className="absolute left-1.5 top-1.5 bottom-2 w-px bg-border-default dark:bg-dark-border" />

        {experiences.map((exp) => (
          <div
            key={`${exp.role}-${exp.company}`}
            className="gsap-timeline-item relative pl-6 group/role"
          >
            {/* Timeline Dot */}
            <div
              className={`absolute left-0 top-1.5 w-3 h-3 rounded-full border-2 transition-colors duration-200 ${
                exp.isCurrent
                  ? "border-blue-600 bg-blue-600 dark:border-blue-500 dark:bg-blue-500"
                  : "border-border-default dark:border-dark-border bg-bg-primary dark:bg-dark-bg-primary group-hover/role:bg-blue-600 dark:group-hover/role:bg-blue-500"
              }`}
            />
            
            {/* Contents */}
            <div className="space-y-1">
              <h3
                className={`text-sm font-semibold transition-colors duration-200 ${
                  exp.isCurrent
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-text-primary dark:text-dark-text-primary group-hover/role:text-blue-600 dark:group-hover/role:text-blue-400"
                }`}
              >
                {exp.role}
              </h3>
              
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs ${
                    exp.isCurrent
                      ? "text-blue-600/80 dark:text-blue-400/80"
                      : "text-text-secondary dark:text-dark-text-secondary"
                  }`}
                >
                  {exp.company}
                </span>
                
                {/* Year tag */}
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full shadow-[0_1px_1px_rgba(0,0,0,0.02)] ${
                    exp.isCurrent
                      ? "bg-blue-600/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400 font-semibold"
                      : "bg-text-primary/5 text-text-secondary dark:text-dark-text-secondary dark:bg-dark-text-primary/5"
                  }`}
                >
                  {exp.year}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default ExperienceTimeline;
