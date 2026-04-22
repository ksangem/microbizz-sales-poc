import React, { useState } from "react";
import { Settings as SettingsIcon, CheckCircle, Save } from "lucide-react";

const Settings = () => {
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-left">
          <h1>Settings</h1>
          <p>POC configuration and integrations</p>
        </div>
        <div className="top-bar-right">
          <span className="poc-badge">POC Week 4</span>
          <div className="user-avatar">RM</div>
        </div>
      </div>

      <div className="page-content">
        <div className="grid-2">
          {/* HubSpot Integration */}
          <div className="card">
            <div className="card-header">
              <h3>HubSpot Integration</h3>
              <span className="badge green">Connected</span>
            </div>
            <div className="card-body">
              <div className="lead-detail-row">
                <span className="label">Status</span>
                <span className="sync-indicator">
                  <span className="sync-dot"></span>
                  Live Sync Active
                </span>
              </div>
              <div className="lead-detail-row">
                <span className="label">Portal ID</span>
                <span className="value">mb-gmbh-prod</span>
              </div>
              <div className="lead-detail-row">
                <span className="label">Custom Properties</span>
                <span className="value">Intent Score, ICP Fit, Signal Count</span>
              </div>
              <div className="lead-detail-row">
                <span className="label">Last Sync</span>
                <span className="value">2 min ago</span>
              </div>
              <button
                className="btn btn-outline"
                style={{ marginTop: 16 }}
                onClick={() => showToast("HubSpot sync triggered")}
              >
                Force Sync
              </button>
            </div>
          </div>

          {/* Enrichment Vendor */}
          <div className="card">
            <div className="card-header">
              <h3>Enrichment Vendor</h3>
              <span className="badge orange">Trial</span>
            </div>
            <div className="card-body">
              <div className="lead-detail-row">
                <span className="label">Provider</span>
                <span className="value">ZoomInfo (Trial)</span>
              </div>
              <div className="lead-detail-row">
                <span className="label">API Credits</span>
                <span className="value">847 / 1000</span>
              </div>
              <div className="lead-detail-row">
                <span className="label">Trial Expires</span>
                <span className="value">June 30, 2026</span>
              </div>
              <div className="lead-detail-row">
                <span className="label">Data Coverage</span>
                <span className="value">European Market</span>
              </div>
            </div>
          </div>

          {/* ICP Configuration */}
          <div className="card">
            <div className="card-header">
              <h3>ICP Configuration</h3>
            </div>
            <div className="card-body">
              <div className="lead-detail-row">
                <span className="label">Target Industries</span>
                <span className="value">
                  Field Services, Facility Mgmt, Property Maint.
                </span>
              </div>
              <div className="lead-detail-row">
                <span className="label">Company Size</span>
                <span className="value">50-1000 employees</span>
              </div>
              <div className="lead-detail-row">
                <span className="label">Geography</span>
                <span className="value">Europe (GDPR scope)</span>
              </div>
              <div className="lead-detail-row">
                <span className="label">Decision Makers</span>
                <span className="value">
                  Head of Ops, Fleet Mgr, IT Director, COO
                </span>
              </div>
              <div className="lead-detail-row">
                <span className="label">Target Accounts</span>
                <span className="value">50-100 companies</span>
              </div>
              <button
                className="btn btn-primary"
                style={{ marginTop: 16 }}
                onClick={() => showToast("ICP settings saved")}
              >
                <Save size={14} /> Save Changes
              </button>
            </div>
          </div>

          {/* GDPR & Compliance */}
          <div className="card">
            <div className="card-header">
              <h3>GDPR & Compliance</h3>
              <span className="badge green">Compliant</span>
            </div>
            <div className="card-body">
              <div className="lead-detail-row">
                <span className="label">Data Sources</span>
                <span className="value">Public signals only</span>
              </div>
              <div className="lead-detail-row">
                <span className="label">Consent Model</span>
                <span className="value">HubSpot consent infrastructure</span>
              </div>
              <div className="lead-detail-row">
                <span className="label">DPIA Status</span>
                <span className="badge orange">Pending Review</span>
              </div>
              <div className="lead-detail-row">
                <span className="label">Legal Review</span>
                <span className="badge orange">Required before go-live</span>
              </div>
              <div className="lead-detail-row">
                <span className="label">Profile Scraping</span>
                <span className="badge green">Disabled</span>
              </div>
            </div>
          </div>
        </div>

        {/* POC Info */}
        <div className="card" style={{ marginTop: 24 }}>
          <div className="card-header">
            <h3>POC Information</h3>
          </div>
          <div className="card-body">
            <div className="grid-3" style={{ marginBottom: 0 }}>
              <div>
                <div className="lead-detail-row">
                  <span className="label">Document Owner</span>
                  <span className="value">Amit (Nalashaa)</span>
                </div>
                <div className="lead-detail-row">
                  <span className="label">Client Sponsor</span>
                  <span className="value">Robin Montens</span>
                </div>
              </div>
              <div>
                <div className="lead-detail-row">
                  <span className="label">Version</span>
                  <span className="value">v1.0 - Draft</span>
                </div>
                <div className="lead-detail-row">
                  <span className="label">Duration</span>
                  <span className="value">10-12 weeks</span>
                </div>
              </div>
              <div>
                <div className="lead-detail-row">
                  <span className="label">Comms Copy</span>
                  <span className="value">Robin, Amit, Shaan</span>
                </div>
                <div className="lead-detail-row">
                  <span className="label">CRM</span>
                  <span className="value">HubSpot</span>
                </div>
              </div>
            </div>
          </div>
        </div>
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

export default Settings;
