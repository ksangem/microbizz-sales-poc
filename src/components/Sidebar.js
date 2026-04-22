import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Radio,
  UserCheck,
  BarChart3,
  MessageSquare,
  Send,
  Target,
  Settings,
} from "lucide-react";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h2>MicroBizz</h2>
        <p>AI Sales Outreach POC</p>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-title">Overview</div>

        <NavLink
          to="/"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
          end
        >
          <LayoutDashboard />
          <span>Dashboard</span>
        </NavLink>

        <div className="nav-section-title">Pipeline Modules</div>

        <NavLink
          to="/signals"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <Radio />
          <span>1. Signal Monitor</span>
          <span className="nav-badge">8</span>
        </NavLink>

        <NavLink
          to="/enrich"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <UserCheck />
          <span>2. Enrich & Score</span>
        </NavLink>

        <NavLink
          to="/hubspot"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <BarChart3 />
          <span>3. HubSpot Dashboard</span>
          <span className="nav-badge">6</span>
        </NavLink>

        <NavLink
          to="/sales-action"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <Send />
          <span>4. Sales Action</span>
          <span className="nav-badge">1</span>
        </NavLink>

        <div className="nav-section-title">Tools</div>

        <NavLink
          to="/outreach"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <MessageSquare />
          <span>Outreach Assist</span>
          <span className="nav-badge">3</span>
        </NavLink>

        <NavLink
          to="/leads"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <BarChart3 />
          <span>Lead Scoring</span>
        </NavLink>

        <div className="nav-section-title">Management</div>

        <NavLink
          to="/tracker"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <Target />
          <span>POC Tracker</span>
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <Settings />
          <span>Settings</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="sync-indicator" style={{ marginBottom: 8 }}>
          <span className="sync-dot"></span>
          HubSpot Synced
        </div>
        Nalashaa Digital Solutions
        <br />
        POC v1.0 — April 2026
      </div>
    </div>
  );
};

export default Sidebar;
