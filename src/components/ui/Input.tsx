import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
}

export function Input({ label, hint, error, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-slate-300">{label}</label>
      )}
      <input
        className={`w-full bg-surface-900 border rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all duration-150
          ${error ? 'border-rose/50 focus:border-rose' : 'border-border focus:border-primary/60'}
          focus:ring-1 ${error ? 'focus:ring-rose/20' : 'focus:ring-primary/20'} ${className}`}
        {...props}
      />
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
      {error && <p className="text-xs text-rose">{error}</p>}
    </div>
  )
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  hint?: string
  options: { value: string; label: string }[]
}

export function Select({ label, hint, options, className = '', ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-slate-300">{label}</label>
      )}
      <select
        className={`w-full bg-surface-900 border border-border rounded-xl px-3.5 py-2.5 text-sm text-slate-100 outline-none transition-all duration-150
          focus:border-primary/60 focus:ring-1 focus:ring-primary/20 appearance-none cursor-pointer ${className}`}
        {...props}
      >
        {options.map(o => (
          <option key={o.value} value={o.value} className="bg-surface-900">{o.label}</option>
        ))}
      </select>
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  )
}

interface SliderProps {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  step?: number
  unit?: string
  hint?: string
}

export function Slider({ label, value, onChange, min = 0, max = 100, step = 1, unit = '', hint }: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-300">{label}</label>
        <span className="text-sm font-bold text-primary tabular-nums">{value}{unit}</span>
      </div>
      <div className="relative h-1.5">
        <div className="absolute inset-0 rounded-full bg-surface-700" />
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-primary transition-all"
          style={{ width: `${pct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary border-2 border-surface-900 shadow-lg shadow-primary/30 pointer-events-none"
          style={{ left: `calc(${pct}% - 8px)` }}
        />
      </div>
      <div className="flex justify-between text-xs text-slate-600">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  )
}
