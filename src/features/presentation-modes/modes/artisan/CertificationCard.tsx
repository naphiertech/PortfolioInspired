"use client";

import React from "react";
import { CertificationItem } from "@/lib/data";
import {
  CertificationBoxCard,
  CertificationInspectorModal,
} from "@/components/CertificationShared";

interface CertificationBadgeCardProps {
  cert: CertificationItem;
  onSelect: (cert: CertificationItem) => void;
}

/** Framed credential badge reusing the shared editorial double-border and laurel motif. */
export function CertificationBadgeCard({ cert, onSelect }: CertificationBadgeCardProps) {
  return <CertificationBoxCard cert={cert} variant="artisan" onSelect={onSelect} />;
}

interface CertificationPreviewModalProps {
  selectedCert: CertificationItem | null;
  onClose: () => void;
}

/** Shared certificate inspector with split-pane Career Path switcher and Escape dismissal. */
export function CertificationPreviewModal({
  selectedCert,
  onClose,
}: CertificationPreviewModalProps) {
  return (
    <CertificationInspectorModal
      selectedCert={selectedCert}
      onClose={onClose}
      variant="artisan"
    />
  );
}
