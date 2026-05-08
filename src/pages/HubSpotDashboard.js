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
  Mail,
  Share2,
  Users,
  Send,
  FileText,
  Info,
} from "lucide-react";
import {
  hubspotWeeklyOpportunities,
  hubspotCustomProperties,
} from "../data/mockData";

/* ── Reusable Info Tooltip ── */
const InfoTooltip = ({ text }) => {
  const [show, setShow] = useState(false);
  return (
    <span
      style={{ position: "relative", display: "inline-flex", alignItems: "center", marginLeft: 6, cursor: "pointer" }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <Info size={15} color="#7f8c8d" />
      {show && (
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
            lineHeight: 1.6,
            width: 300,
            zIndex: 1000,
            boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
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

const HubSpotDashboard = () => {
  const [toast, setToast] = useState(null);
  const [expandedOpp, setExpandedOpp] = useState(1);
  const [feedbackRatings, setFeedbackRatings] = useState({});
  const [activeTab, setActiveTab] = useState("opportunities");
  const [channelSelections, setChannelSelections] = useState({});

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleRating = (oppId, rating) => {
    setFeedbackRatings((prev) => ({ ...prev, [oppId]: rating }));
    showToast(`Signal quality rated ${rating}/5 for opportunity #${oppId}`);
  };

  const setChannel = (oppId, channel) => {
    setChannelSelections((prev) => ({ ...prev, [oppId]: channel }));
  };

  const getChannel = (oppId) => channelSelections[oppId] || "email";

  const ratedCount = Object.keys(feedbackRatings).length;
  const avgRating =
    ratedCount > 0
      ? (
          Object.values(feedbackRatings).reduce((a, b) => a + b, 0) /
          ratedCount
        ).toFixed(1)
      : "\u2014";

  /* ── Channel toggle button style helper ── */
  const channelBtnStyle = (oppId, channel) => {
    const active = getChannel(oppId) === channel;
    return {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "7px 16px",
      border: active ? "2px solid #2980b9" : "1px solid #d5dbdb",
      borderRadius: 6,
      background: active ? "#ebf5fb" : "#fff",
      color: active ? "#2980b9" : "#566573",
      fontWeight: active ? 700 : 500,
      fontSize: 13,
      cursor: "pointer",
      transition: "all 0.15s ease",
    };
  };

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-left">
          <h1 style={{ display: "flex", alignItems: "center" }}>
            HubSpot Dashboard
            <InfoTooltip text="AI-ranked opportunities with signal context not available in HubSpot. See why each account matters and when to act." />
          </h1>
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
            {
              key: "opportunities",
              label: "Weekly Top Opportunities",
              tooltip:
                "Top 6 accounts ranked by AI scoring this week. Each includes signal context, strategic fit analysis, and outreach recommendations.",
            },
            {
              key: "properties",
              label: "HubSpot Custom Properties",
              tooltip:
                "Custom fields synced to HubSpot contact records. These scores appear directly in your existing HubSpot views.",
            },
          ].map((tab) => (
            <div
              key={tab.key}
              className={`tab-item ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
              style={{ display: "flex", alignItems: "center" }}
            >
              {tab.label}
              <InfoTooltip text={tab.tooltip} />
            </div>
          ))}
        </div>

        {/* ── Tab: Weekly Top Opportunities ── */}
        {activeTab === "opportunities" && (
          <>
            {/* H-02: Persistent unique-value banner */}
            <div
              style={{
                background: "linear-gradient(135deg, #1a6fbb 0%, #1abc9c 100%)",
                borderRadius: 10,
                padding: "16px 22px",
                marginBottom: 22,
                fontSize: 14,
                color: "#fff",
                fontWeight: 500,
                letterSpacing: 0.2,
                lineHeight: 1.6,
                boxShadow: "0 2px 10px rgba(26,111,187,0.2)",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span
                style={{
                  background: "rgba(255,255,255,0.2)",
                  borderRadius: 8,
                  padding: "6px 10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Star size={20} color="#fff" />
              </span>
              <span>
                Signal context shown here is not available in HubSpot natively
                &mdash; this is what makes MicroBizz unique. Each opportunity
                below includes AI-detected signals, strategic fit analysis, and
                outreach recommendations you won't find in your CRM.
              </span>
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
                    {/* H-01: Primary action buttons — DOMINANT at top */}
                    <div
                      style={{
                        display: "flex",
                        gap: 10,
                        flexWrap: "wrap",
                        marginBottom: 20,
                        padding: "14px 16px",
                        background: "#f8fafc",
                        borderRadius: 10,
                        border: "1px solid #e0e6ed",
                      }}
                    >
                      <button
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "12px 22px",
                          fontSize: 14,
                          fontWeight: 700,
                          border: "none",
                          borderRadius: 8,
                          cursor: "pointer",
                          background: "#27ae60",
                          color: "#fff",
                          boxShadow: "0 2px 8px rgba(39,174,96,0.25)",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          showToast(
                            `Generating AI outreach message for ${opp.contact}...`
                          );
                        }}
                      >
                        <MessageSquare size={16} /> Generate Message
                      </button>
                      <button
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "12px 22px",
                          fontSize: 14,
                          fontWeight: 700,
                          border: "none",
                          borderRadius: 8,
                          cursor: "pointer",
                          background: "#2980b9",
                          color: "#fff",
                          boxShadow: "0 2px 8px rgba(41,128,185,0.25)",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          showToast(
                            `Sending email to ${opp.contact} at ${opp.company}...`
                          );
                        }}
                      >
                        <Mail size={16} /> Send via Email
                      </button>
                      <button
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "12px 22px",
                          fontSize: 14,
                          fontWeight: 700,
                          border: "none",
                          borderRadius: 8,
                          cursor: "pointer",
                          background: "#2980b9",
                          color: "#fff",
                          boxShadow: "0 2px 8px rgba(41,128,185,0.25)",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          showToast(
                            `Sending LinkedIn message to ${opp.contact}...`
                          );
                        }}
                      >
                        <Share2 size={16} /> Send via LinkedIn
                      </button>
                      <button
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "12px 22px",
                          fontSize: 14,
                          fontWeight: 700,
                          border: "2px solid #7f8c8d",
                          borderRadius: 8,
                          cursor: "pointer",
                          background: "transparent",
                          color: "#566573",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          showToast(
                            `Activity logged for ${opp.contact} at ${opp.company}.`
                          );
                        }}
                      >
                        <FileText size={16} /> Log Activity
                      </button>
                    </div>

                    {/* H-03: Signal-derived data sections */}
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

                    {/* H-04: Channel Selector + Send */}
                    <div
                      style={{
                        marginTop: 16,
                        padding: "14px 16px",
                        background: "#f8fafc",
                        borderRadius: 10,
                        border: "1px solid #e0e6ed",
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#566573",
                        }}
                      >
                        Outreach Channel:
                      </span>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          style={channelBtnStyle(opp.id, "email")}
                          onClick={(e) => {
                            e.stopPropagation();
                            setChannel(opp.id, "email");
                          }}
                        >
                          <Mail size={14} /> Email
                        </button>
                        <button
                          style={channelBtnStyle(opp.id, "linkedin")}
                          onClick={(e) => {
                            e.stopPropagation();
                            setChannel(opp.id, "linkedin");
                          }}
                        >
                          <Share2 size={14} /> LinkedIn
                        </button>
                        <button
                          style={channelBtnStyle(opp.id, "teams")}
                          onClick={(e) => {
                            e.stopPropagation();
                            setChannel(opp.id, "teams");
                          }}
                        >
                          <Users size={14} /> Teams
                        </button>
                      </div>
                      <button
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "9px 20px",
                          fontSize: 13,
                          fontWeight: 700,
                          border: "none",
                          borderRadius: 8,
                          cursor: "pointer",
                          background: "#27ae60",
                          color: "#fff",
                          marginLeft: "auto",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          const ch = getChannel(opp.id);
                          const label =
                            ch === "email"
                              ? "Email"
                              : ch === "linkedin"
                              ? "LinkedIn"
                              : "Teams";
                          showToast(
                            `Outreach sent via ${label} to ${opp.contact} at ${opp.company}.`
                          );
                        }}
                      >
                        <Send size={14} /> Send
                      </button>
                    </div>

                    {/* Signal Quality Rating */}
                    <div
                      style={{
                        marginTop: 16,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                      }}
                    >
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
