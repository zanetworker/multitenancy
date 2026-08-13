import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ChevronRight, AlertCircle, ArrowRight, Cpu, Globe, Building2, Server } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Input, Select, Slider } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { IsolationBadge } from '../components/ui/Badge'
import { ISOLATION_OPTIONS, IDP_OPTIONS, BILLING_OPTIONS, CATALOG_ITEMS } from '../data/constants'
import type { IsolationTier, BillingModel, OrgType, Tenant } from '../types'

type Step = 1 | 2 | 3

interface WizardState {
  name: string
  orgType: OrgType
  idp: string
  q1: OrgType | null
  q2: 'yes' | 'no' | null
  q3: 'yes' | 'no' | null
  recommendedTier: IsolationTier | null
  selectedTier: IsolationTier | null
  showAllOptions: boolean
  catalogItems: string[]
  gpuQuota: number
  tokenQuotaM: number
  billingModel: BillingModel
}

function deriveRecommendation(state: WizardState): IsolationTier {
  if (state.q1 === 'api') return 'epp'
  if (state.q1 === 'external') {
    if (state.q2 === 'yes' || state.q3 === 'yes') return 'physical'
    return 'cluster'
  }
  return 'namespace'
}

const TIER_COLOR_MAP: Record<IsolationTier, string> = {
  namespace: 'border-teal/30 bg-teal-dim',
  cluster: 'border-primary/30 bg-primary-dim',
  physical: 'border-orange/30 bg-orange-dim',
  epp: 'border-violet/30 bg-violet/10',
}

const TIER_TEXT_MAP: Record<IsolationTier, string> = {
  namespace: 'text-teal',
  cluster: 'text-primary',
  physical: 'text-orange',
  epp: 'text-violet',
}

function StepIndicator({ step, current }: { step: number; current: Step }) {
  const done = current > step
  const active = current === step

  return (
    <div className="flex items-center">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200 ${
        done ? 'bg-teal text-white' :
        active ? 'bg-primary text-white' :
        'bg-surface-700 text-slate-500 border border-border'
      }`}>
        {done ? <Check className="w-4 h-4" /> : step}
      </div>
      <span className={`ml-2 text-sm font-medium ${active ? 'text-slate-100' : done ? 'text-slate-400' : 'text-slate-600'}`}>
        {['Identity', 'Isolation', 'Catalog & Quotas'][step - 1]}
      </span>
    </div>
  )
}

function TenantPreview({ state }: { state: WizardState }) {
  const tier = state.selectedTier || state.recommendedTier
  const billing = BILLING_OPTIONS.find(b => b.value === state.billingModel)
  const catalogCount = state.catalogItems.length

  return (
    <div className="bg-surface-900 border border-border rounded-xl p-5 sticky top-8">
      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Tenant Preview</div>

      <div className="space-y-4">
        <div>
          <div className="text-lg font-bold text-slate-100 truncate">{state.name || 'Unnamed Tenant'}</div>
          {state.orgType && (
            <div className="text-xs text-slate-500 capitalize mt-0.5">{state.orgType} organization</div>
          )}
        </div>

        {tier && (
          <div className={`rounded-lg p-3 border ${TIER_COLOR_MAP[tier]}`}>
            <div className={`text-xs font-semibold uppercase tracking-wider mb-1 ${TIER_TEXT_MAP[tier]}`}>Isolation</div>
            <IsolationBadge tier={tier} />
          </div>
        )}

        <div className="space-y-2">
          {state.gpuQuota > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">GPU Quota</span>
              <span className="text-xs font-medium text-slate-300">{state.gpuQuota} GPUs</span>
            </div>
          )}
          {state.tokenQuotaM > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Token Quota</span>
              <span className="text-xs font-medium text-slate-300">{state.tokenQuotaM}M tokens/mo</span>
            </div>
          )}
          {billing && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Billing</span>
              <span className="text-xs font-medium text-slate-300">{billing.label}</span>
            </div>
          )}
          {catalogCount > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Catalog items</span>
              <span className="text-xs font-medium text-slate-300">{catalogCount} selected</span>
            </div>
          )}
          {state.idp && state.idp !== 'ldap' && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">IdP</span>
              <span className="text-xs font-medium text-slate-300">{IDP_OPTIONS.find(i => i.value === state.idp)?.label}</span>
            </div>
          )}
        </div>

        {!state.name && !tier && (
          <div className="text-xs text-slate-600 text-center py-2">Fill in the wizard to see a preview</div>
        )}
      </div>
    </div>
  )
}

export function CreateTenant() {
  const navigate = useNavigate()
  const { addTenant } = useApp()
  const [step, setStep] = useState<Step>(1)
  const [state, setState] = useState<WizardState>({
    name: '',
    orgType: 'internal',
    idp: 'ldap',
    q1: null,
    q2: null,
    q3: null,
    recommendedTier: null,
    selectedTier: null,
    showAllOptions: false,
    catalogItems: ['llama3-70b', 'jupyter-gpu'],
    gpuQuota: 20,
    tokenQuotaM: 5,
    billingModel: 'chargeback',
  })

  const update = (patch: Partial<WizardState>) => setState(prev => ({ ...prev, ...patch }))

  const handleQ1 = (v: OrgType) => {
    update({ q1: v, q2: null, q3: null, recommendedTier: null, selectedTier: null })
  }

  const handleQ2 = (v: 'yes' | 'no') => {
    update({ q2: v, q3: null, recommendedTier: null, selectedTier: null })
  }

  const handleQ3 = (v: 'yes' | 'no') => {
    const newState = { ...state, q3: v }
    const tier = deriveRecommendation(newState as WizardState)
    update({ q3: v, recommendedTier: tier, selectedTier: tier })
  }

  const handleQ2Final = (v: 'yes' | 'no') => {
    if (state.q1 === 'api') return
    if (v === 'yes') {
      update({ q2: v, recommendedTier: 'physical', selectedTier: 'physical', q3: null })
    } else {
      handleQ2(v)
    }
  }

  const handleCreate = () => {
    const tenant: Tenant = {
      id: `tenant-${Date.now()}`,
      name: state.name,
      orgType: state.orgType,
      isolationTier: state.selectedTier || state.recommendedTier || 'namespace',
      billingModel: state.billingModel,
      gpuQuota: state.gpuQuota,
      gpuUsed: 0,
      tokenQuotaM: state.tokenQuotaM,
      tokenUsedM: 0,
      status: 'provisioning',
      members: 0,
      createdAt: new Date().toISOString().slice(0, 10),
      idp: IDP_OPTIONS.find(i => i.value === state.idp)?.label || state.idp,
      costThisMonth: 0,
      team: [],
    }
    addTenant(tenant)
    navigate('/')
  }

  const canAdvance1 = state.name.trim().length > 0
  const canAdvance2 = !!state.selectedTier || !!state.recommendedTier
  const tier = state.selectedTier || state.recommendedTier
  const isolationInfo = tier ? ISOLATION_OPTIONS.find(o => o.tier === tier) : null

  return (
    <div className="p-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100">Create Tenant</h1>
        <p className="text-sm text-slate-500 mt-0.5">Configure GPU access and isolation for a new tenant</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-4 mb-10">
        <StepIndicator step={1} current={step} />
        <ChevronRight className="w-4 h-4 text-slate-700" />
        <StepIndicator step={2} current={step} />
        <ChevronRight className="w-4 h-4 text-slate-700" />
        <StepIndicator step={3} current={step} />
      </div>

      <div className="flex gap-8 items-start">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Step 1: Identity */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-surface-800 border border-border rounded-xl p-6">
                <h2 className="text-base font-semibold text-slate-100 mb-5">Identity</h2>

                <div className="space-y-5">
                  <Input
                    label="Tenant name"
                    placeholder="e.g. Capital Markets Team"
                    value={state.name}
                    onChange={e => update({ name: e.target.value })}
                    hint="Used as the display name and for namespace scoping"
                  />

                  <div>
                    <label className="text-sm font-medium text-slate-300 block mb-2">Organization type</label>
                    <div className="grid grid-cols-3 gap-3">
                      {([
                        { value: 'internal', label: 'Internal Team', icon: Building2, desc: 'Employees, shared infra' },
                        { value: 'external', label: 'External Company', icon: Globe, desc: 'Customers, partners' },
                        { value: 'api', label: 'API Application', icon: Server, desc: 'Service-to-service, no users' },
                      ] as const).map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => update({ orgType: opt.value })}
                          className={`flex flex-col items-start gap-2 p-4 rounded-xl border text-left transition-all duration-150 ${
                            state.orgType === opt.value
                              ? 'border-primary/50 bg-primary-dim'
                              : 'border-border bg-surface-900 hover:border-border hover:bg-surface-700'
                          }`}
                        >
                          <opt.icon className={`w-5 h-5 ${state.orgType === opt.value ? 'text-primary' : 'text-slate-500'}`} />
                          <div>
                            <div className={`text-sm font-medium ${state.orgType === opt.value ? 'text-primary' : 'text-slate-300'}`}>{opt.label}</div>
                            <div className="text-xs text-slate-500 mt-0.5">{opt.desc}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Select
                    label="Identity Provider"
                    value={state.idp}
                    onChange={e => update({ idp: e.target.value })}
                    options={IDP_OPTIONS}
                    hint="Users authenticate via this IdP to access the tenant portal"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button disabled={!canAdvance1} onClick={() => setStep(2)}>
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Isolation */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-surface-800 border border-border rounded-xl p-6">
                <h2 className="text-base font-semibold text-slate-100 mb-1">Isolation Questionnaire</h2>
                <p className="text-sm text-slate-500 mb-6">Answer three questions to get the right isolation tier for {state.name}.</p>

                <div className="space-y-6">
                  {/* Q1 */}
                  <div>
                    <div className="text-sm font-medium text-slate-200 mb-3">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-surface-700 text-slate-400 text-xs font-bold mr-2">1</span>
                      Who is this tenant?
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {([
                        { value: 'internal', label: 'An internal team' },
                        { value: 'external', label: 'An external company' },
                        { value: 'api', label: 'An application / API' },
                      ] as const).map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => handleQ1(opt.value)}
                          className={`py-2.5 px-3 rounded-lg border text-sm font-medium transition-all duration-150 ${
                            state.q1 === opt.value
                              ? 'border-primary/50 bg-primary-dim text-primary'
                              : 'border-border bg-surface-900 text-slate-400 hover:border-border hover:bg-surface-700 hover:text-slate-300'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Q2 */}
                  {state.q1 && state.q1 !== 'api' && (
                    <div className="animate-fade-in">
                      <div className="text-sm font-medium text-slate-200 mb-3">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-surface-700 text-slate-400 text-xs font-bold mr-2">2</span>
                        Could any two tenants on this platform compete with each other?
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {([
                          { value: 'yes', label: 'Yes — competitors present' },
                          { value: 'no', label: 'No — all co-operative' },
                        ] as const).map(opt => (
                          <button
                            key={opt.value}
                            onClick={() => handleQ2Final(opt.value)}
                            className={`py-2.5 px-3 rounded-lg border text-sm font-medium transition-all duration-150 ${
                              state.q2 === opt.value
                                ? 'border-primary/50 bg-primary-dim text-primary'
                                : 'border-border bg-surface-900 text-slate-400 hover:bg-surface-700 hover:text-slate-300'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Q3 */}
                  {state.q1 && state.q1 !== 'api' && state.q2 === 'no' && (
                    <div className="animate-fade-in">
                      <div className="text-sm font-medium text-slate-200 mb-3">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-surface-700 text-slate-400 text-xs font-bold mr-2">3</span>
                        Does this tenant have hard compliance requirements? (HIPAA, FedRAMP, SOC 2 Type II)
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {([
                          { value: 'yes', label: 'Yes — regulated workload' },
                          { value: 'no', label: 'No — standard requirements' },
                        ] as const).map(opt => (
                          <button
                            key={opt.value}
                            onClick={() => handleQ3(opt.value)}
                            className={`py-2.5 px-3 rounded-lg border text-sm font-medium transition-all duration-150 ${
                              state.q3 === opt.value
                                ? 'border-primary/50 bg-primary-dim text-primary'
                                : 'border-border bg-surface-900 text-slate-400 hover:bg-surface-700 hover:text-slate-300'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Auto-recommendation for api */}
                  {state.q1 === 'api' && !state.recommendedTier && (
                    <div className="animate-fade-in">
                      <Button
                        variant="secondary"
                        onClick={() => update({ recommendedTier: 'epp', selectedTier: 'epp' })}
                      >
                        Get recommendation
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Recommendation card */}
              {isolationInfo && (
                <div className={`rounded-xl border p-5 animate-fade-in ${TIER_COLOR_MAP[isolationInfo.tier]}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className={`text-xs font-semibold uppercase tracking-wider mb-1 ${TIER_TEXT_MAP[isolationInfo.tier]}`}>Recommended</div>
                      <div className="text-lg font-bold text-slate-100">{isolationInfo.label} Isolation</div>
                    </div>
                    <IsolationBadge tier={isolationInfo.tier} />
                  </div>
                  <p className="text-sm text-slate-300 mb-4">{isolationInfo.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-teal flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-medium text-teal">RHOAI today: </span>
                        <span className="text-xs text-slate-400">{isolationInfo.rhaiStatus}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-orange flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-medium text-orange">Gap: </span>
                        <span className="text-xs text-slate-400">{isolationInfo.gap}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* All options */}
              {isolationInfo && !state.showAllOptions && (
                <button
                  className="text-sm text-slate-500 hover:text-slate-300 transition-colors duration-150 underline underline-offset-2"
                  onClick={() => update({ showAllOptions: true })}
                >
                  Not right? See all options &rarr;
                </button>
              )}

              {state.showAllOptions && (
                <div className="bg-surface-800 border border-border rounded-xl p-5 animate-fade-in">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">All Isolation Tiers</div>
                  <div className="grid grid-cols-2 gap-3">
                    {ISOLATION_OPTIONS.map(opt => (
                      <button
                        key={opt.tier}
                        onClick={() => update({ selectedTier: opt.tier })}
                        className={`text-left p-4 rounded-xl border transition-all duration-150 ${
                          state.selectedTier === opt.tier
                            ? `${TIER_COLOR_MAP[opt.tier]} border-opacity-50`
                            : 'border-border bg-surface-900 hover:bg-surface-700'
                        }`}
                      >
                        <IsolationBadge tier={opt.tier} />
                        <p className="text-xs text-slate-500 mt-2 leading-relaxed">{opt.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between">
                <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
                <Button disabled={!canAdvance2} onClick={() => setStep(3)}>
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Catalog & Quotas */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-surface-800 border border-border rounded-xl p-6">
                <h2 className="text-base font-semibold text-slate-100 mb-5">Catalog Access</h2>
                <p className="text-sm text-slate-500 mb-4">Select the resources this tenant can request. External items have per-token billing.</p>

                <div className="space-y-2">
                  {CATALOG_ITEMS.map(item => (
                    <label
                      key={item.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-150 ${
                        state.catalogItems.includes(item.id)
                          ? 'border-primary/30 bg-primary-dim'
                          : 'border-border bg-surface-900 hover:bg-surface-700'
                      } ${!item.available ? 'opacity-40 cursor-not-allowed' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={state.catalogItems.includes(item.id)}
                        disabled={!item.available}
                        onChange={e => {
                          if (e.target.checked) {
                            update({ catalogItems: [...state.catalogItems, item.id] })
                          } else {
                            update({ catalogItems: state.catalogItems.filter(i => i !== item.id) })
                          }
                        }}
                        className="w-4 h-4 accent-primary"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-200">{item.name}</span>
                          {item.external && (
                            <span className="text-xs text-orange bg-orange-dim px-1.5 py-0.5 rounded-full border border-orange/20">
                              External &middot; ${item.pricePerHour}/1k tok
                            </span>
                          )}
                          {!item.available && (
                            <span className="text-xs text-slate-600 bg-surface-700 px-1.5 py-0.5 rounded-full">Coming soon</span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500">{item.description}</div>
                      </div>
                      <span className={`text-xs font-medium capitalize ${
                        item.category === 'model' ? 'text-primary' :
                        item.category === 'compute' ? 'text-teal' :
                        item.category === 'storage' ? 'text-orange' : 'text-violet'
                      }`}>{item.category}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-surface-800 border border-border rounded-xl p-6">
                <h2 className="text-base font-semibold text-slate-100 mb-5">Quotas</h2>
                <div className="space-y-6">
                  <Slider
                    label="GPU Quota"
                    value={state.gpuQuota}
                    onChange={v => update({ gpuQuota: v })}
                    min={0}
                    max={200}
                    step={5}
                    unit=" GPUs"
                    hint="Maximum H200/A10G GPUs this tenant can allocate simultaneously"
                  />
                  <Slider
                    label="Token Quota"
                    value={state.tokenQuotaM}
                    onChange={v => update({ tokenQuotaM: v })}
                    min={1}
                    max={100}
                    step={1}
                    unit="M/mo"
                    hint="Monthly token allowance across all inference endpoints"
                  />
                </div>
              </div>

              <div className="bg-surface-800 border border-border rounded-xl p-6">
                <h2 className="text-base font-semibold text-slate-100 mb-4">Billing Model</h2>
                <div className="space-y-2">
                  {BILLING_OPTIONS.map(opt => (
                    <label
                      key={opt.value}
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-150 ${
                        state.billingModel === opt.value
                          ? 'border-primary/30 bg-primary-dim'
                          : 'border-border bg-surface-900 hover:bg-surface-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="billing"
                        value={opt.value}
                        checked={state.billingModel === opt.value}
                        onChange={() => update({ billingModel: opt.value as BillingModel })}
                        className="mt-0.5 accent-primary"
                      />
                      <div>
                        <div className="text-sm font-medium text-slate-200">{opt.label}</div>
                        <div className="text-xs text-slate-500">{opt.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="secondary" onClick={() => setStep(2)}>Back</Button>
                <Button onClick={handleCreate}>
                  <Cpu className="w-4 h-4" />
                  Create Tenant
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Preview panel */}
        <div className="w-64 flex-shrink-0">
          <TenantPreview state={state} />
        </div>
      </div>
    </div>
  )
}
