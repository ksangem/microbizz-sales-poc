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
  Info,
  Trash2,
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

// S-03: Per-source activity checklists
const defaultSourceActivities = {
  "LinkedIn Hashtags": [
    { key: "posts", label: "Posts", enabled: true },
    { key: "hashtags", label: "Hashtags", enabled: true },
    { key: "engagements", label: "Engagements", enabled: true },
  ],
  "LinkedIn Company Pages": [
    { key: "posts", label: "Posts", enabled: true },
    { key: "companyUpdates", label: "Company Updates", enabled: true },
    { key: "engagements", label: "Engagements", enabled: false },
  ],
  "LinkedIn Job Postings": [
    { key: "jobPostings", label: "Job Postings", enabled: true },
    { key: "companyUpdates", label: "Company Updates", enabled: false },
  ],
  "Industry Forums": [
    { key: "blogPosts", label: "Blog Posts", enabled: true },
    { key: "webinars", label: "Webinars", enabled: true },
    { key: "eventRegistrations", label: "Event Registrations", enabled: false },
  ],
  "Company News / Blogs": [
    { key: "pressReleases", label: "Press Releases", enabled: true },
    { key: "productUpdates", label: "Product Updates", enabled: true },
  ],
  "LinkedIn Profile Activity": [
    { key: "posts", label: "Posts", enabled: false },
    { key: "engagements", label: "Engagements", enabled: false },
  ],
};

// S-04: Per-source info tooltip data
const sourceInfoData = {
  "LinkedIn Hashtags": {
    signals: "Captures posts and engagement on tracked hashtags relevant to your ICP.",
    volume: "~15-25 signals/day",
    gdpr: "Compliant - public data only",
  },
  "LinkedIn Company Pages": {
    signals: "Monitors company page updates, posts, and follower engagement.",
    volume: "~10-20 signals/day",
    gdpr: "Compliant - public company data",
  },
  "LinkedIn Job Postings": {
    signals: "Detects job postings that indicate buying intent (e.g., hiring for field service roles).",
    volume: "~5-10 signals/day",
    gdpr: "Compliant - public job listings",
  },
  "Industry Forums": {
    signals: "Tracks discussions, blog posts, webinars, and event registrations on industry forums.",
    volume: "~5-15 signals/day",
    gdpr: "Compliant - public forum content",
  },
  "Company News / Blogs": {
    signals: "Monitors press releases, product announcements, and company blog updates.",
    volume: "~3-8 signals/day",
    gdpr: "Compliant - public news sources",
  },
  "LinkedIn Profile Activity": {
    signals: "Would track individual profile actions (posts, likes, comments).",
    volume: "N/A - disabled",
    gdpr: "Restricted - requires GDPR/DPIA review before activation",
  },
};

// G-01: Info tooltip component
const InfoTooltip = ({ text }) => {
  const [visible, setVisible] = useState(false);
  return (
    <span
      style={{ position: "relative", display: "inline-flex", alignItems: "center", marginLeft: 6, cursor: "help" }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <Info size={14} style={{ color: "#7f8c8d" }} />
      {visible && (
        <span
          style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#2c3e50",
            color: "#fff",
            padding: "10px 14px",
            borderRadius: 8,
            fontSize: 12,
            lineHeight: 1.5,
            width: 300,
            zIndex: 1000,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            pointerEvents: "none",
            whiteSpace: "normal",
          }}
        >
          {text}
        </span>
      )}
    </span>
  );
};

// S-04: Source info tooltip component
const SourceInfoTooltip = ({ source }) => {
  const [visible, setVisible] = useState(false);
  const info = sourceInfoData[source];
  if (!info) return null;
  return (
    <span
      style={{ position: "relative", display: "inline-flex", alignItems: "center", marginLeft: 6, cursor: "help" }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <span style={{ fontSize: 14, color: "#7f8c8d" }}>&#9432;</span>
      {visible && (
        <span
          style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#2c3e50",
            color: "#fff",
            padding: "12px 16px",
            borderRadius: 8,
            fontSize: 12,
            lineHeight: 1.6,
            width: 320,
            zIndex: 1000,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            pointerEvents: "none",
            whiteSpace: "normal",
          }}
        >
          <div style={{ marginBottom: 6 }}>
            <strong>Signals captured:</strong> {info.signals}
          </div>
          <div style={{ marginBottom: 6 }}>
            <strong>Typical volume:</strong> {info.volume}
          </div>
          <div>
            <strong>GDPR status:</strong>{" "}
            <span style={{ color: info.gdpr.startsWith("Compliant") ? "#2ecc71" : "#e74c3c" }}>
              {info.gdpr}
            </span>
          </div>
        </span>
      )}
    </span>
  );
};

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

  // S-01: Add Channel modal state
  const [showAddChannel, setShowAddChannel] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const [newChannelType, setNewChannelType] = useState("custom");

  // S-03: Expanded source rows & activity state
  const [expandedSource, setExpandedSource] = useState(null);
  const [sourceActivities, setSourceActivities] = useState(defaultSourceActivities);

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

  // S-01: Add a new channel
  const addChannel = () => {
    if (newChannelName.trim()) {
      const newSource = {
        id: sources.length + 1,
        source: newChannelName.trim(),
        status: "paused",
        monitored: 0,
        signals: 0,
        lastCheck: "Never",
      };
      setSources((prev) => [...prev, newSource]);
      // Add default activities for custom source
      setSourceActivities((prev) => ({
        ...prev,
        [newChannelName.trim()]: [
          { key: "general", label: "General Monitoring", enabled: true },
        ],
      }));
      setNewChannelName("");
      setNewChannelType("custom");
      setShowAddChannel(false);
      showToast(`Channel "${newSource.source}" added`);
    }
  };

  // S-01: Remove a channel
  const removeSource = (id) => {
    const src = sources.find((s) => s.id === id);
    setSources((prev) => prev.filter((s) => s.id !== id));
    if (src) {
      showToast(`"${src.source}" removed from sources`);
    }
  };

  // S-03: Toggle an activity within a source
  const toggleActivity = (sourceName, activityKey) => {
    setSourceActivities((prev) => ({
      ...prev,
      [sourceName]: (prev[sourceName] || []).map((a) =>
        a.key === activityKey ? { ...a, enabled: !a.enabled } : a
      ),
    }));
  };

  // S-02: Map status to new labels
  const getSourceStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <span className="badge blue">Connected</span>;
      case "paused":
        return <span className="badge green">Available</span>;
      case "disabled":
        return <span className="badge gray">Inactive</span>;
      default:
        return <span className="badge gray">{status}</span>;
    }
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
      case "post": return "\u{1F4DD}";
      case "job_posting": return "\u{1F4BC}";
      case "company_activity": return "\u{1F3E2}";
      case "engagement": return "\u{1F44D}";
      case "content": return "\u{1F4C4}";
      case "event": return "\u{1F4C5}";
      default: return "\u{1F4E1}";
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
          <h1>
            Signal Monitor
            <InfoTooltip text="Real-time monitoring of public intent signals to identify companies showing buying behavior." />
          </h1>
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
              <ArrowUp size={12} /> Target: &ge;20 (Hit!)
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

        {/* -- Tab: Live Signal Feed -- */}
        {activeTab === "live-feed" && (
          <>
            {/* Signal Timeline Chart */}
            <div className="card" style={{ marginBottom: 24 }}>
              <div className="card-header">
                <h3>
                  Signal Activity Today
                  <InfoTooltip text="Hourly distribution of signals detected today across all monitored channels." />
                </h3>
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

        {/* -- Tab: All Signals -- */}
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

        {/* -- Tab: Source Configuration -- */}
        {activeTab === "sources" && (
          <>
            <div className="card" style={{ marginBottom: 24 }}>
              <div className="card-header">
                <h3>
                  Signal Source Configuration
                  <InfoTooltip text="Configure which public data sources to monitor. Add or remove channels without developer help." />
                </h3>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 12, color: "#7f8c8d" }}>
                    Configure which public data sources to monitor for intent signals
                  </span>
                  {/* S-01: Add Channel button */}
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setShowAddChannel(true)}
                  >
                    <Plus size={12} /> Add Channel
                  </button>
                </div>
              </div>

              {/* S-01: Add Channel Modal */}
              {showAddChannel && (
                <div
                  style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "rgba(0,0,0,0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 2000,
                  }}
                  onClick={(e) => {
                    if (e.target === e.currentTarget) setShowAddChannel(false);
                  }}
                >
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: 12,
                      padding: 28,
                      width: 420,
                      boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                    }}
                  >
                    <h3 style={{ marginTop: 0, marginBottom: 20 }}>Add New Signal Channel</h3>
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "#555" }}>
                        Channel Name
                      </label>
                      <input
                        type="text"
                        value={newChannelName}
                        onChange={(e) => setNewChannelName(e.target.value)}
                        placeholder="e.g., Twitter/X Mentions, G2 Reviews..."
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          border: "1px solid #e0e6ed",
                          borderRadius: 8,
                          fontSize: 14,
                          outline: "none",
                          boxSizing: "border-box",
                        }}
                        onKeyDown={(e) => e.key === "Enter" && addChannel()}
                      />
                    </div>
                    <div style={{ marginBottom: 20 }}>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "#555" }}>
                        Channel Type
                      </label>
                      <select
                        value={newChannelType}
                        onChange={(e) => setNewChannelType(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          border: "1px solid #e0e6ed",
                          borderRadius: 8,
                          fontSize: 14,
                          outline: "none",
                          boxSizing: "border-box",
                        }}
                      >
                        <option value="custom">Custom Source</option>
                        <option value="social">Social Media</option>
                        <option value="review">Review Platform</option>
                        <option value="news">News / RSS</option>
                        <option value="forum">Forum / Community</option>
                      </select>
                    </div>
                    <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                      <button
                        className="btn btn-outline"
                        onClick={() => {
                          setShowAddChannel(false);
                          setNewChannelName("");
                        }}
                      >
                        Cancel
                      </button>
                      <button className="btn btn-primary" onClick={addChannel}>
                        <Plus size={14} /> Add Channel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="card-body" style={{ padding: 0 }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th style={{ width: 30 }}></th>
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
                      <React.Fragment key={src.id}>
                        <tr>
                          {/* S-03: Expand/collapse toggle */}
                          <td>
                            <button
                              className="btn btn-sm btn-outline"
                              style={{ padding: "2px 4px", border: "none", background: "transparent" }}
                              onClick={() =>
                                setExpandedSource(
                                  expandedSource === src.id ? null : src.id
                                )
                              }
                            >
                              {expandedSource === src.id ? (
                                <ChevronUp size={14} />
                              ) : (
                                <ChevronDown size={14} />
                              )}
                            </button>
                          </td>
                          <td style={{ fontWeight: 600 }}>
                            {src.source}
                            {/* S-04: Info tooltip per source */}
                            <SourceInfoTooltip source={src.source} />
                          </td>
                          {/* S-02: Updated status badges */}
                          <td>{getSourceStatusBadge(src.status)}</td>
                          <td>{src.monitored}</td>
                          <td style={{ fontWeight: 600 }}>{src.signals}</td>
                          <td style={{ fontSize: 13, color: "#7f8c8d" }}>
                            {src.lastCheck}
                          </td>
                          <td>
                            <div style={{ display: "flex", gap: 6 }}>
                              {src.status !== "disabled" ? (
                                <>
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
                                  {/* S-01: Remove button for non-disabled sources */}
                                  <button
                                    className="btn btn-sm btn-outline"
                                    style={{ color: "#e74c3c", borderColor: "#e74c3c" }}
                                    onClick={() => removeSource(src.id)}
                                    title="Remove this channel"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </>
                              ) : (
                                <span style={{ fontSize: 12, color: "#e74c3c" }}>
                                  GDPR Restricted
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                        {/* S-03: Expanded activity checklist */}
                        {expandedSource === src.id && (
                          <tr>
                            <td colSpan={7} style={{ background: "#f8fafc", padding: "12px 24px 16px 48px" }}>
                              <strong style={{ fontSize: 12, color: "#7f8c8d", textTransform: "uppercase", display: "block", marginBottom: 10 }}>
                                Monitored Activities
                              </strong>
                              {(sourceActivities[src.source] || []).length > 0 ? (
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                                  {(sourceActivities[src.source] || []).map((activity) => (
                                    <label
                                      key={activity.key}
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 8,
                                        fontSize: 14,
                                        cursor: src.status === "disabled" ? "not-allowed" : "pointer",
                                        opacity: src.status === "disabled" ? 0.5 : 1,
                                        padding: "6px 12px",
                                        background: activity.enabled ? "#ebf5fb" : "#f5f5f5",
                                        borderRadius: 6,
                                        border: activity.enabled ? "1px solid #aed6f1" : "1px solid #e0e6ed",
                                      }}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={activity.enabled}
                                        disabled={src.status === "disabled"}
                                        onChange={() => toggleActivity(src.source, activity.key)}
                                        style={{ accentColor: "#2980b9" }}
                                      />
                                      {activity.label}
                                    </label>
                                  ))}
                                </div>
                              ) : (
                                <span style={{ fontSize: 13, color: "#7f8c8d" }}>
                                  No activities configured for this source.
                                </span>
                              )}
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
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

        {/* -- Tab: Keywords & Hashtags -- */}
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
                <h3>
                  Monitored Keywords
                  <InfoTooltip text="Keywords and hashtags being tracked across LinkedIn and forums. Add new ones to expand signal coverage." />
                </h3>
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
