'use client';

import { useMemo, useState } from 'react';

function currency(n: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(isFinite(n) ? n : 0);
}

export default function Page() {
  const [principal, setPrincipal] = useState('10000');
  const [monthly, setMonthly] = useState('500');
  const [rate, setRate] = useState('8');
  const [years, setYears] = useState('20');

  const result = useMemo(() => {
    const P = Number(principal);
    const PMT = Number(monthly);
    const r = Number(rate) / 100 / 12;
    const n = Number(years) * 12;

    const fvPrincipal = P * Math.pow(1 + r, n);
    const fvContrib = r === 0 ? PMT * n : PMT * ((Math.pow(1 + r, n) - 1) / r);
    const total = fvPrincipal + fvContrib;
    const contributed = P + PMT * n;

    return {
      total,
      contributed,
      growth: total - contributed,
    };
  }, [principal, monthly, rate, years]);

  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h1 style={{ fontSize: 40, marginBottom: 8 }}>CalcWise</h1>
      <p style={{ color: '#475569', marginBottom: 24 }}>
        Simple calculators for smarter money decisions.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 24,
          alignItems: 'start',
        }}
      >
        <section style={{ background: '#fff', padding: 20, borderRadius: 16, border: '1px solid #e2e8f0' }}>
          <h2 style={{ marginTop: 0 }}>Compound Interest Calculator</h2>

          <label>Starting amount</label>
          <input value={principal} onChange={(e) => setPrincipal(e.target.value)} style={inputStyle} />

          <label>Monthly contribution</label>
          <input value={monthly} onChange={(e) => setMonthly(e.target.value)} style={inputStyle} />

          <label>Annual return (%)</label>
          <input value={rate} onChange={(e) => setRate(e.target.value)} style={inputStyle} />

          <label>Years</label>
          <input value={years} onChange={(e) => setYears(e.target.value)} style={inputStyle} />
        </section>

        <section style={{ display: 'grid', gap: 16 }}>
          <ResultCard label="Projected value" value={currency(result.total)} />
          <ResultCard label="Total contributed" value={currency(result.contributed)} />
          <ResultCard label="Investment growth" value={currency(result.growth)} />
        </section>
      </div>
    </main>
  );
}

function ResultCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: '#fff', padding: 20, borderRadius: 16, border: '1px solid #e2e8f0' }}>
      <div style={{ color: '#64748b', fontSize: 14 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, marginTop: 8 }}>{value}</div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  marginTop: 6,
  marginBottom: 14,
  borderRadius: 10,
  border: '1px solid #cbd5e1',
  boxSizing: 'border-box',
};