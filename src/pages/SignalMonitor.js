import React, { useState } from "react";
import {
  Radio,
  Filter,
  RefreshCw,
  Eye,
  CheckCircle,
  AlertCircle,
  Clock,
  Hash,
  Rss,
  Play,
  Pause,
  X,
  Plus,
  ArrowUp,
  Flag,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  signalEvents,
  liveSignalFeed,
  signalSourceConfig,
  monitoredKeywords,
} from "../data/mockData";

const signalTimeline = [
  { time: "8am", count: 2 },
  { time: "9am", count: 4 },
  { time: "10am", count: 3 },
  { time: "11am", count: 5 },
  { time: "12pm", count: 6 },
  { time: "1pm", count: 4 },
  { time: "2pm", count: 7 },
  { time: "3pm", count: 3 },
];

const SignalMonitor = () => {
  const [filter, setFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("live-feed");
  const [selectedSignals, setSelectedSignals] = useState([]);
  const [keywords, setKeywords] = useState(monitoredKeywords);
  const [newKeyword, setNewKeyword] = useState("");
  const [sources, setSources] = useState(signalSourceConfig);
  const [expandedSignal, setExpandedSignal] = useState(null);

  const filteredSignals = signalEvents.filter((s) => {
    if (filter !== "all" && s.status !== filter) return false;
    if (sourceFilter !== "all" && s.source !== sourceFilter) return false;
    return true;
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const toggleSignalSelect = (id) => {
    setSelectedSignals((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleBulkAction = (action) => {
    showToast(
      `${selectedSignals.length} signals marked as ${action}`
    );
    setSelectedSignals([]);
  };

  const addKeyword = () => {
    if (newKeyword.trim()) {
      setKeywords((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          keyword: newKeyword.trim(),
          signals: 0,
          active: true,
        },
      ]);
      setNewKeyword("");
      showToast(`Keyword "${newKeyword.trim()}" added to monitoring`);
    }
  };

  const toggleKeyword = (id) => {
    setKeywords((prev) =>
      prev.map((k) => (k.id === id ? { ...k, active: !k.active } : k))
    );
  };

  const toggleSource = (id) => {
    setSources((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status: s.status === "active" ? "paused" : s.status === "disabled" ? "disabled" : "active",
            }
          : s
      )
    );
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "new":
        return <span className="badge green">New</span>;
      case "reviewed":
        return <span className="badge blue">Reviewed</span>;
      case "contacted":
        return <span className="badge orange">Contacted</span>;
      default:
        return <span className="badge gray">{status}</span>;
    }
  };

  const getSourceTag = (source) => {
    if (source.includes("LinkedIn"))
      return <span className="source-tag linkedin">{source}</span>;
    if (source === "Industry Forum")
      return <span className="source-tag forum">Forum</span>;
    return <span className="source-tag news">{source}</span>;
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "post": return "📝";
      case "job_posting": return "💼";
      case "company_activity": return "🏢";
      case "engagement": return "👍";
      case "content": return "📄";
      case "event": return "📅";
      default: return "📡";
    }
  };

  const formatTime = (ts) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-left">
          <h1>Signal Monitor</h1>
          <p>
            Real-time intent signal detection — LinkedIn, hashtags, industry
            forums
          </p>
        </div>
        <div className="top-bar-right">
          <div className="sync-indicator">
            <span className="sync-dot"></span>
            Live Monitoring
          </div>
          <button
            className="btn btn-outline"
            onClick={() => showToast("Signals refreshed from all sources")}
          >
            <RefreshCw size={14} /> Refresh
          </button>
          <span className="poc-badge">POC Week 4</span>
          <div className="user-avatar">RM</div>
        </div>
      </div>

      <div className="page-content">
        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon blue">
                <Radio size={20} />
              </div>
            </div>
            <div className="stat-value">28</div>
            <div className="stat-label">Signals This Week</div>
            <div className="stat-change up">
              <ArrowUp size={12} /> Target: ≥20 (Hit!)
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon green">
                <Flag size={20} />
              </div>
            </div>
            <div className="stat-value">
              {liveSignalFeed.filter((s) => s.autoFlagged).length}
            </div>
            <div className="stat-label">Auto-Flagged Today</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon orange">
                <Hash size={20} />
              </div>
            </div>
            <div className="stat-value">
              {keywords.filter((k) => k.active).length}
            </div>
            <div className="stat-label">Active Keywords</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon red">
                <Rss size={20} />
              </div>
            </div>
            <div className="stat-value">
              {sources.filter((s) => s.status === "active").length}
            </div>
            <div className="stat-label">Active Sources</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tab-nav">
          {[
            { key: "live-feed", label: "Live Signal Feed" },
            { key: "all-signals", label: "All Signals" },
            { key: "sources", label: "Source Configuration" },
            { key: "keywords", label: "Keywords & Hashtags" },
          ].map((tab) => (
            <div
              key={tab.key}
              className={`tab-item ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </div>
          ))}
        </div>

        {/* ── Tab: Live Signal Feed ── */}
        {activeTab === "live-feed" && (
          <>
            {/* Signal Timeline Chart */}
            <div className="card" style={{ marginBottom: 24 }}>
              <div className="card-header">
                <h3>Signal Activity Today</h3>
                <span className="badge blue">{liveSignalFeed.length} signals</span>
              </div>
              <div className="card-body">
                <div style={{ height: 180 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={signalTimeline}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ecf0f1" />
                      <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="count"
                        stroke="#2980b9"
                        fill="#ebf5fb"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Live Feed Cards */}
            {liveSignalFeed.map((signal) => (
              <div
                className="outreach-card"
                key={signal.id}
                style={{
                  borderLeft: signal.autoFlagged
                    ? "4px solid #27ae60"
                    : "4px solid #e0e6ed",
                }}
              >
                <div className="outreach-card-header">
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 20 }}>
                      {getTypeIcon(signal.type)}
                    </span>
                    <div>
                      <h4 style={{ margin: 0 }}>{signal.company}</h4>
                      <span style={{ fontSize: 12, color: "#7f8c8d" }}>
                        <Clock size={10} style={{ marginRight: 4 }} />
                        {formatTime(signal.timestamp)}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {signal.autoFlagged && (
                      <span className="badge green">Auto-Flagged</span>
                    )}
                    {getSourceTag(signal.source)}
                    <span
                      className={`badge ${
                        signal.relevance >= 80
                          ? "green"
                          : signal.relevance >= 60
                          ? "orange"
                          : "gray"
                      }`}
                    >
                      {signal.relevance}% match
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    background: "#f8fafc",
                    padding: "12px 16px",
                    borderRadius: 6,
                    fontSize: 14,
                    lineHeight: 1.6,
                    marginBottom: 10,
                  }}
                >
                  {signal.signal}
                </div>

                {signal.hashtags.length > 0 && (
                  <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                    {signal.hashtags.map((h) => (
                      <span
                        key={h}
                        className="badge blue"
                        style={{ fontSize: 11, padding: "2px 8px" }}
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                )}

                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() =>
                      showToast(`${signal.company} → sent to enrichment pipeline`)
                    }
                  >
                    <ArrowUp size={12} /> Enrich & Score
                  </button>
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() =>
                      showToast(`Signal from ${signal.company} marked as reviewed`)
                    }
                  >
                    <Eye size={12} /> Mark Reviewed
                  </button>
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() =>
                      showToast(`Signal from ${signal.company} dismissed`)
                    }
                  >
                    <X size={12} /> Dismiss
                  </button>
                </div>
              </div>
            ))}
          </>
        )}

        {/* ── Tab: All Signals ── */}
        {activeTab === "all-signals" && (
          <>
            {/* Filters & Bulk Actions */}
            <div className="filter-bar">
              <Filter size={16} style={{ color: "#7f8c8d" }} />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="reviewed">Reviewed</option>
                <option value="contacted">Contacted</option>
              </select>
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
              >
                <option value="all">All Sources</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Industry Forum">Industry Forum</option>
              </select>
              {selectedSignals.length > 0 && (
                <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                  <span style={{ fontSize: 13, color: "#7f8c8d", alignSelf: "center" }}>
                    {selectedSignals.length} selected:
                  </span>
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => handleBulkAction("enriched")}
                  >
                    Bulk Enrich
                  </button>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => handleBulkAction("reviewed")}
                  >
                    Mark Reviewed
                  </button>
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() => handleBulkAction("dismissed")}
                  >
                    Dismiss
                  </button>
                </div>
              )}
              <span
                style={{
                  fontSize: 13,
                  color: "#7f8c8d",
                  marginLeft: selectedSignals.length > 0 ? 0 : "auto",
                }}
              >
                {filteredSignals.length} of {signalEvents.length} signals
              </span>
            </div>

            <div className="card">
              <div className="card-body" style={{ padding: 0 }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th style={{ width: 30 }}>
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSignals(filteredSignals.map((s) => s.id));
                            } else {
                              setSelectedSignals([]);
                            }
                          }}
                        />
                      </th>
                      <th>Company</th>
                      <th>Contact</th>
                      <th>Signal Detected</th>
                      <th>Source</th>
                      <th>Relevance</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSignals.map((signal) => (
                      <React.Fragment key={signal.id}>
                        <tr
                          style={{
                            background: selectedSignals.includes(signal.id)
                              ? "#f0f7ff"
                              : "transparent",
                          }}
                        >
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedSignals.includes(signal.id)}
                              onChange={() => toggleSignalSelect(signal.id)}
                            />
                          </td>
                          <td style={{ fontWeight: 600 }}>{signal.company}</td>
                          <td>
                            <div>{signal.contact}</div>
                            <div style={{ fontSize: 12, color: "#7f8c8d" }}>
                              {signal.title}
                            </div>
                          </td>
                          <td style={{ maxWidth: 220, fontSize: 13, color: "#555" }}>
                            {signal.signal}
                          </td>
                          <td>{getSourceTag(signal.source)}</td>
                          <td>
                            <div className="score-bar-container">
                              <div className="score-bar" style={{ width: 50 }}>
                                <div
                                  className={`score-bar-fill ${
                                    signal.relevance >= 80
                                      ? "high"
                                      : signal.relevance >= 60
                                      ? "medium"
                                      : "low"
                                  }`}
                                  style={{ width: `${signal.relevance}%` }}
                                ></div>
                              </div>
                              <span
                                className={`score-value ${
                                  signal.relevance >= 80
                                    ? "high"
                                    : signal.relevance >= 60
                                    ? "medium"
                                    : "low"
                                }`}
                                style={{ fontSize: 13 }}
                              >
                                {signal.relevance}
                              </span>
                            </div>
                          </td>
                          <td style={{ fontSize: 13, color: "#7f8c8d" }}>
                            {signal.date}
                          </td>
                          <td>{getStatusBadge(signal.status)}</td>
                          <td>
                            <div style={{ display: "flex", gap: 4 }}>
                              <button
                                className="btn btn-sm btn-outline"
                                onClick={() =>
                                  setExpandedSignal(
                                    expandedSignal === signal.id ? null : signal.id
                                  )
                                }
                              >
                                {expandedSignal === signal.id ? (
                                  <ChevronUp size={12} />
                                ) : (
                                  <ChevronDown size={12} />
                                )}
                              </button>
                              <button
                                className="btn btn-sm btn-outline"
                                onClick={() =>
                                  showToast(
                                    `${signal.company} sent to enrichment`
                                  )
                                }
                              >
                                Enrich
                              </button>
                            </div>
                          </td>
                        </tr>
                        {expandedSignal === signal.id && (
                          <tr>
                            <td colSpan={9} style={{ background: "#f8fafc", padding: 16 }}>
                              <div style={{ display: "flex", gap: 24 }}>
                                <div style={{ flex: 1 }}>
                                  <strong style={{ fontSize: 12, color: "#7f8c8d", textTransform: "uppercase" }}>
                                    Full Signal Context
                                  </strong>
                                  <p style={{ marginTop: 8, fontSize: 14 }}>
                                    {signal.signal}
                                  </p>
                                </div>
                                <div style={{ display: "flex", gap: 8 }}>
                                  <button
                                    className="btn btn-sm btn-success"
                                    onClick={() =>
                                      showToast(
                                        `${signal.company} → enrichment pipeline`
                                      )
                                    }
                                  >
                                    <ArrowUp size={12} /> Send to Enrich & Score
                                  </button>
                                  <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() =>
                                      showToast(
                                        `Generating outreach for ${signal.contact}`
                                      )
                                    }
                                  >
                                    Generate Outreach
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ── Tab: Source Configuration ── */}
        {activeTab === "sources" && (
          <>
            <div className="card" style={{ marginBottom: 24 }}>
              <div className="card-header">
                <h3>Signal Source Configuration</h3>
                <span style={{ fontSize: 12, color: "#7f8c8d" }}>
                  Configure which public data sources to monitor for intent signals
                </span>
              </div>
              <div className="card-body" style={{ padding: 0 }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Source</th>
                      <th>Status</th>
                      <th>Items Monitored</th>
                      <th>Signals Found</th>
                      <th>Last Check</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sources.map((src) => (
                      <tr key={src.id}>
                        <td style={{ fontWeight: 600 }}>{src.source}</td>
                        <td>
                          <span
                            className={`badge ${
                              src.status === "active"
                                ? "green"
                                : src.status === "paused"
                                ? "orange"
                                : "red"
                            }`}
                          >
                            {src.status === "active"
                              ? "Active"
                              : src.status === "paused"
                              ? "Paused"
                              : "Disabled"}
                          </span>
                        </td>
                        <td>{src.monitored}</td>
                        <td style={{ fontWeight: 600 }}>{src.signals}</td>
                        <td style={{ fontSize: 13, color: "#7f8c8d" }}>
                          {src.lastCheck}
                        </td>
                        <td>
                          {src.status !== "disabled" ? (
                            <button
                              className={`btn btn-sm ${
                                src.status === "active"
                                  ? "btn-outline"
                                  : "btn-success"
                              }`}
                              onClick={() => {
                                toggleSource(src.id);
                                showToast(
                                  `${src.source} ${
                                    src.status === "active"
                                      ? "paused"
                                      : "activated"
                                  }`
                                );
                              }}
                            >
                              {src.status === "active" ? (
                                <>
                                  <Pause size={12} /> Pause
                                </>
                              ) : (
                                <>
                                  <Play size={12} /> Activate
                                </>
                              )}
                            </button>
                          ) : (
                            <span style={{ fontSize: 12, color: "#e74c3c" }}>
                              GDPR Restricted
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3>GDPR Compliance Note</h3>
              </div>
              <div className="card-body">
                <div
                  style={{
                    background: "#fef5e7",
                    border: "1px solid #f39c12",
                    borderRadius: 8,
                    padding: 16,
                    fontSize: 14,
                    lineHeight: 1.7,
                  }}
                >
                  <strong>LinkedIn Profile Activity</strong> monitoring is{" "}
                  <strong>disabled by default</strong> to comply with GDPR and
                  LinkedIn's Terms of Service. The POC uses only:
                  <ul style={{ marginTop: 8, paddingLeft: 20 }}>
                    <li>
                      Public hashtag feeds and company page activity (no personal
                      profile scraping)
                    </li>
                    <li>
                      ZoomInfo intent data (vendor-provided, consent-compliant)
                    </li>
                    <li>
                      HubSpot's existing consent-based contact records
                    </li>
                  </ul>
                  <p style={{ marginTop: 8, color: "#b7791f" }}>
                    Legal review by MicroBizz GMBH is required before go-live.
                    DPIA status: <strong>Pending Review</strong>.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── Tab: Keywords & Hashtags ── */}
        {activeTab === "keywords" && (
          <>
            {/* Add Keyword */}
            <div className="card" style={{ marginBottom: 24 }}>
              <div className="card-header">
                <h3>Add New Keyword / Hashtag</h3>
              </div>
              <div className="card-body">
                <div style={{ display: "flex", gap: 12 }}>
                  <input
                    type="text"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    placeholder="Enter keyword or #hashtag to monitor..."
                    style={{
                      flex: 1,
                      padding: "10px 14px",
                      border: "1px solid #e0e6ed",
                      borderRadius: 8,
                      fontSize: 14,
                      outline: "none",
                    }}
                    onKeyDown={(e) => e.key === "Enter" && addKeyword()}
                  />
                  <button className="btn btn-primary" onClick={addKeyword}>
                    <Plus size={14} /> Add Keyword
                  </button>
                </div>
                <p
                  style={{
                    fontSize: 12,
                    color: "#7f8c8d",
                    marginTop: 8,
                  }}
                >
                  Keywords are matched against LinkedIn posts, company updates,
                  and industry forum content. Start narrow and expand based on
                  signal quality feedback.
                </p>
              </div>
            </div>

            {/* Keywords Table */}
            <div className="card">
              <div className="card-header">
                <h3>Monitored Keywords</h3>
                <span className="badge blue">
                  {keywords.filter((k) => k.active).length} active /{" "}
                  {keywords.length} total
                </span>
              </div>
              <div className="card-body" style={{ padding: 0 }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Keyword / Hashtag</th>
                      <th>Signals Found</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {keywords.map((kw) => (
                      <tr key={kw.id}>
                        <td style={{ fontWeight: 600 }}>
                          <Hash
                            size={12}
                            style={{
                              marginRight: 4,
                              color: "#2980b9",
                              verticalAlign: "middle",
                            }}
                          />
                          {kw.keyword}
                        </td>
                        <td>{kw.signals}</td>
                        <td>
                          <span
                            className={`badge ${kw.active ? "green" : "gray"}`}
                          >
                            {kw.active ? "Active" : "Paused"}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button
                              className={`btn btn-sm ${
                                kw.active ? "btn-outline" : "btn-success"
                              }`}
                              onClick={() => {
                                toggleKeyword(kw.id);
                                showToast(
                                  `"${kw.keyword}" ${
                                    kw.active ? "paused" : "activated"
                                  }`
                                );
                              }}
                            >
                              {kw.active ? (
                                <>
                                  <Pause size={10} /> Pause
                                </>
                              ) : (
                                <>
                                  <Play size={10} /> Activate
                                </>
                              )}
                            </button>
                            <button
                              className="btn btn-sm btn-outline"
                              onClick={() => {
                                setKeywords((prev) =>
                                  prev.filter((k) => k.id !== kw.id)
                                );
                                showToast(`"${kw.keyword}" removed`);
                              }}
                            >
                              <X size={10} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {toast && (
        <div className="toast">
          <CheckCircle size={16} />
          {toast}
        </div>
      )}
    </>
  );
};

export default SignalMonitor;
