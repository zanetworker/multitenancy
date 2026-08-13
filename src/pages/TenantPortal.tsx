import { useParams } from 'react-router-dom'
import { Brain, Code2, Zap, Bot, MessageSquare, BookOpen, Monitor, Database, HardDrive, Layers, Lock, Plus, Cpu } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { QuotaBar } from '../components/ui/QuotaBar'
import { Button } from '../components/ui/Button'
import { CATALOG_ITEMS } from '../data/constants'
import type { CatalogItem } from '../types'

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Brain, Code2, Zap, Bot, MessageSquare, BookOpen, Monitor, Database, HardDrive, Layers,
}

const LOCKED_ITEMS = [
  'Physical rack access — requires Physical/Rack isolation tier',
  'Cross-tenant data sharing — not permitted by your isolation policy',
  'Raw cluster admin API — provider-only capability',
  'Audit log export — requires invoice billing agreement',
]

function CatalogCard({ item }: { item: CatalogItem }) {
  const Icon = ICON_MAP[item.icon] || Brain

  return (
    <div className={`bg-surface-800 border rounded-xl p-5 flex flex-col gap-3 transition-all duration-150 ${
      item.available ? 'border-border hover:border-border' : 'border-border opacity-50'
    }`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
        item.category === 'model' ? 'bg-primary-dim border border-primary/20' :
        item.category === 'compute' ? 'bg-teal-dim border border-teal/20' :
        item.category === 'storage' ? 'bg-orange-dim border border-orange/20' :
        'bg-violet/10 border border-violet/20'
      }`}>
        <Icon className={`w-5 h-5 ${
          item.category === 'model' ? 'text-primary' :
          item.category === 'compute' ? 'text-teal' :
          item.category === 'storage' ? 'text-orange' : 'text-violet'
        }`} />
      </div>

      <div className="flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="text-sm font-semibold text-slate-100">{item.name}</div>
          {item.external && item.pricePerHour && (
            <span className="text-xs text-orange bg-orange-dim border border-orange/20 px-1.5 py-0.5 rounded-full flex-shrink-0">
              ${item.pricePerHour}/1k
            </span>
          )}
        </div>
        <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.description}</div>
      </div>

      <Button
        variant={item.available ? 'primary' : 'secondary'}
        size="sm"
        disabled={!item.available}
        className="w-full"
      >
        {item.available ? (
          <>
            <Plus className="w-3.5 h-3.5" />
            Request
          </>
        ) : 'Coming soon'}
      </Button>
    </div>
  )
}

export function TenantPortal() {
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

  const availableCatalog = CATALOG_ITEMS.filter(i => i.available)
  const unavailableCatalog = CATALOG_ITEMS.filter(i => !i.available)

  return (
    <div className="p-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-100">{tenant.name}</h1>
            <span className="text-xs font-medium text-violet bg-violet/10 border border-violet/20 px-2.5 py-1 rounded-full">
              Tenant User
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">Self-service resource catalog and quota overview</p>
        </div>
      </div>

      <div className="flex gap-8 items-start">
        <div className="flex-1 min-w-0 space-y-8">
          {/* Catalog */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-slate-200">Resource Catalog</h2>
              <span className="text-xs text-slate-500">{availableCatalog.length} available</span>
            </div>
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
              {availableCatalog.map(item => (
                <CatalogCard key={item.id} item={item} />
              ))}
              {unavailableCatalog.map(item => (
                <CatalogCard key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* Locked items */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-4 h-4 text-slate-500" />
              <h2 className="text-base font-semibold text-slate-400">What you cannot access</h2>
            </div>
            <div className="bg-surface-800 border border-border rounded-xl divide-y divide-border-subtle overflow-hidden">
              {LOCKED_ITEMS.map((item, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3.5">
                  <Lock className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
                  <span className="text-sm text-slate-500">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quota sidebar */}
        <div className="w-64 flex-shrink-0 space-y-4">
          <div className="bg-surface-800 border border-border rounded-xl p-5">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">My Quota</div>
            <div className="space-y-5">
              {tenant.gpuQuota > 0 && (
                <QuotaBar
                  used={tenant.gpuUsed}
                  total={tenant.gpuQuota}
                  label="GPU"
                  unit=" GPUs"
                  color="primary"
                />
              )}
              <QuotaBar
                used={tenant.tokenUsedM}
                total={tenant.tokenQuotaM}
                label="Tokens"
                unit="M"
                color="teal"
              />
            </div>
          </div>

          <div className="bg-surface-800 border border-border rounded-xl p-5">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Tenant Info</div>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Isolation</span>
                <span className="text-xs font-medium text-slate-300 capitalize">{tenant.isolationTier}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">IdP</span>
                <span className="text-xs font-medium text-slate-300">{tenant.idp}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Members</span>
                <span className="text-xs font-medium text-slate-300">{tenant.members}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
