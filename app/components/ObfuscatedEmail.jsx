"use client";

import React, { useEffect, useState } from "react";

/**
 * Renders an obfuscated email link that bots can't harvest.
 * Props:
 *   user      – part before @  (default "george")
 *   domain    – part after @   (default "georgeyachts.com")
 *   subject   – optional mailto subject
 *   body      – optional mailto body
 *   className – optional styling
 *   children  – optional custom label (defaults to showing the email)
 */
const ObfuscatedEmail = ({
  user = "george",
  domain = "georgeyachts.com",
  subject = "",
  body = "",
  className = "",
  children,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // No-JS fallback — no email exposed in HTML source
    return (
      <a href="/contact" className={className}>
        {children || "Contact us"}
      </a>
    );
  }

  const email = `${user}@${domain}`;
  const params = [];
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
  if (body) params.push(`body=${encodeURIComponent(body)}`);
  const href = `mailto:${email}${params.length ? "?" + params.join("&") : ""}`;

  return (
    <a href={href} className={className}>
      {children || email}
    </a>
  );
};

export default ObfuscatedEmail;
