import { NavLink, useNavigate } from 'react-router-dom'
import { Cpu, LayoutDashboard, PlusCircle, ChevronDown, Building2, Globe, Server, Users, Shield } from 'lucide-react'
import { useApp } from '../context/AppContext'
import type { Role, UseCase } from '../types'

const NAV_LINKS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/create', label: 'Create Tenant', icon: PlusCircle, exact: false },
]

const ROLES: { value: Role; label: string; icon: typeof Shield }[] = [
  { value: 'provider', label: 'Provider Admin', icon: Shield },
  { value: 'tenant-admin', label: 'Tenant Admin', icon: Users },
  { value: 'tenant-user', label: 'Tenant User', icon: Users },
]

const USE_CASES: { value: UseCase; label: string; icon: typeof Globe }[] = [
  { value: 'internal', label: 'Internal', icon: Building2 },
  { value: 'external', label: 'External', icon: Globe },
  { value: 'maas', label: 'MaaS', icon: Server },
]

export function Sidebar() {
  const { role, setRole, useCase, setUseCase, tenants, activeTenantId, setActiveTenantId } = useApp()
  const navigate = useNavigate()

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole)
    if (newRole === 'provider') {
      navigate('/')
    } else if (activeTenantId) {
      const path = newRole === 'tenant-admin' ? `/tenant/${activeTenantId}/admin` : `/tenant/${activeTenantId}/portal`
      navigate(path)
    }
  }

  return (
    <aside className="w-60 flex-shrink-0 bg-surface-900 border-r border-border flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary-dim border border-primary/30 flex items-center justify-center">
            <Cpu className="w-4 h-4 text-primary" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-100 leading-tight">GPU Tenant</div>
            <div className="text-xs text-slate-500 leading-tight">Platform</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">
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

        {/* Tenant list (when in tenant role) */}
        {(role === 'tenant-admin' || role === 'tenant-user') && (
          <div className="mt-4">
            <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider px-3 mb-1">Tenant</div>
            <div className="space-y-0.5">
              {tenants.map(t => (
                <button
                  key={t.id}
                  onClick={() => {
                    setActiveTenantId(t.id)
                    const path = role === 'tenant-admin' ? `/tenant/${t.id}/admin` : `/tenant/${t.id}/portal`
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

      {/* Bottom section */}
      <div className="p-3 border-t border-border space-y-3">
        {/* Use Case */}
        <div>
          <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider px-1 mb-1.5">Context</div>
          <div className="flex gap-1">
            {USE_CASES.map(uc => (
              <button
                key={uc.value}
                onClick={() => setUseCase(uc.value)}
                className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                  useCase === uc.value
                    ? 'bg-surface-700 text-slate-200 border border-border'
                    : 'text-slate-600 hover:text-slate-400'
                }`}
                title={uc.label}
              >
                <uc.icon className="w-3 h-3" />
                <span className="hidden xl:block">{uc.label}</span>
              </button>
            ))}
          </div>
          <div className="text-center text-xs text-slate-600 mt-1 capitalize">{useCase}</div>
        </div>

        {/* Role switcher */}
        <div>
          <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider px-1 mb-1.5">Role</div>
          <div className="relative">
            <select
              value={role}
              onChange={e => handleRoleChange(e.target.value as Role)}
              className="w-full bg-surface-800 border border-border rounded-lg px-3 py-2 text-xs text-slate-300 outline-none focus:border-primary/50 appearance-none cursor-pointer"
            >
              {ROLES.map(r => (
                <option key={r.value} value={r.value} className="bg-surface-900">{r.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" />
          </div>
        </div>
      </div>
    </aside>
  )
}
