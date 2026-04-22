import React, { useState } from "react";
import {
  BarChart3,
  Star,
  MessageSquare,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
} from "lucide-react";
import {
  hubspotWeeklyOpportunities,
  hubspotCustomProperties,
} from "../data/mockData";

const HubSpotDashboard = () => {
  const [toast, setToast] = useState(null);
  const [expandedOpp, setExpandedOpp] = useState(1);
  const [feedbackRatings, setFeedbackRatings] = useState({});
  const [activeTab, setActiveTab] = useState("opportunities");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleRating = (oppId, rating) => {
    setFeedbackRatings((prev) => ({ ...prev, [oppId]: rating }));
    showToast(`Signal quality rated ${rating}/5 for opportunity #${oppId}`);
  };

  const ratedCount = Object.keys(feedbackRatings).length;
  const avgRating =
    ratedCount > 0
      ? (
          Object.values(feedbackRatings).reduce((a, b) => a + b, 0) /
          ratedCount
        ).toFixed(1)
      : "—";

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-left">
          <h1>HubSpot Dashboard</h1>
          <p>
            Top weekly opportunities with signal context — ranked leads &
            outreach prompts
          </p>
        </div>
        <div className="top-bar-right">
          <div className="sync-indicator">
            <span className="sync-dot"></span>
            HubSpot Live
          </div>
          <button
            className="btn btn-outline"
            onClick={() => showToast("Refreshing ranked leads from HubSpot...")}
          >
            <RefreshCw size={14} /> Sync
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
                <BarChart3 size={20} />
              </div>
            </div>
            <div className="stat-value">
              {hubspotWeeklyOpportunities.length}
            </div>
            <div className="stat-label">Weekly Opportunities</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon green">
                <Star size={20} />
              </div>
            </div>
            <div className="stat-value">{avgRating}</div>
            <div className="stat-label">Avg Signal Rating</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon orange">
                <Clock size={20} />
              </div>
            </div>
            <div className="stat-value">Daily</div>
            <div className="stat-label">Update Frequency</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon red">
                <MessageSquare size={20} />
              </div>
            </div>
            <div className="stat-value">{ratedCount}</div>
            <div className="stat-label">Feedback Given</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tab-nav">
          {[
            { key: "opportunities", label: "Weekly Top Opportunities" },
            { key: "properties", label: "HubSpot Custom Properties" },
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

        {/* ── Tab: Weekly Top Opportunities ── */}
        {activeTab === "opportunities" && (
          <>
            <div
              style={{
                background: "#ebf5fb",
                border: "1px solid #2980b9",
                borderRadius: 8,
                padding: 14,
                marginBottom: 20,
                fontSize: 13,
                color: "#1a5276",
              }}
            >
              <strong>Robin:</strong> This is your weekly ranked list showing
              the top 6 opportunities with full signal context. For each lead
              you can see <em>why this account</em> and{" "}
              <em>why now</em>, plus a suggested outreach approach. Please rate
              each signal's quality (1-5) so we can tune the model.
            </div>

            {hubspotWeeklyOpportunities.map((opp) => (
              <div
                key={opp.id}
                className="card"
                style={{
                  marginBottom: 16,
                  borderLeft: `4px solid ${
                    opp.overallScore >= 85
                      ? "#27ae60"
                      : opp.overallScore >= 75
                      ? "#f39c12"
                      : "#3498db"
                  }`,
                }}
              >
                {/* Opportunity Header */}
                <div
                  className="card-header"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    setExpandedOpp(expandedOpp === opp.id ? null : opp.id)
                  }
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 16 }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background:
                          opp.overallScore >= 85
                            ? "#eafaf1"
                            : opp.overallScore >= 75
                            ? "#fef5e7"
                            : "#ebf5fb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: 14,
                        color:
                          opp.overallScore >= 85
                            ? "#27ae60"
                            : opp.overallScore >= 75
                            ? "#f39c12"
                            : "#2980b9",
                      }}
                    >
                      #{opp.rank}
                    </div>
                    <div>
                      <h3 style={{ fontSize: 15, margin: 0 }}>
                        {opp.company}
                      </h3>
                      <span style={{ fontSize: 13, color: "#7f8c8d" }}>
                        {opp.contact} — {opp.title}
                      </span>
                    </div>
                  </div>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <span
                      className={`badge ${
                        opp.overallScore >= 85
                          ? "green"
                          : opp.overallScore >= 75
                          ? "orange"
                          : "blue"
                      }`}
                    >
                      Score: {opp.overallScore}
                    </span>
                    <span className="badge blue">{opp.hubspotStage}</span>
                    {expandedOpp === opp.id ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedOpp === opp.id && (
                  <div className="card-body">
                    <div style={{ display: "flex", gap: 24 }}>
                      {/* Why This Account */}
                      <div style={{ flex: 1 }}>
                        <h4
                          style={{
                            fontSize: 12,
                            textTransform: "uppercase",
                            letterSpacing: 1,
                            color: "#2980b9",
                            marginBottom: 8,
                          }}
                        >
                          Why This Account
                        </h4>
                        <p
                          style={{
                            fontSize: 14,
                            lineHeight: 1.7,
                            background: "#f8fafc",
                            padding: 12,
                            borderRadius: 6,
                          }}
                        >
                          {opp.whyThisAccount}
                        </p>
                      </div>

                      {/* Why Now */}
                      <div style={{ flex: 1 }}>
                        <h4
                          style={{
                            fontSize: 12,
                            textTransform: "uppercase",
                            letterSpacing: 1,
                            color: "#27ae60",
                            marginBottom: 8,
                          }}
                        >
                          Why Now
                        </h4>
                        <p
                          style={{
                            fontSize: 14,
                            lineHeight: 1.7,
                            background: "#f0fdf4",
                            padding: 12,
                            borderRadius: 6,
                            border: "1px solid #bbf7d0",
                          }}
                        >
                          {opp.whyNow}
                        </p>
                      </div>
                    </div>

                    {/* Signals */}
                    <div style={{ marginTop: 16 }}>
                      <h4
                        style={{
                          fontSize: 12,
                          textTransform: "uppercase",
                          letterSpacing: 1,
                          color: "#7f8c8d",
                          marginBottom: 8,
                        }}
                      >
                        Detected Signals
                      </h4>
                      {opp.signals.map((sig, i) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            padding: "8px 12px",
                            background: i % 2 === 0 ? "#f8fafc" : "transparent",
                            borderRadius: 4,
                            fontSize: 13,
                          }}
                        >
                          <span
                            className="source-tag linkedin"
                            style={{ minWidth: 60, textAlign: "center" }}
                          >
                            {sig.source}
                          </span>
                          <span style={{ flex: 1 }}>{sig.text}</span>
                          <span style={{ color: "#7f8c8d", fontSize: 12 }}>
                            {sig.date}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Outreach Prompt */}
                    <div
                      style={{
                        marginTop: 16,
                        background: "#fef5e7",
                        border: "1px solid #f39c12",
                        borderRadius: 8,
                        padding: 16,
                      }}
                    >
                      <h4
                        style={{
                          fontSize: 12,
                          textTransform: "uppercase",
                          letterSpacing: 1,
                          color: "#b7791f",
                          marginBottom: 8,
                        }}
                      >
                        Suggested Outreach Approach
                      </h4>
                      <p style={{ fontSize: 14, lineHeight: 1.7 }}>
                        {opp.outreachPrompt}
                      </p>
                    </div>

                    {/* Actions & Rating */}
                    <div
                      style={{
                        marginTop: 16,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          className="btn btn-success"
                          onClick={() =>
                            showToast(
                              `Generating AI outreach message for ${opp.contact}...`
                            )
                          }
                        >
                          <MessageSquare size={14} /> Generate Message
                        </button>
                        <button
                          className="btn btn-primary"
                          onClick={() =>
                            showToast(
                              `Opening ${opp.company} in HubSpot...`
                            )
                          }
                        >
                          <ExternalLink size={14} /> Open in HubSpot
                        </button>
                      </div>

                      {/* Signal Quality Rating */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <span
                          style={{ fontSize: 13, color: "#7f8c8d" }}
                        >
                          Signal Quality:
                        </span>
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            onClick={() => handleRating(opp.id, rating)}
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: "50%",
                              border: "1px solid #e0e6ed",
                              background:
                                (feedbackRatings[opp.id] || opp.feedbackRating) >=
                                rating
                                  ? "#f39c12"
                                  : "white",
                              color:
                                (feedbackRatings[opp.id] || opp.feedbackRating) >=
                                rating
                                  ? "white"
                                  : "#7f8c8d",
                              cursor: "pointer",
                              fontWeight: 600,
                              fontSize: 12,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {rating}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        {/* ── Tab: HubSpot Custom Properties ── */}
        {activeTab === "properties" && (
          <div className="card">
            <div className="card-header">
              <h3>HubSpot Custom Property Fields</h3>
              <span className="badge green">
                All synced
              </span>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Property Name</th>
                    <th>Label</th>
                    <th>Type</th>
                    <th>Group</th>
                    <th>Sync Status</th>
                  </tr>
                </thead>
                <tbody>
                  {hubspotCustomProperties.map((prop, i) => (
                    <tr key={i}>
                      <td>
                        <code
                          style={{
                            background: "#f0f0f0",
                            padding: "2px 6px",
                            borderRadius: 4,
                            fontSize: 12,
                          }}
                        >
                          {prop.name}
                        </code>
                      </td>
                      <td style={{ fontWeight: 600 }}>{prop.label}</td>
                      <td>{prop.type}</td>
                      <td>
                        <span className="badge blue">{prop.group}</span>
                      </td>
                      <td>
                        {prop.synced ? (
                          <span className="badge green">
                            <CheckCircle
                              size={12}
                              style={{ marginRight: 4 }}
                            />
                            Synced
                          </span>
                        ) : (
                          <span className="badge orange">Pending</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div
              className="card-body"
              style={{ borderTop: "1px solid #e0e6ed" }}
            >
              <p style={{ fontSize: 13, color: "#7f8c8d" }}>
                These custom properties are automatically synced to HubSpot
                contact records. The intent score and ICP fit are visible in
                existing HubSpot views — no new tool required for the sales
                team.
              </p>
            </div>
          </div>
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

export default HubSpotDashboard;
