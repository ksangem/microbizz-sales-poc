import React, { useState } from "react";
import {
  MessageSquare,
  Send,
  Edit3,
  Copy,
  CheckCircle,
  ExternalLink,
  Mail,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { outreachMessages } from "../data/mockData";

const OutreachAssist = () => {
  const [messages, setMessages] = useState(outreachMessages);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSend = (id) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "sent" } : m))
    );
    const msg = messages.find((m) => m.id === id);
    showToast(`Message sent to ${msg.contact} via ${msg.channel}`);
  };

  const filteredMessages =
    activeTab === "all"
      ? messages
      : messages.filter((m) => m.status === activeTab);

  const getChannelIcon = (channel) => {
    if (channel === "LinkedIn") return <ExternalLink size={14} />;
    return <Mail size={14} />;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "ready":
        return <span className="badge green">Ready</span>;
      case "sent":
        return <span className="badge blue">Sent</span>;
      case "draft":
        return <span className="badge orange">Draft</span>;
      default:
        return <span className="badge gray">{status}</span>;
    }
  };

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-left">
          <h1>Outreach Assist</h1>
          <p>
            AI-generated, context-aware messaging prompts for sales outreach
          </p>
        </div>
        <div className="top-bar-right">
          <button
            className="btn btn-primary"
            onClick={() =>
              showToast("Generating new outreach messages from latest signals...")
            }
          >
            <Sparkles size={14} /> Generate New
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
                <MessageSquare size={20} />
              </div>
            </div>
            <div className="stat-value">{messages.length}</div>
            <div className="stat-label">Total Messages</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon green">
                <CheckCircle size={20} />
              </div>
            </div>
            <div className="stat-value">
              {messages.filter((m) => m.status === "ready").length}
            </div>
            <div className="stat-label">Ready to Send</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon orange">
                <Send size={20} />
              </div>
            </div>
            <div className="stat-value">
              {messages.filter((m) => m.status === "sent").length}
            </div>
            <div className="stat-label">Sent</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon red">
                <Edit3 size={20} />
              </div>
            </div>
            <div className="stat-value">
              {messages.filter((m) => m.status === "draft").length}
            </div>
            <div className="stat-label">Drafts</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tab-nav">
          {[
            { key: "all", label: "All Messages" },
            { key: "ready", label: "Ready to Send" },
            { key: "sent", label: "Sent" },
            { key: "draft", label: "Drafts" },
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

        {/* Outreach Cards */}
        {filteredMessages.map((msg) => (
          <div className="outreach-card" key={msg.id}>
            <div className="outreach-card-header">
              <div>
                <h4>{msg.contact}</h4>
                <span
                  style={{ fontSize: 13, color: "#7f8c8d" }}
                >
                  {msg.company}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 12,
                    color: "#7f8c8d",
                  }}
                >
                  {getChannelIcon(msg.channel)} {msg.channel}
                </span>
                {getStatusBadge(msg.status)}
              </div>
            </div>

            <div className="outreach-card-signal">
              <strong>Signal detected:</strong> {msg.signal}
            </div>

            <div className="outreach-card-message">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 8,
                  fontSize: 11,
                  color: "#27ae60",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  fontWeight: 600,
                }}
              >
                <Sparkles size={12} /> AI-Generated Message
              </div>
              {msg.message}
            </div>

            <div className="outreach-card-actions">
              {msg.status === "ready" && (
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => handleSend(msg.id)}
                >
                  <Send size={12} /> Send
                </button>
              )}
              <button
                className="btn btn-outline btn-sm"
                onClick={() => showToast("Opening editor...")}
              >
                <Edit3 size={12} /> Edit
              </button>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => showToast("Message copied to clipboard")}
              >
                <Copy size={12} /> Copy
              </button>
              <button
                className="btn btn-outline btn-sm"
                onClick={() =>
                  showToast("Regenerating message with fresh context...")
                }
              >
                <RefreshCw size={12} /> Regenerate
              </button>
            </div>
          </div>
        ))}

        {filteredMessages.length === 0 && (
          <div className="card">
            <div className="card-body">
              <div className="empty-state">
                <MessageSquare size={48} />
                <p>No messages in this category</p>
              </div>
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

export default OutreachAssist;
