import React, { useState } from "react";
import {
  Send,
  CheckCircle,
  Mail,
  ExternalLink,
  Calendar,
  Clock,
  Eye,
  MousePointer,
  MessageSquare,
  ArrowRight,
  Users,
  TrendingUp,
  AlertCircle,
  Phone,
  X,
  FileText,
  Video,
  BookOpen,
  Plus,
  DollarSign,
  Target,
  Trophy,
  XCircle,
  Briefcase,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  salesActivities,
  meetingsPipeline,
  conversionFunnel,
  outreachPerformance,
  opportunities as initialOpportunities,
  leads,
} from "../data/mockData";

const FOLLOW_UP_TYPES = [
  { key: "email", label: "Follow-Up Email", icon: Mail, color: "#2980b9", desc: "Send a contextual follow-up email" },
  { key: "linkedin", label: "LinkedIn Message", icon: ExternalLink, color: "#0077b5", desc: "Send a LinkedIn direct message" },
  { key: "call", label: "Phone Call", icon: Phone, color: "#27ae60", desc: "Schedule or make a phone call" },
  { key: "case-study", label: "Send Case Study", icon: FileText, color: "#9b59b6", desc: "Share a relevant customer case study" },
  { key: "one-pager", label: "Send Product One-Pager", icon: BookOpen, color: "#e67e22", desc: "Share product overview document" },
  { key: "demo", label: "Schedule Demo", icon: Video, color: "#e74c3c", desc: "Propose a product demo session" },
  { key: "meeting", label: "Schedule Meeting", icon: Calendar, color: "#1a5276", desc: "Book a discovery / follow-up meeting" },
];

const STAGE_CONFIG = {
  created: { label: "Created", color: "#3498db", bg: "#ebf5fb" },
  negotiation: { label: "Negotiation", color: "#f39c12", bg: "#fef5e7" },
  "closed-won": { label: "Closed Won", color: "#27ae60", bg: "#eafaf1" },
  "closed-lost": { label: "Closed Lost", color: "#e74c3c", bg: "#fdedec" },
};

const SalesAction = () => {
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("activity");
  const [activities, setActivities] = useState(salesActivities);
  const [followUpModal, setFollowUpModal] = useState(null);
  const [opportunities, setOpportunities] = useState(initialOpportunities);
  const [showCreateOpp, setShowCreateOpp] = useState(false);
  const [newOpp, setNewOpp] = useState({
    company: "",
    contact: "",
    title: "",
    value: "",
    stage: "created",
    source: "",
    notes: "",
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "sent":
        return <Send size={14} style={{ color: "#2980b9" }} />;
      case "opened":
        return <Eye size={14} style={{ color: "#27ae60" }} />;
      case "clicked":
        return <MousePointer size={14} style={{ color: "#f39c12" }} />;
      case "replied":
        return <MessageSquare size={14} style={{ color: "#27ae60" }} />;
      case "accepted":
        return <CheckCircle size={14} style={{ color: "#27ae60" }} />;
      default:
        return <Clock size={14} style={{ color: "#7f8c8d" }} />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "sent":
        return <span className="badge blue">Sent</span>;
      case "opened":
        return <span className="badge green">Opened</span>;
      case "clicked":
        return <span className="badge orange">Clicked</span>;
      case "replied":
        return <span className="badge green">Replied!</span>;
      case "accepted":
        return <span className="badge green">Accepted</span>;
      default:
        return <span className="badge gray">{status}</span>;
    }
  };

  const getPipelineStatus = (status) => {
    switch (status) {
      case "follow-up-needed":
        return <span className="badge orange">Follow-Up Needed</span>;
      case "email-opened":
        return <span className="badge blue">Email Opened</span>;
      case "nurturing":
        return <span className="badge gray">Nurturing</span>;
      case "meeting-scheduled":
        return <span className="badge green">Meeting Scheduled!</span>;
      default:
        return <span className="badge gray">{status}</span>;
    }
  };

  // ─── Opportunity calculations ───
  const oppStats = {
    created: opportunities.filter((o) => o.stage === "created").length,
    negotiation: opportunities.filter((o) => o.stage === "negotiation").length,
    won: opportunities.filter((o) => o.stage === "closed-won").length,
    lost: opportunities.filter((o) => o.stage === "closed-lost").length,
    total: opportunities.length,
  };

  const predictedRevenue = opportunities
    .filter((o) => o.stage !== "closed-lost")
    .reduce((sum, o) => sum + (o.value * o.probability) / 100, 0);

  const totalPipelineValue = opportunities
    .filter((o) => o.stage === "created" || o.stage === "negotiation")
    .reduce((sum, o) => sum + o.value, 0);

  const wonRevenue = opportunities
    .filter((o) => o.stage === "closed-won")
    .reduce((sum, o) => sum + o.value, 0);

  const handleFollowUp = (type, contact) => {
    setFollowUpModal(null);
    showToast(`${type.label} initiated for ${contact.contact} at ${contact.company}`);
  };

  const handleCreateOpportunity = () => {
    if (!newOpp.company || !newOpp.value) return;
    const opp = {
      id: opportunities.length + 1,
      ...newOpp,
      value: parseFloat(newOpp.value),
      probability: newOpp.stage === "created" ? 30 : newOpp.stage === "negotiation" ? 50 : 0,
      createdAt: new Date().toISOString().split("T")[0],
      closedAt: null,
    };
    setOpportunities([opp, ...opportunities]);
    setShowCreateOpp(false);
    setNewOpp({ company: "", contact: "", title: "", value: "", stage: "created", source: "", notes: "" });
    showToast(`Opportunity created for ${opp.company}`);
  };

  const oppPieData = [
    { name: "Created", value: oppStats.created, color: "#3498db" },
    { name: "Negotiation", value: oppStats.negotiation, color: "#f39c12" },
    { name: "Won", value: oppStats.won, color: "#27ae60" },
    { name: "Lost", value: oppStats.lost, color: "#e74c3c" },
  ].filter((d) => d.value > 0);

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-left">
          <h1>Sales Action</h1>
          <p>Outreach tracking, pipeline, opportunities & revenue</p>
        </div>
        <div className="top-bar-right">
          <div className="sync-indicator">
            <span className="sync-dot"></span>
            HubSpot Activity Sync
          </div>
          <span className="poc-badge">POC Week 4</span>
          <div className="user-avatar">RM</div>
        </div>
      </div>

      <div className="page-content">
        {/* Stats */}
        <div className="stats-grid" style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>
          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon blue">
                <Send size={20} />
              </div>
            </div>
            <div className="stat-value">{activities.length}</div>
            <div className="stat-label">Total Outreach Sent</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon green">
                <Eye size={20} />
              </div>
            </div>
            <div className="stat-value">80%</div>
            <div className="stat-label">Open Rate</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon orange">
                <MessageSquare size={20} />
              </div>
            </div>
            <div className="stat-value">1</div>
            <div className="stat-label">Replies Received</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon" style={{ background: "#f0e6ff", color: "#9b59b6" }}>
                <DollarSign size={20} />
              </div>
            </div>
            <div className="stat-value" style={{ fontSize: 22 }}>
              {"\u20AC"}{Math.round(predictedRevenue / 1000)}K
            </div>
            <div className="stat-label">
              Predicted Revenue
              <div style={{ fontSize: 10, color: "#9b59b6" }}>
                Weighted pipeline
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon red">
                <Calendar size={20} />
              </div>
            </div>
            <div className="stat-value">0</div>
            <div className="stat-label">
              Meetings Booked
              <div style={{ fontSize: 10, color: "#e74c3c" }}>
                Target: {"\u2265"}1
              </div>
            </div>
          </div>
        </div>

        {/* Tabs — styled as proper clickable tabs */}
        <div className="sa-tab-bar">
          {[
            { key: "activity", label: "Outreach Activity", icon: Send },
            { key: "pipeline", label: "Meeting Pipeline", icon: Users },
            { key: "opportunities", label: "Opportunities", icon: Briefcase },
            { key: "funnel", label: "Conversion Funnel", icon: TrendingUp },
            { key: "performance", label: "Performance Metrics", icon: Target },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`sa-tab-btn ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <tab.icon size={15} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Tab: Outreach Activity ── */}
        {activeTab === "activity" && (
          <div className="card">
            <div className="card-header">
              <h3>Outreach Activity Log</h3>
              <span className="badge blue">
                All AI-contextualised outreach tracked
              </span>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Contact</th>
                    <th>Action</th>
                    <th>Channel</th>
                    <th>Date Sent</th>
                    <th>Status</th>
                    <th>Opened</th>
                    <th>Replied</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((act) => (
                    <tr key={act.id}>
                      <td style={{ fontWeight: 600 }}>{act.company}</td>
                      <td>{act.contact}</td>
                      <td style={{ fontSize: 13 }}>{act.action}</td>
                      <td>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            fontSize: 12,
                          }}
                        >
                          {act.channel === "LinkedIn" ? (
                            <ExternalLink size={12} />
                          ) : (
                            <Mail size={12} />
                          )}
                          {act.channel}
                        </span>
                      </td>
                      <td style={{ fontSize: 13, color: "#7f8c8d" }}>
                        {new Date(act.date).toLocaleDateString()}
                      </td>
                      <td>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          {getStatusIcon(act.status)}{" "}
                          {getStatusBadge(act.status)}
                        </span>
                      </td>
                      <td style={{ fontSize: 13 }}>
                        {act.openedAt
                          ? new Date(act.openedAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "\u2014"}
                      </td>
                      <td style={{ fontSize: 13 }}>
                        {act.repliedAt ? (
                          <span className="badge green">Yes</span>
                        ) : (
                          "\u2014"
                        )}
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: 4 }}>
                          <button
                            className="btn btn-sm btn-outline"
                            onClick={() => setFollowUpModal(act)}
                          >
                            Follow-Up
                          </button>
                          {act.status === "opened" && !act.repliedAt && (
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => setFollowUpModal(act)}
                            >
                              <Send size={10} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Tab: Meeting Pipeline ── */}
        {activeTab === "pipeline" && (
          <>
            <div
              style={{
                background: "#fef5e7",
                border: "1px solid #f39c12",
                borderRadius: 8,
                padding: 14,
                marginBottom: 20,
                fontSize: 13,
                color: "#b7791f",
              }}
            >
              <strong>POC Objective #4:</strong> At least 1 qualified meeting
              booked from POC-sourced leads by Week 10. Current: 0 meetings,
              but 1 reply received (FranceTech SARL) and 3 emails opened.
              Pipeline is building.
            </div>

            {meetingsPipeline.map((item) => (
              <div
                className="card"
                key={item.id}
                style={{
                  marginBottom: 16,
                  borderLeft: `4px solid ${
                    item.probability >= 60
                      ? "#27ae60"
                      : item.probability >= 40
                      ? "#f39c12"
                      : "#95a5a6"
                  }`,
                }}
              >
                <div className="card-body">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 14,
                    }}
                  >
                    <div>
                      <h4 style={{ fontSize: 16, margin: 0 }}>
                        {item.company}
                      </h4>
                      <span style={{ fontSize: 13, color: "#7f8c8d" }}>
                        {item.contact} — {item.title}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      {getPipelineStatus(item.status)}
                      <span
                        className={`badge ${
                          item.probability >= 60
                            ? "green"
                            : item.probability >= 40
                            ? "orange"
                            : "gray"
                        }`}
                      >
                        {item.probability}% probability
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 24, marginBottom: 14 }}>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: 11,
                          textTransform: "uppercase",
                          letterSpacing: 1,
                          color: "#7f8c8d",
                          marginBottom: 4,
                        }}
                      >
                        Last Action
                      </div>
                      <p style={{ fontSize: 14 }}>{item.lastAction}</p>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: 11,
                          textTransform: "uppercase",
                          letterSpacing: 1,
                          color: "#27ae60",
                          marginBottom: 4,
                        }}
                      >
                        Next Step
                      </div>
                      <p
                        style={{
                          fontSize: 14,
                          fontWeight: 500,
                          color: "#1a5276",
                        }}
                      >
                        {item.nextStep}
                      </p>
                    </div>
                    <div style={{ minWidth: 120 }}>
                      <div
                        style={{
                          fontSize: 11,
                          textTransform: "uppercase",
                          letterSpacing: 1,
                          color: "#7f8c8d",
                          marginBottom: 4,
                        }}
                      >
                        Due Date
                      </div>
                      <p style={{ fontSize: 14, fontWeight: 600 }}>
                        {item.dueDate}
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      background: "#f8fafc",
                      padding: 10,
                      borderRadius: 6,
                      fontSize: 13,
                      color: "#555",
                      marginBottom: 14,
                    }}
                  >
                    <strong>Notes:</strong> {item.notes}
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() =>
                        showToast(`Executing next step for ${item.contact}...`)
                      }
                    >
                      <ArrowRight size={12} /> Execute Next Step
                    </button>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() =>
                        showToast(
                          `Scheduling meeting with ${item.contact}...`
                        )
                      }
                    >
                      <Calendar size={12} /> Schedule Meeting
                    </button>
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() =>
                        showToast(`Calling ${item.contact}...`)
                      }
                    >
                      <Phone size={12} /> Call
                    </button>
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() =>
                        showToast(`Opening ${item.company} in HubSpot`)
                      }
                    >
                      <ExternalLink size={12} /> HubSpot
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* ── Tab: Opportunities ── */}
        {activeTab === "opportunities" && (
          <>
            {/* Opportunity Summary Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
              <div className="stat-card" style={{ borderLeft: "4px solid #3498db" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div className="stat-icon blue"><Briefcase size={18} /></div>
                  <span style={{ fontSize: 12, color: "#7f8c8d", textTransform: "uppercase", letterSpacing: 1 }}>Created</span>
                </div>
                <div className="stat-value">{oppStats.created + oppStats.negotiation}</div>
                <div className="stat-label">Open opportunities</div>
              </div>
              <div className="stat-card" style={{ borderLeft: "4px solid #27ae60" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div className="stat-icon green"><Trophy size={18} /></div>
                  <span style={{ fontSize: 12, color: "#7f8c8d", textTransform: "uppercase", letterSpacing: 1 }}>Won</span>
                </div>
                <div className="stat-value">{oppStats.won}</div>
                <div className="stat-label">{"\u20AC"}{wonRevenue.toLocaleString()} revenue</div>
              </div>
              <div className="stat-card" style={{ borderLeft: "4px solid #e74c3c" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div className="stat-icon red"><XCircle size={18} /></div>
                  <span style={{ fontSize: 12, color: "#7f8c8d", textTransform: "uppercase", letterSpacing: 1 }}>Lost</span>
                </div>
                <div className="stat-value">{oppStats.lost}</div>
                <div className="stat-label">Closed lost</div>
              </div>
              <div className="stat-card" style={{ borderLeft: "4px solid #9b59b6" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div className="stat-icon" style={{ background: "#f0e6ff", color: "#9b59b6" }}><TrendingUp size={18} /></div>
                  <span style={{ fontSize: 12, color: "#7f8c8d", textTransform: "uppercase", letterSpacing: 1 }}>Predicted</span>
                </div>
                <div className="stat-value" style={{ fontSize: 24 }}>{"\u20AC"}{Math.round(predictedRevenue).toLocaleString()}</div>
                <div className="stat-label">Weighted revenue forecast</div>
              </div>
            </div>

            <div className="grid-2">
              {/* Opportunity List */}
              <div className="card">
                <div className="card-header">
                  <h3>All Opportunities</h3>
                  <button className="btn btn-sm btn-success" onClick={() => setShowCreateOpp(true)}>
                    <Plus size={14} /> Create Opportunity
                  </button>
                </div>
                <div className="card-body" style={{ padding: 0 }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Company</th>
                        <th>Contact</th>
                        <th>Value</th>
                        <th>Stage</th>
                        <th>Probability</th>
                      </tr>
                    </thead>
                    <tbody>
                      {opportunities.map((opp) => {
                        const cfg = STAGE_CONFIG[opp.stage];
                        return (
                          <tr key={opp.id}>
                            <td style={{ fontWeight: 600 }}>{opp.company}</td>
                            <td>
                              <div>{opp.contact}</div>
                              <div style={{ fontSize: 11, color: "#7f8c8d" }}>{opp.title}</div>
                            </td>
                            <td style={{ fontWeight: 700 }}>{"\u20AC"}{opp.value.toLocaleString()}</td>
                            <td>
                              <span
                                style={{
                                  display: "inline-block",
                                  padding: "4px 10px",
                                  borderRadius: 6,
                                  fontSize: 12,
                                  fontWeight: 600,
                                  background: cfg.bg,
                                  color: cfg.color,
                                }}
                              >
                                {cfg.label}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <div style={{ flex: 1, height: 6, background: "#ecf0f1", borderRadius: 3, overflow: "hidden" }}>
                                  <div
                                    style={{
                                      height: "100%",
                                      width: `${opp.probability}%`,
                                      background: opp.probability >= 60 ? "#27ae60" : opp.probability >= 30 ? "#f39c12" : "#e74c3c",
                                      borderRadius: 3,
                                    }}
                                  />
                                </div>
                                <span style={{ fontSize: 12, fontWeight: 600, minWidth: 32 }}>{opp.probability}%</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pipeline Revenue & Chart */}
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <div className="card">
                  <div className="card-header">
                    <h3>Pipeline Revenue Breakdown</h3>
                  </div>
                  <div className="card-body">
                    <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                      <div style={{ width: 180, height: 180 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={oppPieData}
                              cx="50%"
                              cy="50%"
                              innerRadius={50}
                              outerRadius={80}
                              dataKey="value"
                              paddingAngle={3}
                            >
                              {oppPieData.map((entry, i) => (
                                <Cell key={i} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div style={{ flex: 1 }}>
                        {oppPieData.map((d) => (
                          <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                            <div style={{ width: 10, height: 10, borderRadius: 2, background: d.color }} />
                            <span style={{ fontSize: 13, flex: 1 }}>{d.name}</span>
                            <span style={{ fontWeight: 700, fontSize: 14 }}>{d.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <h3>Revenue Summary</h3>
                  </div>
                  <div className="card-body">
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 14 }}>
                        <span>Total Pipeline Value</span>
                        <span style={{ fontWeight: 700 }}>{"\u20AC"}{totalPipelineValue.toLocaleString()}</span>
                      </div>
                      <div style={{ height: 8, background: "#ecf0f1", borderRadius: 4, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: "100%", background: "linear-gradient(90deg, #3498db, #2980b9)", borderRadius: 4 }} />
                      </div>
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 14 }}>
                        <span>Weighted Predicted Revenue</span>
                        <span style={{ fontWeight: 700, color: "#9b59b6" }}>{"\u20AC"}{Math.round(predictedRevenue).toLocaleString()}</span>
                      </div>
                      <div style={{ height: 8, background: "#ecf0f1", borderRadius: 4, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${Math.round((predictedRevenue / totalPipelineValue) * 100)}%`, background: "linear-gradient(90deg, #9b59b6, #8e44ad)", borderRadius: 4 }} />
                      </div>
                    </div>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 14 }}>
                        <span>Revenue Won (Closed)</span>
                        <span style={{ fontWeight: 700, color: "#27ae60" }}>{"\u20AC"}{wonRevenue.toLocaleString()}</span>
                      </div>
                      <div style={{ height: 8, background: "#ecf0f1", borderRadius: 4, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${Math.round((wonRevenue / (totalPipelineValue + wonRevenue)) * 100)}%`, background: "linear-gradient(90deg, #27ae60, #2ecc71)", borderRadius: 4 }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── Tab: Conversion Funnel ── */}
        {activeTab === "funnel" && (
          <div className="grid-2">
            <div className="card">
              <div className="card-header">
                <h3>POC Conversion Funnel</h3>
              </div>
              <div className="card-body">
                {conversionFunnel.map((stage, i) => (
                  <div key={i} style={{ marginBottom: 12 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 4,
                        fontSize: 14,
                      }}
                    >
                      <span>{stage.stage}</span>
                      <span style={{ fontWeight: 700 }}>{stage.count}</span>
                    </div>
                    <div
                      style={{
                        height: 28,
                        background: "#ecf0f1",
                        borderRadius: 6,
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${Math.max(
                            (stage.count / conversionFunnel[0].count) * 100,
                            stage.count > 0 ? 4 : 0
                          )}%`,
                          background: stage.color,
                          borderRadius: 6,
                          transition: "width 0.5s ease",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: 12,
                          fontWeight: 600,
                          minWidth: stage.count > 0 ? 30 : 0,
                        }}
                      >
                        {stage.count > 0 && stage.count}
                      </div>
                    </div>
                    {i < conversionFunnel.length - 1 && (
                      <div
                        style={{
                          textAlign: "center",
                          fontSize: 11,
                          color: "#7f8c8d",
                          marginTop: 2,
                        }}
                      >
                        {conversionFunnel[i + 1].count > 0
                          ? `${Math.round(
                              (conversionFunnel[i + 1].count / stage.count) *
                                100
                            )}% conversion`
                          : "0% conversion"}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3>Funnel Analysis</h3>
              </div>
              <div className="card-body">
                <div
                  style={{
                    background: "#eafaf1",
                    border: "1px solid #27ae60",
                    borderRadius: 8,
                    padding: 16,
                    marginBottom: 16,
                  }}
                >
                  <h4 style={{ fontSize: 14, color: "#1e8449", marginBottom: 8 }}>
                    What's Working
                  </h4>
                  <ul
                    style={{
                      fontSize: 13,
                      lineHeight: 1.8,
                      paddingLeft: 16,
                    }}
                  >
                    <li>
                      80% open rate on AI-contextualised outreach (industry avg:
                      ~20%)
                    </li>
                    <li>
                      100% of outreach uses AI-suggested context (target: {"\u2265"}50%)
                    </li>
                    <li>
                      Signal detection exceeds target: 28/week vs 20/week goal
                    </li>
                    <li>
                      1 reply received from FranceTech — highest-scored lead
                    </li>
                  </ul>
                </div>

                <div
                  style={{
                    background: "#fef5e7",
                    border: "1px solid #f39c12",
                    borderRadius: 8,
                    padding: 16,
                    marginBottom: 16,
                  }}
                >
                  <h4 style={{ fontSize: 14, color: "#b7791f", marginBottom: 8 }}>
                    Needs Attention
                  </h4>
                  <ul
                    style={{
                      fontSize: 13,
                      lineHeight: 1.8,
                      paddingLeft: 16,
                    }}
                  >
                    <li>
                      Reply rate is 20% — follow-up sequences needed for opened
                      emails
                    </li>
                    <li>
                      0 meetings booked yet (target: {"\u2265"}1 by Week 10) — 6 weeks
                      remaining
                    </li>
                    <li>
                      BelgaTech and Nordic Clean opened but didn't reply — try
                      different channel
                    </li>
                  </ul>
                </div>

                <div
                  style={{
                    background: "#ebf5fb",
                    border: "1px solid #2980b9",
                    borderRadius: 8,
                    padding: 16,
                  }}
                >
                  <h4 style={{ fontSize: 14, color: "#1a5276", marginBottom: 8 }}>
                    Recommended Next Actions
                  </h4>
                  <ul
                    style={{
                      fontSize: 13,
                      lineHeight: 1.8,
                      paddingLeft: 16,
                    }}
                  >
                    <li>
                      <strong>FranceTech SARL:</strong> Send product one-pager
                      + propose 15-min call (highest probability: 70%)
                    </li>
                    <li>
                      <strong>BelgaTech:</strong> Switch to LinkedIn DM —
                      Sophie opened email but didn't reply
                    </li>
                    <li>
                      <strong>Nordic Clean:</strong> Offer comparison demo,
                      they're in active evaluation
                    </li>
                    <li>
                      <strong>Osterreich:</strong> Don't push yet — nurture with
                      webinar invite
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: Performance Metrics ── */}
        {activeTab === "performance" && (
          <>
            <div className="grid-2">
              <div className="card">
                <div className="card-header">
                  <h3>Outreach Performance</h3>
                </div>
                <div className="card-body" style={{ padding: 0 }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Metric</th>
                        <th>Value</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {outreachPerformance.map((m, i) => (
                        <tr key={i}>
                          <td style={{ fontWeight: 600 }}>{m.metric}</td>
                          <td style={{ fontSize: 18, fontWeight: 700 }}>
                            {m.value}
                          </td>
                          <td>
                            {m.metric === "Meetings Booked" ? (
                              <span className="badge orange">
                                <AlertCircle
                                  size={12}
                                  style={{ marginRight: 4 }}
                                />
                                Target: {"\u2265"}1
                              </span>
                            ) : m.metric === "Open Rate" ? (
                              <span className="badge green">Excellent</span>
                            ) : m.metric === "AI Context Usage" ? (
                              <span className="badge green">
                                Target exceeded
                              </span>
                            ) : (
                              <span className="badge blue">On Track</span>
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
                  <h3>Channel Performance</h3>
                </div>
                <div className="card-body">
                  <div style={{ height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          {
                            channel: "Email",
                            sent: 3,
                            opened: 3,
                            replied: 0,
                          },
                          {
                            channel: "LinkedIn",
                            sent: 2,
                            opened: 1,
                            replied: 1,
                          },
                        ]}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#ecf0f1"
                        />
                        <XAxis dataKey="channel" />
                        <YAxis />
                        <Tooltip />
                        <Bar
                          dataKey="sent"
                          fill="#3498db"
                          name="Sent"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar
                          dataKey="opened"
                          fill="#27ae60"
                          name="Opened"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar
                          dataKey="replied"
                          fill="#f39c12"
                          name="Replied"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div
                    style={{
                      marginTop: 12,
                      fontSize: 13,
                      color: "#7f8c8d",
                      textAlign: "center",
                    }}
                  >
                    LinkedIn shows better reply rate (50%) vs Email (0%) —
                    consider shifting more outreach to LinkedIn
                  </div>
                </div>
              </div>
            </div>

            {/* POC Target Summary */}
            <div className="card" style={{ marginTop: 24 }}>
              <div className="card-header">
                <h3>POC Objective #4 — Progress</h3>
              </div>
              <div className="card-body">
                <div style={{ display: "flex", gap: 24 }}>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{ marginBottom: 12 }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: 14,
                          marginBottom: 4,
                        }}
                      >
                        <span>
                          AI-suggested context used in outreach
                        </span>
                        <span style={{ fontWeight: 600, color: "#27ae60" }}>
                          100% (target: {"\u2265"}50%)
                        </span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-bar-fill on-track"
                          style={{ width: "100%" }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: 14,
                          marginBottom: 4,
                        }}
                      >
                        <span>
                          Meetings booked from POC leads
                        </span>
                        <span style={{ fontWeight: 600, color: "#e74c3c" }}>
                          0 / 1 (target: {"\u2265"}1)
                        </span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-bar-fill at-risk"
                          style={{ width: "0%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      minWidth: 200,
                      background: "#f8fafc",
                      padding: 16,
                      borderRadius: 8,
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{ fontSize: 12, color: "#7f8c8d", marginBottom: 4 }}
                    >
                      Weeks Remaining
                    </div>
                    <div
                      style={{ fontSize: 36, fontWeight: 700, color: "#f39c12" }}
                    >
                      6
                    </div>
                    <div style={{ fontSize: 12, color: "#7f8c8d" }}>
                      of 10-week target
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ═══ Follow-Up Modal ═══ */}
      {followUpModal && (
        <div className="sa-modal-overlay" onClick={() => setFollowUpModal(null)}>
          <div className="sa-modal" onClick={(e) => e.stopPropagation()}>
            <div className="sa-modal-header">
              <div>
                <h3 style={{ margin: 0, fontSize: 17 }}>Choose Follow-Up Type</h3>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "#7f8c8d" }}>
                  {followUpModal.contact} at {followUpModal.company}
                </p>
              </div>
              <button className="sa-modal-close" onClick={() => setFollowUpModal(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="sa-modal-body">
              {FOLLOW_UP_TYPES.map((type) => (
                <button
                  key={type.key}
                  className="sa-followup-option"
                  onClick={() => handleFollowUp(type, followUpModal)}
                >
                  <div
                    className="sa-followup-icon"
                    style={{ background: type.color + "18", color: type.color }}
                  >
                    <type.icon size={20} />
                  </div>
                  <div style={{ flex: 1, textAlign: "left" }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{type.label}</div>
                    <div style={{ fontSize: 12, color: "#7f8c8d" }}>{type.desc}</div>
                  </div>
                  <ArrowRight size={16} style={{ color: "#bdc3c7" }} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══ Create Opportunity Modal ═══ */}
      {showCreateOpp && (
        <div className="sa-modal-overlay" onClick={() => setShowCreateOpp(false)}>
          <div className="sa-modal" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
            <div className="sa-modal-header">
              <h3 style={{ margin: 0, fontSize: 17 }}>Create Opportunity</h3>
              <button className="sa-modal-close" onClick={() => setShowCreateOpp(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="sa-modal-body">
              <div className="sa-form-grid">
                <div className="sa-form-group">
                  <label>Company *</label>
                  <input
                    type="text"
                    placeholder="e.g. Acme Field Services GmbH"
                    value={newOpp.company}
                    onChange={(e) => setNewOpp({ ...newOpp, company: e.target.value })}
                  />
                </div>
                <div className="sa-form-group">
                  <label>Contact Name</label>
                  <input
                    type="text"
                    placeholder="e.g. John Smith"
                    value={newOpp.contact}
                    onChange={(e) => setNewOpp({ ...newOpp, contact: e.target.value })}
                  />
                </div>
                <div className="sa-form-group">
                  <label>Title / Role</label>
                  <input
                    type="text"
                    placeholder="e.g. VP Operations"
                    value={newOpp.title}
                    onChange={(e) => setNewOpp({ ...newOpp, title: e.target.value })}
                  />
                </div>
                <div className="sa-form-group">
                  <label>Deal Value ({"\u20AC"}) *</label>
                  <input
                    type="number"
                    placeholder="e.g. 50000"
                    value={newOpp.value}
                    onChange={(e) => setNewOpp({ ...newOpp, value: e.target.value })}
                  />
                </div>
                <div className="sa-form-group">
                  <label>Stage</label>
                  <select
                    value={newOpp.stage}
                    onChange={(e) => setNewOpp({ ...newOpp, stage: e.target.value })}
                  >
                    <option value="created">Created</option>
                    <option value="negotiation">Negotiation</option>
                  </select>
                </div>
                <div className="sa-form-group">
                  <label>Source</label>
                  <input
                    type="text"
                    placeholder="e.g. AI Signal — LinkedIn Post"
                    value={newOpp.source}
                    onChange={(e) => setNewOpp({ ...newOpp, source: e.target.value })}
                  />
                </div>
              </div>
              <div className="sa-form-group" style={{ marginTop: 12 }}>
                <label>Notes</label>
                <textarea
                  rows={3}
                  placeholder="Additional context about this opportunity..."
                  value={newOpp.notes}
                  onChange={(e) => setNewOpp({ ...newOpp, notes: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #e0e6ed",
                    borderRadius: 8,
                    fontSize: 13,
                    resize: "vertical",
                    fontFamily: "inherit",
                  }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20 }}>
                <button className="btn btn-outline" onClick={() => setShowCreateOpp(false)}>
                  Cancel
                </button>
                <button
                  className="btn btn-success"
                  onClick={handleCreateOpportunity}
                  disabled={!newOpp.company || !newOpp.value}
                  style={{ opacity: !newOpp.company || !newOpp.value ? 0.5 : 1 }}
                >
                  <Plus size={14} /> Create Opportunity
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="toast">
          <CheckCircle size={16} />
          {toast}
        </div>
      )}
    </>
  );
};

export default SalesAction;
