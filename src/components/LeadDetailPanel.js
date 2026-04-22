import React from "react";
import { X, Mail, ExternalLink, Phone, Building, MapPin } from "lucide-react";

const getScoreClass = (score) => {
  if (score >= 80) return "high";
  if (score >= 60) return "medium";
  return "low";
};

const LeadDetailPanel = ({ lead, onClose }) => {
  if (!lead) return null;

  return (
    <div className="lead-detail-overlay" onClick={onClose}>
      <div
        className="lead-detail-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="lead-detail-close" onClick={onClose}>
          <X size={16} />
        </button>

        <div className="lead-detail-header">
          <h2>{lead.contact}</h2>
          <p>
            {lead.title} at {lead.company}
          </p>
        </div>

        <div className="lead-detail-body">
          {/* Scores */}
          <div className="lead-detail-section">
            <h4>Lead Scores</h4>
            <div className="lead-scores">
              <div className="lead-score-item">
                <div
                  className={`score-number ${getScoreClass(lead.overallScore)}`}
                  style={{ color: lead.overallScore >= 80 ? "#27ae60" : lead.overallScore >= 60 ? "#f39c12" : "#e74c3c" }}
                >
                  {lead.overallScore}
                </div>
                <div className="score-label">Overall</div>
              </div>
              <div className="lead-score-item">
                <div
                  className="score-number"
                  style={{ color: lead.icpFit >= 80 ? "#27ae60" : "#f39c12" }}
                >
                  {lead.icpFit}
                </div>
                <div className="score-label">ICP Fit</div>
              </div>
              <div className="lead-score-item">
                <div
                  className="score-number"
                  style={{ color: lead.intentScore >= 80 ? "#27ae60" : "#f39c12" }}
                >
                  {lead.intentScore}
                </div>
                <div className="score-label">Intent</div>
              </div>
              <div className="lead-score-item">
                <div
                  className="score-number"
                  style={{ color: lead.engagementScore >= 60 ? "#27ae60" : "#f39c12" }}
                >
                  {lead.engagementScore}
                </div>
                <div className="score-label">Engagement</div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="lead-detail-section">
            <h4>Contact Information</h4>
            <div className="lead-detail-row">
              <span className="label">
                <Mail size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />
                Email
              </span>
              <span className="value">{lead.email}</span>
            </div>
            <div className="lead-detail-row">
              <span className="label">
                <ExternalLink size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />
                LinkedIn
              </span>
              <span className="value">{lead.linkedin}</span>
            </div>
            <div className="lead-detail-row">
              <span className="label">
                <Phone size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />
                Phone
              </span>
              <span className="value">{lead.phone}</span>
            </div>
          </div>

          {/* Company Info */}
          <div className="lead-detail-section">
            <h4>Company Details</h4>
            <div className="lead-detail-row">
              <span className="label">
                <Building size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />
                Industry
              </span>
              <span className="value">{lead.industry}</span>
            </div>
            <div className="lead-detail-row">
              <span className="label">Employees</span>
              <span className="value">{lead.employees}</span>
            </div>
            <div className="lead-detail-row">
              <span className="label">
                <MapPin size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />
                Country
              </span>
              <span className="value">{lead.country}</span>
            </div>
          </div>

          {/* Status */}
          <div className="lead-detail-section">
            <h4>Status</h4>
            <div className="lead-detail-row">
              <span className="label">HubSpot Status</span>
              <span className="badge blue">{lead.hubspotStatus}</span>
            </div>
            <div className="lead-detail-row">
              <span className="label">Enriched</span>
              <span className={`badge ${lead.enriched ? "green" : "orange"}`}>
                {lead.enriched ? "Yes" : "Pending"}
              </span>
            </div>
            <div className="lead-detail-row">
              <span className="label">Contact Verified</span>
              <span className={`badge ${lead.verified ? "green" : "orange"}`}>
                {lead.verified ? "Verified" : "Unverified"}
              </span>
            </div>
            <div className="lead-detail-row">
              <span className="label">Signals Detected</span>
              <span className="value">{lead.signals}</span>
            </div>
            <div className="lead-detail-row">
              <span className="label">Last Signal</span>
              <span className="value">{lead.lastSignal}</span>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-primary" style={{ flex: 1 }}>
              <MessageSquare size={14} /> Generate Outreach
            </button>
            <button className="btn btn-outline" style={{ flex: 1 }}>
              Open in HubSpot
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MessageSquare = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export default LeadDetailPanel;
