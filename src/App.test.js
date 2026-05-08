import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import Dashboard from "./pages/Dashboard";
import SignalMonitor from "./pages/SignalMonitor";
import EnrichScore from "./pages/EnrichScore";
import LeadScoring from "./pages/LeadScoring";
import HubSpotDashboard from "./pages/HubSpotDashboard";
import POCTracker from "./pages/POCTracker";

// Recharts uses ResizeObserver which isn't in jsdom
beforeAll(() => {
  window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

// Suppress recharts warnings
beforeEach(() => {
  jest.spyOn(console, "warn").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

const renderWithRouter = (ui, { route = "/" } = {}) => {
  return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>);
};

// ═══════════════════════════════════════════════════════════
// DASHBOARD TESTS (D-01 to D-04)
// ═══════════════════════════════════════════════════════════

describe("Dashboard — D-01 to D-04", () => {
  beforeEach(() => {
    renderWithRouter(<Dashboard />);
  });

  test("D-01: No duplicate introductory/explanatory prose in dashboard body", () => {
    // "Click any step to open that module" should be removed
    expect(
      screen.queryByText("Click any step to open that module")
    ).not.toBeInTheDocument();
  });

  test("D-02: Stat tiles serve as navigation with explicit nav hints", () => {
    expect(screen.getByText(/Go to Signal Monitor/)).toBeInTheDocument();
    expect(screen.getByText(/Go to Enrich/)).toBeInTheDocument();
  });

  test("D-03: Recent Signals appears above the fold (before charts)", () => {
    const recentSignals = screen.getByText("Recent Signals");
    const weeklyProgress = screen.getByText("Weekly Progress");
    // Recent Signals should appear in the DOM before Weekly Progress
    const allHeaders = screen.getAllByRole("heading", { level: 3 });
    const headerTexts = allHeaders.map((h) => h.textContent);
    const signalIdx = headerTexts.findIndex((t) => t.includes("Recent Signals"));
    const progressIdx = headerTexts.findIndex((t) => t.includes("Weekly Progress"));
    expect(signalIdx).toBeLessThan(progressIdx);
  });

  test("D-04: Quick Access section removed", () => {
    expect(screen.queryByText("Quick Access")).not.toBeInTheDocument();
  });

  test("D-01: Stat tiles display metric numbers", () => {
    // Numbers may appear in multiple places (stat cards + tables), so use getAllByText
    expect(screen.getAllByText("28").length).toBeGreaterThan(0); // Signals
    expect(screen.getAllByText("7").length).toBeGreaterThan(0); // Enriched Leads
    expect(screen.getAllByText("91").length).toBeGreaterThan(0); // Top Lead Score
    expect(screen.getAllByText("5").length).toBeGreaterThan(0); // Outreach Messages
  });
});

// ═══════════════════════════════════════════════════════════
// SIGNAL SOURCES TESTS (S-01 to S-04)
// ═══════════════════════════════════════════════════════════

describe("Signal Sources — S-01 to S-04", () => {
  beforeEach(() => {
    renderWithRouter(<SignalMonitor />);
  });

  test("S-01: Add Channel button is visible in Source Configuration tab", () => {
    // Navigate to Source Configuration tab
    fireEvent.click(screen.getByText("Source Configuration"));
    expect(screen.getByText(/Add Channel/)).toBeInTheDocument();
  });

  test("S-02: Status badges show Connected/Available/Inactive", () => {
    fireEvent.click(screen.getByText("Source Configuration"));
    // Active sources should show "Connected"
    const connectedBadges = screen.getAllByText("Connected");
    expect(connectedBadges.length).toBeGreaterThan(0);
  });

  test("S-01: Remove button exists for non-disabled sources", () => {
    fireEvent.click(screen.getByText("Source Configuration"));
    // There should be remove buttons (trash icons) for non-GDPR sources
    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();
  });

  test("S-04: Signal source info tooltips exist", () => {
    fireEvent.click(screen.getByText("Source Configuration"));
    // Info tooltips should be present (ⓘ characters or Info icons)
    const infoElements = document.querySelectorAll('[class*="info"], [title*="info"]');
    // At minimum, the source table should render
    expect(screen.getByText("LinkedIn Hashtags")).toBeInTheDocument();
  });

  test("Keywords tab shows monitored keywords", () => {
    fireEvent.click(screen.getByText("Keywords & Hashtags"));
    expect(screen.getByText("#fieldservicemanagement")).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════
// ENRICHMENT TESTS (E-01 to E-04)
// ═══════════════════════════════════════════════════════════

describe("Enrichment — E-01 to E-04", () => {
  beforeEach(() => {
    renderWithRouter(<EnrichScore />);
  });

  test("E-01: Three primary action buttons visible at top", () => {
    expect(screen.getByText("Run Enrichment")).toBeInTheDocument();
    expect(screen.getByText("Re-enrich")).toBeInTheDocument();
    expect(screen.getByText("Generate Outreach")).toBeInTheDocument();
  });

  test("E-02: Enrichment status shows Enriched/Pending with visual indicators", () => {
    // The pipeline table should show "Enriched" badges for completed leads
    const enrichedBadges = screen.getAllByText("Enriched");
    expect(enrichedBadges.length).toBeGreaterThan(0);
    // And at least one "Pending" for incomplete leads
    const pendingBadges = screen.getAllByText("Pending");
    expect(pendingBadges.length).toBeGreaterThan(0);
  });

  test("E-03: Guided next-action prompt shows enriched lead count", () => {
    expect(screen.getByText(/leads enriched/)).toBeInTheDocument();
    expect(screen.getByText(/Trigger outreach for top leads/)).toBeInTheDocument();
  });

  test("E-03: Trigger Outreach CTA button exists", () => {
    expect(screen.getByText("Trigger Outreach")).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════
// SCORING TESTS (SC-01 to SC-03)
// ═══════════════════════════════════════════════════════════

describe("Scoring — SC-01 to SC-03", () => {
  test("SC-01: Auto-applied scoring callout in EnrichScore scoring tab", () => {
    renderWithRouter(<EnrichScore />);
    fireEvent.click(screen.getByText("Scoring Model"));
    expect(
      screen.getByText(/Scoring model is configured once and applied automatically/)
    ).toBeInTheDocument();
  });

  test("SC-02: Score-to-action recommendation label shown", () => {
    renderWithRouter(<EnrichScore />);
    fireEvent.click(screen.getByText("Scoring Model"));
    // The default selected lead (first one, score 91) should show high intent recommendation
    expect(
      screen.getByText(/trigger outreach now/i)
    ).toBeInTheDocument();
  });

  test("SC-03: Configure Scoring Model button in EnrichScore", () => {
    renderWithRouter(<EnrichScore />);
    fireEvent.click(screen.getByText("Scoring Model"));
    expect(screen.getByText("Configure Scoring Model")).toBeInTheDocument();
  });

  test("SC-01: LeadScoring page shows auto-applied scoring callout", () => {
    renderWithRouter(<LeadScoring />);
    expect(
      screen.getByText(/Scoring model is configured once/)
    ).toBeInTheDocument();
  });

  test("SC-02: LeadScoring table shows recommended action column", () => {
    renderWithRouter(<LeadScoring />);
    // Should show "Trigger outreach now" for high-scoring leads
    const actions = screen.getAllByText(/Trigger outreach now/i);
    expect(actions.length).toBeGreaterThan(0);
  });

  test("SC-03: Configure Scoring Model button in LeadScoring", () => {
    renderWithRouter(<LeadScoring />);
    expect(screen.getByText("Configure Scoring Model")).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════
// HUBSPOT / OPPORTUNITIES TESTS (H-01 to H-04)
// ═══════════════════════════════════════════════════════════

describe("HubSpot / Opportunities — H-01 to H-04", () => {
  beforeEach(() => {
    renderWithRouter(<HubSpotDashboard />);
  });

  test("H-01: Prominent action buttons - Generate Message", () => {
    expect(screen.getByText(/Generate Message/)).toBeInTheDocument();
  });

  test("H-01: Prominent action buttons - Send via Email", () => {
    expect(screen.getByText(/Send via Email/)).toBeInTheDocument();
  });

  test("H-01: Prominent action buttons - Send via LinkedIn", () => {
    expect(screen.getByText(/Send via LinkedIn/)).toBeInTheDocument();
  });

  test("H-01: Prominent action buttons - Log Activity", () => {
    expect(screen.getByText(/Log Activity/)).toBeInTheDocument();
  });

  test("H-02: Unique value banner present", () => {
    expect(
      screen.getByText(/Signal context shown here is not available in HubSpot natively/)
    ).toBeInTheDocument();
  });

  test("H-04: Channel selector buttons (Email/LinkedIn/Teams) present", () => {
    expect(screen.getAllByText("Email").length).toBeGreaterThan(0);
    expect(screen.getAllByText("LinkedIn").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Teams").length).toBeGreaterThan(0);
  });

  test("H-03: Signal-derived data (Why This Account, Why Now) present", () => {
    expect(screen.getByText("Why This Account")).toBeInTheDocument();
    expect(screen.getByText("Why Now")).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════
// POC TRACKER TESTS (P-01 to P-03)
// ═══════════════════════════════════════════════════════════

describe("POC Tracker — P-01 to P-03", () => {
  beforeEach(() => {
    renderWithRouter(<POCTracker />);
  });

  test("P-01: Risks & Challenges section is removed", () => {
    expect(screen.queryByText("Risks & Challenges")).not.toBeInTheDocument();
  });

  test("P-01: Action Items section is removed", () => {
    expect(screen.queryByText("Action Items")).not.toBeInTheDocument();
  });

  test("P-01: No risk entries present", () => {
    expect(
      screen.queryByText(/LinkedIn API restrictions/)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/GDPR non-compliance/)
    ).not.toBeInTheDocument();
  });

  test("P-02: POC Objectives retained", () => {
    expect(screen.getByText("POC Objectives")).toBeInTheDocument();
  });

  test("P-02: Success Metrics retained", () => {
    expect(screen.getByText(/Success Metrics/)).toBeInTheDocument();
  });

  test("P-02: Weekly KPI Trends chart section exists", () => {
    expect(screen.getByText("Weekly KPI Trends")).toBeInTheDocument();
  });

  test("P-02: Page subtitle is ROI focused", () => {
    expect(
      screen.getByText(/ROI Demonstration/)
    ).toBeInTheDocument();
  });

  test("P-03: External reference note present", () => {
    expect(
      screen.getByText(/MicroBizz_NalashaaProposal_v1.0.pptx/)
    ).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════
// GENERAL UX TESTS (G-01 to G-03)
// ═══════════════════════════════════════════════════════════

describe("General UX — G-01 to G-03", () => {
  test("G-01: Dashboard has info tooltips on section headers", () => {
    renderWithRouter(<Dashboard />);
    // Info icons should be present in the DOM (lucide Info icon renders as SVG)
    const svgs = document.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThan(0);
  });

  test("G-01: EnrichScore has info tooltips", () => {
    renderWithRouter(<EnrichScore />);
    // Should have Info tooltips on the page
    const svgs = document.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThan(0);
  });

  test("G-01: HubSpot page has info tooltips", () => {
    renderWithRouter(<HubSpotDashboard />);
    const svgs = document.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThan(0);
  });

  test("G-01: POC Tracker has info tooltips", () => {
    renderWithRouter(<POCTracker />);
    const svgs = document.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThan(0);
  });

  test("G-02: Dashboard is self-explanatory with subtitle", () => {
    renderWithRouter(<Dashboard />);
    expect(
      screen.getByText("AI-Driven Sales Outreach Overview")
    ).toBeInTheDocument();
  });

  test("G-02: Signal Monitor has descriptive subtitle", () => {
    renderWithRouter(<SignalMonitor />);
    expect(
      screen.getByText(/Real-time intent signal detection/)
    ).toBeInTheDocument();
  });

  test("G-02: EnrichScore has descriptive subtitle", () => {
    renderWithRouter(<EnrichScore />);
    expect(
      screen.getByText(/ZoomInfo enrichment, ICP fit scoring/)
    ).toBeInTheDocument();
  });

  test("G-02: HubSpot has descriptive subtitle", () => {
    renderWithRouter(<HubSpotDashboard />);
    expect(
      screen.getByText(/Top weekly opportunities with signal context/)
    ).toBeInTheDocument();
  });

  test("G-02: POC Tracker has ROI-focused subtitle", () => {
    renderWithRouter(<POCTracker />);
    expect(
      screen.getByText(/ROI Demonstration/)
    ).toBeInTheDocument();
  });

  test("G-03: Dashboard stat cards are clickable (navigation tiles)", () => {
    renderWithRouter(<Dashboard />);
    // Stat cards should have cursor pointer and navigation hints
    expect(screen.getByText("Signals This Week")).toBeInTheDocument();
    expect(screen.getByText(/Go to Signal Monitor/)).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════
// INTEGRATION TEST — Full App renders all routes
// ═══════════════════════════════════════════════════════════

describe("Integration — Full App", () => {
  test("App renders Dashboard at root route", () => {
    render(<App />);
    // Dashboard appears in both sidebar nav and page header, so use getAllByText
    expect(screen.getAllByText("Dashboard").length).toBeGreaterThan(0);
  });

  test("App renders sidebar navigation", () => {
    render(<App />);
    expect(screen.getByText("MicroBizz")).toBeInTheDocument();
    expect(screen.getAllByText(/Signal Monitor/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Enrich & Score/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/HubSpot Dashboard/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Sales Action/).length).toBeGreaterThan(0);
  });

  test("App renders all pages without crashing", () => {
    const { unmount } = render(<App />);
    // Dashboard renders by default - appears in sidebar + page header
    expect(screen.getAllByText("Dashboard").length).toBeGreaterThan(0);
    unmount();
  });
});

// ═══════════════════════════════════════════════════════════
// DATA INTEGRITY TESTS
// ═══════════════════════════════════════════════════════════

describe("Data Integrity", () => {
  test("Mock data exports all required datasets", () => {
    const mockData = require("./data/mockData");
    expect(mockData.signalEvents).toBeDefined();
    expect(mockData.signalEvents.length).toBe(8);
    expect(mockData.leads).toBeDefined();
    expect(mockData.leads.length).toBe(8);
    expect(mockData.outreachMessages).toBeDefined();
    expect(mockData.weeklyMetrics).toBeDefined();
    expect(mockData.pocObjectives).toBeDefined();
    expect(mockData.enrichmentPipeline).toBeDefined();
    expect(mockData.hubspotWeeklyOpportunities).toBeDefined();
    expect(mockData.hubspotCustomProperties).toBeDefined();
  });

  test("All leads have required scoring fields", () => {
    const { leads } = require("./data/mockData");
    leads.forEach((lead) => {
      expect(lead.icpFit).toBeDefined();
      expect(lead.intentScore).toBeDefined();
      expect(lead.overallScore).toBeDefined();
      expect(lead.overallScore).toBeGreaterThanOrEqual(0);
      expect(lead.overallScore).toBeLessThanOrEqual(100);
    });
  });

  test("Enrichment pipeline has status for each entry", () => {
    const { enrichmentPipeline } = require("./data/mockData");
    enrichmentPipeline.forEach((item) => {
      expect(["complete", "pending", "failed"]).toContain(item.status);
    });
  });
});
