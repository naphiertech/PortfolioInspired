import React from "react";
import { ExternalLink, Mail, Calendar, BookOpen, ChevronRight, FileText } from "lucide-react";
import { memberOf } from "@/lib/data";

export function FooterGrid() {
  return (
    <div className="gsap-footer-section bento-card p-4 col-span-1 md:col-span-6 space-y-4 group">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Column 1 — A member of */}
        <div className="gsap-footer-link flex flex-col h-full justify-between">
          <div>
            <p className="text-xs text-text-secondary dark:text-dark-text-secondary font-medium mb-2 uppercase tracking-wide">
              A member of
            </p>
            <div className="flex flex-col gap-1.5 h-full">
              {memberOf.map((member) => (
                <a
                  key={member.name}
                  href={member.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-2.5 rounded-lg bg-text-primary/5 hover:bg-text-primary/10 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all duration-200 hover:-translate-y-0.5 group/member flex-1 border border-border-default/50 dark:border-dark-border/50 cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-1.5 h-full">
                    <p className="text-[10px] font-medium leading-tight text-text-primary dark:text-dark-text-primary group-hover/member:text-blue-600 dark:group-hover/member:text-blue-400 transition-colors">
                      {member.name}
                    </p>
                    <ExternalLink className="w-2.5 h-2.5 text-text-muted dark:text-dark-text-muted transition-transform group-hover/member:translate-x-0.5 flex-shrink-0 mt-0.5" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Column 2 — Social Links */}
        <div className="gsap-footer-link flex flex-col">
          <p className="text-xs text-text-secondary dark:text-dark-text-secondary font-medium mb-2 uppercase tracking-wide">
            Social Links
          </p>
          <div className="grid grid-cols-1 gap-1">
            <a
              href="https://www.linkedin.com/in/awalie-naphier-b-0551983b5/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-1.5 rounded-lg bg-text-primary/5 hover:bg-text-primary/10 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all duration-200 hover:-translate-y-0.5 group/social border border-border-default/50 dark:border-dark-border/50 cursor-pointer"
            >
              <div className="text-[#0077b5]">
                <svg
                  className="w-4 h-4 fill-current group-hover/social:scale-105 transition-transform"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </div>
              <p className="text-[10px] font-medium text-text-primary dark:text-dark-text-primary group-hover/social:text-blue-600 dark:group-hover/social:text-blue-400 transition-colors">
                LinkedIn
              </p>
            </a>

            <a
              href="https://github.com/bagatata05/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-1.5 rounded-lg bg-text-primary/5 hover:bg-text-primary/10 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all duration-200 hover:-translate-y-0.5 group/social border border-border-default/50 dark:border-dark-border/50 cursor-pointer"
            >
              <div className="text-text-primary dark:text-dark-text-primary">
                <svg
                  className="w-4 h-4 fill-current group-hover/social:scale-105 transition-transform"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-[10px] font-medium text-text-primary dark:text-dark-text-primary group-hover/social:text-blue-600 dark:group-hover/social:text-blue-400 transition-colors">
                GitHub
              </p>
            </a>

            <a
              href="https://www.instagram.com/bagatata05/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-1.5 rounded-lg bg-text-primary/5 hover:bg-text-primary/10 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all duration-200 hover:-translate-y-0.5 group/social border border-border-default/50 dark:border-dark-border/50 cursor-pointer"
            >
              <div className="text-[#e1306c]">
                <svg
                  className="w-4 h-4 fill-current group-hover/social:scale-105 transition-transform"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-[10px] font-medium text-text-primary dark:text-dark-text-primary group-hover/social:text-blue-600 dark:group-hover/social:text-blue-400 transition-colors">
                Instagram
              </p>
            </a>
          </div>
        </div>

        {/* Column 3 — Speaking */}
        <div className="gsap-footer-link flex flex-col">
          <p className="text-xs text-text-secondary dark:text-dark-text-secondary font-medium mb-2 uppercase tracking-wide">
            Speaking
          </p>
          <div className="p-3 rounded-lg bg-text-primary/5 border border-border-default/50 dark:border-dark-border/50 h-full flex flex-col justify-between">
            <p className="text-[11px] text-text-secondary dark:text-dark-text-secondary leading-relaxed">
              Available for speaking at events about software development and emerging technologies.
            </p>
            <a
              href="mailto:naphiera@gmail.com"
              className="text-[11px] font-semibold text-text-primary dark:text-dark-text-primary hover:underline mt-2 inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Get in touch →</span>
            </a>
          </div>
        </div>

        {/* Column 4 — Contact */}
        <div className="gsap-footer-link flex flex-col gap-1">
          <p className="text-xs text-text-secondary dark:text-dark-text-secondary font-medium mb-2 uppercase tracking-wide">
            Contact
          </p>
          
          {/* Row 1: Email */}
          <a
            href="mailto:naphiera@gmail.com"
            className="flex items-center justify-between p-2 rounded-lg bg-text-primary/5 hover:bg-text-primary/10 border border-border-default/50 dark:border-dark-border/50 transition-all cursor-pointer group/item"
          >
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-text-muted" />
              <div className="flex flex-col">
                <span className="text-[8px] text-text-muted uppercase tracking-wider leading-none">Email</span>
                <span className="text-[10px] font-medium text-text-secondary dark:text-dark-text-secondary group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 mt-0.5 leading-none">
                  naphiera@gmail.com
                </span>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
          </a>

          {/* Row 2: LinkedIn */}
          <a
            href="https://www.linkedin.com/in/awalie-naphier-b-0551983b5/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-2 rounded-lg bg-text-primary/5 hover:bg-text-primary/10 border border-border-default/50 dark:border-dark-border/50 transition-all cursor-pointer group/item"
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-text-muted" />
              <div className="flex flex-col">
                <span className="text-[8px] text-text-muted uppercase tracking-wider leading-none">LinkedIn</span>
                <span className="text-[10px] font-medium text-text-secondary dark:text-dark-text-secondary group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 mt-0.5 leading-none">
                  Connect on LinkedIn
                </span>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
          </a>

          {/* Row 3: GitHub */}
          <a
            href="https://github.com/bagatata05/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-2 rounded-lg bg-text-primary/5 hover:bg-text-primary/10 border border-border-default/50 dark:border-dark-border/50 transition-all cursor-pointer group/item"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-text-muted" />
              <div className="flex flex-col">
                <span className="text-[8px] text-text-muted uppercase tracking-wider leading-none">GitHub</span>
                <span className="text-[10px] font-medium text-text-secondary dark:text-dark-text-secondary group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 mt-0.5 leading-none">
                  View my GitHub
                </span>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
          </a>

          {/* Row 4: Resume */}
          <a
            href="/resume/IT_Resume_ATS.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-2 rounded-lg bg-text-primary/5 hover:bg-text-primary/10 border border-border-default/50 dark:border-dark-border/50 transition-all cursor-pointer group/item"
          >
            <div className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-text-muted" />
              <div className="flex flex-col">
                <span className="text-[8px] text-text-muted uppercase tracking-wider leading-none">Resume</span>
                <span className="text-[10px] font-medium text-text-secondary dark:text-dark-text-secondary group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 mt-0.5 leading-none">
                  Download Resume
                </span>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
          </a>

        </div>
      </div>
    </div>
  );
}
export default FooterGrid;
