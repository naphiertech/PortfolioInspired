"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Briefcase,
  FolderGit2,
  Cpu,
  Award,
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

export function NavigationDock() {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      name: "Home",
      href: "/",
      icon: <Home className="w-[18px] h-[18px]" />,
    },
    {
      name: "Work",
      href: "/work",
      icon: <Briefcase className="w-[18px] h-[18px]" />,
    },
    {
      name: "Projects",
      href: "/projects",
      icon: <FolderGit2 className="w-[18px] h-[18px]" />,
    },
    {
      name: "Tech",
      href: "/tech-stack",
      icon: <Cpu className="w-[18px] h-[18px]" />,
    },
    {
      name: "Certs",
      href: "/certifications",
      icon: <Award className="w-[18px] h-[18px]" />,
    },
  ];

  return (
    <nav
      className="nav-dock"
      aria-label="Bottom Quick Navigation"
    >
      {navItems.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-1 transition-all duration-150 px-3 py-1 rounded-full cursor-pointer relative group ${
              isActive
                ? "text-ink font-semibold"
                : "text-muted-foreground hover:text-ink"
            }`}
            aria-current={isActive ? "page" : undefined}
          >
            {/* Icon */}
            <div className="relative">
              {item.icon}
              {isActive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand" />
              )}
            </div>

            {/* Label */}
            <span className="text-[10px] font-sans leading-none tracking-tight">
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

export default NavigationDock;
