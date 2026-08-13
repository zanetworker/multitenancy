import React from 'react'

interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  icon: React.ReactNode
  trend?: { value: string; up: boolean }
  color?: 'primary' | 'teal' | 'orange' | 'violet'
}

export function StatCard({ label, value, sub, icon, trend, color = 'primary' }: StatCardProps) {
  const colorMap = {
    primary: { bg: 'bg-primary-dim', border: 'border-primary/20', text: 'text-primary' },
    teal: { bg: 'bg-teal-dim', border: 'border-teal/20', text: 'text-teal' },
    orange: { bg: 'bg-orange-dim', border: 'border-orange/20', text: 'text-orange' },
    violet: { bg: 'bg-violet-dim', border: 'border-violet/20', text: 'text-violet' },
  }
  const c = colorMap[color]

  return (
    <div className="bg-surface-800 border border-border rounded-xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.bg} border ${c.border}`}>
          <span className={c.text}>{icon}</span>
        </div>
        {trend && (
          <span className={`text-xs font-medium ${trend.up ? 'text-teal' : 'text-rose'}`}>
            {trend.up ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-slate-100 tabular-nums">{value}</div>
      <div className="text-sm text-slate-400 mt-0.5">{label}</div>
      {sub && <div className="text-xs text-slate-600 mt-1">{sub}</div>}
    </div>
  )
}
