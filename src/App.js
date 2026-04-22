import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import SignalMonitor from "./pages/SignalMonitor";
import EnrichScore from "./pages/EnrichScore";
import HubSpotDashboard from "./pages/HubSpotDashboard";
import SalesAction from "./pages/SalesAction";
import LeadScoring from "./pages/LeadScoring";
import OutreachAssist from "./pages/OutreachAssist";
import POCTracker from "./pages/POCTracker";
import Settings from "./pages/Settings";

function App() {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/signals" element={<SignalMonitor />} />
            <Route path="/enrich" element={<EnrichScore />} />
            <Route path="/hubspot" element={<HubSpotDashboard />} />
            <Route path="/sales-action" element={<SalesAction />} />
            <Route path="/leads" element={<LeadScoring />} />
            <Route path="/outreach" element={<OutreachAssist />} />
            <Route path="/tracker" element={<POCTracker />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
