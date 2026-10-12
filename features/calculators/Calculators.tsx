"use client";

import { useMemo, useState } from "react";

function money(value: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(Number.isFinite(value) ? value : 0);
}

export function Calculators() {
  const [currency, setCurrency] = useState("USD");
  const [hourly, setHourly] = useState(32);
  const [hours, setHours] = useState(40);
  const [weeks, setWeeks] = useState(52);
  const [overtimeHours, setOvertimeHours] = useState(6);
  const [country, setCountry] = useState("United States");
  const [premium, setPremium] = useState(1.5);
  const [tax, setTax] = useState(22);
  const [tuition, setTuition] = useState(2400);
  const [materials, setMaterials] = useState(600);
  const [travel, setTravel] = useState(300);
  const [lostWeeks, setLostWeeks] = useState(4);
  const [tools, setTools] = useState(1500);
  const [gapMonths, setGapMonths] = useState(2);

  const annual = hourly * hours * weeks;
  const overtimePay = useMemo(() => overtimeHours * hourly * premium, [overtimeHours, hourly, premium]);
  const weekly = hourly * Math.min(hours, country === "United States" ? 40 : hours) + overtimePay;
  const takeHome = annual * (1 - tax / 100);
  const training = tuition + materials + travel + lostWeeks * hourly * hours;
  const careerChange = training + tools + gapMonths * (annual / 12);

  return (
    <div className="calc-grid">
      <section className="card">
        <h2>Hourly and annual</h2>
        <label>Currency<select value={currency} onChange={(event) => setCurrency(event.target.value)}><option>USD</option><option>GBP</option><option>CAD</option></select></label>
        <label>Hourly rate<input type="number" value={hourly} min="0" onChange={(event) => setHourly(Number(event.target.value))} /></label>
        <label>Hours per week<input type="number" value={hours} min="1" onChange={(event) => setHours(Number(event.target.value))} /></label>
        <label>Weeks per year<input type="number" value={weeks} min="1" max="52" onChange={(event) => setWeeks(Number(event.target.value))} /></label>
        <p className="result">{money(annual, currency)}</p>
        <p>This multiplies the numbers you entered. It is not a verified wage.</p>
      </section>
      <section className="card">
        <h2>Overtime</h2>
        <label>Country
          <select value={country} onChange={(event) => { const next = event.target.value; setCountry(next); setPremium(next === "United States" ? 1.5 : 1); }}>
            <option>United States</option><option>United Kingdom</option><option>Canada</option>
          </select>
        </label>
        <label>Overtime hours / week<input type="number" value={overtimeHours} min="0" onChange={(event) => setOvertimeHours(Number(event.target.value))} /></label>
        <label>Premium multiplier<input type="number" step="0.1" value={premium} min="1" onChange={(event) => setPremium(Number(event.target.value))} /></label>
        <p className="result">{money(weekly, currency)}<span style={{ fontSize: 16 }}>/week</span></p>
        <p>{country === "United States" ? "US default uses 1.5× after 40 hours. Exemptions and state rules differ." : country === "United Kingdom" ? "The UK has no single statutory overtime premium. Set the multiplier from the contract." : "Canadian overtime rules vary by province. Use the premium in the contract or local rule you are estimating."} Not payroll or legal advice.</p>
      </section>
      <section className="card">
        <h2>Take-home estimate</h2>
        <label>Estimated deduction percent<input type="number" value={tax} min="0" max="70" onChange={(event) => setTax(Number(event.target.value))} /></label>
        <p className="result">{money(takeHome, currency)}</p>
        <p>A flat percentage of the annual figure. It ignores benefits, pensions, credits, and filing status.</p>
      </section>
      <section className="card">
        <h2>Training and career-change cost</h2>
        <label>Tuition<input type="number" value={tuition} onChange={(event) => setTuition(Number(event.target.value))} /></label>
        <label>Materials<input type="number" value={materials} onChange={(event) => setMaterials(Number(event.target.value))} /></label>
        <label>Travel<input type="number" value={travel} onChange={(event) => setTravel(Number(event.target.value))} /></label>
        <label>Unpaid training weeks<input type="number" value={lostWeeks} onChange={(event) => setLostWeeks(Number(event.target.value))} /></label>
        <label>Tools to buy<input type="number" value={tools} onChange={(event) => setTools(Number(event.target.value))} /></label>
        <label>Months of income gap<input type="number" value={gapMonths} onChange={(event) => setGapMonths(Number(event.target.value))} /></label>
        <p>Training cost: <strong>{money(training, currency)}</strong></p>
        <p>Career-change cost: <strong>{money(careerChange, currency)}</strong></p>
      </section>
    </div>
  );
}
