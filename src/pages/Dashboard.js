import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Radio,
  Users,
  TrendingUp,
  MessageSquare,
  ArrowUp,
  Search,
  UserCheck,
  BarChart3,
  Send,
  ArrowRight,
  ExternalLink,
  Info,
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
  Legend,
} from "recharts";
import {
  signalEvents,
  leads,
  weeklyMetrics,
  signalSourceBreakdown,
} from "../data/mockData";
import LeadDetailPanel from "../components/LeadDetailPanel";

const COLORS = ["#2980b9", "#3498db", "#f39c12", "#e67e22", "#95a5a6"];

/* G-01: Inline InfoTooltip component */
const InfoTooltip = ({ text }) => {
  const [visible, setVisible] = useState(false);
  return (
    <span
      style={{ position: "relative", display: "inline-flex", alignItems: "center", marginLeft: 8, cursor: "help" }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <Info size={15} style={{ color: "#95a5a6" }} />
      {visible && (
        <span
          style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#2c3e50",
            color: "#fff",
            fontSize: 12,
            lineHeight: 1.4,
            padding: "8px 12px",
            borderRadius: 6,
            whiteSpace: "normal",
            width: 260,
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            zIndex: 1000,
            pointerEvents: "none",
          }}
        >
          {text}
        </span>
      )}
    </span>
  );
};

const Dashboard = () => {
  const [selectedLead, setSelectedLead] = useState(null);
  const navigate = useNavigate();

  const topLeads = leads.slice(0, 5);
  const recentSignals = signalEvents.slice(0, 4);

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-left">
          <h1>Dashboard</h1>
          <p>AI-Driven Sales Outreach Overview</p>
        </div>
        <div className="top-bar-right">
          <div className="sync-indicator">
            <span className="sync-dot"></span>
            Live Sync
          </div>
          <span className="poc-badge">POC Week 4</span>
          <div className="user-avatar">RM</div>
        </div>
      </div>

      <div className="page-content">
        {/* D-01: Workflow Overview — removed "Click any step" prose */}
        <div className="card" style={{ marginBottom: 28 }}>
          <div className="card-header">
            <h3>POC Workflow Pipeline</h3>
          </div>
          <div className="card-body">
            <div className="workflow-diagram">
              <div
                className="workflow-step"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/signals")}
                title="Open Signal Monitor"
              >
                <div className="workflow-step-icon step1" style={{ transition: "transform 0.2s", boxShadow: "0 2px 8px rgba(52,152,219,0.3)" }}>
                  <Search size={24} />
                </div>
                <div className="workflow-step-label">1. Signal Monitor</div>
                <div className="workflow-step-sub">
                  LinkedIn, Hashtags, Forums
                </div>
                <span className="badge blue" style={{ marginTop: 6, fontSize: 10 }}>
                  28 signals <ArrowRight size={10} />
                </span>
              </div>

              <div className="workflow-arrow">→</div>

              <div
                className="workflow-step"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/enrich")}
                title="Open Enrich & Score"
              >
                <div className="workflow-step-icon step2" style={{ transition: "transform 0.2s", boxShadow: "0 2px 8px rgba(155,89,182,0.3)" }}>
                  <UserCheck size={24} />
                </div>
                <div className="workflow-step-label">2. Enrich & Score</div>
                <div className="workflow-step-sub">
                  ZoomInfo, ICP Fit, Intent
                </div>
                <span className="badge blue" style={{ marginTop: 6, fontSize: 10 }}>
                  7 enriched <ArrowRight size={10} />
                </span>
              </div>

              <div className="workflow-arrow">→</div>

              <div
                className="workflow-step"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/hubspot")}
                title="Open HubSpot Dashboard"
              >
                <div className="workflow-step-icon step3" style={{ transition: "transform 0.2s", boxShadow: "0 2px 8px rgba(39,174,96,0.3)" }}>
                  <BarChart3 size={24} />
                </div>
                <div className="workflow-step-label">3. HubSpot Dashboard</div>
                <div className="workflow-step-sub">
                  Ranked Leads, Prompts
                </div>
                <span className="badge blue" style={{ marginTop: 6, fontSize: 10 }}>
                  6 ranked <ArrowRight size={10} />
                </span>
              </div>

              <div className="workflow-arrow">→</div>

              <div
                className="workflow-step"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/sales-action")}
                title="Open Sales Action"
              >
                <div className="workflow-step-icon step4" style={{ transition: "transform 0.2s", boxShadow: "0 2px 8px rgba(230,126,34,0.3)" }}>
                  <Send size={24} />
                </div>
                <div className="workflow-step-label">4. Sales Action</div>
                <div className="workflow-step-sub">
                  Outreach, Meeting Booked
                </div>
                <span className="badge orange" style={{ marginTop: 6, fontSize: 10 }}>
                  5 sent, 0 meetings <ArrowRight size={10} />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid — D-02: Added "View →" navigation hint */}
        <div className="stats-grid">
          <div
            className="stat-card"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/signals")}
            title="View Signal Monitor"
          >
            <div className="stat-card-header">
              <div className="stat-icon blue">
                <Radio size={20} />
              </div>
              <ArrowRight size={14} style={{ color: "#bdc3c7" }} />
            </div>
            <div className="stat-value">28</div>
            <div className="stat-label">Signals This Week</div>
            <div className="stat-change up">
              <ArrowUp size={12} /> +27% vs last week
            </div>
            <div style={{ marginTop: 8, fontSize: 11, color: "#3498db", fontWeight: 500 }}>
              Go to Signal Monitor →
            </div>
          </div>

          <div
            className="stat-card"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/enrich")}
            title="View Enrich & Score"
          >
            <div className="stat-card-header">
              <div className="stat-icon green">
                <Users size={20} />
              </div>
              <ArrowRight size={14} style={{ color: "#bdc3c7" }} />
            </div>
            <div className="stat-value">7</div>
            <div className="stat-label">Enriched Leads</div>
            <div className="stat-change up">
              <ArrowUp size={12} /> 87.5% enrichment rate
            </div>
            <div style={{ marginTop: 8, fontSize: 11, color: "#27ae60", fontWeight: 500 }}>
              Go to Enrich & Score →
            </div>
          </div>

          <div
            className="stat-card"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/hubspot")}
            title="View HubSpot Dashboard"
          >
            <div className="stat-card-header">
              <div className="stat-icon orange">
                <TrendingUp size={20} />
              </div>
              <ArrowRight size={14} style={{ color: "#bdc3c7" }} />
            </div>
            <div className="stat-value">91</div>
            <div className="stat-label">Top Lead Score</div>
            <div className="stat-change up">
              <ArrowUp size={12} /> FranceTech SARL
            </div>
            <div style={{ marginTop: 8, fontSize: 11, color: "#e67e22", fontWeight: 500 }}>
              Go to HubSpot Dashboard →
            </div>
          </div>

          <div
            className="stat-card"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/sales-action")}
            title="View Sales Action"
          >
            <div className="stat-card-header">
              <div className="stat-icon red">
                <MessageSquare size={20} />
              </div>
              <ArrowRight size={14} style={{ color: "#bdc3c7" }} />
            </div>
            <div className="stat-value">5</div>
            <div className="stat-label">Outreach Messages</div>
            <div className="stat-change up">
              <ArrowUp size={12} /> 3 ready to send
            </div>
            <div style={{ marginTop: 8, fontSize: 11, color: "#e74c3c", fontWeight: 500 }}>
              Go to Sales Action →
            </div>
          </div>
        </div>

        {/* D-03: Recent Signals & Top Leads moved ABOVE charts */}
        <div className="grid-2">
          <div className="card">
            <div
              className="card-header"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/signals")}
              title="View all signals"
            >
              <h3 style={{ display: "flex", alignItems: "center" }}>
                Recent Signals
                <InfoTooltip text="New intent signals detected from LinkedIn, forums, and job postings that need your review." />
              </h3>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="badge blue">Last 48h</span>
                <button className="btn btn-sm btn-outline" onClick={(e) => { e.stopPropagation(); navigate("/signals"); }}>
                  View All <ArrowRight size={10} />
                </button>
              </div>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Signal</th>
                    <th>Relevance</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSignals.map((s) => (
                    <tr
                      key={s.id}
                      onClick={() => navigate("/signals")}
                      style={{ cursor: "pointer" }}
                      title="View in Signal Monitor"
                    >
                      <td style={{ fontWeight: 600 }}>{s.company}</td>
                      <td style={{ fontSize: 13, color: "#7f8c8d" }}>
                        {s.signal.length > 50
                          ? s.signal.substring(0, 50) + "..."
                          : s.signal}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            s.relevance >= 85 ? "green" : "orange"
                          }`}
                        >
                          {s.relevance}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <div
              className="card-header"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/hubspot")}
              title="View HubSpot Dashboard"
            >
              <h3 style={{ display: "flex", alignItems: "center" }}>
                Top Ranked Leads
                <InfoTooltip text="Leads ranked by AI scoring based on ICP fit, intent signals, and engagement data." />
              </h3>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="badge green">Updated Daily</span>
                <button className="btn btn-sm btn-outline" onClick={(e) => { e.stopPropagation(); navigate("/hubspot"); }}>
                  View All <ArrowRight size={10} />
                </button>
              </div>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Contact</th>
                    <th>Company</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {topLeads.map((l) => (
                    <tr
                      key={l.id}
                      onClick={() => setSelectedLead(l)}
                      style={{ cursor: "pointer" }}
                      title="Click to view lead details"
                    >
                      <td>
                        <div style={{ fontWeight: 600 }}>{l.contact}</div>
                        <div style={{ fontSize: 12, color: "#7f8c8d" }}>
                          {l.title}
                        </div>
                      </td>
                      <td>{l.company}</td>
                      <td>
                        <div className="score-bar-container">
                          <div className="score-bar" style={{ width: 60 }}>
                            <div
                              className={`score-bar-fill ${
                                l.overallScore >= 80
                                  ? "high"
                                  : l.overallScore >= 60
                                  ? "medium"
                                  : "low"
                              }`}
                              style={{
                                width: `${l.overallScore}%`,
                              }}
                            ></div>
                          </div>
                          <span
                            className={`score-value ${
                              l.overallScore >= 80
                                ? "high"
                                : l.overallScore >= 60
                                ? "medium"
                                : "low"
                            }`}
                          >
                            {l.overallScore}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Charts Row — now below the signals/leads tables */}
        <div className="grid-2">
          <div className="card" style={{ cursor: "pointer" }} onClick={() => navigate("/tracker")} title="View POC Tracker">
            <div className="card-header">
              <h3 style={{ display: "flex", alignItems: "center" }}>
                Weekly Progress
                <InfoTooltip text="Week-over-week trend of signals detected, leads enriched, and outreach sent." />
              </h3>
              <ArrowRight size={14} style={{ color: "#bdc3c7" }} />
            </div>
            <div className="card-body">
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyMetrics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ecf0f1" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="signals"
                      fill="#3498db"
                      name="Signals"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="enriched"
                      fill="#9b59b6"
                      name="Enriched"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="outreach"
                      fill="#27ae60"
                      name="Outreach"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="card" style={{ cursor: "pointer" }} onClick={() => navigate("/signals")} title="View Signal Sources">
            <div className="card-header">
              <h3 style={{ display: "flex", alignItems: "center" }}>
                Signal Sources
                <InfoTooltip text="Breakdown of where intent signals are being detected across monitored channels." />
              </h3>
              <ArrowRight size={14} style={{ color: "#bdc3c7" }} />
            </div>
            <div className="card-body">
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={signalSourceBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {signalSourceBreakdown.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* D-04: Quick Access section removed — redundant with stat cards and workflow */}
      </div>

      {selectedLead && (
        <LeadDetailPanel
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
        />
      )}
    </>
  );
};

export default Dashboard;
