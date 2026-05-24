"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Package, Plus, RefreshCw, Pencil, Trash2, Eye, EyeOff, Wrench, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

// ── Types ──────────────────────────────────────────────────────────────
interface Tool {
  _id:              string
  name:             string
  shortDescription: string
  thumbnail?:       { url: string }
  accessLink:       string
  price:            number
  status:           string
}

interface PackageVariation {
  label: string
  days:  number | null
  price: number
}

interface Pkg {
  _id:              string
  name:             string
  shortDescription: string
  thumbnail?:       { url: string }
  tools:            Tool[]
  price:            number
  discount:         number
  variations:       PackageVariation[]
  status:           "draft" | "published" | "archived"
  enrollmentCount:  number
  createdAt:        string
}

// ── Validity Options ───────────────────────────────────────────────────
const VALIDITY_OPTIONS = [
  { label: "1 Day",     days: 1    },
  { label: "3 Days",    days: 3    },
  { label: "7 Days",    days: 7    },
  { label: "15 Days",   days: 15   },
  { label: "30 Days",   days: 30   },
  { label: "2 Months",  days: 60   },
  { label: "3 Months",  days: 90   },
  { label: "6 Months",  days: 180  },
  { label: "12 Months", days: 365  },
  { label: "2 Years",   days: 730  },
  { label: "3 Years",   days: 1095 },
  { label: "Lifetime",  days: null },
]

// ── Empty Form ─────────────────────────────────────────────────────────
const EMPTY_FORM: {
  name:             string
  shortDescription: string
  thumbnail:        string
  tools:            string[]
  price:            number
  discount:         number
  status:           "draft" | "published" | "archived"
  variations:       PackageVariation[]
} = {
  name:             "",
  shortDescription: "",
  thumbnail:        "",
  tools:            [],
  price:            0,
  discount:         0,
  status:           "draft",
  variations:       [],
}

// ── Tool Selector Modal ────────────────────────────────────────────────
function ToolSelectorModal({
  allTools,
  selectedIds,
  onConfirm,
  onClose,
}: {
  allTools:    Tool[]
  selectedIds: string[]
  onConfirm:   (ids: string[]) => void
  onClose:     () => void
}) {
  const [selected, setSelected] = useState<string[]>(selectedIds)

  const toggle = (id: string) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const published = allTools.filter(t => t.status === "published")

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-6 max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <Wrench className="h-5 w-5 text-purple-400" />
            Select Tools for Package
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-gray-500 text-xs mb-4">{selected.length} tool(s) selected</p>

        <div className="overflow-y-auto flex-1 space-y-2 pr-1">
          {published.length === 0 ? (
            <p className="text-center text-gray-500 text-sm py-8">No published tools found.</p>
          ) : (
            published.map(tool => {
              const isSelected = selected.includes(tool._id)
              return (
                <button
                  key={tool._id}
                  onClick={() => toggle(tool._id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-150 ${
                    isSelected
                      ? "bg-purple-500/15 border-purple-500/50"
                      : "bg-gray-800/40 border-gray-700/50 hover:border-gray-600"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                    isSelected ? "bg-purple-500 border-purple-500" : "border-gray-600"
                  }`}>
                    {isSelected && <Check className="h-3 w-3 text-white" />}
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-gray-700 overflow-hidden shrink-0">
                    {tool.thumbnail?.url ? (
                      <img src={tool.thumbnail.url} alt={tool.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Wrench className="h-4 w-4 text-gray-500" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{tool.name}</p>
                    <p className="text-gray-500 text-xs truncate">{tool.shortDescription}</p>
                  </div>
                  <span className="text-purple-400 text-xs font-semibold shrink-0">৳{tool.price}</span>
                </button>
              )
            })
          )}
        </div>

        <div className="flex gap-3 mt-4 pt-4 border-t border-gray-800">
          <button onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-gray-300 text-sm font-semibold hover:bg-gray-700 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => { onConfirm(selected); onClose() }}
            disabled={selected.length === 0}
            className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm font-semibold transition-all disabled:opacity-50">
            Confirm ({selected.length})
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────
export default function AdminPackagesPage() {
  const { data: session } = useSession()
  const accessToken = session?.accessToken as string

  const [packages,         setPackages]         = useState<Pkg[]>([])
  const [allTools,         setAllTools]         = useState<Tool[]>([])
  const [loading,          setLoading]          = useState(true)
  const [error,            setError]            = useState("")
  const [showForm,         setShowForm]         = useState(false)
  const [editingId,        setEditingId]        = useState<string | null>(null)
  const [saving,           setSaving]           = useState(false)
  const [form,             setForm]             = useState(EMPTY_FORM)
  const [showToolSelector, setShowToolSelector] = useState(false)

  const [varLabel, setVarLabel] = useState("")
  const [varDays,  setVarDays]  = useState<string>("")
  const [varPrice, setVarPrice] = useState("")

  const PKG_API  = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/packages`
  const TOOL_API = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tools`

  const fetchPackages = async () => {
    setLoading(true); setError("")
    try {
      const res  = await fetch(`${PKG_API}/admin/all`, { headers: { Authorization: `Bearer ${accessToken}` } })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed")
      setPackages(data.data || [])
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const fetchAllTools = async () => {
    try {
      const res  = await fetch(`${TOOL_API}/admin/all`, { headers: { Authorization: `Bearer ${accessToken}` } })
      const data = await res.json()
      if (res.ok) setAllTools(data.data || [])
    } catch {}
  }

  useEffect(() => {
    if (accessToken) { fetchPackages(); fetchAllTools() }
  }, [accessToken])

  const openCreate = () => {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setShowForm(true)
  }

  const openEdit = (pkg: Pkg) => {
    setForm({
      name:             pkg.name,
      shortDescription: pkg.shortDescription,
      thumbnail:        pkg.thumbnail?.url || "",
      tools:            pkg.tools.map(t => t._id),
      price:            pkg.price,
      discount:         Math.min(pkg.discount ?? 0, 100),
      status:           pkg.status,
      variations:       pkg.variations || [],
    })
    setEditingId(pkg._id)
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!form.name || form.tools.length === 0) return
    setSaving(true)
    try {
      const url    = editingId ? `${PKG_API}/${editingId}` : `${PKG_API}/create`
      const method = editingId ? "PUT" : "POST"
      const res    = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({
          ...form,
          price:    Number(form.price) || 0,
          discount: Math.min(Number(form.discount) || 0, 100),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Save failed")
      setShowForm(false)
      fetchPackages()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this package?")) return
    try {
      const res = await fetch(`${PKG_API}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      if (!res.ok) throw new Error("Delete failed")
      fetchPackages()
    } catch (err) {
      setError((err as Error).message)
    }
  }

  const handleToggleStatus = async (pkg: Pkg) => {
    const newStatus = pkg.status === "published" ? "draft" : "published"
    try {
      const res = await fetch(`${PKG_API}/${pkg._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error("Update failed")
      fetchPackages()
    } catch (err) {
      setError((err as Error).message)
    }
  }

  const addVariation = () => {
    if (!varLabel || !varPrice) return
    const days = varDays === "" || varDays === "null" ? null : Number(varDays)
    setForm(f => ({ ...f, variations: [...f.variations, { label: varLabel, days, price: Number(varPrice) }] }))
    setVarLabel(""); setVarDays(""); setVarPrice("")
  }

  const removeVariation = (i: number) =>
    setForm(f => ({ ...f, variations: f.variations.filter((_, idx) => idx !== i) }))

  const selectedToolNames = allTools.filter(t => form.tools.includes(t._id)).map(t => t.name)

  return (
    <>
      {showToolSelector && (
        <ToolSelectorModal
          allTools={allTools}
          selectedIds={form.tools}
          onConfirm={ids => setForm(f => ({ ...f, tools: ids }))}
          onClose={() => setShowToolSelector(false)}
        />
      )}

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
              Packages Management
            </h1>
            <p className="text-gray-400">Bundle multiple tools into one combo package</p>
          </div>
          <div className="flex gap-3">
            <button onClick={fetchPackages} disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 rounded-lg text-sm transition-colors disabled:opacity-50">
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <Button onClick={openCreate}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 gap-2">
              <Plus className="h-4 w-4" /> Add Package
            </Button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-xl text-red-400 text-sm">{error}</div>
        )}

        {/* ── CREATE / EDIT FORM ──────────────────────────────────── */}
        {showForm && (
          <div className="mb-8 bg-gray-900/60 border border-gray-800/50 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white">{editingId ? "Edit Package" : "Create Package"}</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Package Name *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                  placeholder="e.g. Learning Bundle Pro" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Thumbnail URL (optional)</label>
                <input value={form.thumbnail} onChange={e => setForm(f => ({ ...f, thumbnail: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                  placeholder="https://..." />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs text-gray-400 mb-1 block">Short Description *</label>
                <textarea value={form.shortDescription} onChange={e => setForm(f => ({ ...f, shortDescription: e.target.value }))}
                  rows={2}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500 resize-none"
                  placeholder="Brief description of this package" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Base Price (৳)</label>
                <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Discount (%)</label>
                <input type="number" min={0} max={100} value={form.discount}
                  onChange={e => setForm(f => ({ ...f, discount: Math.min(Number(e.target.value), 100) }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Status</label>
                <select value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value as "draft" | "published" | "archived" }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            {/* Tool Selector */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Included Tools * (published tools only)</label>
              <button
                onClick={() => setShowToolSelector(true)}
                className={`w-full flex items-center gap-2 px-4 py-3 rounded-xl border text-sm transition-all ${
                  form.tools.length > 0
                    ? "bg-purple-500/10 border-purple-500/40 text-purple-300"
                    : "bg-gray-800/60 border-gray-700 text-gray-400 hover:border-gray-600"
                }`}
              >
                <Wrench className="h-4 w-4 shrink-0" />
                {form.tools.length > 0
                  ? `${form.tools.length} tool(s) selected — click to change`
                  : "Click to select tools"}
              </button>
              {selectedToolNames.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedToolNames.map((name, i) => (
                    <span key={i} className="px-3 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs rounded-full">
                      {name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Variations */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Pricing Variations (optional)</label>
              <div className="flex gap-2 mb-2 flex-wrap items-end">
                <div>
                  <p className="text-[10px] text-gray-500 mb-1">Label</p>
                  <input value={varLabel} onChange={e => setVarLabel(e.target.value)}
                    placeholder="e.g. 1 Month"
                    className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-purple-500 w-32" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 mb-1">Duration</p>
                  <select value={varDays} onChange={e => setVarDays(e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-purple-500 w-36">
                    <option value="">Select...</option>
                    {VALIDITY_OPTIONS.map(o => (
                      <option key={o.label} value={o.days === null ? "null" : String(o.days)}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 mb-1">Price (৳)</p>
                  <input type="number" value={varPrice} onChange={e => setVarPrice(e.target.value)}
                    placeholder="৳"
                    className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-purple-500 w-24" />
                </div>
                <button onClick={addVariation}
                  className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-lg transition-colors">
                  + Add
                </button>
              </div>
              {form.variations.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {form.variations.map((v, i) => (
                    <span key={i} className="flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs rounded-full">
                      {v.label} — {v.days === null ? "Lifetime" : `${v.days}d`} — ৳{v.price}
                      <button onClick={() => removeVariation(i)} className="text-purple-400 hover:text-red-400">×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 rounded-lg text-sm transition-colors">
                Cancel
              </button>
              <Button onClick={handleSave} disabled={saving || !form.name || form.tools.length === 0}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0">
                {saving ? "Saving..." : editingId ? "Update Package" : "Create Package"}
              </Button>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-12 text-center">
            <RefreshCw className="w-10 h-10 text-gray-600 mx-auto mb-4 animate-spin" />
            <p className="text-gray-400">Loading packages...</p>
          </div>
        )}

        {/* Empty */}
        {!loading && packages.length === 0 && !error && (
          <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-12 text-center">
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Packages Yet</h3>
            <p className="text-gray-400 mb-6">Create your first combo package to bundle multiple tools.</p>
            <Button onClick={openCreate}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0">
              <Plus className="h-4 w-4 mr-2" /> Create Package
            </Button>
          </div>
        )}

        {/* Packages Grid */}
        {!loading && packages.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {packages.map(pkg => (
              <div key={pkg._id}
                className="bg-gray-900/60 border border-gray-800/50 rounded-xl overflow-hidden flex flex-col">

                {/* Thumbnail */}
                <div className="h-36 bg-gray-800 relative">
                  {pkg.thumbnail?.url ? (
                    <img src={pkg.thumbnail.url} alt={pkg.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/30 to-pink-900/30">
                      <Package className="h-10 w-10 text-purple-500/50" />
                    </div>
                  )}
                  <span className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-medium border ${
                    pkg.status === "published"
                      ? "bg-green-500/20 border-green-500/40 text-green-400"
                      : pkg.status === "draft"
                      ? "bg-yellow-500/20 border-yellow-500/40 text-yellow-400"
                      : "bg-gray-500/20 border-gray-500/40 text-gray-400"
                  }`}>
                    {pkg.status}
                  </span>
                  <span className="absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full font-medium bg-purple-500/20 border border-purple-500/40 text-purple-400">
                    {pkg.tools.length} tools
                  </span>
                </div>

                {/* Info */}
                <div className="p-4 flex-1 space-y-2">
                  <h3 className="text-white font-semibold text-sm">{pkg.name}</h3>
                  <p className="text-gray-400 text-xs line-clamp-2">{pkg.shortDescription}</p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-green-400 font-semibold">৳{pkg.price}</span>
                    {pkg.discount > 0 && <span className="text-gray-500">({pkg.discount}% off)</span>}
                    <span className="text-gray-600">•</span>
                    <span className="text-gray-500">{pkg.enrollmentCount} enrolled</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {pkg.tools.slice(0, 3).map((tool, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-full">
                        {tool.name}
                      </span>
                    ))}
                    {pkg.tools.length > 3 && (
                      <span className="text-xs px-2 py-0.5 bg-gray-700/50 text-gray-400 rounded-full">
                        +{pkg.tools.length - 3} more
                      </span>
                    )}
                  </div>
                  {pkg.variations.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {pkg.variations.map((v, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 bg-pink-500/10 border border-pink-500/20 text-pink-400 rounded-full">
                          {v.label} — ৳{v.price}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="px-4 pb-4 flex items-center gap-2 ml-auto">
                  <button onClick={() => handleToggleStatus(pkg)}
                    title={pkg.status === "published" ? "Unpublish" : "Publish"}
                    className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors">
                    {pkg.status === "published" ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                  <button onClick={() => openEdit(pkg)}
                    className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-yellow-400 transition-colors">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => handleDelete(pkg._id)}
                    className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-red-400 transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}