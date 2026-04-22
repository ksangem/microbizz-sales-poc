import React, { useState } from "react";
import {
  UserCheck,
  CheckCircle,
  Shield,
  Mail,
  Phone,
  ExternalLink,
  Database,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  AlertCircle,
  Sliders,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { enrichmentPipeline, scoringModel } from "../data/mockData";

const EnrichScore = () => {
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("pipeline");
  const [expandedRow, setExpandedRow] = useState(null);
  const [selectedLead, setSelectedLead] = useState(enrichmentPipeline[0]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const completedCount = enrichmentPipeline.filter(
    (e) => e.status === "complete"
  ).length;
  const emailVerified = enrichmentPipeline.filter(
    (e) => e.emailVerified
  ).length;
  const phoneVerified = enrichmentPipeline.filter(
    (e) => e.phoneVerified
  ).length;

  const scoringBarData = selectedLead
    ? [
        { name: "ICP Fit", value: selectedLead.icpFit, fill: "#2980b9" },
        { name: "Intent", value: selectedLead.intentScore, fill: "#9b59b6" },
        { name: "Recency", value: selectedLead.signalRecency, fill: "#27ae60" },
        { name: "Relevance", value: selectedLead.signalRelevance, fill: "#f39c12" },
        { name: "Title Match", value: selectedLead.titleMatch, fill: "#e67e22" },
        { name: "Engagement", value: selectedLead.engagementHistory, fill: "#3498db" },
      ]
    : [];

  const icpRadarData = selectedLead
    ? [
        { metric: "Industry", value: selectedLead.icpBreakdown.industryFit },
        { metric: "Size", value: selectedLead.icpBreakdown.sizeFit },
        { metric: "Geography", value: selectedLead.icpBreakdown.geoFit },
        { metric: "Operations", value: selectedLead.icpBreakdown.operationalFit },
      ]
    : [];

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-left">
          <h1>Enrich & Score</h1>
          <p>
            ZoomInfo enrichment, ICP fit scoring, and lead ranking model
          </p>
        </div>
        <div className="top-bar-right">
          <div className="sync-indicator">
            <span className="sync-dot"></span>
            ZoomInfo Connected
          </div>
          <button
            className="btn btn-primary"
            onClick={() =>
              showToast("Running enrichment on all pending accounts...")
            }
          >
            <RefreshCw size={14} /> Run Enrichment
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
                <Database size={20} />
              </div>
            </div>
            <div className="stat-value">{enrichmentPipeline.length}</div>
            <div className="stat-label">Total Accounts</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon green">
                <UserCheck size={20} />
              </div>
            </div>
            <div className="stat-value">{completedCount}</div>
            <div className="stat-label">
              Enriched (
              {Math.round((completedCount / enrichmentPipeline.length) * 100)}%)
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon orange">
                <Mail size={20} />
              </div>
            </div>
            <div className="stat-value">{emailVerified}</div>
            <div className="stat-label">Emails Verified</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon red">
                <Phone size={20} />
              </div>
            </div>
            <div className="stat-value">{phoneVerified}</div>
            <div className="stat-label">Phones Verified</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tab-nav">
          {[
            { key: "pipeline", label: "Enrichment Pipeline" },
            { key: "scoring", label: "Scoring Model" },
            { key: "icp", label: "ICP Configuration" },
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

        {/* ── Tab: Enrichment Pipeline ── */}
        {activeTab === "pipeline" && (
          <div className="card">
            <div className="card-header">
              <h3>Account Enrichment Pipeline</h3>
              <span className="badge green">
                {completedCount}/{enrichmentPipeline.length} Complete — Target:
                ≥80%
              </span>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Decision Maker</th>
                    <th>Source</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>LinkedIn</th>
                    <th>ICP Fit</th>
                    <th>Intent</th>
                    <th>Overall</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {enrichmentPipeline.map((item) => (
                    <React.Fragment key={item.id}>
                      <tr
                        onClick={() => setSelectedLead(item)}
                        style={{
                          background:
                            selectedLead?.id === item.id
                              ? "#f0f7ff"
                              : "transparent",
                        }}
                      >
                        <td style={{ fontWeight: 600 }}>{item.company}</td>
                        <td>
                          {item.contact ? (
                            <>
                              <div>{item.contact}</div>
                              <div style={{ fontSize: 12, color: "#7f8c8d" }}>
                                {item.title}
                              </div>
                            </>
                          ) : (
                            <span className="badge orange">Not Identified</span>
                          )}
                        </td>
                        <td>
                          {item.enrichmentSource ? (
                            <span className="badge blue">
                              {item.enrichmentSource}
                            </span>
                          ) : (
                            <span className="badge gray">Pending</span>
                          )}
                        </td>
                        <td>
                          {item.emailVerified ? (
                            <CheckCircle
                              size={16}
                              style={{ color: "#27ae60" }}
                            />
                          ) : (
                            <AlertCircle
                              size={16}
                              style={{ color: "#e74c3c" }}
                            />
                          )}
                        </td>
                        <td>
                          {item.phoneVerified ? (
                            <CheckCircle
                              size={16}
                              style={{ color: "#27ae60" }}
                            />
                          ) : (
                            <AlertCircle
                              size={16}
                              style={{ color: "#e74c3c" }}
                            />
                          )}
                        </td>
                        <td>
                          {item.linkedinVerified ? (
                            <CheckCircle
                              size={16}
                              style={{ color: "#27ae60" }}
                            />
                          ) : (
                            <AlertCircle
                              size={16}
                              style={{ color: "#e74c3c" }}
                            />
                          )}
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              item.icpFit >= 85
                                ? "green"
                                : item.icpFit >= 70
                                ? "orange"
                                : "red"
                            }`}
                          >
                            {item.icpFit}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              item.intentScore >= 85
                                ? "green"
                                : item.intentScore >= 70
                                ? "orange"
                                : "red"
                            }`}
                          >
                            {item.intentScore}
                          </span>
                        </td>
                        <td>
                          <div className="score-bar-container">
                            <div className="score-bar" style={{ width: 50 }}>
                              <div
                                className={`score-bar-fill ${
                                  item.overallScore >= 80
                                    ? "high"
                                    : item.overallScore >= 60
                                    ? "medium"
                                    : "low"
                                }`}
                                style={{ width: `${item.overallScore}%` }}
                              ></div>
                            </div>
                            <span
                              className={`score-value ${
                                item.overallScore >= 80
                                  ? "high"
                                  : item.overallScore >= 60
                                  ? "medium"
                                  : "low"
                              }`}
                            >
                              {item.overallScore}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              item.status === "complete" ? "green" : "orange"
                            }`}
                          >
                            {item.status === "complete"
                              ? "Complete"
                              : "Pending"}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedRow(
                                expandedRow === item.id ? null : item.id
                              );
                            }}
                          >
                            {expandedRow === item.id ? (
                              <ChevronUp size={12} />
                            ) : (
                              <ChevronDown size={12} />
                            )}
                          </button>
                        </td>
                      </tr>
                      {expandedRow === item.id && (
                        <tr>
                          <td
                            colSpan={11}
                            style={{ background: "#f8fafc", padding: 20 }}
                          >
                            <div style={{ display: "flex", gap: 32 }}>
                              {/* Firmographics */}
                              <div style={{ flex: 1 }}>
                                <h4
                                  style={{
                                    fontSize: 12,
                                    textTransform: "uppercase",
                                    letterSpacing: 1,
                                    color: "#7f8c8d",
                                    marginBottom: 10,
                                  }}
                                >
                                  Company Firmographics
                                </h4>
                                <div className="lead-detail-row">
                                  <span className="label">Industry</span>
                                  <span className="value">
                                    {item.firmographics.industry}
                                  </span>
                                </div>
                                <div className="lead-detail-row">
                                  <span className="label">Employees</span>
                                  <span className="value">
                                    {item.firmographics.employees}
                                  </span>
                                </div>
                                <div className="lead-detail-row">
                                  <span className="label">Revenue</span>
                                  <span className="value">
                                    {item.firmographics.revenue}
                                  </span>
                                </div>
                                <div className="lead-detail-row">
                                  <span className="label">Founded</span>
                                  <span className="value">
                                    {item.firmographics.founded}
                                  </span>
                                </div>
                                <div className="lead-detail-row">
                                  <span className="label">HQ</span>
                                  <span className="value">
                                    {item.firmographics.hq}
                                  </span>
                                </div>
                              </div>
                              {/* ICP Breakdown */}
                              <div style={{ flex: 1 }}>
                                <h4
                                  style={{
                                    fontSize: 12,
                                    textTransform: "uppercase",
                                    letterSpacing: 1,
                                    color: "#7f8c8d",
                                    marginBottom: 10,
                                  }}
                                >
                                  ICP Fit Breakdown
                                </h4>
                                {Object.entries(item.icpBreakdown).map(
                                  ([key, val]) => (
                                    <div
                                      key={key}
                                      style={{ marginBottom: 8 }}
                                    >
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                          fontSize: 13,
                                          marginBottom: 4,
                                        }}
                                      >
                                        <span>
                                          {key
                                            .replace("Fit", " Fit")
                                            .replace(
                                              /([A-Z])/g,
                                              " $1"
                                            )
                                            .trim()}
                                        </span>
                                        <span style={{ fontWeight: 600 }}>
                                          {val}%
                                        </span>
                                      </div>
                                      <div className="progress-bar">
                                        <div
                                          className={`progress-bar-fill ${
                                            val >= 85
                                              ? "on-track"
                                              : "in-progress"
                                          }`}
                                          style={{ width: `${val}%` }}
                                        ></div>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                              {/* Actions */}
                              <div style={{ flex: 1 }}>
                                <h4
                                  style={{
                                    fontSize: 12,
                                    textTransform: "uppercase",
                                    letterSpacing: 1,
                                    color: "#7f8c8d",
                                    marginBottom: 10,
                                  }}
                                >
                                  Actions
                                </h4>
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 8,
                                  }}
                                >
                                  {item.status === "pending" ? (
                                    <button
                                      className="btn btn-success"
                                      onClick={() =>
                                        showToast(
                                          `Running ZoomInfo enrichment for ${item.company}...`
                                        )
                                      }
                                    >
                                      <Database size={14} /> Run Enrichment
                                    </button>
                                  ) : (
                                    <button
                                      className="btn btn-primary"
                                      onClick={() =>
                                        showToast(
                                          `Pushing ${item.company} scores to HubSpot`
                                        )
                                      }
                                    >
                                      <ArrowRight size={14} /> Push to HubSpot
                                    </button>
                                  )}
                                  <button
                                    className="btn btn-outline"
                                    onClick={() =>
                                      showToast(
                                        `Generating outreach for ${item.contact}...`
                                      )
                                    }
                                  >
                                    Generate Outreach
                                  </button>
                                  <button
                                    className="btn btn-outline"
                                    onClick={() =>
                                      showToast("Re-enriching with latest data...")
                                    }
                                  >
                                    <RefreshCw size={14} /> Re-Enrich
                                  </button>
                                </div>
                                {item.enrichedAt && (
                                  <p
                                    style={{
                                      fontSize: 11,
                                      color: "#7f8c8d",
                                      marginTop: 12,
                                    }}
                                  >
                                    Last enriched:{" "}
                                    {new Date(item.enrichedAt).toLocaleDateString()}
                                  </p>
                                )}
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
        )}

        {/* ── Tab: Scoring Model ── */}
        {activeTab === "scoring" && (
          <>
            <div className="grid-2">
              {/* Score Breakdown for Selected Lead */}
              <div className="card">
                <div className="card-header">
                  <h3>
                    Score Breakdown:{" "}
                    {selectedLead?.contact || "Select a lead"}
                  </h3>
                  <select
                    style={{
                      padding: "6px 10px",
                      border: "1px solid #e0e6ed",
                      borderRadius: 6,
                      fontSize: 13,
                    }}
                    value={selectedLead?.id || ""}
                    onChange={(e) =>
                      setSelectedLead(
                        enrichmentPipeline.find(
                          (l) => l.id === parseInt(e.target.value)
                        )
                      )
                    }
                  >
                    {enrichmentPipeline
                      .filter((l) => l.contact)
                      .map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.contact} — {l.company}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="card-body">
                  <div style={{ height: 280 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={scoringBarData} layout="vertical">
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#ecf0f1"
                        />
                        <XAxis type="number" domain={[0, 100]} />
                        <YAxis
                          type="category"
                          dataKey="name"
                          width={100}
                          tick={{ fontSize: 12 }}
                        />
                        <Tooltip />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                          {scoringBarData.map((entry, i) => (
                            <React.Fragment key={i}>
                              {/* Custom fill via data */}
                            </React.Fragment>
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  {selectedLead && (
                    <div
                      style={{
                        textAlign: "center",
                        marginTop: 16,
                        padding: 16,
                        background: "#f8fafc",
                        borderRadius: 8,
                      }}
                    >
                      <span style={{ fontSize: 14, color: "#7f8c8d" }}>
                        Overall Score:{" "}
                      </span>
                      <span
                        style={{
                          fontSize: 32,
                          fontWeight: 700,
                          color:
                            selectedLead.overallScore >= 80
                              ? "#27ae60"
                              : "#f39c12",
                        }}
                      >
                        {selectedLead.overallScore}
                      </span>
                      <span style={{ fontSize: 14, color: "#7f8c8d" }}>
                        {" "}
                        / 100
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* ICP Radar */}
              <div className="card">
                <div className="card-header">
                  <h3>ICP Fit Analysis</h3>
                </div>
                <div className="card-body">
                  <div style={{ height: 280 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={icpRadarData}>
                        <PolarGrid stroke="#ecf0f1" />
                        <PolarAngleAxis
                          dataKey="metric"
                          tick={{ fontSize: 12 }}
                        />
                        <PolarRadiusAxis
                          angle={90}
                          domain={[0, 100]}
                          tick={{ fontSize: 10 }}
                        />
                        <Radar
                          name="ICP Fit"
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
                  {selectedLead && (
                    <div
                      style={{
                        textAlign: "center",
                        marginTop: 8,
                        fontSize: 13,
                        color: "#7f8c8d",
                      }}
                    >
                      {selectedLead.company} — {selectedLead.firmographics.hq}
                      <br />
                      {selectedLead.firmographics.employees} employees,{" "}
                      {selectedLead.firmographics.revenue} revenue
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Scoring Weights */}
            <div className="card">
              <div className="card-header">
                <h3>
                  <Sliders
                    size={16}
                    style={{ marginRight: 8, verticalAlign: "middle" }}
                  />
                  Lead Scoring Model — Weight Configuration
                </h3>
              </div>
              <div className="card-body" style={{ padding: 0 }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Scoring Factor</th>
                      <th>Weight</th>
                      <th>Description</th>
                      <th>Visual</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scoringModel.weights.map((w, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 600 }}>{w.factor}</td>
                        <td>
                          <span className="badge blue">{w.weight}%</span>
                        </td>
                        <td style={{ fontSize: 13, color: "#555" }}>
                          {w.description}
                        </td>
                        <td>
                          <div className="progress-bar" style={{ width: 120 }}>
                            <div
                              className="progress-bar-fill in-progress"
                              style={{ width: `${w.weight * 3.33}%` }}
                            ></div>
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

        {/* ── Tab: ICP Configuration ── */}
        {activeTab === "icp" && (
          <>
            <div className="card" style={{ marginBottom: 24 }}>
              <div className="card-header">
                <h3>Ideal Customer Profile (ICP) Definition</h3>
                <span style={{ fontSize: 12, color: "#7f8c8d" }}>
                  Defined in Phase 1 with Robin Montens
                </span>
              </div>
              <div className="card-body" style={{ padding: 0 }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Criterion</th>
                      <th>Ideal Profile</th>
                      <th>Weight</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scoringModel.icpCriteria.map((c, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 600 }}>{c.criterion}</td>
                        <td style={{ fontSize: 14 }}>{c.ideal}</td>
                        <td>
                          <span className="badge blue">{c.weight}%</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid-2">
              <div className="card">
                <div className="card-header">
                  <h3>Target Decision-Maker Titles</h3>
                </div>
                <div className="card-body">
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {[
                      "Head of Operations",
                      "Fleet Manager",
                      "IT Director",
                      "COO",
                      "CTO",
                      "VP Operations",
                      "Operations Director",
                      "Head of Digital",
                      "Service Delivery Manager",
                      "Field Operations Manager",
                    ].map((t) => (
                      <span
                        key={t}
                        className="badge blue"
                        style={{ padding: "6px 12px" }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3>Target Geographies</h3>
                </div>
                <div className="card-body">
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {[
                      "Germany",
                      "France",
                      "Sweden",
                      "Belgium",
                      "Switzerland",
                      "Austria",
                      "Denmark",
                      "Netherlands",
                      "United Kingdom",
                      "Norway",
                    ].map((c) => (
                      <span
                        key={c}
                        className="badge green"
                        style={{ padding: "6px 12px" }}
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                  <p
                    style={{
                      marginTop: 12,
                      fontSize: 12,
                      color: "#7f8c8d",
                    }}
                  >
                    European market — GDPR-compliant operations only
                  </p>
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

export default EnrichScore;
