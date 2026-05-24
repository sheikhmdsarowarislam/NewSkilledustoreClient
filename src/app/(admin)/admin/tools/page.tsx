"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Wrench, Plus, RefreshCw, ExternalLink, Pencil, Trash2, Eye, EyeOff, Package, ChevronDown, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ToolVariation {
  label: string
  days: number
  price: number
}

interface Tool {
  _id: string
  name: string
  shortDescription: string
  thumbnail?: { url: string }
  accessLink: string
  price: number
  discount: number
  variations: ToolVariation[]
  status: "draft" | "published" | "archived"
  enrollmentCount: number
  createdAt: string
  isPackage?: boolean
  includedTools?: string[]
}

const EMPTY_TOOL_FORM: {
  name: string
  shortDescription: string
  accessLink: string
  price: number
  discount: number
  status: "draft" | "published" | "archived"
  thumbnail: string
  variations: ToolVariation[]
} = {
  name: "",
  shortDescription: "",
  accessLink: "",
  price: 0,
  discount: 0,
  status: "draft",
  thumbnail: "",
  variations: [],
}

// Duration options in days
const DURATION_OPTIONS = [
  { label: "7 Days", days: 7 },
  { label: "15 Days", days: 15 },
  { label: "1 Month", days: 30 },
  { label: "3 Months", days: 90 },
  { label: "6 Months", days: 180 },
  { label: "1 Year", days: 365 },
  { label: "Lifetime", days: 36500 },
]

const EMPTY_PACKAGE_FORM: {
  name: string
  shortDescription: string
  price: number
  discount: number
  status: "draft" | "published" | "archived"
  thumbnail: string
  includedTools: string[]
  variations: ToolVariation[]
} = {
  name: "",
  shortDescription: "",
  price: 0,
  discount: 0,
  status: "draft",
  thumbnail: "",
  includedTools: [],
  variations: [],
}

export default function AdminToolsPage() {
  const { data: session } = useSession()
  const accessToken = session?.accessToken as string

  const [tools, setTools]         = useState<Tool[]>([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState("")

  // Tool form state
  const [showToolForm, setShowToolForm]   = useState(false)
  const [editingToolId, setEditingToolId] = useState<string | null>(null)
  const [savingTool, setSavingTool]       = useState(false)
  const [toolForm, setToolForm]           = useState(EMPTY_TOOL_FORM)

  // Package form state
  const [showPackageForm, setShowPackageForm]   = useState(false)
  const [editingPackageId, setEditingPackageId] = useState<string | null>(null)
  const [savingPackage, setSavingPackage]       = useState(false)
  const [packageForm, setPackageForm]           = useState(EMPTY_PACKAGE_FORM)
  const [showToolDropdown, setShowToolDropdown] = useState(false)

  // Variation temp state (shared)
  const [varLabel, setVarLabel]         = useState("")
  const [varDuration, setVarDuration]   = useState("")
  const [varDays, setVarDays]           = useState<number | "">("")
  const [varPrice, setVarPrice]         = useState("")

  const API = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tools`

  const fetchTools = async () => {
    setLoading(true); setError("")
    try {
      const res  = await fetch(`${API}/admin/all`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed")
      setTools(data.data || [])
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { if (accessToken) fetchTools() }, [accessToken])

  // Published non-package tools (for package inclusion)
  const publishedTools = tools.filter(t => t.status === "published" && !t.isPackage)

  // ── Tool CRUD ──────────────────────────────────────────────────────────
  const openCreateTool = () => {
    setToolForm(EMPTY_TOOL_FORM)
    setEditingToolId(null)
    setShowToolForm(true)
    setShowPackageForm(false)
  }

  const openEditTool = (tool: Tool) => {
    setToolForm({
      name:             tool.name,
      shortDescription: tool.shortDescription,
      accessLink:       tool.accessLink,
      price:            tool.price,
      discount:         Math.min(tool.discount ?? 0, 100),
      status:           tool.status,
      thumbnail:        tool.thumbnail?.url || "",
      variations:       tool.variations || [],
    })
    setEditingToolId(tool._id)
    setShowToolForm(true)
    setShowPackageForm(false)
  }

  const handleSaveTool = async () => {
    if (!toolForm.name || !toolForm.accessLink) return
    setSavingTool(true)
    try {
      const url    = editingToolId ? `${API}/${editingToolId}` : `${API}/create`
      const method = editingToolId ? "PUT" : "POST"
      const res    = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({
          ...toolForm,
          price:    Number(toolForm.price) || 0,
          discount: Math.min(Number(toolForm.discount) || 0, 100),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Save failed")
      setShowToolForm(false)
      fetchTools()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSavingTool(false)
    }
  }

  // ── Package CRUD ───────────────────────────────────────────────────────
  const openCreatePackage = () => {
    setPackageForm(EMPTY_PACKAGE_FORM)
    setEditingPackageId(null)
    setShowPackageForm(true)
    setShowToolForm(false)
  }

 const openEditPackage = (tool: Tool) => {
  setPackageForm({
    name:             tool.name,
    shortDescription: tool.shortDescription,
    price:            tool.price,
    discount:         Math.min(tool.discount ?? 0, 100),
    status:           tool.status,
    thumbnail:        tool.thumbnail?.url || "",
    includedTools:    tool.includedTools || [],
    variations:       tool.variations || [],
  })
  setEditingPackageId(tool._id)
  setShowPackageForm(true)
  setShowToolForm(false)
}

 const handleSavePackage = async () => {
  if (!packageForm.name || packageForm.includedTools.length === 0) return
  setSavingPackage(true)
  try {
    const url    = editingPackageId ? `${API}/${editingPackageId}` : `${API}/create`
    const method = editingPackageId ? "PUT" : "POST"
    const res    = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({
        ...packageForm,
        isPackage:    true,
        price:        Number(packageForm.price) || 0,
        discount:     Math.min(Number(packageForm.discount) || 0, 100),
        // object হলে _id extract করো, string হলে সরাসরি রাখো
        includedTools: packageForm.includedTools.map((t: any) =>
          typeof t === "string" ? t : t._id
        ),
      }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || "Save failed")
    setShowPackageForm(false)
    fetchTools()
  } catch (err) {
    setError((err as Error).message)
  } finally {
    setSavingPackage(false)
  }
}

  // ── Shared actions ─────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return
    try {
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      if (!res.ok) throw new Error("Delete failed")
      fetchTools()
    } catch (err) {
      setError((err as Error).message)
    }
  }

  const handleToggleStatus = async (tool: Tool) => {
    const newStatus = tool.status === "published" ? "draft" : "published"
    try {
      const res = await fetch(`${API}/${tool._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error("Update failed")
      fetchTools()
    } catch (err) {
      setError((err as Error).message)
    }
  }

  // ── Variation helpers ──────────────────────────────────────────────────
  const addToolVariation = () => {
    if (!varLabel || !varDays || !varPrice) return
    setToolForm(f => ({
      ...f,
      variations: [...f.variations, { label: varLabel, days: Number(varDays), price: Number(varPrice) }],
    }))
    setVarLabel(""); setVarDuration(""); setVarDays(""); setVarPrice("")
  }

  const addPackageVariation = () => {
    if (!varLabel || !varDays || !varPrice) return
    setPackageForm(f => ({
      ...f,
      variations: [...f.variations, { label: varLabel, days: Number(varDays), price: Number(varPrice) }],
    }))
    setVarLabel(""); setVarDuration(""); setVarDays(""); setVarPrice("")
  }

  const removeToolVariation = (i: number) =>
    setToolForm(f => ({ ...f, variations: f.variations.filter((_, idx) => idx !== i) }))

  const removePackageVariation = (i: number) =>
    setPackageForm(f => ({ ...f, variations: f.variations.filter((_, idx) => idx !== i) }))

  const toggleIncludedTool = (toolId: string) => {
    setPackageForm(f => ({
      ...f,
      includedTools: f.includedTools.includes(toolId)
        ? f.includedTools.filter(id => id !== toolId)
        : [...f.includedTools, toolId],
    }))
  }

  const handleDurationSelect = (label: string, days: number) => {
    setVarDuration(label)
    setVarDays(days)
  }

  // Separate tools and packages for display
  const regularTools = tools.filter(t => !t.isPackage)
  const packages     = tools.filter(t => t.isPackage)

  // ── Variation row UI (reusable) ────────────────────────────────────────
  const VariationRow = ({
    onAdd,
    formVariations,
    onRemove,
  }: {
    onAdd: () => void
    formVariations: ToolVariation[]
    onRemove: (i: number) => void
  }) => (
    <div>
      <label className="text-xs text-gray-400 mb-2 block">Pricing Variations (optional)</label>
      <div className="flex gap-2 mb-2 flex-wrap items-end">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-500">Label</span>
          <input
            value={varLabel}
            onChange={e => setVarLabel(e.target.value)}
            placeholder="e.g. 1 Month"
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-purple-500 w-36"
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-500">Duration</span>
          <select
            value={varDuration}
            onChange={e => {
              const opt = DURATION_OPTIONS.find(o => o.label === e.target.value)
              if (opt) handleDurationSelect(opt.label, opt.days)
            }}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-purple-500 w-36"
          >
            <option value="">Select...</option>
            {DURATION_OPTIONS.map(o => (
              <option key={o.label} value={o.label}>{o.label}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-500">Price (৳)</span>
          <input
            type="number"
            value={varPrice}
            onChange={e => setVarPrice(e.target.value)}
            placeholder="৳"
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-purple-500 w-28"
          />
        </div>
        <button
          onClick={onAdd}
          className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-lg transition-colors"
        >
          + Add
        </button>
      </div>
      {formVariations.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {formVariations.map((v, i) => (
            <span
              key={i}
              className="flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs rounded-full"
            >
              {v.label} — {v.days}d — ৳{v.price}
              <button onClick={() => onRemove(i)} className="text-purple-400 hover:text-red-400">×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

      {/* Header */}
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
            Tools Management
          </h1>
          <p className="text-gray-400">Add and manage subscription-based tools & packages</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={fetchTools}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700
              text-gray-300 rounded-lg text-sm transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <Button
            onClick={openCreatePackage}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0 gap-2"
          >
            <Package className="h-4 w-4" /> Add Package
          </Button>
          <Button
            onClick={openCreateTool}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 gap-2"
          >
            <Plus className="h-4 w-4" /> Add Tool
          </Button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-xl text-red-400 text-sm">{error}</div>
      )}

      {/* ── CREATE / EDIT TOOL FORM ──────────────────────────────────── */}
      {showToolForm && (
        <div className="mb-8 bg-gray-900/60 border border-gray-800/50 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">{editingToolId ? "Edit Tool" : "Create Tool"}</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Tool Name *</label>
              <input
                value={toolForm.name}
                onChange={e => setToolForm(f => ({ ...f, name: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                placeholder="e.g. AI Code Assistant"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Access Link *</label>
              <input
                value={toolForm.accessLink}
                onChange={e => setToolForm(f => ({ ...f, accessLink: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                placeholder="https://tool.example.com"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-gray-400 mb-1 block">Short Description *</label>
              <textarea
                value={toolForm.shortDescription}
                onChange={e => setToolForm(f => ({ ...f, shortDescription: e.target.value }))}
                rows={2}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500 resize-none"
                placeholder="Brief description of the tool"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Base Price (৳)</label>
              <input
                type="number"
                value={toolForm.price}
                onChange={e => setToolForm(f => ({ ...f, price: Number(e.target.value) }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Discount (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={toolForm.discount}
                onChange={e => setToolForm(f => ({ ...f, discount: Math.min(Number(e.target.value), 100) }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Thumbnail URL (optional)</label>
              <input
                value={toolForm.thumbnail}
                onChange={e => setToolForm(f => ({ ...f, thumbnail: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Status</label>
              <select
                value={toolForm.status}
                onChange={e => setToolForm(f => ({ ...f, status: e.target.value as "draft" | "published" | "archived" }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <VariationRow
            onAdd={addToolVariation}
            formVariations={toolForm.variations}
            onRemove={removeToolVariation}
          />

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setShowToolForm(false)}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 rounded-lg text-sm transition-colors"
            >
              Cancel
            </button>
            <Button
              onClick={handleSaveTool}
              disabled={savingTool || !toolForm.name || !toolForm.accessLink}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
            >
              {savingTool ? "Saving..." : editingToolId ? "Update Tool" : "Create Tool"}
            </Button>
          </div>
        </div>
      )}

      {/* ── CREATE / EDIT PACKAGE FORM ───────────────────────────────── */}
      {showPackageForm && (
        <div className="mb-8 bg-gray-900/60 border border-blue-900/30 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-cyan-400" />
            <h2 className="text-lg font-semibold text-white">
              {editingPackageId ? "Edit Package" : "Create Package"}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Package Name *</label>
              <input
                value={packageForm.name}
                onChange={e => setPackageForm(f => ({ ...f, name: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
                placeholder="e.g. Learning Package"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Thumbnail URL (optional)</label>
              <input
                value={packageForm.thumbnail}
                onChange={e => setPackageForm(f => ({ ...f, thumbnail: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
                placeholder="https://..."
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-gray-400 mb-1 block">Short Description *</label>
              <textarea
                value={packageForm.shortDescription}
                onChange={e => setPackageForm(f => ({ ...f, shortDescription: e.target.value }))}
                rows={2}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500 resize-none"
                placeholder="Brief description of the package"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Base Price (৳)</label>
              <input
                type="number"
                value={packageForm.price}
                onChange={e => setPackageForm(f => ({ ...f, price: Number(e.target.value) }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Discount (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={packageForm.discount}
                onChange={e => setPackageForm(f => ({ ...f, discount: Math.min(Number(e.target.value), 100) }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-gray-400 mb-1 block">Status</label>
              <select
                value={packageForm.status}
                onChange={e => setPackageForm(f => ({ ...f, status: e.target.value as "draft" | "published" | "archived" }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          {/* Included Tools Selector */}
          <div className="space-y-2">
            <label className="text-xs text-gray-400 block">
              Included Tools * <span className="text-gray-600">(published tools only)</span>
            </label>

            {/* Dropdown trigger */}
            <div className="relative">
              <button
                onClick={() => setShowToolDropdown(p => !p)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-800/80 border border-gray-700 hover:border-cyan-500/50 rounded-xl text-sm text-gray-300 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-cyan-400" />
                  {packageForm.includedTools.length === 0
                    ? "Select tools to include..."
                    : `${packageForm.includedTools.length} tool(s) selected — click to change`}
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showToolDropdown ? "rotate-180" : ""}`} />
              </button>

              {showToolDropdown && (
                <div className="absolute z-20 mt-2 w-full bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
                  {publishedTools.length === 0 ? (
                    <p className="px-4 py-3 text-sm text-gray-500">No published tools available</p>
                  ) : (
                    <div className="max-h-60 overflow-y-auto divide-y divide-gray-800">
                      {publishedTools.map(t => {
                        const selected = packageForm.includedTools.includes(t._id)
                        return (
                          <button
                            key={t._id}
                            onClick={() => toggleIncludedTool(t._id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-colors
                              ${selected ? "bg-cyan-500/10 text-cyan-300" : "text-gray-300 hover:bg-gray-800"}`}
                          >
                            <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0
                              ${selected ? "bg-cyan-500 border-cyan-500" : "border-gray-600"}`}>
                              {selected && <span className="text-white text-xs">✓</span>}
                            </div>
                            {t.thumbnail?.url ? (
                              <img src={t.thumbnail.url} alt={t.name} className="w-8 h-8 rounded object-cover flex-shrink-0" />
                            ) : (
                              <div className="w-8 h-8 rounded bg-gray-700 flex items-center justify-center flex-shrink-0">
                                <Wrench className="h-3.5 w-3.5 text-gray-500" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{t.name}</p>
                              <p className="text-xs text-gray-500 truncate">৳{t.price}</p>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  )}
                  <div className="px-4 py-2 bg-gray-800/50 border-t border-gray-700">
                    <button
                      onClick={() => setShowToolDropdown(false)}
                      className="text-xs text-cyan-400 hover:text-cyan-300"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Selected tool chips */}
            {packageForm.includedTools.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {packageForm.includedTools.map(id => {
                  const t = publishedTools.find(p => p._id === id)
                  if (!t) return null
                  return (
                    <span
                      key={id}
                      className="flex items-center gap-1.5 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs rounded-full"
                    >
                      {t.name}
                      <button
                        onClick={() => toggleIncludedTool(id)}
                        className="text-cyan-400 hover:text-red-400"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )
                })}
              </div>
            )}
          </div>

          {/* Package variations */}
          <VariationRow
            onAdd={addPackageVariation}
            formVariations={packageForm.variations}
            onRemove={removePackageVariation}
          />

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setShowPackageForm(false)}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 rounded-lg text-sm transition-colors"
            >
              Cancel
            </button>
            <Button
              onClick={handleSavePackage}
              disabled={savingPackage || !packageForm.name || packageForm.includedTools.length === 0}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0"
            >
              {savingPackage ? "Saving..." : editingPackageId ? "Update Package" : "Create Package"}
            </Button>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-12 text-center">
          <RefreshCw className="w-10 h-10 text-gray-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-400">Loading tools...</p>
        </div>
      )}

      {/* Empty */}
      {!loading && tools.length === 0 && !error && (
        <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-12 text-center">
          <Wrench className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Tools Yet</h3>
          <p className="text-gray-400 mb-6">Add your first tool or package to get started.</p>
          <div className="flex gap-3 justify-center">
            <Button
              onClick={openCreatePackage}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0"
            >
              <Package className="h-4 w-4 mr-2" /> Add Package
            </Button>
            <Button
              onClick={openCreateTool}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Tool
            </Button>
          </div>
        </div>
      )}

      {/* ── Packages Section ───────────────────────────────────────────── */}
      {!loading && packages.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Package className="h-4 w-4 text-cyan-400" /> Packages ({packages.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {packages.map(pkg => (
              <ToolCard
                key={pkg._id}
                tool={pkg}
                publishedTools={publishedTools}
                onToggleStatus={handleToggleStatus}
                onEdit={() => openEditPackage(pkg)}
                onDelete={() => handleDelete(pkg._id)}
                isPackage
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Tools Section ──────────────────────────────────────────────── */}
      {!loading && regularTools.length > 0 && (
        <div>
          {packages.length > 0 && (
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Wrench className="h-4 w-4 text-purple-400" /> Tools ({regularTools.length})
            </h2>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {regularTools.map(tool => (
              <ToolCard
                key={tool._id}
                tool={tool}
                publishedTools={publishedTools}
                onToggleStatus={handleToggleStatus}
                onEdit={() => openEditTool(tool)}
                onDelete={() => handleDelete(tool._id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Shared card component ──────────────────────────────────────────────────
function ToolCard({
  tool,
  publishedTools,
  onToggleStatus,
  onEdit,
  onDelete,
  isPackage = false,
}: {
  tool: Tool
  publishedTools: Tool[]
  onToggleStatus: (t: Tool) => void
  onEdit: () => void
  onDelete: () => void
  isPackage?: boolean
}) {
  return (
    <div className={`bg-gray-900/60 border rounded-xl overflow-hidden flex flex-col
      ${isPackage ? "border-blue-900/40" : "border-gray-800/50"}`}>

      {/* Thumbnail */}
      <div className="h-36 bg-gray-800 relative">
        {tool.thumbnail?.url ? (
          <img src={tool.thumbnail.url} alt={tool.name} className="w-full h-full object-cover" />
        ) : (
          <div className={`w-full h-full flex items-center justify-center
            ${isPackage ? "bg-gradient-to-br from-blue-900/30 to-cyan-900/30" : ""}`}>
            {isPackage
              ? <Package className="h-10 w-10 text-cyan-700" />
              : <Wrench className="h-10 w-10 text-gray-600" />}
          </div>
        )}

        {/* Package badge */}
        {isPackage && (
          <span className="absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full font-medium bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
            Package
          </span>
        )}

        {/* Status badge */}
        <span className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-medium
          ${tool.status === "published"
            ? "bg-green-500/20 border border-green-500/40 text-green-400"
            : tool.status === "draft"
            ? "bg-yellow-500/20 border border-yellow-500/40 text-yellow-400"
            : "bg-gray-500/20 border border-gray-500/40 text-gray-400"}`}>
          {tool.status}
        </span>
      </div>

      {/* Info */}
      <div className="p-4 flex-1 space-y-2">
        <h3 className="text-white font-semibold text-sm">{tool.name}</h3>
        <p className="text-gray-400 text-xs line-clamp-2">{tool.shortDescription}</p>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-green-400 font-semibold">৳{tool.price}</span>
          {tool.discount > 0 && (
            <span className="text-gray-500">({tool.discount}% off)</span>
          )}
          <span className="text-gray-600">•</span>
          <span className="text-gray-500">{tool.enrollmentCount} enrolled</span>
        </div>

        {/* Included tools chips (for packages) */}
        {isPackage && tool.includedTools && tool.includedTools.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tool.includedTools.slice(0, 4).map(id => {
              const t = publishedTools.find(p => p._id === id)
              return t ? (
                <span key={id} className="text-xs px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-full">
                  {t.name}
                </span>
              ) : null
            })}
            {tool.includedTools.length > 4 && (
              <span className="text-xs px-2 py-0.5 bg-gray-700 text-gray-400 rounded-full">
                +{tool.includedTools.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Variation chips (for regular tools) */}
        {!isPackage && tool.variations?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tool.variations.map((v, i) => (
              <span key={i} className="text-xs px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-full">
                {v.label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 pb-4 flex items-center gap-2 flex-wrap">
        {!isPackage && tool.accessLink && (
          <a
            href={tool.accessLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" /> Preview
          </a>
        )}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => onToggleStatus(tool)}
            title={tool.status === "published" ? "Unpublish" : "Publish"}
            className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
          >
            {tool.status === "published" ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={onEdit}
            className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-yellow-400 transition-colors"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-red-400 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}