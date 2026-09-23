"use client";

import React from "react";
import NextImage from "next/image";
import { Mail, FileText, ArrowUpRight, MapPin, GraduationCap } from "lucide-react";
import { FaGithub as Github, FaLinkedin as Linkedin, FaInstagram as Instagram } from "react-icons/fa";
import { LocalTime } from "@/components/LocalTime";
import { ProfileFrameOverlay } from "@/components/ProfileFrameOverlay";
import { StatusBadge } from "@/components/ProjectStatusBadge";
import styles from "./FocusHero.module.css";
import {
  AUTHOR_INFO,
  AVAILABILITY,
  EDUCATION,
  SITE_DEFAULT_DESCRIPTION,
  SOCIAL_PROFILES,
} from "@/lib/siteConfig";

export function FocusHero() {
  const surname = AUTHOR_INFO.name.slice(AUTHOR_INFO.shortName.length).trim();
  return (
    <section aria-label="Identity and candidate overview" className={styles.hero}>
      <div className={styles.marker}>[ 00 // PROFILE ]</div>
      <div className={styles.split}>
        <div className={styles.identity}>
          <p className={styles.availability}><span aria-hidden="true" />{AVAILABILITY.status} for opportunities</p>
          <h1 className={styles.name}>
            <span className={styles.firstName}>{AUTHOR_INFO.shortName}</span>
            <span className={styles.surname}>{surname}</span>
          </h1>
          <p className={styles.role}>{AUTHOR_INFO.jobTitle}</p>
          <p className={styles.bio}>{SITE_DEFAULT_DESCRIPTION}</p>
          <div className="mt-4">
            <StatusBadge status="available" label={AVAILABILITY.openTo} size="sm" />
          </div>
          <div className={styles.metadata}>
            <span><MapPin size={13} aria-hidden="true" />{AUTHOR_INFO.city}, PH</span>
            <LocalTime />
            <span><GraduationCap size={14} aria-hidden="true" />{EDUCATION.shortDegree} @ {EDUCATION.abbreviation}</span>
          </div>
          <div className={styles.actions}>
            <a href={"mailto:" + SOCIAL_PROFILES.email} className={styles.primary}>
              <Mail size={15} aria-hidden="true" />Send Email<ArrowUpRight size={13} aria-hidden="true" />
            </a>
            <a href="/resume/naphier_awalie_resume.pdf" target="_blank" rel="noopener noreferrer" className={styles.secondary}>
              <FileText size={15} aria-hidden="true" />Resume PDF<ArrowUpRight size={13} aria-hidden="true" />
            </a>
          </div>
          <div className={styles.lowerIdentity}>
            <div>
              <div className={styles.connectLabel}>CONNECT<span aria-hidden="true" /></div>
              <div className={styles.socials}>
                <a href={SOCIAL_PROFILES.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"><Github size={17} /></a>
                <a href={SOCIAL_PROFILES.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin size={17} /></a>
                <a href={SOCIAL_PROFILES.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram size={17} /></a>
              </div>
            </div>
            <p className={styles.note}>“Better tools. Brighter ideas.”</p>
          </div>
        </div>
        <div className={styles.portraitGroup}>
        <div className={styles.portraitComposition}>
          <div className={styles.orbit} aria-hidden="true" />
          <span className={styles.crosshair} aria-hidden="true">+</span>
          <div className={styles.portrait}>
            <NextImage src="/profile/ezgif-frame-001.png" alt={AUTHOR_INFO.name} fill sizes="(max-width: 767px) 280px, (max-width: 1023px) 36vw, 380px" priority className={styles.portraitImage} />
            <ProfileFrameOverlay className={styles.portraitOverlay} />
          </div>
          <div className={styles.codeNote} aria-hidden="true">
            <span>{"// Developer"}</span>
            <pre>{"const " + AUTHOR_INFO.shortName.toLowerCase() + " = {\n  learn: true,\n  build: true,\n  improve: true\n}"}</pre>
          </div>
          <div className={styles.projectNote} aria-hidden="true">
            <span>Turning ideas into</span><strong>real projects.</strong>
          </div>
          <p className={styles.portraitCaption}>{AUTHOR_INFO.city}, PH<span aria-hidden="true">↗</span></p>
        </div>
        <div className={styles.processNote} aria-hidden="true">
          {["IDEAS", "DESIGN", "DEVELOP", "DEPLOY", "IMPROVE"].map((step, index) => (
            <span key={step} className={styles.processStep} data-current={index === 0}>
              {step}
            </span>
          ))}
        </div>
        </div>
      </div>
    </section>
  );
}

export default FocusHero;
