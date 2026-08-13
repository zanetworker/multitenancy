import type { IsolationTier, OrgType } from '../../types'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'ghost'
  size?: 'sm' | 'md'
  className?: string
}

export function Badge({ children, variant = 'default', size = 'sm', className = '' }: BadgeProps) {
  const variants = {
    default: 'bg-surface-700 text-slate-300 border border-border',
    success: 'bg-teal-dim text-teal border border-teal/20',
    warning: 'bg-orange-dim text-orange border border-orange/20',
    danger: 'bg-rose-dim text-rose border border-rose/20',
    ghost: 'bg-primary-dim text-primary border border-primary/20',
  }
  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
  }

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  )
}

export function IsolationBadge({ tier }: { tier: IsolationTier }) {
  const config = {
    namespace: { color: 'bg-teal', label: 'Namespace' },
    cluster: { color: 'bg-primary', label: 'Cluster' },
    physical: { color: 'bg-orange', label: 'Physical' },
    epp: { color: 'bg-violet', label: 'EPP' },
  }
  const { color, label } = config[tier]

  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`w-1.5 h-1.5 rounded-full ${color}`} />
      <span className="text-xs text-slate-300 font-medium">{label}</span>
    </span>
  )
}

export function StatusBadge({ status }: { status: 'active' | 'provisioning' | 'suspended' }) {
  const config = {
    active: { bg: 'bg-teal-dim', text: 'text-teal', border: 'border-teal/20', dot: 'bg-teal', label: 'Active' },
    provisioning: { bg: 'bg-primary-dim', text: 'text-primary', border: 'border-primary/20', dot: 'bg-primary', label: 'Provisioning' },
    suspended: { bg: 'bg-rose-dim', text: 'text-rose', border: 'border-rose/20', dot: 'bg-rose', label: 'Suspended' },
  }
  const c = config[status]

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full border ${c.bg} ${c.text} ${c.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  )
}

export function OrgTypeBadge({ type }: { type: OrgType }) {
  const config = {
    internal: { label: 'Internal', className: 'text-slate-400 bg-surface-700 border-border' },
    external: { label: 'External', className: 'text-orange bg-orange-dim border-orange/20' },
    api: { label: 'API App', className: 'text-violet bg-violet/10 border-violet/20' },
  }
  const c = config[type]

  return (
    <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full border ${c.className}`}>
      {c.label}
    </span>
  )
}
