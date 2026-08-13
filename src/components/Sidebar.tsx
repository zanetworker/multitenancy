import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, PlusCircle, ChevronDown, Building2, Globe, Server } from 'lucide-react'
import { useApp } from '../context/AppContext'
import type { Role, UseCase } from '../types'

const NAV_LINKS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/create', label: 'New Tenant', icon: PlusCircle, exact: false },
]

const ROLES: {
  value: Role
  label: string
  who: string
  example: string
  dot: string
}[] = [
  {
    value: 'provider',
    label: 'Provider Admin',
    who: 'Platform operator',
    example: 'Foxconn IT · RHOAI platform team · cloud ops',
    dot: 'bg-primary',
  },
  {
    value: 'tenant-admin',
    label: 'Tenant Admin',
    who: "Tenant's IT lead",
    example: 'TSMC ML platform lead · Wells Fargo AI team lead',
    dot: 'bg-teal',
  },
  {
    value: 'tenant-user',
    label: 'Tenant User',
    who: 'ML engineer / data scientist',
    example: 'TSMC researcher · Capital Markets quant · Bloomberg dev',
    dot: 'bg-violet',
  },
]

const USE_CASES: {
  value: UseCase
  label: string
  short: string
  desc: string
  icon: typeof Globe
}[] = [
  {
    value: 'internal',
    label: 'Internal AI Platform',
    short: 'Internal',
    desc: 'Cost center chargeback — trusted teams inside one org',
    icon: Building2,
  },
  {
    value: 'external',
    label: 'External GPU Cloud',
    short: 'External',
    desc: 'Invoiced customers — potentially competing tenants',
    icon: Globe,
  },
  {
    value: 'maas',
    label: 'MaaS / API',
    short: 'MaaS',
    desc: 'Per-API-key token serving — no portal, just endpoints',
    icon: Server,
  },
]

export function Sidebar() {
  const { role, setRole, useCase, setUseCase, tenants, activeTenantId, setActiveTenantId } = useApp()
  const navigate = useNavigate()

  const currentRole = ROLES.find(r => r.value === role)!
  const currentUC = USE_CASES.find(u => u.value === useCase)!

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole)
    if (newRole === 'provider') {
      navigate('/')
    } else if (activeTenantId) {
      const path = newRole === 'tenant-admin'
        ? `/tenant/${activeTenantId}/admin`
        : `/tenant/${activeTenantId}/portal`
      navigate(path)
    } else if (tenants.length > 0) {
      const first = tenants[0].id
      setActiveTenantId(first)
      const path = newRole === 'tenant-admin'
        ? `/tenant/${first}/admin`
        : `/tenant/${first}/portal`
      navigate(path)
    }
  }

  return (
    <aside className="w-64 flex-shrink-0 bg-surface-900 border-r border-border flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2.5">
          {/* Red Hat hat SVG mark */}
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="flex-shrink-0">
            <rect width="28" height="28" rx="6" fill="#EE0000"/>
            {/* Simplified hat shape */}
            <path d="M7 17.5 C7 17.5 9.5 14 14 14 C18.5 14 21 17.5 21 17.5 L19.5 18.5 C19.5 18.5 18 16 14 16 C10 16 8.5 18.5 8.5 18.5 Z" fill="white"/>
            <ellipse cx="14" cy="13" rx="5" ry="3" fill="white"/>
          </svg>
          <div>
            <div className="text-sm font-bold text-white leading-tight" style={{fontFamily:'Red Hat Display,sans-serif'}}>GPU Tenant</div>
            <div className="text-[10px] text-red-300 leading-tight tracking-wide">Red Hat · Platform</div>
          </div>
        </div>
      </div>

      {/* Who am I banner */}
      <div className="px-4 py-3 border-b border-border bg-surface-800/50">
        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5">Viewing as</div>
        <div className="flex items-start gap-2">
          <span className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${currentRole.dot}`} />
          <div>
            <div className="text-xs font-semibold text-slate-200">{currentRole.who}</div>
            <div className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{currentRole.example}</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-4">
        <div className="space-y-0.5">
          {NAV_LINKS.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.exact}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-primary-dim text-primary border border-primary/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-surface-700'
                }`
              }
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Tenant list */}
        {(role === 'tenant-admin' || role === 'tenant-user') && (
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-600 px-3 mb-1.5">
              {role === 'tenant-admin' ? 'Your tenants' : 'Your account'}
            </div>
            <div className="space-y-0.5">
              {tenants.map(t => (
                <button
                  key={t.id}
                  onClick={() => {
                    setActiveTenantId(t.id)
                    const path = role === 'tenant-admin'
                      ? `/tenant/${t.id}/admin`
                      : `/tenant/${t.id}/portal`
                    navigate(path)
                  }}
                  className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
                    activeTenantId === t.id
                      ? 'bg-surface-700 text-slate-200'
                      : 'text-slate-500 hover:text-slate-300 hover:bg-surface-700'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-teal flex-shrink-0" />
                  <span className="truncate">{t.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Bottom: role + use case switchers */}
      <div className="p-3 border-t border-border space-y-4">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5">Use case</div>
          <div className="flex gap-1 mb-1.5">
            {USE_CASES.map(uc => (
              <button
                key={uc.value}
                onClick={() => setUseCase(uc.value)}
                className={`flex-1 py-1.5 rounded-md text-[10px] font-semibold transition-all duration-150 ${
                  useCase === uc.value
                    ? 'bg-surface-700 text-slate-200 border border-border'
                    : 'text-slate-600 hover:text-slate-400'
                }`}
                title={uc.desc}
              >
                {uc.short}
              </button>
            ))}
          </div>
          <div className="text-[10px] text-slate-600 leading-relaxed px-0.5">{currentUC.desc}</div>
        </div>

        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5">Switch role</div>
          <div className="relative">
            <select
              value={role}
              onChange={e => handleRoleChange(e.target.value as Role)}
              className="w-full bg-surface-800 border border-border rounded-lg px-3 py-2 text-xs text-slate-300 outline-none focus:border-primary/50 appearance-none cursor-pointer"
            >
              {ROLES.map(r => (
                <option key={r.value} value={r.value} className="bg-surface-900">
                  {r.label} — {r.who}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" />
          </div>
        </div>
      </div>
    </aside>
  )
}
