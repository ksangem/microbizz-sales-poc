import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  Filter,
  CheckCircle,
  Shield,
  TrendingUp,
  Users,
  Info,
  Settings,
} from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { leads } from "../data/mockData";
import LeadDetailPanel from "../components/LeadDetailPanel";

/* G-01: Inline InfoTooltip component */
const InfoTooltip = ({ text }) => {
  const [show, setShow] = useState(false);
  return (
    <span
      style={{ position: "relative", display: "inline-flex", alignItems: "center", marginLeft: 6, cursor: "help" }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <Info size={15} style={{ color: "#7f8c8d" }} />
      {show && (
        <span
          style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#2c3e50",
            color: "#fff",
            fontSize: 12,
            padding: "8px 12px",
            borderRadius: 6,
            whiteSpace: "nowrap",
            maxWidth: 340,
            whiteSpace: "normal",
            zIndex: 1000,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            lineHeight: 1.4,
          }}
        >
          {text}
        </span>
      )}
    </span>
  );
};

/* SC-02: Helper to determine recommended action based on score */
const getRecommendedAction = (score) => {
  if (score >= 80) {
    return { label: "Trigger outreach now", color: "green" };
  } else if (score >= 50) {
    return { label: "Monitor \u2014 re-enrich in 7 days", color: "orange" };
  } else {
    return { label: "Low priority", color: "gray" };
  }
};

const LeadScoring = () => {
  const navigate = useNavigate();
  const [selectedLead, setSelectedLead] = useState(null);
  const [sortBy, setSortBy] = useState("overallScore");
  const [filterCountry, setFilterCountry] = useState("all");

  const sortedLeads = [...leads]
    .filter((l) => filterCountry === "all" || l.country === filterCountry)
    .sort((a, b) => b[sortBy] - a[sortBy]);

  const countries = [...new Set(leads.map((l) => l.country))];

  const enrichedCount = leads.filter((l) => l.enriched).length;
  const verifiedCount = leads.filter((l) => l.verified).length;
  const avgScore = Math.round(
    leads.reduce((sum, l) => sum + l.overallScore, 0) / leads.length
  );

  const radarData = selectedLead
    ? [
        { metric: "ICP Fit", value: selectedLead.icpFit },
        { metric: "Intent", value: selectedLead.intentScore },
        { metric: "Engagement", value: selectedLead.engagementScore },
        { metric: "Signals", value: Math.min(selectedLead.signals * 25, 100) },
        { metric: "Verified", value: selectedLead.verified ? 100 : 30 },
      ]
    : [];

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-left">
          <h1>Lead Scoring & Ranking</h1>
          <p>
            ICP fit, intent signals, and engagement — ranked in HubSpot
          </p>
        </div>
        <div className="top-bar-right">
          <div className="sync-indicator">
            <span className="sync-dot"></span>
            HubSpot Synced
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
                <Users size={20} />
              </div>
            </div>
            <div className="stat-value">{leads.length}</div>
            <div className="stat-label">Total Leads</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon green">
                <CheckCircle size={20} />
              </div>
            </div>
            <div className="stat-value">{enrichedCount}</div>
            <div className="stat-label">
              Enriched ({Math.round((enrichedCount / leads.length) * 100)}%)
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon orange">
                <Shield size={20} />
              </div>
            </div>
            <div className="stat-value">{verifiedCount}</div>
            <div className="stat-label">Contacts Verified</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon red">
                <TrendingUp size={20} />
              </div>
            </div>
            <div className="stat-value">{avgScore}</div>
            <div className="stat-label">Avg. Lead Score</div>
          </div>
        </div>

        {/* SC-01: Info callout banner */}
        <div
          style={{
            background: "#ebf5fb",
            border: "1px solid #aed6f1",
            borderRadius: 8,
            padding: "12px 20px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 16,
            fontSize: 14,
            color: "#2c3e50",
          }}
        >
          <Info size={18} style={{ color: "#2980b9", flexShrink: 0 }} />
          Scoring model is configured once and applied automatically to all leads. No manual scoring required per lead.
        </div>

        {/* Filters */}
        <div className="filter-bar">
          <Filter size={16} style={{ color: "#7f8c8d" }} />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="overallScore">Sort by Overall Score</option>
            <option value="icpFit">Sort by ICP Fit</option>
            <option value="intentScore">Sort by Intent Score</option>
            <option value="engagementScore">Sort by Engagement</option>
          </select>
          <select
            value={filterCountry}
            onChange={(e) => setFilterCountry(e.target.value)}
          >
            <option value="all">All Countries</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {/* SC-03: Configure Scoring Model button */}
          <button
            className="btn btn-primary"
            style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}
            onClick={() => navigate("/enrich?tab=scoring")}
          >
            <Settings size={14} />
            Configure Scoring Model
          </button>
        </div>

        <div style={{ display: "flex", gap: 24 }}>
          {/* Lead Table */}
          <div className="card" style={{ flex: 2 }}>
            <div className="card-header">
              <h3 style={{ display: "flex", alignItems: "center" }}>
                Ranked Leads
                <InfoTooltip text="All leads ranked by AI scoring. Click any lead to view their detailed scoring profile and signal history." />
              </h3>
              <span className="badge green">Updated Daily</span>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Contact</th>
                    <th>Company</th>
                    <th>Country</th>
                    <th>ICP Fit</th>
                    <th>Intent</th>
                    <th>Overall</th>
                    <th>Recommended Action</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedLeads.map((lead, index) => {
                    const action = getRecommendedAction(lead.overallScore);
                    return (
                      <tr
                        key={lead.id}
                        onClick={() => setSelectedLead(lead)}
                        style={{
                          background:
                            selectedLead?.id === lead.id
                              ? "#f0f7ff"
                              : "transparent",
                        }}
                      >
                        <td style={{ fontWeight: 700, color: "#7f8c8d" }}>
                          {index + 1}
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{lead.contact}</div>
                          <div style={{ fontSize: 12, color: "#7f8c8d" }}>
                            {lead.title}
                          </div>
                        </td>
                        <td>{lead.company}</td>
                        <td style={{ fontSize: 13 }}>{lead.country}</td>
                        <td>
                          <span
                            className={`badge ${
                              lead.icpFit >= 85
                                ? "green"
                                : lead.icpFit >= 70
                                ? "orange"
                                : "red"
                            }`}
                          >
                            {lead.icpFit}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              lead.intentScore >= 85
                                ? "green"
                                : lead.intentScore >= 70
                                ? "orange"
                                : "red"
                            }`}
                          >
                            {lead.intentScore}
                          </span>
                        </td>
                        <td>
                          <div className="score-bar-container">
                            <div className="score-bar" style={{ width: 50 }}>
                              <div
                                className={`score-bar-fill ${
                                  lead.overallScore >= 80
                                    ? "high"
                                    : lead.overallScore >= 60
                                    ? "medium"
                                    : "low"
                                }`}
                                style={{
                                  width: `${lead.overallScore}%`,
                                }}
                              ></div>
                            </div>
                            <span
                              className={`score-value ${
                                lead.overallScore >= 80
                                  ? "high"
                                  : lead.overallScore >= 60
                                  ? "medium"
                                  : "low"
                              }`}
                            >
                              {lead.overallScore}
                            </span>
                          </div>
                        </td>
                        {/* SC-02: Recommended Action column */}
                        <td>
                          <span
                            className={`badge ${action.color}`}
                            style={{ fontSize: 11, whiteSpace: "nowrap" }}
                          >
                            {action.label}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              lead.verified ? "green" : "orange"
                            }`}
                          >
                            {lead.verified ? "Verified" : "Pending"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Radar Chart for selected lead */}
          <div className="card" style={{ flex: 1, minWidth: 320 }}>
            <div className="card-header">
              <h3 style={{ display: "flex", alignItems: "center" }}>
                Lead Profile
                <InfoTooltip text="Detailed breakdown of the selected lead's scoring across ICP fit, intent, engagement, and verification metrics." />
              </h3>
            </div>
            <div className="card-body">
              {selectedLead ? (
                <>
                  <div style={{ textAlign: "center", marginBottom: 16 }}>
                    <h4 style={{ fontSize: 16 }}>{selectedLead.contact}</h4>
                    <p style={{ fontSize: 13, color: "#7f8c8d" }}>
                      {selectedLead.title}
                    </p>
                    <p style={{ fontSize: 13, color: "#7f8c8d" }}>
                      {selectedLead.company}
                    </p>
                  </div>
                  <div style={{ height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="#ecf0f1" />
                        <PolarAngleAxis
                          dataKey="metric"
                          tick={{ fontSize: 11 }}
                        />
                        <PolarRadiusAxis
                          angle={90}
                          domain={[0, 100]}
                          tick={{ fontSize: 10 }}
                        />
                        <Radar
                          name="Score"
                          dataKey="value"
                          stroke="#2980b9"
                          fill="#2980b9"
                          fillOpacity={0.25}
                          strokeWidth={2}
                        />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <div style={{ marginTop: 16 }}>
                    <div className="lead-detail-row">
                      <span className="label">Industry</span>
                      <span className="value">{selectedLead.industry}</span>
                    </div>
                    <div className="lead-detail-row">
                      <span className="label">Employees</span>
                      <span className="value">{selectedLead.employees}</span>
                    </div>
                    <div className="lead-detail-row">
                      <span className="label">Signals</span>
                      <span className="value">{selectedLead.signals}</span>
                    </div>
                    <div className="lead-detail-row">
                      <span className="label">HubSpot</span>
                      <span className="badge blue">
                        {selectedLead.hubspotStatus}
                      </span>
                    </div>
                  </div>
                  <button
                    className="btn btn-primary"
                    style={{ width: "100%", marginTop: 16, justifyContent: "center" }}
                    onClick={() => {}}
                  >
                    <BarChart3 size={14} /> View Full Profile
                  </button>
                </>
              ) : (
                <div className="empty-state">
                  <BarChart3 size={48} />
                  <p>Select a lead to view their scoring profile</p>
                </div>
              )}
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

export default LeadScoring;
