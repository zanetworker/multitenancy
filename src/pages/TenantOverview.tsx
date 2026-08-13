import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Users, Cpu, Zap, DollarSign, Shield, BookOpen,
  CreditCard, Key, Server, ExternalLink, Clock, Activity
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { IsolationBadge, StatusBadge, OrgTypeBadge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { QuotaBar } from '../components/ui/QuotaBar'

const ISO_DETAIL: Record<string, { what: string; guarantees: string[]; gap?: string }> = {
  namespace: {
    what: 'Logical separation within a shared Kubernetes cluster',
    guarantees: ['Cross-namespace visibility blocked via RBAC', 'Separate resource quotas', 'Network policies enforced'],
    gap: 'Shared compute pool — noisy-neighbour risk at the node level',
  },
  cluster: {
    what: 'Dedicated Kubernetes cluster, shared physical hardware',
    guarantees: ['Dedicated control plane', 'No cross-cluster visibility', 'Ethernet isolated via BlueField DPU'],
    gap: 'Physical nodes and InfiniBand fabric may be shared with other tenants',
  },
  physical: {
    what: 'Dedicated physical nodes or rack',
    guarantees: ['No shared hardware', 'Dedicated network fabric', 'Suitable for competitor co-tenancy and govt compliance'],
  },
  epp: {
    what: 'Per-API-key isolation at the inference layer (llm-d EPP)',
    guarantees: ['API key maps to tenant identity', 'Per-tenant KV cache quota via Evictor', 'Never rejects — queues on quota hit'],
    gap: 'No traditional portal — isolation is at the request level only',
  },
}

const BILLING_DETAIL: Record<string, string> = {
  chargeback: 'Usage mapped to a cost center. Monthly chargeback report exported to finance.',
  invoice: 'Usage invoiced monthly. Tenant admin sees line-item breakdown.',
  'per-token': 'Metered per token consumed. No portal billing view — API consumers see usage via dashboard.',
  none: 'No billing. Quota tracking only.',
}

const ROLE_COLORS: Record<string, string> = {
  admin: 'text-primary bg-primary-dim',
  developer: 'text-teal bg-teal-dim',
  viewer: 'text-slate-400 bg-surface-700',
}

export function TenantOverview() {
  const { id } = useParams<{ id: string }>()
  const { tenants, setActiveTenantId, setRole } = useApp()
  const navigate = useNavigate()

  const tenant = tenants.find(t => t.id === id)
  if (!tenant) {
    return (
      <div className="p-8 text-center text-slate-500">
        Tenant not found.
        <Button variant="ghost" className="mt-4" onClick={() => navigate('/')}>← Back to Dashboard</Button>
      </div>
    )
  }

  const iso = ISO_DETAIL[tenant.isolationTier] ?? { what: '', guarantees: [] }
  const gpuPct = tenant.gpuQuota > 0 ? (tenant.gpuUsed / tenant.gpuQuota) * 100 : 0
  const tokPct = tenant.tokenQuotaM > 0 ? (tenant.tokenUsedM / tenant.tokenQuotaM) * 100 : 0

  const openAs = (view: 'admin' | 'portal') => {
    setActiveTenantId(tenant.id)
    setRole(view === 'admin' ? 'tenant-admin' : 'tenant-user')
    navigate(`/tenant/${tenant.id}/${view}`)
  }

  return (
    <div className="p-8 animate-fade-in">
      {/* Back + header */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> All tenants
      </button>

      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-surface-700 border border-border flex items-center justify-center text-base font-bold text-slate-300">
            {tenant.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">{tenant.name}</h1>
            <div className="flex items-center gap-2 mt-1.5">
              <StatusBadge status={tenant.status} />
              <IsolationBadge tier={tenant.isolationTier} />
              <OrgTypeBadge type={tenant.orgType} />
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => openAs('portal')}>
            <ExternalLink className="w-3.5 h-3.5" />
            Tenant Portal
          </Button>
          <Button onClick={() => openAs('admin')}>
            <Users className="w-3.5 h-3.5" />
            Admin View
          </Button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-surface-800 border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <Cpu className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">GPU Usage</span>
          </div>
          {tenant.gpuQuota > 0 ? (
            <>
              <div className="text-2xl font-bold text-slate-100 mb-1">{tenant.gpuUsed}<span className="text-sm text-slate-500 font-normal">/{tenant.gpuQuota}</span></div>
              <QuotaBar used={tenant.gpuUsed} total={tenant.gpuQuota} label="GPUs" color="primary" />
            </>
          ) : (
            <div className="text-sm text-slate-500 mt-1">GPU-less tenant</div>
          )}
        </div>
        <div className="bg-surface-800 border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <Zap className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Tokens / day</span>
          </div>
          <div className="text-2xl font-bold text-slate-100 mb-1">{tenant.tokenUsedM.toFixed(1)}<span className="text-sm text-slate-500 font-normal">M / {tenant.tokenQuotaM}M</span></div>
          <QuotaBar used={tenant.tokenUsedM} total={tenant.tokenQuotaM} label="Tokens" color="teal" />
        </div>
        <div className="bg-surface-800 border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <Users className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Members</span>
          </div>
          <div className="text-2xl font-bold text-slate-100">{tenant.members || '—'}</div>
          <div className="text-xs text-slate-500 mt-1">via {tenant.idp}</div>
        </div>
        <div className="bg-surface-800 border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <DollarSign className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">This Month</span>
          </div>
          <div className="text-2xl font-bold text-slate-100">${(tenant.costThisMonth / 1000).toFixed(1)}<span className="text-sm text-slate-500 font-normal">k</span></div>
          <div className="text-xs text-slate-500 mt-1 capitalize">{tenant.billingModel}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Tenant Properties */}
        <div className="bg-surface-800 border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-slate-200">Tenant Properties</h2>
            <p className="text-xs text-slate-500 mt-0.5">The five fields that define this tenant</p>
          </div>
          <div className="divide-y divide-border-subtle">

            {/* Identity */}
            <div className="px-5 py-4 flex gap-3">
              <div className="w-7 h-7 rounded-lg bg-primary-dim flex items-center justify-center flex-shrink-0 mt-0.5">
                <Key className="w-3.5 h-3.5 text-primary" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Identity</div>
                <div className="text-sm text-slate-200 font-medium">{tenant.idp}</div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {tenant.orgType === 'api' ? 'API key mapped to tenant identity at EPP layer' : 'SSO — users auth via their org IdP'}
                </div>
              </div>
            </div>

            {/* Isolation */}
            <div className="px-5 py-4 flex gap-3">
              <div className="w-7 h-7 rounded-lg bg-teal-dim flex items-center justify-center flex-shrink-0 mt-0.5">
                <Shield className="w-3.5 h-3.5 text-teal" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Isolation</div>
                <div className="text-sm text-slate-200 font-medium mb-1">{iso.what}</div>
                <ul className="space-y-0.5">
                  {iso.guarantees.map(g => (
                    <li key={g} className="text-xs text-slate-500 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-teal flex-shrink-0" />
                      {g}
                    </li>
                  ))}
                </ul>
                {iso.gap && (
                  <div className="mt-2 text-xs text-orange bg-orange-dim border border-orange/20 rounded px-2 py-1">
                    ⚠ {iso.gap}
                  </div>
                )}
              </div>
            </div>

            {/* Catalog */}
            <div className="px-5 py-4 flex gap-3">
              <div className="w-7 h-7 rounded-lg bg-violet-dim flex items-center justify-center flex-shrink-0 mt-0.5">
                <BookOpen className="w-3.5 h-3.5 text-violet" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Catalog</div>
                <div className="text-sm text-slate-200 font-medium">
                  {tenant.orgType === 'api'
                    ? 'Inference API endpoints only'
                    : tenant.orgType === 'external'
                    ? 'GPU clusters, dev VMs, inference APIs'
                    : 'Notebooks, model serving, fine-tuning'}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {tenant.orgType === 'external' ? 'Prices shown to tenant user' : 'No pricing shown — quota only'}
                </div>
              </div>
            </div>

            {/* Quota */}
            <div className="px-5 py-4 flex gap-3">
              <div className="w-7 h-7 rounded-lg bg-orange-dim flex items-center justify-center flex-shrink-0 mt-0.5">
                <Server className="w-3.5 h-3.5 text-orange" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Quota</div>
                <div className="space-y-2">
                  {tenant.gpuQuota > 0 && (
                    <div>
                      <div className="flex justify-between text-xs text-slate-500 mb-1">
                        <span>GPUs</span><span>{tenant.gpuUsed}/{tenant.gpuQuota}</span>
                      </div>
                      <QuotaBar used={tenant.gpuUsed} total={tenant.gpuQuota} label="GPUs" color="primary" />
                    </div>
                  )}
                  <div>
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Tokens/day</span><span>{tenant.tokenUsedM.toFixed(1)}M / {tenant.tokenQuotaM}M</span>
                    </div>
                    <QuotaBar used={tenant.tokenUsedM} total={tenant.tokenQuotaM} label="Tokens" color="teal" />
                  </div>
                </div>
              </div>
            </div>

            {/* Billing */}
            <div className="px-5 py-4 flex gap-3">
              <div className="w-7 h-7 rounded-lg bg-rose-dim flex items-center justify-center flex-shrink-0 mt-0.5">
                <CreditCard className="w-3.5 h-3.5 text-rose" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Billing</div>
                <div className="text-sm text-slate-200 font-medium capitalize">{tenant.billingModel}</div>
                <div className="text-xs text-slate-500 mt-0.5">{BILLING_DETAIL[tenant.billingModel]}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="bg-surface-800 border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-200">Team</h2>
              <p className="text-xs text-slate-500 mt-0.5">{tenant.members} members · {tenant.idp}</p>
            </div>
            <span className="text-xs text-slate-600">Created {tenant.createdAt}</span>
          </div>

          {tenant.team && tenant.team.length > 0 ? (
            <div className="divide-y divide-border-subtle">
              {tenant.team.map(member => (
                <div key={member.id} className="px-5 py-3 flex items-center gap-3 hover:bg-surface-700/40 transition-colors">
                  <div className="w-7 h-7 rounded-full bg-surface-700 border border-border flex items-center justify-center text-[10px] font-bold text-slate-400 flex-shrink-0">
                    {member.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-slate-200 truncate">{member.name}</div>
                    <div className="text-[10px] text-slate-500 truncate">{member.email}</div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {member.gpusInUse > 0 && (
                      <span className="text-[10px] text-teal flex items-center gap-1">
                        <Cpu className="w-3 h-3" />{member.gpusInUse}
                      </span>
                    )}
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded capitalize ${ROLE_COLORS[member.role] ?? 'text-slate-500'}`}>
                      {member.role}
                    </span>
                    <span className="text-[10px] text-slate-600 flex items-center gap-1">
                      <Clock className="w-3 h-3" />{member.lastActive}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-5 py-8 text-center">
              <Activity className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-500">API tenant — no human members</p>
              <p className="text-[10px] text-slate-600 mt-1">Access is via API key, not user accounts</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
