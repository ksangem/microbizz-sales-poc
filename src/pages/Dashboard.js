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
        {/* Workflow Overview — All steps clickable */}
        <div className="card" style={{ marginBottom: 28 }}>
          <div className="card-header">
            <h3>POC Workflow Pipeline</h3>
            <span style={{ fontSize: 12, color: "#7f8c8d" }}>
              Click any step to open that module
            </span>
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

        {/* Stats Grid — All clickable */}
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
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid-2">
          <div className="card" style={{ cursor: "pointer" }} onClick={() => navigate("/tracker")} title="View POC Tracker">
            <div className="card-header">
              <h3>Weekly Progress</h3>
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
              <h3>Signal Sources</h3>
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

        {/* Recent Signals & Top Leads */}
        <div className="grid-2">
          <div className="card">
            <div
              className="card-header"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/signals")}
              title="View all signals"
            >
              <h3>Recent Signals</h3>
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
              <h3>Top Ranked Leads</h3>
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

        {/* Quick Access Module Cards */}
        <div style={{ marginTop: 8 }}>
          <h3 style={{ fontSize: 14, color: "#7f8c8d", marginBottom: 14, textTransform: "uppercase", letterSpacing: 1 }}>
            Quick Access
          </h3>
          <div className="stats-grid">
            <div
              className="stat-card"
              style={{ cursor: "pointer", borderTop: "3px solid #3498db" }}
              onClick={() => navigate("/outreach")}
              title="Outreach Assist"
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Outreach Assist</div>
                  <div style={{ fontSize: 12, color: "#7f8c8d" }}>AI-generated messages</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span className="nav-badge" style={{ background: "#27ae60" }}>3 ready</span>
                  <ArrowRight size={16} style={{ color: "#bdc3c7" }} />
                </div>
              </div>
            </div>

            <div
              className="stat-card"
              style={{ cursor: "pointer", borderTop: "3px solid #9b59b6" }}
              onClick={() => navigate("/leads")}
              title="Lead Scoring"
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Lead Scoring</div>
                  <div style={{ fontSize: 12, color: "#7f8c8d" }}>Ranked lead list</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span className="nav-badge" style={{ background: "#27ae60" }}>8 leads</span>
                  <ArrowRight size={16} style={{ color: "#bdc3c7" }} />
                </div>
              </div>
            </div>

            <div
              className="stat-card"
              style={{ cursor: "pointer", borderTop: "3px solid #27ae60" }}
              onClick={() => navigate("/tracker")}
              title="POC Tracker"
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>POC Tracker</div>
                  <div style={{ fontSize: 12, color: "#7f8c8d" }}>Objectives & metrics</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span className="nav-badge" style={{ background: "#27ae60" }}>2 on track</span>
                  <ArrowRight size={16} style={{ color: "#bdc3c7" }} />
                </div>
              </div>
            </div>

            <div
              className="stat-card"
              style={{ cursor: "pointer", borderTop: "3px solid #e67e22" }}
              onClick={() => navigate("/settings")}
              title="Settings"
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Settings</div>
                  <div style={{ fontSize: 12, color: "#7f8c8d" }}>Integrations & config</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span className="badge green" style={{ fontSize: 10 }}>Connected</span>
                  <ArrowRight size={16} style={{ color: "#bdc3c7" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
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
