"use client"

import { useState, useEffect } from "react"
import { Cookie, Plus, Edit2, Trash2, ExternalLink, Eye, EyeOff, Save, LogOut, Lock, Globe, Key, ChevronRight, X, Check, RefreshCw } from "lucide-react"

const ADMIN_CREDENTIALS = { username: "Skilledustore", password: "123456" }
const STORAGE_KEY = "cookies_panel_tools"
const AUTH_KEY = "cookies_panel_auth"

interface Tool {
  id: string
  name: string
  url: string
  cookie: string
  createdAt: string
}

interface LoginForm {
  username: string
  password: string
}

interface ToolForm {
  name: string
  url: string
  cookie: string
}

interface ToastState {
  msg: string
  type: "success" | "error"
}

function loadTools(): Tool[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Tool[]) : []
  } catch {
    return []
  }
}

function saveTools(tools: Tool[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tools))
  } catch {}
}

export default function CookiesPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [loginForm, setLoginForm] = useState<LoginForm>({ username: "Skilledustore", password: "123456" })
  const [loginError, setLoginError] = useState<string>("")
  const [showPass, setShowPass] = useState<boolean>(false)

  const [tools, setTools] = useState<Tool[]>([])
  const [showForm, setShowForm] = useState<boolean>(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<ToolForm>({ name: "", url: "", cookie: "" })
  const [showCookieId, setShowCookieId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [toast, setToast] = useState<ToastState | null>(null)

  useEffect(() => {
    try {
      const auth = sessionStorage.getItem(AUTH_KEY)
      if (auth === "1") setIsLoggedIn(true)
    } catch {}
    setTools(loadTools())
  }, [])

  const showToast = (msg: string, type: "success" | "error" = "success"): void => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 2500)
  }

  const handleLogin = (): void => {
    if (
      loginForm.username === ADMIN_CREDENTIALS.username &&
      loginForm.password === ADMIN_CREDENTIALS.password
    ) {
      setIsLoggedIn(true)
      try {
        sessionStorage.setItem(AUTH_KEY, "1")
      } catch {}
      setLoginError("")
    } else {
      setLoginError("Invalid username or password")
    }
  }

  const handleLogout = (): void => {
    setIsLoggedIn(false)
    try {
      sessionStorage.removeItem(AUTH_KEY)
    } catch {}
  }

  const openForm = (tool: Tool | null = null): void => {
    if (tool) {
      setForm({ name: tool.name, url: tool.url, cookie: tool.cookie })
      setEditingId(tool.id)
    } else {
      setForm({ name: "", url: "", cookie: "" })
      setEditingId(null)
    }
    setShowForm(true)
  }

  const handleSave = (): void => {
    if (!form.name.trim() || !form.url.trim() || !form.cookie.trim()) {
      showToast("All fields are required", "error")
      return
    }
    let updated: Tool[]
    if (editingId) {
      updated = tools.map((t) =>
        t.id === editingId ? { ...t, ...form } : t
      )
    } else {
      const newTool: Tool = {
        id: Date.now().toString(),
        ...form,
        createdAt: new Date().toISOString(),
      }
      updated = [...tools, newTool]
    }
    setTools(updated)
    saveTools(updated)
    setShowForm(false)
    setEditingId(null)
    showToast(editingId ? "Tool updated!" : "Tool saved!")
  }

  const handleDelete = (id: string): void => {
    const updated = tools.filter((t) => t.id !== id)
    setTools(updated)
    saveTools(updated)
    showToast("Tool deleted", "error")
  }

  const handleOpen = (tool: Tool): void => {
    window.open(tool.url, "_blank")
  }

  const handleCopyCookie = (tool: Tool): void => {
    try {
      navigator.clipboard.writeText(tool.cookie)
      setCopiedId(tool.id)
      setTimeout(() => setCopiedId(null), 1500)
      showToast("Cookie copied!")
    } catch {
      showToast("Copy failed", "error")
    }
  }

  if (!isLoggedIn) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0a0d14 0%, #0f1218 50%, #0a0d14 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "420px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "20px",
            padding: "40px",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div
              style={{
                width: "60px",
                height: "60px",
                background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <Cookie size={28} color="white" />
            </div>
            <h1 style={{ color: "white", fontSize: "22px", fontWeight: 700, margin: "0 0 6px" }}>
              Cookies Panel
            </h1>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", margin: 0 }}>
              Admin Access Required
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label
                style={{
                  display: "block",
                  color: "rgba(255,255,255,0.6)",
                  fontSize: "12px",
                  marginBottom: "6px",
                  fontWeight: 500,
                }}
              >
                USERNAME
              </label>
              <div style={{ position: "relative" }}>
                <Lock
                  size={16}
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "rgba(255,255,255,0.3)",
                  }}
                />
                <input
                  type="text"
                  value={loginForm.username}
                  onChange={(e) =>
                    setLoginForm((p) => ({ ...p, username: e.target.value }))
                  }
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "10px",
                    padding: "11px 14px 11px 40px",
                    color: "white",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  color: "rgba(255,255,255,0.6)",
                  fontSize: "12px",
                  marginBottom: "6px",
                  fontWeight: 500,
                }}
              >
                PASSWORD
              </label>
              <div style={{ position: "relative" }}>
                <Key
                  size={16}
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "rgba(255,255,255,0.3)",
                  }}
                />
                <input
                  type={showPass ? "text" : "password"}
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm((p) => ({ ...p, password: e.target.value }))
                  }
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "10px",
                    padding: "11px 40px 11px 40px",
                    color: "white",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  style={{
                    position: "absolute",
                    right: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    color: "rgba(255,255,255,0.3)",
                  }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {loginError && (
              <p style={{ color: "#f87171", fontSize: "13px", margin: 0, textAlign: "center" }}>
                {loginError}
              </p>
            )}

            <button
              type="button"
              onClick={handleLogin}
              style={{
                width: "100%",
                padding: "12px",
                background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
                border: "none",
                borderRadius: "10px",
                color: "white",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                marginTop: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              Login <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a0d14 0%, #0f1218 50%, #0a0d14 100%)",
        fontFamily: "'Inter', sans-serif",
        padding: "24px",
      }}
    >
      {/* Toast */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 9999,
            background: toast.type === "error" ? "#ef4444" : "#10b981",
            color: "white",
            padding: "10px 18px",
            borderRadius: "10px",
            fontSize: "13px",
            fontWeight: 500,
            boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          }}
        >
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "28px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Cookie size={22} color="white" />
          </div>
          <div>
            <h1 style={{ color: "white", fontSize: "24px", fontWeight: 700, margin: 0 }}>
              Cookies Panel
            </h1>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", margin: 0 }}>
              Manage tool URLs & cookies
            </p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="button"
            onClick={() => setTools(loadTools())}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "10px",
              padding: "8px 14px",
              color: "rgba(255,255,255,0.7)",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            <RefreshCw size={14} /> Refresh
          </button>
          <button
            type="button"
            onClick={() => openForm(null)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
              border: "none",
              borderRadius: "10px",
              padding: "8px 16px",
              color: "white",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <Plus size={14} /> Add Tool
          </button>
          <button
            type="button"
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: "10px",
              padding: "8px 14px",
              color: "#f87171",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>

      {/* Count */}
      <div
        style={{
          color: "rgba(255,255,255,0.4)",
          fontSize: "12px",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          marginBottom: "16px",
        }}
      >
        Saved Tools ({tools.length})
      </div>

      {/* Empty state */}
      {tools.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            background: "rgba(255,255,255,0.02)",
            border: "1px dashed rgba(255,255,255,0.1)",
            borderRadius: "16px",
          }}
        >
          <Cookie size={40} color="rgba(255,255,255,0.15)" style={{ margin: "0 auto 12px" }} />
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "14px", margin: "0 0 16px" }}>
            No tools saved yet
          </p>
          <button
            type="button"
            onClick={() => openForm(null)}
            style={{
              background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
              border: "none",
              borderRadius: "10px",
              padding: "10px 20px",
              color: "white",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            + Add First Tool
          </button>
        </div>
      )}

      {/* Tools grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "16px",
        }}
      >
        {tools.map((tool) => (
          <div
            key={tool.id}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "16px",
              padding: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                marginBottom: "14px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    background: "linear-gradient(135deg, rgba(139,92,246,0.3), rgba(236,72,153,0.3))",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Globe size={16} color="#a78bfa" />
                </div>
                <div>
                  <p style={{ color: "white", fontWeight: 600, fontSize: "15px", margin: 0 }}>
                    {tool.name}
                  </p>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.35)",
                      fontSize: "11px",
                      margin: 0,
                      maxWidth: "200px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {tool.url}
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  type="button"
                  onClick={() => openForm(tool)}
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    width: "30px",
                    height: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  <Edit2 size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(tool.id)}
                  style={{
                    background: "rgba(239,68,68,0.08)",
                    border: "1px solid rgba(239,68,68,0.15)",
                    borderRadius: "8px",
                    width: "30px",
                    height: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "#f87171",
                  }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            {/* Cookie field */}
            <div
              style={{
                background: "rgba(0,0,0,0.3)",
                borderRadius: "10px",
                padding: "10px 12px",
                marginBottom: "14px",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "4px",
                }}
              >
                <span
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    fontSize: "10px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  Cookie
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setShowCookieId(showCookieId === tool.id ? null : tool.id)
                  }
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "rgba(255,255,255,0.4)",
                    padding: 0,
                    display: "flex",
                  }}
                >
                  {showCookieId === tool.id ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
              <p
                style={{
                  color:
                    showCookieId === tool.id
                      ? "rgba(255,255,255,0.8)"
                      : "rgba(255,255,255,0.2)",
                  fontSize: "11px",
                  margin: 0,
                  fontFamily: "monospace",
                  filter: showCookieId === tool.id ? "none" : "blur(4px)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "100%",
                  transition: "all 0.2s",
                }}
              >
                {tool.cookie}
              </p>
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                onClick={() => handleOpen(tool)}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
                  border: "none",
                  borderRadius: "10px",
                  padding: "9px",
                  color: "white",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <ExternalLink size={14} /> Open Tool
              </button>
              <button
                type="button"
                onClick={() => handleCopyCookie(tool)}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  background:
                    copiedId === tool.id
                      ? "rgba(16,185,129,0.15)"
                      : "rgba(255,255,255,0.05)",
                  border: `1px solid ${
                    copiedId === tool.id
                      ? "rgba(16,185,129,0.3)"
                      : "rgba(255,255,255,0.1)"
                  }`,
                  borderRadius: "10px",
                  padding: "9px",
                  color: copiedId === tool.id ? "#34d399" : "rgba(255,255,255,0.6)",
                  fontSize: "13px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {copiedId === tool.id ? <Check size={14} /> : <Cookie size={14} />}
                {copiedId === tool.id ? "Copied!" : "Copy Cookie"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "500px",
              background: "#0f1218",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "20px",
              padding: "32px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "24px",
              }}
            >
              <h2 style={{ color: "white", fontSize: "18px", fontWeight: 700, margin: 0 }}>
                {editingId ? "Edit Tool" : "Add New Tool"}
              </h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {(["name", "url"] as const).map((key) => (
                <div key={key}>
                  <label
                    style={{
                      display: "block",
                      color: "rgba(255,255,255,0.5)",
                      fontSize: "11px",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      marginBottom: "6px",
                    }}
                  >
                    {key === "name" ? "Tool Name" : "Tool URL"}
                  </label>
                  <div style={{ position: "relative" }}>
                    <Globe
                      size={14}
                      style={{
                        position: "absolute",
                        left: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "rgba(255,255,255,0.3)",
                      }}
                    />
                    <input
                      type="text"
                      value={form[key]}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, [key]: e.target.value }))
                      }
                      placeholder={key === "name" ? "e.g. ChatGPT" : "https://example.com"}
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "10px",
                        padding: "11px 12px 11px 36px",
                        color: "white",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>
              ))}

              <div>
                <label
                  style={{
                    display: "block",
                    color: "rgba(255,255,255,0.5)",
                    fontSize: "11px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: "6px",
                  }}
                >
                  Cookie Value
                </label>
                <div style={{ position: "relative" }}>
                  <Cookie
                    size={14}
                    style={{
                      position: "absolute",
                      left: "12px",
                      top: "12px",
                      color: "rgba(255,255,255,0.3)",
                    }}
                  />
                  <textarea
                    value={form.cookie}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, cookie: e.target.value }))
                    }
                    placeholder="Paste your cookie string here..."
                    rows={4}
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "10px",
                      padding: "11px 12px 11px 36px",
                      color: "white",
                      fontSize: "13px",
                      fontFamily: "monospace",
                      outline: "none",
                      resize: "vertical",
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={{
                    flex: 1,
                    padding: "11px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "10px",
                    color: "rgba(255,255,255,0.6)",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  style={{
                    flex: 1,
                    padding: "11px",
                    background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
                    border: "none",
                    borderRadius: "10px",
                    color: "white",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                  }}
                >
                  <Save size={14} /> Save Tool
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}