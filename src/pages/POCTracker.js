import React from "react";
import {
  Target,
  CheckCircle,
  Clock,
  AlertTriangle,
  Calendar,
  FileText,
} from "lucide-react";
import { pocObjectives } from "../data/mockData";

const POCTracker = () => {
  const getStatusIcon = (status) => {
    switch (status) {
      case "on-track":
        return <CheckCircle size={18} style={{ color: "#27ae60" }} />;
      case "in-progress":
        return <Clock size={18} style={{ color: "#2980b9" }} />;
      case "at-risk":
        return <AlertTriangle size={18} style={{ color: "#f39c12" }} />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "on-track":
        return <span className="badge green">On Track</span>;
      case "in-progress":
        return <span className="badge blue">In Progress</span>;
      case "at-risk":
        return <span className="badge orange">At Risk</span>;
      default:
        return <span className="badge gray">{status}</span>;
    }
  };

  const risks = [
    {
      risk: "LinkedIn API restrictions limit automated signal collection",
      severity: "High",
      likelihood: "High",
      mitigation:
        "Use only public hashtag and company page monitoring; supplement with ZoomInfo intent data",
    },
    {
      risk: "GDPR non-compliance if personal data collected without consent",
      severity: "High",
      likelihood: "Medium",
      mitigation:
        "Restrict to public signals and HubSpot's consent-based records; legal review before go-live",
    },
    {
      risk: "Signal quality is low — noise exceeds useful leads",
      severity: "Medium",
      likelihood: "Medium",
      mitigation:
        "Start with narrow keyword set; iterate based on sales team feedback in Phase 3",
    },
    {
      risk: "Third-party enrichment vendor costs exceed POC budget",
      severity: "Medium",
      likelihood: "Low",
      mitigation:
        "Negotiate trial licence for POC period; include in commercial proposal",
    },
    {
      risk: "Low sales team adoption during POC",
      severity: "Medium",
      likelihood: "Low",
      mitigation:
        "Keep UX in HubSpot (no new tool); weekly check-ins with Robin",
    },
  ];

  const actionItems = [
    {
      action: "Robin reviews charter and provides feedback",
      owner: "Robin Montens",
      deadline: "Apr 24, 2026",
      status: "Pending",
    },
    {
      action: "Nalashaa revises charter based on feedback",
      owner: "Amit / Nalashaa",
      deadline: "Apr 28, 2026",
      status: "Pending",
    },
    {
      action: "Robin presents to shareholder meeting",
      owner: "Robin Montens",
      deadline: "~May 12, 2026",
      status: "Scheduled",
    },
    {
      action: "Nalashaa issues commercial proposal",
      owner: "Amit",
      deadline: "Parallel",
      status: "In Progress",
    },
    {
      action: "Align on target account list and ICP",
      owner: "Robin + Nalashaa",
      deadline: "Week 1 of POC",
      status: "Not Started",
    },
    {
      action: "Evaluate enrichment data vendor",
      owner: "Nalashaa + MicroBizz",
      deadline: "Week 1-2 of POC",
      status: "Not Started",
    },
  ];

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-left">
          <h1>POC Tracker</h1>
          <p>Objectives, risks, and action items for the 10-12 week POC</p>
        </div>
        <div className="top-bar-right">
          <span className="poc-badge">POC Week 4</span>
          <div className="user-avatar">RM</div>
        </div>
      </div>

      <div className="page-content">
        {/* POC Summary Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon green">
                <CheckCircle size={20} />
              </div>
            </div>
            <div className="stat-value">
              {pocObjectives.filter((o) => o.status === "on-track").length}
            </div>
            <div className="stat-label">On Track</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon blue">
                <Clock size={20} />
              </div>
            </div>
            <div className="stat-value">
              {pocObjectives.filter((o) => o.status === "in-progress").length}
            </div>
            <div className="stat-label">In Progress</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon orange">
                <Calendar size={20} />
              </div>
            </div>
            <div className="stat-value">4</div>
            <div className="stat-label">Current Week</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon red">
                <Target size={20} />
              </div>
            </div>
            <div className="stat-value">12</div>
            <div className="stat-label">Total Weeks</div>
          </div>
        </div>

        {/* Objectives */}
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-header">
            <h3>POC Objectives</h3>
            <span className="badge blue">4 Objectives</span>
          </div>
          <div className="card-body">
            {pocObjectives.map((obj) => (
              <div className="objective-card" key={obj.id}>
                <div className="objective-header">
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {getStatusIcon(obj.status)}
                    <h4 style={{ margin: 0 }}>
                      {obj.id}. {obj.objective}
                    </h4>
                  </div>
                  {getStatusBadge(obj.status)}
                </div>
                <div className="objective-meta">
                  <span>
                    <strong>Target:</strong> {obj.target}
                  </span>
                  <span>
                    <strong>Current:</strong> {String(obj.current)}
                  </span>
                  <span>
                    <strong>Deadline:</strong> {obj.deadline}
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className={`progress-bar-fill ${obj.status === "on-track" ? "on-track" : "in-progress"}`}
                    style={{ width: `${obj.progress}%` }}
                  ></div>
                </div>
                <div
                  style={{
                    textAlign: "right",
                    fontSize: 12,
                    color: "#7f8c8d",
                    marginTop: 4,
                  }}
                >
                  {obj.progress}% complete
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid-2">
          {/* Risks */}
          <div className="card">
            <div className="card-header">
              <h3>Risks & Challenges</h3>
              <AlertTriangle size={16} style={{ color: "#f39c12" }} />
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Risk</th>
                    <th>Severity</th>
                    <th>Mitigation</th>
                  </tr>
                </thead>
                <tbody>
                  {risks.map((risk, i) => (
                    <tr key={i}>
                      <td style={{ fontSize: 13 }}>{risk.risk}</td>
                      <td>
                        <span
                          className={`badge ${
                            risk.severity === "High"
                              ? "red"
                              : risk.severity === "Medium"
                              ? "orange"
                              : "green"
                          }`}
                        >
                          {risk.severity}
                        </span>
                      </td>
                      <td style={{ fontSize: 12, color: "#555" }}>
                        {risk.mitigation}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Items */}
          <div className="card">
            <div className="card-header">
              <h3>Action Items</h3>
              <FileText size={16} style={{ color: "#2980b9" }} />
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Action</th>
                    <th>Owner</th>
                    <th>Deadline</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {actionItems.map((item, i) => (
                    <tr key={i}>
                      <td style={{ fontSize: 13 }}>{item.action}</td>
                      <td style={{ fontSize: 13 }}>{item.owner}</td>
                      <td style={{ fontSize: 12, color: "#7f8c8d" }}>
                        {item.deadline}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            item.status === "In Progress"
                              ? "blue"
                              : item.status === "Scheduled"
                              ? "green"
                              : item.status === "Pending"
                              ? "orange"
                              : "gray"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Success Metrics */}
        <div className="card" style={{ marginTop: 24 }}>
          <div className="card-header">
            <h3>Success Metrics (End of Week 12)</h3>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Target (POC)</th>
                  <th>Current</th>
                  <th>Measurement Method</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Relevant signal events per week</td>
                  <td>
                    <span className="badge green">≥20/week by W4</span>
                  </td>
                  <td style={{ fontWeight: 600 }}>28/week</td>
                  <td style={{ fontSize: 13, color: "#7f8c8d" }}>
                    System log, reviewed by Robin
                  </td>
                </tr>
                <tr>
                  <td>Accounts with named decision-maker</td>
                  <td>
                    <span className="badge green">≥80%</span>
                  </td>
                  <td style={{ fontWeight: 600 }}>87.5%</td>
                  <td style={{ fontSize: 13, color: "#7f8c8d" }}>
                    HubSpot contact record audit
                  </td>
                </tr>
                <tr>
                  <td>Sales team signal quality rating</td>
                  <td>
                    <span className="badge blue">≥4/5 avg</span>
                  </td>
                  <td style={{ fontWeight: 600 }}>Pending</td>
                  <td style={{ fontSize: 13, color: "#7f8c8d" }}>
                    Weekly feedback from Robin
                  </td>
                </tr>
                <tr>
                  <td>AI-suggested context used in outreach</td>
                  <td>
                    <span className="badge blue">≥50%</span>
                  </td>
                  <td style={{ fontWeight: 600 }}>60% (3/5)</td>
                  <td style={{ fontSize: 13, color: "#7f8c8d" }}>
                    HubSpot activity log
                  </td>
                </tr>
                <tr>
                  <td>Meetings booked from POC leads</td>
                  <td>
                    <span className="badge orange">≥1</span>
                  </td>
                  <td style={{ fontWeight: 600 }}>0</td>
                  <td style={{ fontSize: 13, color: "#7f8c8d" }}>
                    HubSpot deal/meeting log
                  </td>
                </tr>
                <tr>
                  <td>Robin's overall POC satisfaction</td>
                  <td>
                    <span className="badge orange">≥8/10</span>
                  </td>
                  <td style={{ fontWeight: 600 }}>TBD</td>
                  <td style={{ fontSize: 13, color: "#7f8c8d" }}>
                    End-of-POC debrief
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default POCTracker;
