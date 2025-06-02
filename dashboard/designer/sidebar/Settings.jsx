import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

export default function Settings() {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  const [user, setUser] = useState({
    manager: 'Sharif Hasanov',
    company: 'Archonwiser',
    country: 'Poland',
    billingDate: 'June 16, 2025',
    plan: 'Platinum',
    language: 'en',
    customerId: 'AW-7483-2281',
  });

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'ru', label: 'Russian' },
    { code: 'zh', label: 'Chinese' },
    { code: 'tr', label: 'Turkish' },
    { code: 'de', label: 'German' },
    { code: 'ar', label: 'Arabic' }
  ];

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
    setUser({ ...user, language: lang });
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-6 py-12 bg-white text-black dark:bg-black dark:text-white transition-colors duration-300">
      {/* Top bar */}
      <div className="w-full max-w-4xl flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-10">
        <h1 className="text-3xl font-bold">{t('settings.accountSettings')}</h1>
        <div className="flex gap-4 items-center">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="px-4 py-2 text-sm border rounded-full bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition"
          >
            {theme === 'dark' ? t('settings.lightMode') : t('settings.darkMode')}
          </button>
          <select
            value={i18n.language}
            onChange={handleLanguageChange}
            className="px-3 py-2 text-sm border rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-black dark:text-white transition"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code} className="text-black dark:text-white">
                {lang.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Editable Settings Panel */}
      <div className="w-full max-w-4xl bg-zinc-100 dark:bg-zinc-900 rounded-xl p-6 shadow space-y-6 transition mb-12">
        {Object.entries(user).map(([key, value]) => (
          key !== 'customerId' && key !== 'language' && (
            <div key={key} className="flex justify-between items-center border-b border-zinc-300 dark:border-zinc-700 pb-2">
              <span className="text-zinc-600 dark:text-zinc-400 capitalize">
                {t(`settings.${key}`)}
              </span>
              <input
                type="text"
                value={value}
                onChange={(e) => setUser({ ...user, [key]: e.target.value })}
                className="bg-transparent text-right text-black dark:text-white w-1/2 focus:outline-none"
              />
            </div>
          )
        ))}
      </div>

      {/* 💳 Sexy Card Below */}
      <div className="w-full flex justify-center">
        <div className="relative w-[420px] h-[260px] rounded-xl p-[2px] bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 shadow-2xl">
          <div className="w-full h-full rounded-xl bg-black dark:bg-white text-white dark:text-black backdrop-blur-xl p-6 flex flex-col justify-between transition-colors">

            <div className="text-xs bg-white/10 dark:bg-black/10 text-white dark:text-black px-3 py-1 rounded-full w-max shadow mb-4">
              {user.company}
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-1 text-white dark:text-black drop-shadow">
                {user.plan} {t('settings.plan')}
              </h2>
              <p className="text-sm text-zinc-300 dark:text-zinc-700">
                {t('planCard.premiumAccessNote')}
              </p>
            </div>

            <div className="text-sm font-mono space-y-1 text-zinc-200 dark:text-zinc-700">
              <p><span className="font-bold">{t('planCard.billing')}:</span> {user.billingDate}</p>
              <p><span className="font-bold">{t('planCard.id')}:</span> {user.customerId}</p>
              <p><span className="font-bold">{t('planCard.region')}:</span> {user.country}</p>
            </div>

            {/* ✅ Manage Plan button with navigation */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => navigate('/dashboard/designer/plans')}
                className="bg-white dark:bg-black text-black dark:text-white px-4 py-2 rounded-md text-sm font-semibold shadow hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
              >
                {t('planCard.managePlan')}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
