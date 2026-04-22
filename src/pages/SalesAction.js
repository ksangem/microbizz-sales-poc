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
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  FunnelChart,
  Funnel,
  LabelList,
  Cell,
} from "recharts";
import {
  salesActivities,
  meetingsPipeline,
  conversionFunnel,
  outreachPerformance,
} from "../data/mockData";

const SalesAction = () => {
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("activity");
  const [activities, setActivities] = useState(salesActivities);

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

  const funnelData = conversionFunnel.map((item) => ({
    ...item,
    name: item.stage,
    value: item.count || 0.5,
  }));

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-left">
          <h1>Sales Action</h1>
          <p>
            Outreach tracking, meeting pipeline, and conversion funnel
          </p>
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
        <div className="stats-grid">
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
              <div className="stat-icon red">
                <Calendar size={20} />
              </div>
            </div>
            <div className="stat-value">0</div>
            <div className="stat-label">
              Meetings Booked
              <div style={{ fontSize: 10, color: "#e74c3c" }}>
                Target: ≥1
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tab-nav">
          {[
            { key: "activity", label: "Outreach Activity" },
            { key: "pipeline", label: "Meeting Pipeline" },
            { key: "funnel", label: "Conversion Funnel" },
            { key: "performance", label: "Performance Metrics" },
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
                          : "—"}
                      </td>
                      <td style={{ fontSize: 13 }}>
                        {act.repliedAt ? (
                          <span className="badge green">Yes</span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: 4 }}>
                          <button
                            className="btn btn-sm btn-outline"
                            onClick={() =>
                              showToast(`Scheduling follow-up for ${act.contact}`)
                            }
                          >
                            Follow-Up
                          </button>
                          {act.status === "opened" && !act.repliedAt && (
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() =>
                                showToast(
                                  `Sending follow-up to ${act.contact}...`
                                )
                              }
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
                      100% of outreach uses AI-suggested context (target: ≥50%)
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
                      0 meetings booked yet (target: ≥1 by Week 10) — 6 weeks
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
                                Target: ≥1
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
                          100% (target: ≥50%)
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
                          0 / 1 (target: ≥1)
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
