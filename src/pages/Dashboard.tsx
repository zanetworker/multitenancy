import { useNavigate } from 'react-router-dom'
import { PlusCircle, Cpu, Zap, DollarSign, Users, MoreHorizontal, ExternalLink } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { StatCard } from '../components/ui/StatCard'
import { IsolationBadge, StatusBadge, OrgTypeBadge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'

export function Dashboard() {
  const { tenants, setActiveTenantId, setRole } = useApp()
  const navigate = useNavigate()

  const totalGPUs = tenants.reduce((s, t) => s + t.gpuUsed, 0)
  const totalTokensM = tenants.reduce((s, t) => s + t.tokenUsedM, 0)
  const totalRevenue = tenants.reduce((s, t) => s + t.costThisMonth, 0)

  const handleViewTenant = (id: string, view: 'admin' | 'portal') => {
    setActiveTenantId(id)
    setRole(view === 'admin' ? 'tenant-admin' : 'tenant-user')
    navigate(`/tenant/${id}/${view}`)
  }

  return (
    <div className="p-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Tenants</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage GPU-as-a-service access for all tenants</p>
        </div>
        <Button onClick={() => navigate('/create')}>
          <PlusCircle className="w-4 h-4" />
          New Tenant
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Tenants"
          value={tenants.length}
          sub="across all isolation tiers"
          icon={<Users className="w-5 h-5" />}
          color="primary"
          trend={{ value: '1 this month', up: true }}
        />
        <StatCard
          label="Active GPUs"
          value={totalGPUs}
          sub="H200s and A10Gs in use"
          icon={<Cpu className="w-5 h-5" />}
          color="teal"
          trend={{ value: '12% utilisation', up: true }}
        />
        <StatCard
          label="Tokens / day"
          value={`${(totalTokensM * 1000 / 30).toFixed(0)}k`}
          sub="avg across 30 days"
          icon={<Zap className="w-5 h-5" />}
          color="orange"
        />
        <StatCard
          label="Monthly Revenue"
          value={`$${(totalRevenue / 1000).toFixed(0)}k`}
          sub="chargeback + invoiced"
          icon={<DollarSign className="w-5 h-5" />}
          color="violet"
          trend={{ value: '8% vs last month', up: true }}
        />
      </div>

      {/* Tenant Table */}
      <div className="bg-surface-800 border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-200">All Tenants</h2>
          <span className="text-xs text-slate-500">{tenants.length} tenants</span>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-subtle">
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Name</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Isolation</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">GPU Usage</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Status</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Type</th>
              <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {tenants.map(tenant => {
              const gpuPct = tenant.gpuQuota > 0 ? (tenant.gpuUsed / tenant.gpuQuota) * 100 : 0
              return (
                <tr
                  key={tenant.id}
                  className="hover:bg-surface-700/50 transition-colors duration-100 group cursor-pointer"
                  onClick={() => navigate(`/tenant/${tenant.id}`)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-surface-700 border border-border flex items-center justify-center text-xs font-bold text-slate-400">
                        {tenant.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-200 group-hover:text-primary transition-colors">{tenant.name}</div>
                        <div className="text-xs text-slate-500">{tenant.members} member{tenant.members !== 1 ? 's' : ''} · {tenant.idp}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <IsolationBadge tier={tenant.isolationTier} />
                  </td>
                  <td className="px-4 py-4">
                    {tenant.gpuQuota > 0 ? (
                      <div className="w-36">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-slate-400 tabular-nums">{tenant.gpuUsed}/{tenant.gpuQuota} GPUs</span>
                          <span className="text-xs text-slate-500">{gpuPct.toFixed(0)}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-surface-700 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${gpuPct > 85 ? 'bg-rose' : 'bg-primary'}`}
                            style={{ width: `${gpuPct}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500">
                        <span className="text-violet font-medium">{tenant.tokenUsedM.toFixed(1)}M</span>
                        <span className="text-slate-600">/{tenant.tokenQuotaM}M tokens</span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={tenant.status} />
                  </td>
                  <td className="px-4 py-4">
                    <OrgTypeBadge type={tenant.orgType} />
                  </td>
                  <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewTenant(tenant.id, 'portal')}
                        title="Tenant Portal"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Portal
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleViewTenant(tenant.id, 'admin')}
                      >
                        Admin
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {tenants.length === 0 && (
          <div className="py-16 text-center">
            <Cpu className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-500">No tenants yet. Create your first tenant to get started.</p>
          </div>
        )}
      </div>
    </div>
  )
}
