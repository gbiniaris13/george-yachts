'use client';

import { LanguageSwitcher } from '@/lib/i18n/I18nProvider';

export default function TranslateWidget() {
  return (
    <div className="fixed z-50" style={{ top: '24px', right: '24px' }}>
      <LanguageSwitcher />
    </div>
  );
}
