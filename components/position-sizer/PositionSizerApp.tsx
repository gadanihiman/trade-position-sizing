'use client';

import { useMemo, useState } from 'react';

type NumberFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  helperText?: string;
};

function NumberField({ id, label, value, onChange, placeholder, helperText }: NumberFieldProps) {
  return (
    <div className="grid gap-1.5">
      <label className="text-sm text-slate-300" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type="number"
        step="any"
        inputMode="decimal"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl bg-slate-800 px-4 py-3 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-cyan-400"
      />
      {helperText ? <p className="text-xs text-slate-400">{helperText}</p> : null}
    </div>
  );
}

type StatCardProps = {
  label: string;
  value: string | number;
  hint?: string;
};

function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <div className="rounded-xl bg-slate-800/60 p-4 ring-1 ring-white/10">
      <div className="text-xs uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-1 text-xl font-semibold text-slate-100">{value}</div>
      {hint ? <div className="mt-1 text-xs text-slate-400">{hint}</div> : null}
    </div>
  );
}

export default function PositionSizerApp() {
  const [accountSize, setAccountSize] = useState<string>('');
  const [riskPercent, setRiskPercent] = useState<string>('1');
  const [entryPrice, setEntryPrice] = useState<string>('');
  const [stopLoss, setStopLoss] = useState<string>('');
  const [touched, setTouched] = useState<boolean>(false);

  const parsed = useMemo(() => {
    const a = parseFloat(accountSize);
    const r = parseFloat(riskPercent);
    const e = parseFloat(entryPrice);
    const s = parseFloat(stopLoss);
    return { a, r, e, s };
  }, [accountSize, riskPercent, entryPrice, stopLoss]);

  const errors = useMemo(() => {
    const list: string[] = [];
    if (!Number.isFinite(parsed.a) || parsed.a <= 0) list.push('Account Size must be a positive number.');
    if (!Number.isFinite(parsed.r) || parsed.r <= 0 || parsed.r > 100) list.push('Risk % must be between 0 and 100.');
    if (!Number.isFinite(parsed.e) || parsed.e <= 0) list.push('Entry Price must be a positive number.');
    if (!Number.isFinite(parsed.s) || parsed.s <= 0) list.push('Stop Loss must be a positive number.');
    if (Number.isFinite(parsed.e) && Number.isFinite(parsed.s) && parsed.e === parsed.s) list.push('Entry and Stop Loss cannot be equal.');
    return list;
  }, [parsed]);

  const result = useMemo(() => {
    if (errors.length > 0) return null;

    const riskAmount = parsed.a * (parsed.r / 100);
    const riskPerUnit = Math.abs(parsed.e - parsed.s);
    const units = riskPerUnit === 0 ? 0 : riskAmount / riskPerUnit;
    const notional = units * parsed.e;
    const direction = parsed.e > parsed.s ? 'LONG' : 'SHORT';
    const stopDistancePct = (riskPerUnit / parsed.e) * 100;

    return {
      direction,
      riskAmount,
      riskPerUnit,
      units,
      notional,
      stopDistancePct,
    };
  }, [errors.length, parsed]);

  function format(numberValue: number, options: Intl.NumberFormatOptions = {}) {
    if (!Number.isFinite(numberValue)) return '-';
    return new Intl.NumberFormat(undefined, { maximumFractionDigits: 8, ...options }).format(numberValue);
  }

  function handleCalculate(event: React.FormEvent) {
    event.preventDefault();
    setTouched(true);
  }

  function handleReset() {
    setAccountSize('');
    setRiskPercent('1');
    setEntryPrice('');
    setStopLoss('');
    setTouched(false);
  }

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-slate-100">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Position Sizing Calculator</h1>
          <p className="mt-2 text-slate-300">
            Risk-based position sizing for smarter entries. Fill in your account size, risk %, entry, and stop—then compute exact size.
          </p>
        </header>

        <form onSubmit={handleCalculate} className="grid gap-6 rounded-2xl bg-slate-900/60 p-6 shadow-xl ring-1 ring-white/10">
          <NumberField
            id="accountSize"
            label="Account Size (USD)"
            value={accountSize}
            onChange={setAccountSize}
            placeholder="e.g. 10000"
          />

          <NumberField
            id="riskPercent"
            label="Risk Ratio (%)"
            value={riskPercent}
            onChange={setRiskPercent}
            placeholder="e.g. 1"
            helperText="Typical values: 0.5% – 2%."
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <NumberField
              id="entry"
              label="Entry Price (USD)"
              value={entryPrice}
              onChange={setEntryPrice}
              placeholder="e.g. 62_500"
            />
            <NumberField
              id="stop"
              label="Stop Loss (USD)"
              value={stopLoss}
              onChange={setStopLoss}
              placeholder="e.g. 60_000"
              helperText="If stop is below entry → LONG. If above entry → SHORT."
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="rounded-2xl bg-cyan-500/90 px-5 py-3 font-semibold text-slate-900 shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-300"
            >
              Calculate
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="rounded-2xl bg-slate-800 px-5 py-3 font-medium text-slate-100 ring-1 ring-white/10 hover:bg-slate-700"
            >
              Reset
            </button>
            <span className="text-xs text-slate-400">No data leaves your browser.</span>
          </div>
        </form>

        {touched && (
          <section className="mt-6">
            {errors.length > 0 ? (
              <div className="rounded-2xl border border-red-400/30 bg-red-950/30 p-4 text-red-200">
                <h3 className="mb-1 font-semibold">Please fix the following:</h3>
                <ul className="list-disc pl-5 text-sm">
                  {errors.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              </div>
            ) : result ? (
              <div className="grid gap-4 rounded-2xl bg-slate-900/60 p-6 ring-1 ring-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight">Position Size Result</h3>
                    <p className="text-sm text-slate-400">Direction inferred from Entry vs Stop.</p>
                  </div>
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold ring-1 ring-white/10">
                    {result.direction}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <StatCard
                    label="Risk Amount"
                    value={`$${format(result.riskAmount, { maximumFractionDigits: 2 })}`}
                    hint={`${format(parsed.r, { maximumFractionDigits: 4 })}% of $${format(parsed.a, { maximumFractionDigits: 2 })}`}
                  />
                  <StatCard
                    label="Risk per Unit"
                    value={`$${format(result.riskPerUnit, { maximumFractionDigits: 6 })}`}
                    hint="|Entry - Stop|"
                  />
                  <StatCard label="Size (Units)" value={format(result.units)} hint="Coins / contracts to buy or sell" />
                  <StatCard
                    label="Notional (USD)"
                    value={`$${format(result.notional, { maximumFractionDigits: 2 })}`}
                    hint="Units × Entry Price"
                  />
                </div>

                <div className="rounded-xl bg-slate-800/60 p-4 text-sm text-slate-300 ring-1 ring-white/10">
                  <p className="mb-2 font-medium">Sanity checks</p>
                  <ul className="list-disc space-y-1 pl-5">
                    <li>Stop distance: {format(result.stopDistancePct, { maximumFractionDigits: 4 })}% from entry.</li>
                    <li>
                      If your exchange uses lot sizes / min notional, round <span className="font-semibold">Size (Units)</span>{' '}
                      accordingly and re-check risk.
                    </li>
                    <li>Derivatives with leverage don’t change dollar <em>risk</em>; they change required margin.</li>
                  </ul>
                </div>
              </div>
            ) : null}
          </section>
        )}

        <footer className="mt-10 text-xs text-slate-400">
          <p>Educational tool only. Markets are spicy—manage risk like a pro.</p>
        </footer>
      </div>
    </main>
  );
}

export { NumberField, StatCard };
