interface QuotaBarProps {
  used: number
  total: number
  label: string
  unit?: string
  color?: 'primary' | 'teal' | 'orange' | 'violet'
}

export function QuotaBar({ used, total, label, unit = '', color = 'primary' }: QuotaBarProps) {
  const pct = total > 0 ? Math.min(100, (used / total) * 100) : 0
  const danger = pct > 85

  const colorMap = {
    primary: danger ? 'bg-rose' : 'bg-primary',
    teal: danger ? 'bg-rose' : 'bg-teal',
    orange: danger ? 'bg-rose' : 'bg-orange',
    violet: danger ? 'bg-rose' : 'bg-violet',
  }

  const trackColor = 'bg-surface-700'

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-slate-400">{label}</span>
        <span className="text-xs text-slate-300 font-medium tabular-nums">
          {used}{unit} <span className="text-slate-600">/</span> {total}{unit}
        </span>
      </div>
      <div className={`relative h-1.5 rounded-full overflow-hidden ${trackColor}`}>
        <div
          className={`h-full rounded-full transition-all duration-700 ${colorMap[color]}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-1 text-right">
        <span className={`text-xs font-medium tabular-nums ${danger ? 'text-rose' : 'text-slate-500'}`}>
          {pct.toFixed(0)}%
        </span>
      </div>
    </div>
  )
}

interface QuotaRingProps {
  used: number
  total: number
  label: string
  sublabel?: string
  color?: 'primary' | 'teal' | 'orange' | 'violet'
  size?: number
}

export function QuotaRing({ used, total, label, sublabel, color = 'primary', size = 80 }: QuotaRingProps) {
  const pct = total > 0 ? Math.min(100, (used / total) * 100) : 0
  const radius = (size - 8) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (pct / 100) * circumference

  const strokeColor = {
    primary: '#6B8AFE',
    teal: '#2DD4BF',
    orange: '#FB923C',
    violet: '#A78BFA',
  }[color]

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#1C1C38"
            strokeWidth="6"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-base font-bold text-slate-100 tabular-nums">{pct.toFixed(0)}%</span>
        </div>
      </div>
      <div className="text-center">
        <div className="text-xs font-medium text-slate-300">{label}</div>
        {sublabel && <div className="text-xs text-slate-500">{sublabel}</div>}
      </div>
    </div>
  )
}
