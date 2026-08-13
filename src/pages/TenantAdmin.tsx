import { useParams } from 'react-router-dom'
import { Cpu, Zap, DollarSign, Users, Clock, CreditCard, Receipt, BarChart3 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { StatCard } from '../components/ui/StatCard'
import { QuotaBar } from '../components/ui/QuotaBar'
import { Badge } from '../components/ui/Badge'

const ROLE_COLORS: Record<string, string> = {
  admin: 'text-violet bg-violet/10 border-violet/20',
  developer: 'text-primary bg-primary-dim border-primary/20',
  viewer: 'text-slate-400 bg-surface-700 border-border',
}

function ChargebackBilling({ costThisMonth }: { costThisMonth: number }) {
  const departments = [
    { name: 'ML Engineering', gpus: 14, costPercent: 45 },
    { name: 'Data Science', gpus: 10, costPercent: 31 },
    { name: 'Quant Research', gpus: 8, costPercent: 24 },
  ]
  return (
    <div className="bg-surface-800 border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-semibold text-slate-200">Chargeback Allocation</h3>
        <span className="text-sm font-bold text-teal">${(costThisMonth / 1000).toFixed(1)}k this month</span>
      </div>
      <div className="space-y-3">
        {departments.map(d => (
          <div key={d.name}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm text-slate-300">{d.name}</span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500">{d.gpus} GPUs</span>
                <span className="text-xs font-medium text-slate-300 tabular-nums">
                  ${((costThisMonth * d.costPercent / 100) / 1000).toFixed(1)}k
                </span>
              </div>
            </div>
            <div className="h-1.5 rounded-full bg-surface-700 overflow-hidden">
              <div className="h-full rounded-full bg-primary" style={{ width: `${d.costPercent}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
        <span className="text-xs text-slate-500">Budget code</span>
        <span className="text-xs font-mono text-slate-400">DEPT-FIN-0042</span>
      </div>
    </div>
  )
}

function InvoiceBilling({ costThisMonth }: { costThisMonth: number }) {
  const lineItems = [
    { label: 'GPU-hours (H200)', qty: '448 hrs', rate: '$8.50/hr', amount: costThisMonth * 0.72 },
    { label: 'GPU-hours (A10G)', qty: '320 hrs', rate: '$2.80/hr', amount: costThisMonth * 0.20 },
    { label: 'Egress (GiB)', qty: '1,200 GiB', rate: '$0.08/GiB', amount: costThisMonth * 0.04 },
    { label: 'Support tier (Silver)', qty: '1 mo', rate: 'flat', amount: costThisMonth * 0.04 },
  ]
  return (
    <div className="bg-surface-800 border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-semibold text-slate-200">Invoice Breakdown</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-teal bg-teal-dim border border-teal/20 px-2 py-0.5 rounded-full">Net-30</span>
          <Receipt className="w-4 h-4 text-slate-500" />
        </div>
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b border-border-subtle">
            <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider pb-2">Item</th>
            <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider pb-2">Qty</th>
            <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider pb-2">Rate</th>
            <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider pb-2">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-subtle">
          {lineItems.map(item => (
            <tr key={item.label}>
              <td className="text-sm text-slate-300 py-2.5">{item.label}</td>
              <td className="text-right text-xs text-slate-500 py-2.5 tabular-nums">{item.qty}</td>
              <td className="text-right text-xs text-slate-500 py-2.5">{item.rate}</td>
              <td className="text-right text-sm font-medium text-slate-200 py-2.5 tabular-nums">${item.amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-border">
            <td colSpan={3} className="text-sm font-semibold text-slate-200 pt-3">Total</td>
            <td className="text-right text-sm font-bold text-slate-100 pt-3 tabular-nums">${costThisMonth.toLocaleString()}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

function TokenBilling({ tokenUsedM, tokenQuotaM }: { tokenUsedM: number; tokenQuotaM: number }) {
  const dailyData = [1.2, 0.8, 1.4, 1.1, 0.9, 1.5, 1.3, 0.7, 1.0, 1.2, 0.9, 1.1, 1.4, 1.0]
  const maxVal = Math.max(...dailyData)
  return (
    <div className="bg-surface-800 border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-semibold text-slate-200">Token Consumption</h3>
        <span className="text-sm font-bold text-violet">{tokenUsedM.toFixed(1)}M / {tokenQuotaM}M tokens</span>
      </div>
      <div className="flex items-end gap-1 h-24 mb-4">
        {dailyData.map((v, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm bg-violet/60 hover:bg-violet transition-colors duration-100"
            style={{ height: `${(v / maxVal) * 100}%`, minHeight: 4 }}
            title={`${v}M tokens`}
          />
        ))}
      </div>
      <div className="flex justify-between text-xs text-slate-600 mb-5">
        <span>14 days ago</span>
        <span>Today</span>
      </div>
      <QuotaBar
        used={tokenUsedM}
        total={tokenQuotaM}
        label="Monthly quota"
        unit="M"
        color="violet"
      />
    </div>
  )
}

export function TenantAdmin() {
  const { id } = useParams<{ id: string }>()
  const { tenants } = useApp()
  const tenant = tenants.find(t => t.id === id)

  if (!tenant) {
    return (
      <div className="p-8 text-center text-slate-500">
        <Cpu className="w-10 h-10 mx-auto mb-3 text-slate-700" />
        Tenant not found
      </div>
    )
  }

  const gpuPct = tenant.gpuQuota > 0 ? (tenant.gpuUsed / tenant.gpuQuota) * 100 : 0
  const tokenPct = (tenant.tokenUsedM / tenant.tokenQuotaM) * 100

  return (
    <div className="p-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-100">{tenant.name}</h1>
            <span className="text-xs font-medium text-orange bg-orange-dim border border-orange/20 px-2.5 py-1 rounded-full">
              Tenant Admin
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">Usage, team management, and billing overview</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard
          label="GPU Usage"
          value={`${tenant.gpuUsed} / ${tenant.gpuQuota}`}
          sub={`${gpuPct.toFixed(0)}% of quota`}
          icon={<Cpu className="w-5 h-5" />}
          color="primary"
          trend={gpuPct > 75 ? { value: 'near quota', up: false } : undefined}
        />
        <StatCard
          label="Token Usage"
          value={`${tenant.tokenUsedM.toFixed(1)}M`}
          sub={`${tokenPct.toFixed(0)}% of ${tenant.tokenQuotaM}M quota`}
          icon={<Zap className="w-5 h-5" />}
          color="teal"
        />
        <StatCard
          label="Cost This Month"
          value={`$${(tenant.costThisMonth / 1000).toFixed(1)}k`}
          sub="across all resources"
          icon={<DollarSign className="w-5 h-5" />}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          {/* Team table */}
          {tenant.team.length > 0 && (
            <div className="bg-surface-800 border border-border rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-500" />
                  <h3 className="text-sm font-semibold text-slate-200">Team Members</h3>
                </div>
                <span className="text-xs text-slate-500">{tenant.team.length} members</span>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-subtle">
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-2.5">Member</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-2.5">Role</th>
                    <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-2.5">GPUs</th>
                    <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-2.5">Last active</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {tenant.team.map(member => (
                    <tr key={member.id} className="hover:bg-surface-700/50 transition-colors duration-100">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-surface-700 border border-border flex items-center justify-center text-xs font-bold text-slate-400">
                            {member.avatar}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-200">{member.name}</div>
                            <div className="text-xs text-slate-500">{member.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${ROLE_COLORS[member.role]}`}>
                          {member.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`text-sm font-medium tabular-nums ${member.gpusInUse > 0 ? 'text-primary' : 'text-slate-600'}`}>
                          {member.gpusInUse}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5 text-xs text-slate-500">
                          <Clock className="w-3 h-3" />
                          {member.lastActive}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Billing panel */}
          {tenant.billingModel === 'chargeback' && (
            <ChargebackBilling costThisMonth={tenant.costThisMonth} />
          )}
          {tenant.billingModel === 'invoice' && (
            <InvoiceBilling costThisMonth={tenant.costThisMonth} />
          )}
          {tenant.billingModel === 'per-token' && (
            <TokenBilling tokenUsedM={tenant.tokenUsedM} tokenQuotaM={tenant.tokenQuotaM} />
          )}
          {tenant.billingModel === 'none' && (
            <div className="bg-surface-800 border border-border rounded-xl p-6 text-center">
              <CreditCard className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No billing configured for this tenant</p>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <div className="bg-surface-800 border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-slate-500" />
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Quota Overview</div>
            </div>
            <div className="space-y-5">
              {tenant.gpuQuota > 0 && (
                <QuotaBar
                  used={tenant.gpuUsed}
                  total={tenant.gpuQuota}
                  label="GPU Quota"
                  unit=" GPUs"
                  color="primary"
                />
              )}
              <QuotaBar
                used={tenant.tokenUsedM}
                total={tenant.tokenQuotaM}
                label="Token Quota"
                unit="M"
                color="teal"
              />
            </div>
          </div>

          <div className="bg-surface-800 border border-border rounded-xl p-5">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Configuration</div>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Isolation tier</span>
                <span className="text-xs font-medium text-slate-300 capitalize">{tenant.isolationTier}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Billing model</span>
                <span className="text-xs font-medium text-slate-300 capitalize">{tenant.billingModel}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">IdP</span>
                <span className="text-xs font-medium text-slate-300">{tenant.idp}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Created</span>
                <span className="text-xs font-medium text-slate-300">{tenant.createdAt}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Org type</span>
                <Badge variant="default" size="sm">{tenant.orgType}</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
