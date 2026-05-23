"use client";

// app/components/cabin/DateOfBirthPicker.jsx
// =============================================================
// 2026-05-23 — Friend-test feedback (Olga):
//
//   "Έπρεπε να γυρίσω στο 1991 σιγά σιγά, δεν είχε να το γράψω
//    κατευθείαν."
//
// The native <input type="date"> on Mac Chrome forces the user
// to click month-arrows back from the current year to reach
// their birth year. For a 70-year-old guest that's a hundred
// clicks. This control replaces it with three plain inputs:
//
//   Day    — number 1-31
//   Month  — select with English month names
//   Year   — number, typeable (defaults to YYYY)
//
// Value contract: emits an ISO-8601 yyyy-mm-dd string on change,
// or "" when the date is incomplete / invalid. The parent stores
// it exactly as the native date input would have, so server-side
// validation (cleanDate in /api/cabin/me) is unchanged.
// =============================================================

import { useEffect, useState } from "react";

const MONTHS = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

function isLeap(y) {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}
function daysInMonth(y, m) {
  if (m === 2) return isLeap(y) ? 29 : 28;
  if ([4, 6, 9, 11].includes(m)) return 30;
  return 31;
}

export default function DateOfBirthPicker({
  value,
  onChange,
  required = false,
  // Most-recent year selectable. For DOB defaults to today.
  maxYear = new Date().getFullYear(),
  // Oldest year selectable. 110 years back covers every
  // realistic charter guest.
  minYear = new Date().getFullYear() - 110,
}) {
  // Parse incoming ISO yyyy-mm-dd into its parts. Keep parts in
  // local state so the user can leave individual fields blank
  // while filling the others without the parent value flickering.
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  useEffect(() => {
    if (!value || typeof value !== "string") {
      setDay("");
      setMonth("");
      setYear("");
      return;
    }
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!m) {
      setDay("");
      setMonth("");
      setYear("");
      return;
    }
    setYear(m[1]);
    setMonth(m[2]);
    setDay(String(parseInt(m[3], 10))); // strip leading zero for friendlier display
  }, [value]);

  function emit(nextDay, nextMonth, nextYear) {
    const yNum = parseInt(nextYear, 10);
    const mNum = parseInt(nextMonth, 10);
    const dNum = parseInt(nextDay, 10);
    if (
      Number.isFinite(yNum) &&
      Number.isFinite(mNum) &&
      Number.isFinite(dNum) &&
      yNum >= minYear &&
      yNum <= maxYear &&
      mNum >= 1 &&
      mNum <= 12 &&
      dNum >= 1 &&
      dNum <= daysInMonth(yNum, mNum)
    ) {
      const iso = `${String(yNum).padStart(4, "0")}-${String(mNum).padStart(2, "0")}-${String(dNum).padStart(2, "0")}`;
      onChange?.(iso);
    } else {
      onChange?.("");
    }
  }

  function onDayChange(e) {
    const v = e.target.value.replace(/[^0-9]/g, "").slice(0, 2);
    setDay(v);
    emit(v, month, year);
  }
  function onMonthChange(e) {
    const v = e.target.value;
    setMonth(v);
    emit(day, v, year);
  }
  function onYearChange(e) {
    const v = e.target.value.replace(/[^0-9]/g, "").slice(0, 4);
    setYear(v);
    emit(day, month, v);
  }

  return (
    <div className="dob-picker">
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        autoComplete="bday-day"
        placeholder="DD"
        value={day}
        onChange={onDayChange}
        maxLength={2}
        required={required}
        aria-label="Day"
        className="dob-picker__day"
      />
      <select
        value={month}
        onChange={onMonthChange}
        required={required}
        aria-label="Month"
        autoComplete="bday-month"
        className="dob-picker__month"
      >
        <option value="">Month</option>
        {MONTHS.map((m) => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </select>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        autoComplete="bday-year"
        placeholder="YYYY"
        value={year}
        onChange={onYearChange}
        maxLength={4}
        required={required}
        aria-label="Year"
        className="dob-picker__year"
      />

      <style>{`
        .dob-picker {
          display: grid;
          grid-template-columns: 64px 1fr 96px;
          gap: 10px;
          align-items: stretch;
        }
        .dob-picker > input,
        .dob-picker > select {
          background: #ffffff;
          border: 1px solid rgba(13, 27, 42, 0.18);
          padding: 11px 12px;
          font-family: var(--gy-font-body, Georgia, serif);
          font-size: 16px;
          color: var(--gy-navy, #0D1B2A);
          outline: none;
          transition: border-color 140ms ease;
        }
        .dob-picker > input:focus,
        .dob-picker > select:focus {
          border-color: var(--gy-gold, #C9A84C);
        }
        .dob-picker__day,
        .dob-picker__year {
          text-align: center;
          letter-spacing: 1px;
        }
      `}</style>
    </div>
  );
}
