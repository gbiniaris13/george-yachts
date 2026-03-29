"use client";

import Image from "next/image";
import { useI18n } from "@/lib/i18n/I18nProvider";

export default function CredentialsStrip() {
  const { t } = useI18n();
  const credentials = [
    {
      icon: (
        <Image
          src="/images/iyba.png"
          alt="IYBA Member — International Yacht Brokers Association"
          width={48}
          height={48}
          className="opacity-60 group-hover:opacity-100 transition-opacity duration-500"
        />
      ),
      label: t('credentials.iyba'),
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-[#DAA520]/60 group-hover:text-[#DAA520] transition-colors duration-500">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <polyline points="14,2 14,8 20,8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      ),
      label: t('credentials.myba'),
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-[#DAA520]/60 group-hover:text-[#DAA520] transition-colors duration-500">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M2 7h20" />
          <path d="M12 21v-4" />
          <path d="M8 21h8" />
        </svg>
      ),
      label: t('credentials.us'),
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-[#DAA520]/60 group-hover:text-[#DAA520] transition-colors duration-500">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
        </svg>
      ),
      label: t('credentials.greek'),
    },
  ];

  return (
    <section className="py-12 bg-black border-t border-b border-white/[0.04]">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {credentials.map((cred, i) => (
            <div
              key={i}
              className="group flex flex-col items-center gap-3 text-center md:border-r md:last:border-r-0 border-white/[0.06]"
            >
              <div className="h-12 flex items-center justify-center">
                {cred.icon}
              </div>
              <span className="text-[10px] tracking-[0.2em] uppercase text-white/30 group-hover:text-white/50 transition-colors duration-500 font-light">
                {cred.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
