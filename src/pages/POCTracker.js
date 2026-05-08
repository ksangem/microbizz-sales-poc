import React, { useState } from "react";
import {
  Target,
  CheckCircle,
  Clock,
  AlertTriangle,
  Calendar,
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
} from "recharts";
import { pocObjectives, weeklyMetrics } from "../data/mockData";

const InfoTooltip = ({ text }) => {
  const [visible, setVisible] = useState(false);
  return (
    <span
      style={{ position: "relative", display: "inline-flex", alignItems: "center", marginLeft: 8, cursor: "pointer" }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <Info size={16} style={{ color: "#7f8c8d" }} />
      {visible && (
        <span
          style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#2c3e50",
            color: "#fff",
            padding: "8px 12px",
            borderRadius: 6,
            fontSize: 12,
            lineHeight: 1.4,
            width: 260,
            textAlign: "left",
            zIndex: 1000,
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            whiteSpace: "normal",
          }}
        >
          {text}
        </span>
      )}
    </span>
  );
};

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

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-left">
          <h1>POC Tracker</h1>
          <p>ROI Demonstration — KPI Progress vs Targets</p>
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
            <h3>
              POC Objectives
              <InfoTooltip text="Key objectives for the 10-week POC with progress tracking against agreed targets." />
            </h3>
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

        {/* Weekly KPI Trends */}
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-header">
            <h3>
              Weekly KPI Trends
              <InfoTooltip text="Week-over-week progression of key performance indicators across the POC timeline." />
            </h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyMetrics} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="signals" name="Signals / Week" fill="#2980b9" radius={[4, 4, 0, 0]} />
                <Bar dataKey="enriched" name="Enrichment Rate" fill="#27ae60" radius={[4, 4, 0, 0]} />
                <Bar dataKey="outreach" name="Outreach Sent" fill="#8e44ad" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Success Metrics */}
        <div className="card" style={{ marginTop: 24 }}>
          <div className="card-header">
            <h3>
              Success Metrics (End of Week 12)
              <InfoTooltip text="End-of-POC success criteria. Green = target met, Orange = in progress, Red = needs attention." />
            </h3>
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
                    <span className="badge green">&ge;20/week by W4</span>
                  </td>
                  <td style={{ fontWeight: 600 }}>28/week</td>
                  <td style={{ fontSize: 13, color: "#7f8c8d" }}>
                    System log, reviewed by Robin
                  </td>
                </tr>
                <tr>
                  <td>Accounts with named decision-maker</td>
                  <td>
                    <span className="badge green">&ge;80%</span>
                  </td>
                  <td style={{ fontWeight: 600 }}>87.5%</td>
                  <td style={{ fontSize: 13, color: "#7f8c8d" }}>
                    HubSpot contact record audit
                  </td>
                </tr>
                <tr>
                  <td>Sales team signal quality rating</td>
                  <td>
                    <span className="badge blue">&ge;4/5 avg</span>
                  </td>
                  <td style={{ fontWeight: 600 }}>Pending</td>
                  <td style={{ fontSize: 13, color: "#7f8c8d" }}>
                    Weekly feedback from Robin
                  </td>
                </tr>
                <tr>
                  <td>AI-suggested context used in outreach</td>
                  <td>
                    <span className="badge blue">&ge;50%</span>
                  </td>
                  <td style={{ fontWeight: 600 }}>60% (3/5)</td>
                  <td style={{ fontSize: 13, color: "#7f8c8d" }}>
                    HubSpot activity log
                  </td>
                </tr>
                <tr>
                  <td>Meetings booked from POC leads</td>
                  <td>
                    <span className="badge orange">&ge;1</span>
                  </td>
                  <td style={{ fontWeight: 600 }}>0</td>
                  <td style={{ fontSize: 13, color: "#7f8c8d" }}>
                    HubSpot deal/meeting log
                  </td>
                </tr>
                <tr>
                  <td>Robin's overall POC satisfaction</td>
                  <td>
                    <span className="badge orange">&ge;8/10</span>
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

        {/* P-03 Note */}
        <p
          style={{
            marginTop: 24,
            fontSize: 13,
            color: "#7f8c8d",
            fontStyle: "italic",
            textAlign: "center",
          }}
        >
          Assumptions, risks, and prerequisites have been documented in the external sales presentation materials (MicroBizz_NalashaaProposal_v1.0.pptx, Slide 12).
        </p>
      </div>
    </>
  );
};

export default POCTracker;
