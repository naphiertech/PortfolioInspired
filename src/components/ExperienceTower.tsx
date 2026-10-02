import { useState, useEffect } from "react";
import styles from "./ExperienceTower.module.css";

function useIsDesktop(query = "(min-width: 640px)") {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [query]);
  return isDesktop;
}

/** Only the wire paths fill the disclosure height; couplers and plugs stay rigid. */
function ExposedWiring() {
  return (
    <div className={styles.wiring}>
      <svg className={styles.wirePaths} viewBox="0 0 64 100" preserveAspectRatio="none" fill="none" focusable="false">
        <path className={styles.powerWire} d="M24 0V10C24 25 42 31 38 47S20 72 25 89V100" />
        <path className={styles.powerWire} d="M33 0V8C33 24 19 35 25 51S44 78 37 93V100" />
        <path className={styles.powerWire} d="M43 0V12C43 29 49 34 41 53S31 78 44 92V100" />
        <path className={styles.wireGlint} d="M24 0V10C24 25 42 31 38 47S20 72 25 89V100" />
        <path className={styles.signalWire} d="M29 0V13C29 30 38 36 33 53S26 81 31 92V100" />
      </svg>
      {["upper", "lower"].map((end) => (
        <svg key={end} className={styles.coupler} data-end={end} viewBox="0 0 64 18" fill="none" focusable="false">
          <path className={styles.shadow} d="M18 2H47V10H18Z" />
          <path className={styles.face} d="M16 0H44V7H16Z" />
          <path className={styles.highlight} d="M17 1H43M18 6H29" />
          <path className={styles.recess} d="M21 7H27V14H21ZM30 7H36V12H30ZM40 7H46V14H40Z" />
          <path className={styles.pins} d="M24 13V18M33 11V18M43 13V18" />
        </svg>
      ))}
      <span className={styles.inlinePlug} />
      <span className={styles.hangingPlug} />
      <span className={styles.fragments} />
    </div>
  );
}

/** Machinery scales with the section; only the rails extend for expanded rows. */
export function ExperienceTowerNode({ index, current, year }: { index: number; current: boolean; year: string }) {
  const isDesktop = useIsDesktop();
  const offset = index % 2 ? 8 : 0;
  return (
    <div className={styles.rail} data-current={current} aria-hidden="true">
      {isDesktop && <div className={styles.column} />}
      {isDesktop && <ExposedWiring />}
      <div className={styles.spine} />
      {isDesktop && <span className={styles.year}>{year}</span>}
      <span className={styles.connector} />
      <span className={styles.node}><i /></span>
      {isDesktop && (
        <svg className={styles.machine} viewBox="0 0 70 110" fill="none" focusable="false">
          <path className={styles.cable} d="M22 1 V16 H13 V69 H24 V107 M53 0 V27 H59 V84 H49 V110" />
          <path className={styles.shadow} d="M28 0 H43 V109 H28 Z M43 8 H49 V88 H43 Z" />
          <path className={styles.face} d="M25 0 H37 V110 H25 Z M20 15 H29 V79 H20 Z" />
          <path className={styles.highlight} d="M25 1 V109 M33 3 V45 M21 18 V76 M44 60 V91" />
          <path className={styles.seam} d="M30 52 H38 V76 H33 V102 M38 20 H46 V35" />
          <g transform={`translate(${offset} 0)`}>
            <path className={styles.shadow} d="M8 24 H36 V56 H8 Z" />
            <path className={styles.face} d="M5 21 H32 V52 H5 Z" />
            <path className={styles.highlight} d="M6 51 V22 H31" />
            <path className={styles.recess} d="M11 27 H26 V44 H11 Z" />
            <rect className={styles.screen} x="14" y="30" width="9" height="11" />
            <path className={styles.screenDetail} d="M16 33 H21 M16 36 H20" />
            <path className={styles.pins} d="M11 53 V60 M16 53 V65 M22 53 V59 M27 53 V62" />
          </g>
          {index === 0 && <g className={styles.crest}>
            <path className={styles.cable} d="M34 0 V-14 M46 10 V-7 H52 V-20 M17 20 V2" />
            <path className={styles.face} d="M31 -17 h6 v5 h-6 Z M49 -23 h6 v5 h-6 Z M14 0 h6 v5 h-6 Z" />
          </g>}
          <g className={styles.detail}>
            <path className={styles.face} d="M40 71 h13 v18 H40 Z" />
            <path className={styles.recess} d="M43 74 h7 v10 h-7 Z" />
            <path className={styles.highlight} d="M44 76 v5 M27 91 h4 v5 h-4 Z" />
            <path className={styles.dust} d={index % 2 ? "M7 84 h3 v3 H7 Z M58 12 h4 v4 h-4 Z" : "M3 6 h4 v4 H3 Z M60 65 h3 v3 h-3 Z"} />
          </g>
        </svg>
      )}
    </div>
  );
}

export function ExperienceTowerBase() {
  const isDesktop = useIsDesktop();
  return (
    <div className={styles.ending}>
      {isDesktop && (
        <svg className={styles.base} viewBox="0 0 680 88" preserveAspectRatio="xMinYMax meet" fill="none" focusable="false" aria-hidden="true">
          <path className={styles.shadow} d="M27 0 H49 V31 H62 V51 H83 V66 H143 V73 H236 V78 H17 V66 H29 V46 H27 Z" />
          <path className={styles.face} d="M24 0 H38 V28 H54 V49 H68 V64 H126 V70 H202 V76 H10 V69 H21 V57 H31 V31 H24 Z" />
          <path className={styles.highlight} d="M25 0 V27 H53 M22 58 H66 M11 70 H123 M38 31 V48" />
          <path className={styles.recess} d="M30 38 H51 V53 H30 Z" />
          <path className={styles.screen} d="M34 42 H47 V48 H34 Z" />
          <path className={styles.face} d="M96 58 h9 v12 h-9 Z M159 66 h16 v8 h-16 Z M274 70 h14 v5 h-14 Z" />
          <path className={styles.cable} d="M100 58 V47 M280 70 V62" />
          <path className={styles.dust} d="M73 82 h4 v4 h-4 Z M243 81 h3 v3 h-3 Z M323 70 h4 v4 h-4 Z M453 73 h3 v3 h-3 Z" />
        </svg>
      )}
      {/* Only the horizontal ground rules extend across the wider section. */}
      {isDesktop && (
        <svg className={styles.groundPlane} viewBox="0 0 680 88" preserveAspectRatio="none" fill="none" focusable="false" aria-hidden="true">
          <path className={styles.ground} d="M0 77 H350 M365 77 H498 M516 77 H676 M22 81 H141 M168 81 H215" />
        </svg>
      )}
      <div className={styles.annotation}>
        <svg viewBox="0 0 100 60" fill="none" focusable="false" aria-hidden="true">
          <path d="M94 50 C50 55 15 40 13 7 M7 16 L13 7 L21 15" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="94" cy="50" r="2.4" fill="currentColor" />
        </svg>
        <p>same curiosity,<br /><strong>bigger impact</strong></p>
      </div>
    </div>
  );
}
