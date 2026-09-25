import React, { useState, useEffect, useRef, useMemo } from 'react';

/* ------------------------------------------------------------------ */
/* ICONS                                                               */
/* ------------------------------------------------------------------ */

const ICON_PATHS = {
  Home: <><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
  PlusCircle: <><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></>,
  ShieldCheck: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></>,
  Award: <><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></>,
  User: <><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
  LogOut: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></>,
  MapPin: <><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></>,
  Flame: <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3.5z"/>,
  CheckCircle2: <><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></>,
  XCircle: <><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></>,
  AlertTriangle: <><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></>,
  UploadCloud: <><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m16 16-4-4-4 4"/></>,
  Clock: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
  Coins: <><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="m7 6 2.5 4"/></>,
  ArrowLeft: <><line x1="19" x2="5" y1="12" y2="12"/><polyline points="12 19 5 12 12 5"/></>,
  Layers: <><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></>,
  RefreshCw: <><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></>,
  Search: <><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></>,
  Bookmark: <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>,
  Crosshair: <><circle cx="12" cy="12" r="10"/><line x1="22" x2="18" y1="12" y2="12"/><line x1="6" x2="2" y1="12" y2="12"/><line x1="12" x2="12" y1="6" y2="2"/><line x1="12" x2="12" y1="22" y2="18"/></>,
  TrendingUp: <><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></>,
  FileText: <><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M16 13H8"/><path d="M16 17H8"/></>,
  Image: <><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></>,
};

const Icon = ({ name, size = 20, className = "" }) => {
  const paths = ICON_PATHS[name];
  if (!paths) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {paths}
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* DOMAIN: categories, benchmarks & the Pramaan audit engine           */
/* ------------------------------------------------------------------ */

// Benchmark = typical PWD schedule-of-rates cost for a standard fix in that category.
const CATEGORIES = {
  Roads:       { label: 'Roads & Potholes',            benchmark: 6500 },
  Water:       { label: 'Water Supply & Leakage',      benchmark: 11000 },
  Sanitation:  { label: 'Sanitation & Drainage',       benchmark: 8000 },
  Electricity: { label: 'Electricity & Cables',        benchmark: 5000 },
  Garbage:     { label: 'Garbage & Solid Waste',       benchmark: 7500 },
  Streetlight: { label: 'Streetlight & Illumination',  benchmark: 3500 },
};

const SEVERITY_WEIGHT = { Major: 3, Moderate: 2, Minor: 1 };
const BASE_REWARD = { Major: 400, Moderate: 300, Minor: 200 };
const COST_TOLERANCE = 0.15;
const APPROVAL_THRESHOLD = 75;

const SAMPLE_AFTER_IMG = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80";

// Priority = citizen resonance weighted by hazard severity. Drives the officer queue order.
const priorityScore = (issue) => issue.anumodanCount * (SEVERITY_WEIGHT[issue.severity] || 1);

const formatINR = (n) => `₹${Math.round(n).toLocaleString('en-IN')}`;

const nowStamp = () =>
  new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

/**
 * Deterministic Pramaan audit. Every check shown on the verification screen
 * is derived from this result, so the UI can never claim a pass the data doesn't support.
 */
function runPramaan({ category, severity, reportedCost, locationOk = true, timestampOk = true, tamperDetected = false, beforeImg, afterImg, workNotes = '' }) {
  const benchCost = CATEGORIES[category]?.benchmark ?? 6000;
  const variance = (reportedCost - benchCost) / benchCost;
  const costOk = variance <= COST_TOLERANCE;

  let confidence = 99 - Math.min(10, Math.round(Math.max(0, variance) * 10));
  if (!locationOk) confidence -= 25;
  if (!timestampOk) confidence -= 15;
  if (tamperDetected) confidence -= 30;
  // Any overrun past tolerance must land below the approval threshold on its own.
  if (!costOk) confidence -= 20 + Math.min(20, Math.round((variance - COST_TOLERANCE) * 100));
  confidence = Math.max(5, Math.min(99, confidence));

  const approved = confidence >= APPROVAL_THRESHOLD;
  const savingsBonus = variance < 0 ? Math.min(150, Math.round((-variance * benchCost) / 20)) : 0;

  return {
    locationOk,
    timestampOk,
    costOk,
    variance,
    reportedCost,
    benchCost,
    tamperDetected,
    confidence,
    approved,
    coins: approved ? (BASE_REWARD[severity] || 200) + savingsBonus : 0,
    beforeImg,
    afterImg,
    workNotes,
    auditedAt: nowStamp(),
  };
}

/* ------------------------------------------------------------------ */
/* SEED DATA                                                           */
/* ------------------------------------------------------------------ */

const CITIZEN_DEMO = { role: 'citizen', name: 'Aarav Sharma', id: '+91 98451 22019', alwaysAnonymous: false };
const OFFICER_DEMO = { role: 'officer', name: 'Er. Ramesh Kulkarni', id: 'EMP-BLR-4091', alwaysAnonymous: false };

const DAY = 86400000;
const SEED_NOW = Date.now();

const INITIAL_ISSUES = [
  {
    id: "ISS-9821",
    title: "Deep pothole hazard near 4th Cross signal",
    description: "Multiple two-wheelers skidded last night due to continuous water leakage eroding the main asphalt layer right before the signal turning.",
    category: "Roads",
    location: "Indiranagar 100ft Road, Ward 112",
    severity: "Major",
    anumodanCount: 142,
    hasVoted: false,
    isTracked: true,
    status: "Pending",
    claimedBy: null,
    reporterId: CITIZEN_DEMO.id,
    reporterName: CITIZEN_DEMO.name,
    image: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    createdAt: SEED_NOW - 2 * DAY,
    verification: null,
  },
  {
    id: "ISS-9822",
    title: "Burst pipeline flooding residential by-lane",
    description: "Drinking water main cracked during cable excavation. Clean water has been overflowing into basements for 18 hours.",
    category: "Water",
    location: "Lane 4, BTM Layout 2nd Stage, Ward 176",
    severity: "Major",
    anumodanCount: 89,
    hasVoted: false,
    isTracked: false,
    status: "Claimed",
    claimedBy: OFFICER_DEMO.id,
    reporterId: "anon-1",
    reporterName: null,
    image: "https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&w=800&q=80",
    createdAt: SEED_NOW - 3 * DAY,
    verification: null,
  },
  {
    id: "ISS-9823",
    title: "Garbage dump outside primary school gate",
    description: "Community waste bin missing for 3 weeks, leading to open burning of solid garbage right next to the government school entrance.",
    category: "Garbage",
    location: "Gandhi Nagar Model School, Ward 94",
    severity: "Moderate",
    anumodanCount: 64,
    hasVoted: false,
    isTracked: true,
    status: "Flagged",
    claimedBy: "EMP-BLR-3317",
    reporterId: "+91 99010 44120",
    reporterName: "Meera Iyer",
    image: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80",
    createdAt: SEED_NOW - 4 * DAY,
    verification: runPramaan({
      category: "Garbage", severity: "Moderate", reportedCost: 18000, timestampOk: false, tamperDetected: true,
      beforeImg: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=600&q=80",
      afterImg: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80",
      workNotes: "Area cleared, new 1100L bin installed.",
    }),
  },
  {
    id: "ISS-9824",
    title: "5-pole streetlight outage on Ring Road curve",
    description: "High-collision hairpin turn has been pitch black since Monday's thunderstorm, risking pedestrians and freight trucks.",
    category: "Streetlight",
    location: "Outer Ring Road Junction 14, Ward 85",
    severity: "Minor",
    anumodanCount: 31,
    hasVoted: false,
    isTracked: false,
    status: "Completed",
    claimedBy: OFFICER_DEMO.id,
    reporterId: CITIZEN_DEMO.id,
    reporterName: null,
    image: null,
    createdAt: SEED_NOW - 5 * DAY,
    verification: runPramaan({
      category: "Streetlight", severity: "Minor", reportedCost: 3100,
      beforeImg: null,
      afterImg: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=600&q=80",
      workNotes: "Replaced 5 sodium fixtures with 90W LED, re-cabled junction box.",
    }),
  },
  {
    id: "ISS-9825",
    title: "Open storm drain overflowing onto footpath",
    description: "Drain slab broken and choked with silt; sewage mixes with rainwater and floods the bus stop every evening.",
    category: "Sanitation",
    location: "Jayanagar 4th T Block, 9th Main Road Bus Shelter",
    severity: "Moderate",
    anumodanCount: 47,
    hasVoted: false,
    isTracked: false,
    status: "Pending",
    claimedBy: null,
    reporterId: "anon-2",
    reporterName: null,
    image: null,
    createdAt: SEED_NOW - 1 * DAY,
    verification: null,
  },
  {
    id: "ISS-9826",
    title: "Live cable dangling at pedestrian height",
    description: "BESCOM service cable snapped from pole and hangs 5 ft above the pavement outside the college entrance.",
    category: "Electricity",
    location: "Koramangala 5th Block, Jyoti Nivas College Road",
    severity: "Major",
    anumodanCount: 23,
    hasVoted: false,
    isTracked: false,
    status: "Pending",
    claimedBy: null,
    reporterId: "+91 90080 55671",
    reporterName: "Farhan Ali",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80",
    createdAt: SEED_NOW - 6 * 3600000,
    verification: null,
  },
];

const INITIAL_OFFICERS = [
  { id: "EMP-BLR-4091", name: "Er. Ramesh Kulkarni", ward: "Ward 112 (East Zone - PWD)", resolved: 142, coins: 18450, efficiency: 98.4 },
  { id: "EMP-BLR-2208", name: "Pooja Deshmukh", ward: "Ward 176 (South Water Supply)", resolved: 129, coins: 16900, efficiency: 96.1 },
  { id: "EMP-BLR-3317", name: "Vikas Narayan", ward: "Ward 94 (Central Solid Waste)", resolved: 114, coins: 14750, efficiency: 94.7 },
  { id: "EMP-BLR-1150", name: "Suresh Pillai", ward: "Ward 85 (Infra & Electrical)", resolved: 98, coins: 12800, efficiency: 92.3 },
  { id: "EMP-BLR-5521", name: "Ananya Sen", ward: "Ward 64 (Stormwater Drainage)", resolved: 87, coins: 11200, efficiency: 90.8 },
  { id: "EMP-BLR-6603", name: "K. Mohan Das", ward: "Ward 103 (Sanitation Hub)", resolved: 73, coins: 9600, efficiency: 89.2 },
  { id: "EMP-BLR-7740", name: "Harpreet Singh", ward: "Ward 42 (Bridges & Flyovers)", resolved: 65, coins: 8100, efficiency: 87.5 },
];

const ADDRESS_SUGGESTIONS = [
  "Indiranagar 100ft Road, 4th Cross Corner, Ward 112",
  "BTM Layout 2nd Stage, Outer Ring Road Service Lane",
  "Gandhi Nagar 3rd Main, near Government Primary School",
  "Outer Ring Road Junction 14, Bellandur Flyover Downramp",
  "Koramangala 5th Block, Jyoti Nivas College Road",
  "Jayanagar 4th T Block, 9th Main Road Bus Shelter",
];

// Data URLs survive sandboxed hosts that block blob: images.
const readAsDataUrl = (file, onLoad) => {
  const reader = new FileReader();
  reader.onload = () => onLoad(reader.result);
  reader.readAsDataURL(file);
};

const relativeDate = (ts) => {
  const diff = Date.now() - ts;
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
  if (diff < DAY) return `${Math.floor(diff / 3600000)} hr ago`;
  return new Date(ts).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

/* ------------------------------------------------------------------ */
/* APP SHELL                                                           */
/* ------------------------------------------------------------------ */

export default function App() {
  const [user, setUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('auth'); // 'auth' | 'feed' | 'post' | 'taskboard' | 'saboot' | 'pramaan' | 'ledger' | 'profile'
  const [activeIssueId, setActiveIssueId] = useState(null);
  const [issues, setIssues] = useState(INITIAL_ISSUES);
  const [officers, setOfficers] = useState(INITIAL_OFFICERS);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => { window.scrollTo(0, 0); }, [currentScreen, activeIssueId]);

  const notify = (message, tone = 'success') => setToast({ message, tone, key: Date.now() });

  const activeIssue = issues.find(i => i.id === activeIssueId) || null;
  const auditedIssues = issues.filter(i => i.verification);

  const homeScreen = (role) => (role === 'officer' ? 'taskboard' : 'feed');

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentScreen(homeScreen(userData.role));
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentScreen('auth');
    setActiveIssueId(null);
  };

  const handleInstantSwitchRole = () => {
    const next = user.role === 'citizen' ? OFFICER_DEMO : CITIZEN_DEMO;
    setUser(next);
    setCurrentScreen(homeScreen(next.role));
    notify(`Switched to ${next.role === 'officer' ? 'Officer' : 'Citizen'} view`, 'info');
  };

  const updateIssue = (id, fn) => setIssues(prev => prev.map(i => (i.id === id ? fn(i) : i)));

  // Voting also tracks the issue, so citizens can follow what they supported.
  const handleAnumodanVote = (id) => updateIssue(id, (issue) => {
    const hasVoted = !issue.hasVoted;
    return {
      ...issue,
      hasVoted,
      isTracked: hasVoted ? true : issue.isTracked,
      anumodanCount: issue.anumodanCount + (hasVoted ? 1 : -1),
    };
  });

  const handleToggleTrack = (id) => updateIssue(id, (issue) => ({ ...issue, isTracked: !issue.isTracked }));

  const handleClaimIssue = (id) => {
    updateIssue(id, (issue) => ({ ...issue, status: 'Claimed', claimedBy: user.id }));
    notify(`${id} claimed — find it in your Claimed Workspace`);
  };

  const openSaboot = (issue) => { setActiveIssueId(issue.id); setCurrentScreen('saboot'); };
  const openPramaan = (issue) => { setActiveIssueId(issue?.id ?? null); setCurrentScreen('pramaan'); };

  const handlePostSubmit = (newIssue) => {
    setIssues(prev => [newIssue, ...prev]);
    setCurrentScreen('feed');
    notify(`Awaaz ${newIssue.id} published to the ward radar`);
  };

  const handleSabootSubmit = (issueId, verification) => {
    updateIssue(issueId, (issue) => ({
      ...issue,
      status: verification.approved ? 'Completed' : 'Flagged',
      verification,
    }));

    if (verification.approved) {
      setOfficers(prev => {
        const exists = prev.some(o => o.id === user.id);
        const base = exists ? prev : [...prev, { id: user.id, name: user.name, ward: 'Newly onboarded', resolved: 0, coins: 0, efficiency: 90 }];
        return base.map(o => o.id === user.id ? { ...o, resolved: o.resolved + 1, coins: o.coins + verification.coins } : o);
      });
    }
    setCurrentScreen('pramaan');
  };

  const handleSelectPramaanDefault = () => {
    // Prefer an audit the viewer cares about: officers see their own, citizens see tracked ones.
    const preferred = user.role === 'officer'
      ? auditedIssues.find(i => i.claimedBy === user.id)
      : auditedIssues.find(i => i.isTracked || i.reporterId === user.id);
    openPramaan(activeIssue?.verification ? activeIssue : (preferred || auditedIssues[0]));
  };

  if (currentScreen === 'auth' || !user) {
    return (
      <Shell>
        <ScreenAuth onLogin={handleLogin} />
      </Shell>
    );
  }

  const isOfficer = user.role === 'officer';

  return (
    <Shell>
      <div className="flex w-full min-h-screen">
        <Sidebar
          user={user}
          currentScreen={currentScreen}
          onNavigate={setCurrentScreen}
          onLogout={handleLogout}
          onSelectPramaan={handleSelectPramaanDefault}
        />

        <div className="flex-1 lg:ml-[260px] flex flex-col min-h-screen bg-[#06141B] pb-20 lg:pb-0">
          <header className="sticky top-0 z-30 bg-[#11212D]/95 backdrop-blur border-b border-[#9BA8AB]/20 px-4 sm:px-8 py-3 flex flex-wrap gap-3 items-center justify-between card-shadow">
            <div className="flex items-center gap-3 min-w-0">
              <div className="lg:hidden w-8 h-8 rounded-lg bg-[#253745] flex items-center justify-center text-[#6BBF4A] flex-shrink-0">
                <Icon name="Layers" size={18} />
              </div>
              <span className="text-[12px] uppercase text-[#9BA8AB] font-semibold tracking-wider hidden sm:inline">
                Active Session:
              </span>
              <span className={`px-3 py-1 rounded text-[12px] uppercase font-bold tracking-wider flex items-center gap-1.5 truncate ${
                isOfficer
                  ? 'bg-[#FF9800]/20 text-[#FF9800] border border-[#FF9800]/40'
                  : 'bg-[#6BBF4A]/20 text-[#6BBF4A] border border-[#6BBF4A]/40'
              }`}>
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isOfficer ? 'bg-[#FF9800]' : 'bg-[#6BBF4A]'}`} />
                <span className="truncate">{isOfficer ? 'Officer' : 'Citizen'} · {user.name}</span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] text-[#9BA8AB] uppercase tracking-wider hidden xl:inline">
                Judge Testing Tool:
              </span>
              <button
                onClick={handleInstantSwitchRole}
                className="px-3.5 py-1.5 bg-[#253745] hover:bg-[#4A5C6A] text-[#CCD0CF] rounded-lg text-[12px] uppercase font-bold flex items-center gap-2 border border-[#9BA8AB]/20 btn-interact"
                title="Instantly toggle between Citizen and Officer interfaces without logging out"
              >
                <Icon name="RefreshCw" size={14} className="text-[#6BBF4A]" />
                <span>Switch to {isOfficer ? 'Citizen' : 'Officer'}<span className="hidden md:inline"> View</span></span>
              </button>
            </div>
          </header>

          <main className="flex-1 px-4 sm:px-8 py-6 sm:py-8 max-w-[1440px] w-full mx-auto">
            {currentScreen === 'feed' && (
              <ScreenAwaazFeed
                issues={issues}
                onAnumodan={handleAnumodanVote}
                onToggleTrack={handleToggleTrack}
                onViewPramaan={openPramaan}
                onPost={() => setCurrentScreen('post')}
              />
            )}

            {currentScreen === 'post' && (
              <ScreenPostAwaaz
                user={user}
                issues={issues}
                onCancel={() => setCurrentScreen(homeScreen(user.role))}
                onSubmit={handlePostSubmit}
                onSupportExisting={(id) => {
                  const target = issues.find(i => i.id === id);
                  if (target && !target.hasVoted) handleAnumodanVote(id);
                  setCurrentScreen('feed');
                  notify(`Added your Anumodan to ${id} instead of filing a duplicate`);
                }}
              />
            )}

            {currentScreen === 'taskboard' && (
              <ScreenOfficerTaskBoard
                issues={issues}
                user={user}
                onClaim={handleClaimIssue}
                onOpenSaboot={openSaboot}
                onOpenPramaan={openPramaan}
              />
            )}

            {currentScreen === 'saboot' && activeIssue && (
              <ScreenSabootSubmission
                issue={activeIssue}
                onBack={() => setCurrentScreen('taskboard')}
                onSubmit={handleSabootSubmit}
              />
            )}

            {currentScreen === 'pramaan' && (
              <ScreenAIVerification
                issue={activeIssue?.verification ? activeIssue : null}
                pendingIssue={activeIssue && !activeIssue.verification ? activeIssue : null}
                auditedIssues={auditedIssues}
                user={user}
                onSelect={openPramaan}
                onResubmit={openSaboot}
                onBack={() => setCurrentScreen(homeScreen(user.role))}
              />
            )}

            {currentScreen === 'ledger' && (
              <ScreenPublicLedger officers={officers} currentUserId={user.id} />
            )}

            {currentScreen === 'profile' && (
              <ScreenProfile
                user={user}
                issues={issues}
                officers={officers}
                onViewPramaan={openPramaan}
              />
            )}
          </main>
        </div>

        <MobileNav
          user={user}
          currentScreen={currentScreen}
          onNavigate={setCurrentScreen}
          onSelectPramaan={handleSelectPramaanDefault}
        />
      </div>

      {toast && <Toast key={toast.key} message={toast.message} tone={toast.tone} />}
    </Shell>
  );
}

function Shell({ children }) {
  return (
    <div className="min-h-screen bg-[#06141B] text-[#CCD0CF] antialiased font-['Lora',serif]">
      <style>{`
        .font-bebas { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.05em; text-transform: uppercase; font-weight: 400 !important; }
        .btn-interact { transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1); }
        .btn-interact:hover:not(:disabled) { filter: brightness(1.12); transform: translateY(-1px); cursor: pointer; }
        .btn-interact:active:not(:disabled) { transform: scale(0.96) !important; }
        .card-shadow { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4); }
        @keyframes toast-in { from { opacity: 0; transform: translate(-50%, 12px); } to { opacity: 1; transform: translate(-50%, 0); } }
        .toast-in { animation: toast-in 0.25s ease-out; }
        :focus-visible { outline: 2px solid #6BBF4A; outline-offset: 2px; }
      `}</style>
      {children}
    </div>
  );
}

function Toast({ message, tone }) {
  const tones = {
    success: 'bg-[#6BBF4A] text-black',
    info: 'bg-[#253745] text-[#CCD0CF] border border-[#9BA8AB]/30',
    warn: 'bg-[#FF9800] text-black',
  };
  return (
    <div role="status" className={`toast-in fixed left-1/2 -translate-x-1/2 bottom-24 lg:bottom-8 z-[60] px-5 py-3 rounded-xl card-shadow text-[14px] font-semibold flex items-center gap-2 max-w-[90vw] ${tones[tone] || tones.info}`}>
      <Icon name={tone === 'warn' ? 'AlertTriangle' : 'CheckCircle2'} size={18} />
      {message}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* NAVIGATION                                                          */
/* ------------------------------------------------------------------ */

const navItemsFor = (user, onSelectPramaan) => (user.role === 'citizen'
  ? [
      { id: 'feed', label: 'Awaaz Feed', short: 'Feed', icon: 'Home' },
      { id: 'post', label: 'Post Awaaz', short: 'Post', icon: 'PlusCircle' },
      { id: 'pramaan', label: 'AI Verification', short: 'Pramaan', icon: 'ShieldCheck', action: onSelectPramaan },
      { id: 'ledger', label: 'Team Ledger', short: 'Ledger', icon: 'Award' },
      { id: 'profile', label: 'Citizen Profile', short: 'Profile', icon: 'User' },
    ]
  : [
      { id: 'taskboard', label: 'Task Board', short: 'Tasks', icon: 'Home' },
      { id: 'pramaan', label: 'AI Verification', short: 'Pramaan', icon: 'ShieldCheck', action: onSelectPramaan },
      { id: 'ledger', label: 'Team Ledger', short: 'Ledger', icon: 'Award' },
      { id: 'profile', label: 'Officer Profile', short: 'Profile', icon: 'User' },
    ]);

const isNavActive = (itemId, currentScreen) =>
  currentScreen === itemId || (itemId === 'taskboard' && currentScreen === 'saboot');

function Sidebar({ user, currentScreen, onNavigate, onLogout, onSelectPramaan }) {
  const isCitizen = user.role === 'citizen';
  const navItems = navItemsFor(user, onSelectPramaan);

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-[260px] bg-[#4A5C6A] flex-col justify-between p-5 z-40 border-r border-[#9BA8AB]/20 card-shadow">
      <div>
        <div className="flex items-center gap-3 px-2 py-4 mb-5 border-b border-[#9BA8AB]/20">
          <div className="w-10 h-10 rounded-lg bg-[#11212D] flex items-center justify-center border border-[#9BA8AB]/30 text-[#6BBF4A]">
            <Icon name="Layers" size={22} />
          </div>
          <div>
            <h1 className="font-bebas text-[28px] tracking-wider text-[#CCD0CF] leading-none m-0">JANSETU</h1>
            <span className="text-[11px] text-[#9BA8AB] tracking-widest uppercase font-sans font-semibold">Civic Bridge v2.5</span>
          </div>
        </div>

        <div className="mb-6 px-3 py-2 rounded-lg bg-[#253745]/80 border border-[#9BA8AB]/20 flex items-center justify-between">
          <span className="text-[11px] uppercase text-[#9BA8AB] font-semibold">Role View</span>
          <span className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded ${
            isCitizen ? 'bg-[#6BBF4A]/20 text-[#6BBF4A]' : 'bg-[#FF9800]/20 text-[#FF9800]'
          }`}>
            {isCitizen ? 'Citizen' : 'Officer'}
          </span>
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = isNavActive(item.id, currentScreen);
            return (
              <button
                key={item.id}
                onClick={() => (item.action ? item.action() : onNavigate(item.id))}
                aria-current={isActive ? 'page' : undefined}
                className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-lg font-semibold tracking-wide btn-interact text-left ${
                  isActive
                    ? 'bg-[#11212D] text-[#CCD0CF] shadow-inner border border-[#9BA8AB]/30'
                    : 'text-[#CCD0CF]/85 hover:bg-[#253745] hover:text-[#CCD0CF] border border-transparent'
                }`}
              >
                <Icon
                  name={item.icon}
                  size={20}
                  className={isActive ? (isCitizen ? "text-[#6BBF4A]" : "text-[#FF9800]") : "text-[#9BA8AB]"}
                />
                <span className="uppercase text-[13px]">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-[#9BA8AB]/20">
        <div className="flex items-center gap-3 px-2 py-2 mb-2">
          <div className="w-10 h-10 rounded-full bg-[#253745] border border-[#9BA8AB]/30 flex items-center justify-center text-[#CCD0CF] font-bold text-sm">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-[#CCD0CF] truncate leading-tight">{user.name}</p>
            <p className="text-[11px] text-[#9BA8AB] truncate font-mono">{user.id}</p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#253745] hover:bg-[#F44336]/20 text-[#CCD0CF] hover:text-[#F44336] text-[13px] font-bold uppercase tracking-wider btn-interact border border-[#9BA8AB]/20"
        >
          <Icon name="LogOut" size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

function MobileNav({ user, currentScreen, onNavigate, onSelectPramaan }) {
  const navItems = navItemsFor(user, onSelectPramaan);
  const accent = user.role === 'citizen' ? 'text-[#6BBF4A]' : 'text-[#FF9800]';
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#11212D]/95 backdrop-blur border-t border-[#9BA8AB]/20 flex justify-around px-2 pt-2" style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}>
      {navItems.map((item) => {
        const isActive = isNavActive(item.id, currentScreen);
        return (
          <button
            key={item.id}
            onClick={() => (item.action ? item.action() : onNavigate(item.id))}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] uppercase font-bold ${isActive ? accent : 'text-[#9BA8AB]'}`}
          >
            <Icon name={item.icon} size={20} />
            {item.short}
          </button>
        );
      })}
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* SHARED UI                                                           */
/* ------------------------------------------------------------------ */

const CATEGORY_TINT = {
  Roads: '#4A5C6A', Water: '#2B6CB0', Sanitation: '#5A6B3A', Electricity: '#B7791F', Garbage: '#6B4F3A', Streetlight: '#7B5EA7',
};

// Falls back to a labelled placeholder when there's no photo or the URL fails to load.
function IssueImage({ src, category, alt, className = "" }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => { setFailed(false); }, [src]);

  if (!src || failed) {
    const tint = CATEGORY_TINT[category] || '#4A5C6A';
    return (
      <div
        className={`flex flex-col items-center justify-center text-[#CCD0CF]/80 ${className}`}
        style={{ background: `linear-gradient(135deg, ${tint}55, #06141B 85%)` }}
        role="img"
        aria-label={alt}
      >
        <Icon name="Image" size={32} className="opacity-60 mb-1" />
        <span className="font-bebas text-[16px] opacity-80">{CATEGORIES[category]?.label || category}</span>
        <span className="text-[11px] opacity-60">No photo attached</span>
      </div>
    );
  }
  return <img src={src} alt={alt} onError={() => setFailed(true)} className={`object-cover ${className}`} />;
}

const STATUS_META = {
  Pending:   { label: 'Awaiting Officer', cls: 'bg-[#253745] text-[#9BA8AB]' },
  Claimed:   { label: 'Work In Progress', cls: 'bg-[#FF9800]/20 text-[#FF9800]' },
  Completed: { label: 'Verified Resolved', cls: 'bg-[#6BBF4A]/20 text-[#6BBF4A]' },
  Flagged:   { label: 'Flagged · Human Review', cls: 'bg-[#F44336]/20 text-[#F44336]' },
};

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.Pending;
  return <span className={`px-2.5 py-0.5 rounded text-[11px] uppercase font-bold tracking-wide whitespace-nowrap ${meta.cls}`}>{meta.label}</span>;
}

// Reported → Claimed → Saboot → Pramaan verdict
function StatusStepper({ status }) {
  const reached = { Pending: 1, Claimed: 2, Completed: 4, Flagged: 4 }[status] || 1;
  const steps = ['Reported', 'Claimed', 'Saboot Filed', status === 'Flagged' ? 'Under Review' : 'Verified'];
  return (
    <ol className="flex items-center w-full" aria-label="Resolution progress">
      {steps.map((label, idx) => {
        const done = idx < reached;
        const isLastFlag = status === 'Flagged' && idx === 3;
        const dot = isLastFlag ? 'bg-[#F44336] border-[#F44336]' : done ? 'bg-[#6BBF4A] border-[#6BBF4A]' : 'bg-transparent border-[#4A5C6A]';
        return (
          <li key={label} className="flex-1 flex items-center last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <span className={`w-3 h-3 rounded-full border-2 ${dot}`} />
              <span className={`text-[10px] uppercase font-bold tracking-wide whitespace-nowrap ${isLastFlag ? 'text-[#F44336]' : done ? 'text-[#CCD0CF]' : 'text-[#9BA8AB]/60'}`}>{label}</span>
            </div>
            {idx < steps.length - 1 && (
              <span className={`flex-1 h-0.5 mx-1 -mt-4 ${idx < reached - 1 ? 'bg-[#6BBF4A]' : 'bg-[#253745]'}`} />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function StatTile({ label, value, icon, accent = 'text-[#CCD0CF]' }) {
  return (
    <div className="bg-[#11212D] border border-[#9BA8AB]/15 rounded-xl p-4 card-shadow">
      <span className="text-[11px] uppercase text-[#9BA8AB] block mb-1 font-semibold tracking-wide">{label}</span>
      <div className="flex items-center gap-2">
        {icon && <Icon name={icon} size={20} className={accent} />}
        <span className={`font-bebas text-[28px] leading-none ${accent}`}>{value}</span>
      </div>
    </div>
  );
}

type PageHeaderProps = { title: string; subtitle?: string; onBack?: () => void; children?: React.ReactNode };

function PageHeader({ title, subtitle, onBack, children }: PageHeaderProps) {
  return (
    <div className="flex flex-wrap gap-4 items-center justify-between mb-6 pb-4 border-b border-[#253745]">
      <div className="flex items-center gap-3 min-w-0">
        {onBack && (
          <button onClick={onBack} aria-label="Back" className="p-2 rounded-lg bg-[#253745] hover:bg-[#4A5C6A] text-[#CCD0CF] btn-interact flex-shrink-0">
            <Icon name="ArrowLeft" size={20} />
          </button>
        )}
        <div className="min-w-0">
          <h1 className="font-bebas text-[28px] sm:text-[32px] text-[#CCD0CF] leading-tight m-0">{title}</h1>
          {subtitle && <p className="text-[13px] sm:text-[14px] text-[#9BA8AB] mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

function SegmentedTabs({ value, onChange, options }) {
  return (
    <div className="flex bg-[#11212D] border border-[#9BA8AB]/20 rounded-lg p-1 overflow-x-auto">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-4 py-2 text-[13px] uppercase font-semibold rounded-md btn-interact whitespace-nowrap ${
            value === opt.value ? 'bg-[#4A5C6A] text-[#CCD0CF] shadow' : 'text-[#9BA8AB] hover:text-[#CCD0CF]'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

const inputCls = "w-full bg-[#06141B] border border-[#9BA8AB]/30 rounded-lg px-4 py-3 text-[#CCD0CF] text-[15px] focus:outline-none focus:border-[#6BBF4A] placeholder:text-[#9BA8AB]/50";
const labelCls = "block text-[12px] uppercase text-[#9BA8AB] font-semibold mb-2";

/* ------------------------------------------------------------------ */
/* SCREEN 1: AUTH                                                      */
/* ------------------------------------------------------------------ */

function ScreenAuth({ onLogin }) {
  const [role, setRole] = useState('citizen');
  const [mode, setMode] = useState('signin');
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [alwaysAnonymous, setAlwaysAnonymous] = useState(false);

  const demo = role === 'officer' ? OFFICER_DEMO : CITIZEN_DEMO;

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({
      role,
      name: name.trim() || demo.name,
      id: identifier.trim() || demo.id,
      alwaysAnonymous: role === 'citizen' ? alwaysAnonymous : false,
    });
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[#06141B]">
      <div className="w-full max-w-[480px] bg-[#11212D] border border-[#9BA8AB]/20 rounded-xl p-6 sm:p-8 card-shadow">
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-xl bg-[#253745] flex items-center justify-center border border-[#9BA8AB]/30 text-[#6BBF4A] mb-3">
            <Icon name="Layers" size={32} />
          </div>
          <h1 className="font-bebas text-[32px] text-[#CCD0CF] leading-tight tracking-wider">JANSETU CIVIC PORTAL</h1>
          <p className="text-[14px] text-[#9BA8AB] mt-1">Citizen Accountability & Municipal Nivaran Framework</p>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-6 text-center">
          {[['Awaaz', 'Citizens report'], ['Saboot', 'Officers prove'], ['Pramaan', 'AI verifies']].map(([t, s], i) => (
            <div key={t} className="rounded-lg bg-[#06141B] border border-[#9BA8AB]/15 py-2 px-1">
              <span className="block font-bebas text-[16px] text-[#CCD0CF]">{i + 1}. {t}</span>
              <span className="text-[10px] text-[#9BA8AB] uppercase tracking-wide">{s}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 p-1 bg-[#06141B] rounded-lg border border-[#9BA8AB]/20 mb-5" role="tablist">
          {[['citizen', 'Citizen'], ['officer', 'Municipal Officer']].map(([val, label]) => (
            <button
              key={val}
              type="button"
              role="tab"
              aria-selected={role === val}
              onClick={() => setRole(val)}
              className={`py-2 text-[14px] font-semibold uppercase rounded-md btn-interact ${
                role === val ? 'bg-[#4A5C6A] text-[#CCD0CF] shadow' : 'text-[#9BA8AB] hover:text-[#CCD0CF]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex border-b border-[#253745] mb-6">
          {[['signin', 'Sign In'], ['create', 'Create Account']].map(([val, label]) => (
            <button
              key={val}
              type="button"
              onClick={() => setMode(val)}
              className={`flex-1 pb-3 text-center text-[15px] uppercase font-semibold border-b-2 btn-interact ${
                mode === val ? 'border-[#6BBF4A] text-[#CCD0CF]' : 'border-transparent text-[#9BA8AB] hover:text-[#CCD0CF]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'create' && (
            <div>
              <label htmlFor="auth-name" className={labelCls}>Full Name</label>
              <input id="auth-name" type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder={`e.g. ${demo.name}`} className={inputCls} />
            </div>
          )}

          <div>
            <label htmlFor="auth-id" className={labelCls}>{role === 'citizen' ? 'Mobile / Email' : 'Official Employee ID / Email'}</label>
            <input id="auth-id" type="text" required value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder={demo.id} className={inputCls} />
          </div>

          <div>
            <label htmlFor="auth-pw" className={labelCls}>Password</label>
            <input id="auth-pw" type="password" required minLength={4} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••••••" className={inputCls} />
          </div>

          {role === 'citizen' && mode === 'create' && (
            <div className="flex items-center justify-between p-3 bg-[#06141B] border border-[#9BA8AB]/20 rounded-lg">
              <div>
                <span className="block text-[13px] font-semibold text-[#CCD0CF]">Always Post Anonymously</span>
                <span className="text-[11px] text-[#9BA8AB]">Mask identity on public ward feed</span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={alwaysAnonymous}
                aria-label="Always post anonymously"
                onClick={() => setAlwaysAnonymous(!alwaysAnonymous)}
                className={`w-11 h-6 rounded-full transition-colors p-0.5 ${alwaysAnonymous ? 'bg-[#6BBF4A]' : 'bg-[#253745]'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${alwaysAnonymous ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          )}

          <button type="submit" className="w-full mt-2 py-3 bg-[#4A5C6A] hover:bg-[#6BBF4A] hover:text-black text-[#CCD0CF] font-semibold text-[16px] uppercase tracking-wider rounded-lg btn-interact border border-[#9BA8AB]/30 card-shadow">
            {mode === 'create' ? 'Create Account & Continue' : 'Continue'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#9BA8AB]/20 text-center">
          <span className="text-[11px] uppercase tracking-widest text-[#9BA8AB] font-bold block mb-3">⚖️ Judge & Evaluator Fast Demo Access</span>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => onLogin(CITIZEN_DEMO)} className="py-2.5 px-3 bg-[#253745] hover:bg-[#6BBF4A] hover:text-black text-[#CCD0CF] rounded-lg text-[13px] uppercase font-bold btn-interact border border-[#9BA8AB]/20">
              Demo — Citizen
            </button>
            <button type="button" onClick={() => onLogin(OFFICER_DEMO)} className="py-2.5 px-3 bg-[#253745] hover:bg-[#FF9800] hover:text-black text-[#CCD0CF] rounded-lg text-[13px] uppercase font-bold btn-interact border border-[#9BA8AB]/20">
              Demo — Officer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SCREEN 2: AWAAZ FEED (CITIZEN)                                      */
/* ------------------------------------------------------------------ */

function ScreenAwaazFeed({ issues, onAnumodan, onToggleTrack, onViewPramaan, onPost }) {
  const [tab, setTab] = useState('all');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('priority');

  const stats = useMemo(() => ({
    open: issues.filter(i => i.status === 'Pending').length,
    progress: issues.filter(i => i.status === 'Claimed' || i.status === 'Flagged').length,
    resolved: issues.filter(i => i.status === 'Completed').length,
    votes: issues.reduce((s, i) => s + i.anumodanCount, 0),
  }), [issues]);

  const displayed = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = issues.filter(i =>
      (tab === 'all' || i.isTracked) &&
      (category === 'All' || i.category === category) &&
      (!q || `${i.title} ${i.location} ${i.id} ${i.description}`.toLowerCase().includes(q))
    );
    const sorters = {
      priority: (a, b) => priorityScore(b) - priorityScore(a),
      votes: (a, b) => b.anumodanCount - a.anumodanCount,
      newest: (a, b) => b.createdAt - a.createdAt,
    };
    return [...list].sort(sorters[sort]);
  }, [issues, tab, query, category, sort]);

  const trackedCount = issues.filter(i => i.isTracked).length;

  return (
    <div className="w-full">
      <PageHeader title="AWAAZ CIVIC RADAR" subtitle="Community grievances ranked by citizen resonance × hazard severity.">
        <SegmentedTabs
          value={tab}
          onChange={setTab}
          options={[
            { value: 'all', label: `All Issues (${issues.length})` },
            { value: 'tracked', label: `My Tracked (${trackedCount})` },
          ]}
        />
      </PageHeader>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <StatTile label="Open Grievances" value={stats.open} icon="AlertTriangle" accent="text-[#FF9800]" />
        <StatTile label="In Progress / Review" value={stats.progress} icon="Clock" />
        <StatTile label="Verified Resolved" value={stats.resolved} icon="ShieldCheck" accent="text-[#6BBF4A]" />
        <StatTile label="Total Anumodan" value={stats.votes.toLocaleString('en-IN')} icon="Flame" accent="text-[#FF9800]" />
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Icon name="Search" size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9BA8AB]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, ward, landmark or ID…"
            aria-label="Search issues"
            className={`${inputCls} pl-10 py-2.5`}
          />
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort issues" className={`${inputCls} py-2.5 md:w-56`}>
          <option value="priority">Sort: Priority score</option>
          <option value="votes">Sort: Most Anumodan</option>
          <option value="newest">Sort: Newest first</option>
        </select>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {['All', ...Object.keys(CATEGORIES)].map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-[12px] uppercase font-semibold whitespace-nowrap border btn-interact ${
              category === cat ? 'bg-[#CCD0CF] text-[#06141B] border-[#CCD0CF]' : 'bg-[#11212D] text-[#9BA8AB] border-[#9BA8AB]/20 hover:text-[#CCD0CF]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {displayed.length === 0 ? (
        <div className="bg-[#11212D] rounded-xl border border-[#9BA8AB]/15 p-12 text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#253745] flex items-center justify-center text-[#9BA8AB] mb-3">
            <Icon name="Flame" size={24} />
          </div>
          <h3 className="font-bebas text-[20px] text-[#CCD0CF]">
            {tab === 'tracked' && !query && category === 'All' ? "You aren't tracking any issues yet" : 'No issues match these filters'}
          </h3>
          <p className="text-[14px] text-[#9BA8AB] max-w-md mx-auto mt-1 mb-4">
            {tab === 'tracked'
              ? 'Give an Anumodan or tap Track on any issue to follow its Nivaran and Saboot status here.'
              : 'Try another category or search term, or report a new civic defect.'}
          </p>
          <button onClick={onPost} className="px-4 py-2 rounded-lg bg-[#6BBF4A] text-black text-[13px] uppercase font-bold btn-interact">Post Awaaz</button>
        </div>
      ) : (
        <div className="space-y-5">
          {displayed.map((issue) => (
            <article key={issue.id} className="bg-[#11212D] border border-[#9BA8AB]/15 rounded-xl overflow-hidden card-shadow flex flex-col md:flex-row">
              <div className="relative md:w-[340px] h-56 md:h-auto flex-shrink-0 bg-[#06141B] overflow-hidden">
                <IssueImage src={issue.image} category={issue.category} alt={issue.title} className="w-full h-full md:absolute md:inset-0" />
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 bg-[#11212D]/90 backdrop-blur-md border border-[#9BA8AB]/30 text-[#CCD0CF] text-[11px] uppercase font-semibold rounded-md">{issue.category}</span>
                  <span className={`px-2.5 py-1 backdrop-blur-md text-[11px] uppercase font-semibold rounded-md ${
                    issue.severity === 'Major' ? 'bg-[#F44336]/85 text-white' : issue.severity === 'Moderate' ? 'bg-[#FF9800]/85 text-black' : 'bg-[#4A5C6A]/90 text-[#CCD0CF]'
                  }`}>{issue.severity}</span>
                </div>
              </div>

              <div className="p-5 sm:p-6 flex-1 flex flex-col gap-3 min-w-0">
                <div className="flex flex-wrap items-center gap-2 justify-between">
                  <StatusBadge status={issue.status} />
                  <span className="text-[12px] text-[#9BA8AB] font-mono">{issue.id}</span>
                </div>

                <div>
                  <h3 className="font-bebas text-[22px] text-[#CCD0CF] tracking-wide leading-snug">{issue.title}</h3>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-[#9BA8AB] mt-1">
                    <Icon name="MapPin" size={14} className="text-[#FF9800]" />
                    <span>{issue.location}</span>
                    <span>•</span>
                    <span>{relativeDate(issue.createdAt)}</span>
                    <span>•</span>
                    <span>by {issue.reporterName || 'Anonymous citizen'}</span>
                  </div>
                </div>

                <p className="text-[15px] text-[#CCD0CF]/85 line-clamp-2 leading-relaxed">{issue.description}</p>

                <div className="py-2"><StatusStepper status={issue.status} /></div>

                <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[#253745] mt-auto">
                  <button
                    onClick={() => onAnumodan(issue.id)}
                    aria-pressed={issue.hasVoted}
                    className={`px-4 py-2 rounded-lg text-[13px] uppercase font-semibold btn-interact flex items-center gap-2 border ${
                      issue.hasVoted ? 'bg-[#FF9800] text-black border-[#FF9800]' : 'bg-[#253745] hover:bg-[#4A5C6A] text-[#CCD0CF] border-[#9BA8AB]/20'
                    }`}
                  >
                    <Icon name="Flame" size={16} className={issue.hasVoted ? 'text-black' : 'text-[#FF9800]'} />
                    {issue.hasVoted ? 'Anumodit' : 'Anumodan'}
                    <span className={`font-bebas text-[17px] leading-none pl-2 border-l ${issue.hasVoted ? 'border-black/30' : 'border-[#9BA8AB]/30 text-[#FF9800]'}`}>{issue.anumodanCount}</span>
                  </button>

                  <button
                    onClick={() => onToggleTrack(issue.id)}
                    aria-pressed={issue.isTracked}
                    className={`px-3 py-2 rounded-lg text-[13px] uppercase font-semibold btn-interact flex items-center gap-1.5 border ${
                      issue.isTracked ? 'bg-[#CCD0CF]/10 text-[#CCD0CF] border-[#CCD0CF]/40' : 'bg-transparent text-[#9BA8AB] border-[#9BA8AB]/20 hover:text-[#CCD0CF]'
                    }`}
                  >
                    <Icon name="Bookmark" size={15} />
                    {issue.isTracked ? 'Tracking' : 'Track'}
                  </button>

                  <span className="text-[11px] uppercase text-[#9BA8AB] font-semibold ml-auto hidden sm:flex items-center gap-1" title="Anumodan × severity weight">
                    <Icon name="TrendingUp" size={14} /> Priority {priorityScore(issue)}
                  </span>

                  {issue.verification && (
                    <button
                      onClick={() => onViewPramaan(issue)}
                      className={`px-3 py-2 rounded-lg text-[13px] uppercase font-semibold btn-interact flex items-center gap-1.5 border ${
                        issue.verification.approved ? 'text-[#6BBF4A] border-[#6BBF4A]/40' : 'text-[#F44336] border-[#F44336]/40'
                      }`}
                    >
                      <Icon name="ShieldCheck" size={15} /> View Pramaan Audit
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SCREEN 3: POST AWAAZ                                                */
/* ------------------------------------------------------------------ */

const locationKey = (s) => s.split(',')[0].trim().toLowerCase();

function ScreenPostAwaaz({ user, issues, onCancel, onSubmit, onSupportExisting }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Roads');
  const [severity, setSeverity] = useState('Moderate');
  const [description, setDescription] = useState('');
  const [geoLocation, setGeoLocation] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [locating, setLocating] = useState(false);
  const [showAnonModal, setShowAnonModal] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(user?.alwaysAnonymous || false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const suggestions = geoLocation.trim().length > 1 && showSuggestions
    ? ADDRESS_SUGGESTIONS.filter(item => item.toLowerCase().includes(geoLocation.toLowerCase()) && item !== geoLocation)
    : [];

  // Duplicate guard: an open issue in the same category at the same street/landmark.
  const duplicate = useMemo(() => {
    const key = locationKey(geoLocation);
    if (key.length < 4) return null;
    return issues.find(i =>
      i.category === category &&
      i.status !== 'Completed' &&
      (locationKey(i.location).includes(key) || key.includes(locationKey(i.location)))
    ) || null;
  }, [issues, category, geoLocation]);

  const handleImagePick = (e) => {
    const file = e.target.files?.[0];
    if (file) readAsDataUrl(file, setPreviewImage);
  };

  const handleUseMyLocation = () => {
    const fallback = () => { setGeoLocation(ADDRESS_SUGGESTIONS[0]); setLocating(false); };
    if (!navigator.geolocation) return fallback();
    setLocating(true);
    try {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGeoLocation(`${pos.coords.latitude.toFixed(4)}° N, ${pos.coords.longitude.toFixed(4)}° E (GPS fix ±${Math.round(pos.coords.accuracy)}m)`);
          setLocating(false);
        },
        fallback,
        { timeout: 6000 }
      );
    } catch {
      fallback();
    }
  };

  const handleFormPreSubmit = (e) => {
    e.preventDefault();
    if (!description.trim() || !geoLocation.trim()) return;
    setShowAnonModal(true);
  };

  const handleFinalSubmit = () => {
    setShowAnonModal(false);
    onSubmit({
      id: `ISS-${Math.floor(10000 + Math.random() * 90000)}`,
      title: title.trim() || `${CATEGORIES[category].label} issue at ${geoLocation.split(',')[0]}`,
      description: description.trim(),
      category,
      location: geoLocation.trim(),
      severity,
      anumodanCount: 1,
      hasVoted: true,
      isTracked: true,
      status: 'Pending',
      claimedBy: null,
      reporterId: user.id,
      reporterName: isAnonymous ? null : user.name,
      image: previewImage,
      createdAt: Date.now(),
      verification: null,
    });
  };

  return (
    <div className="max-w-3xl mx-auto w-full">
      <PageHeader title="POST NEW AWAAZ" subtitle="File an audited civic grievance into the municipal radar." onBack={onCancel} />

      <form onSubmit={handleFormPreSubmit} className="bg-[#11212D] border border-[#9BA8AB]/15 rounded-xl p-5 sm:p-8 card-shadow space-y-6">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="post-cat" className={labelCls}>1. Issue Category</label>
            <select id="post-cat" value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
              {Object.entries(CATEGORIES).map(([key, c]) => <option key={key} value={key}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <span className={labelCls}>2. Hazard Severity</span>
            <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Hazard severity">
              {['Minor', 'Moderate', 'Major'].map(s => {
                const active = severity === s;
                const tone = s === 'Major' ? 'bg-[#F44336] text-white border-[#F44336]' : s === 'Moderate' ? 'bg-[#FF9800] text-black border-[#FF9800]' : 'bg-[#4A5C6A] text-[#CCD0CF] border-[#4A5C6A]';
                return (
                  <button key={s} type="button" role="radio" aria-checked={active} onClick={() => setSeverity(s)}
                    className={`py-3 rounded-lg text-[13px] uppercase font-bold border btn-interact ${active ? tone : 'bg-[#06141B] text-[#9BA8AB] border-[#9BA8AB]/30'}`}>
                    {s}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="post-title" className={labelCls}>3. Headline <span className="normal-case font-normal">(optional)</span></label>
          <input id="post-title" type="text" maxLength={80} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Deep pothole before 4th Cross signal" className={inputCls} />
        </div>

        <div>
          <label htmlFor="post-desc" className={labelCls}>4. Issue Description</label>
          <textarea id="post-desc" required rows={4} maxLength={500} value={description} onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the defect, hazards caused, how long it has persisted, and the exact landmark…"
            className={`${inputCls} resize-none`} />
          <span className="block text-right text-[11px] text-[#9BA8AB] mt-1">{description.length}/500</span>
        </div>

        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="post-loc" className={`${labelCls} mb-0`}>5. Geo Location</label>
            <button type="button" onClick={handleUseMyLocation} disabled={locating} className="text-[12px] uppercase font-semibold text-[#6BBF4A] flex items-center gap-1 btn-interact disabled:opacity-50">
              <Icon name="Crosshair" size={14} /> {locating ? 'Locating…' : 'Use my location'}
            </button>
          </div>
          <div className="relative">
            <input
              id="post-loc"
              type="text"
              required
              autoComplete="off"
              value={geoLocation}
              onChange={(e) => { setGeoLocation(e.target.value); setShowSuggestions(true); }}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              placeholder="Search ward, street name, or landmark…"
              className={`${inputCls} pl-10`}
            />
            <Icon name="MapPin" size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9BA8AB]" />
          </div>

          {suggestions.length > 0 && (
            <ul className="absolute top-full left-0 right-0 mt-1 bg-[#11212D] border border-[#9BA8AB]/30 rounded-lg shadow-2xl z-20 overflow-hidden">
              {suggestions.map((item) => (
                <li key={item}>
                  <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => { setGeoLocation(item); setShowSuggestions(false); }}
                    className="w-full text-left px-4 py-2.5 text-[14px] text-[#CCD0CF] hover:bg-[#253745] flex items-center gap-2 border-b border-[#253745] last:border-none">
                    <Icon name="MapPin" size={14} className="text-[#FF9800]" />
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {duplicate && (
          <div className="p-4 rounded-lg border border-[#FF9800]/50 bg-[#FF9800]/10 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
            <div className="flex gap-3">
              <Icon name="AlertTriangle" size={20} className="text-[#FF9800] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[14px] font-semibold text-[#CCD0CF]">This looks already reported: {duplicate.id}</p>
                <p className="text-[12px] text-[#9BA8AB]">"{duplicate.title}" · {duplicate.anumodanCount} Anumodan. Supporting it raises its priority faster than a duplicate.</p>
              </div>
            </div>
            <button type="button" onClick={() => onSupportExisting(duplicate.id)} className="px-4 py-2 rounded-lg bg-[#FF9800] text-black text-[12px] uppercase font-bold whitespace-nowrap btn-interact">
              🔥 Support existing
            </button>
          </div>
        )}

        <div>
          <span className={labelCls}>6. Proof Photograph</span>
          <input type="file" ref={fileInputRef} accept="image/*" capture="environment" onChange={handleImagePick} className="hidden" />
          {previewImage ? (
            <div className="relative rounded-lg overflow-hidden border border-[#9BA8AB]/30 bg-[#06141B]">
              <img src={previewImage} alt="Issue preview" className="w-full h-60 object-cover" />
              <button type="button" aria-label="Remove photo" onClick={() => setPreviewImage(null)} className="absolute top-3 right-3 bg-[#06141B]/80 text-[#CCD0CF] hover:text-[#F44336] p-1.5 rounded-md btn-interact">
                <Icon name="XCircle" size={20} />
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => fileInputRef.current?.click()}
              className="w-full py-8 border-2 border-dashed border-[#253745] hover:border-[#4A5C6A] rounded-lg bg-[#06141B]/60 flex flex-col items-center justify-center text-[#9BA8AB] hover:text-[#CCD0CF] btn-interact">
              <Icon name="UploadCloud" size={36} className="text-[#4A5C6A] mb-2" />
              <span className="text-[14px] font-semibold uppercase">Click to select issue photo</span>
              <span className="text-[12px] text-[#9BA8AB] mt-1">JPG / PNG with camera EXIF metadata — optional but boosts credibility</span>
            </button>
          )}
        </div>

        <button type="submit" className="w-full py-3.5 bg-[#4A5C6A] hover:bg-[#6BBF4A] hover:text-black text-[#CCD0CF] font-semibold text-[16px] uppercase tracking-wider rounded-lg btn-interact border border-[#9BA8AB]/30 card-shadow">
          Submit Issue For Nivaran
        </button>
      </form>

      {showAnonModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="anon-title">
          <div className="bg-[#11212D] border border-[#9BA8AB]/30 rounded-xl p-6 max-w-md w-full card-shadow">
            <h3 id="anon-title" className="font-bebas text-[24px] text-[#CCD0CF] mb-2">Privacy Preference Check</h3>
            <p className="text-[14px] text-[#9BA8AB] mb-6">Would you like to post this Awaaz anonymously on the public ward radar? Officers still see a verified-citizen flag either way.</p>

            <div className="space-y-3 mb-6">
              {[
                [true, 'Yes, post anonymously', 'Your name stays masked on the public feed'],
                [false, 'No, attach my citizen profile', `Post as ${user.name} for civic recognition`],
              ].map(([val, head, sub]) => {
                const active = isAnonymous === val;
                return (
                  <button key={String(val)} type="button" onClick={() => setIsAnonymous(val)}
                    className={`w-full text-left flex items-center gap-3 p-3.5 rounded-lg border btn-interact ${active ? 'bg-[#253745] border-[#6BBF4A]' : 'bg-[#06141B] border-[#9BA8AB]/20'}`}>
                    <span className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${active ? 'border-[#6BBF4A]' : 'border-[#9BA8AB]'}`}>
                      {active && <span className="w-2 h-2 rounded-full bg-[#6BBF4A]" />}
                    </span>
                    <span>
                      <span className="block text-[14px] font-semibold text-[#CCD0CF]">{head}</span>
                      <span className="text-[11px] text-[#9BA8AB]">{sub}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setShowAnonModal(false)} className="flex-1 py-2.5 bg-[#253745] text-[#9BA8AB] uppercase font-semibold rounded-lg text-[14px] btn-interact">Back</button>
              <button type="button" onClick={handleFinalSubmit} className="flex-1 py-2.5 bg-[#6BBF4A] text-black uppercase font-bold rounded-lg text-[14px] btn-interact">Confirm & Post</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SCREEN 4A: OFFICER TASK BOARD                                       */
/* ------------------------------------------------------------------ */

function ScreenOfficerTaskBoard({ issues, user, onClaim, onOpenSaboot, onOpenPramaan }) {
  const [tab, setTab] = useState('queue');

  const queue = issues.filter(i => i.status === 'Pending').sort((a, b) => priorityScore(b) - priorityScore(a));
  const mine = issues.filter(i => i.claimedBy === user.id && i.status !== 'Pending');
  const active = mine.filter(i => i.status === 'Claimed');
  const topScore = Math.max(1, ...queue.map(priorityScore));

  return (
    <div className="w-full">
      <PageHeader title="OFFICER TASK BOARD" subtitle="Priority-ranked action queue, task claims, and the Saboot proof pipeline.">
        <SegmentedTabs
          value={tab}
          onChange={setTab}
          options={[
            { value: 'queue', label: `Issues Queue (${queue.length})` },
            { value: 'claimed', label: `My Workspace (${mine.length})` },
          ]}
        />
      </PageHeader>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <StatTile label="Unclaimed in Ward" value={queue.length} icon="AlertTriangle" accent="text-[#FF9800]" />
        <StatTile label="My Active Tasks" value={active.length} icon="Clock" />
        <StatTile label="My Verified Fixes" value={mine.filter(i => i.status === 'Completed').length} icon="ShieldCheck" accent="text-[#6BBF4A]" />
        <StatTile label="Flagged for Review" value={mine.filter(i => i.status === 'Flagged').length} icon="XCircle" accent="text-[#F44336]" />
      </div>

      {tab === 'queue' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {queue.length === 0 ? (
            <div className="md:col-span-2 bg-[#11212D] rounded-xl border border-[#9BA8AB]/15 p-12 text-center">
              <Icon name="CheckCircle2" size={32} className="mx-auto text-[#6BBF4A] mb-3" />
              <h3 className="font-bebas text-[20px] text-[#CCD0CF]">All issues claimed</h3>
              <p className="text-[14px] text-[#9BA8AB]">No pending unassigned civic defects in your jurisdiction.</p>
            </div>
          ) : (
            queue.map((issue, idx) => (
              <div key={issue.id} className="bg-[#11212D] border border-[#9BA8AB]/15 rounded-xl overflow-hidden card-shadow flex flex-col">
                <div className="relative h-44 w-full bg-[#06141B]">
                  <IssueImage src={issue.image} category={issue.category} alt={issue.title} className="w-full h-full" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#11212D]/90 text-[11px] uppercase font-semibold rounded text-[#CCD0CF]">#{idx + 1} · {issue.category}</span>
                  <span className={`absolute top-3 right-3 px-2.5 py-1 text-[11px] uppercase font-semibold rounded ${
                    issue.severity === 'Major' ? 'bg-[#F44336] text-white' : issue.severity === 'Moderate' ? 'bg-[#FF9800] text-black' : 'bg-[#4A5C6A] text-[#CCD0CF]'
                  }`}>{issue.severity}</span>
                </div>

                <div className="p-5 flex-1">
                  <h3 className="font-bebas text-[20px] text-[#CCD0CF] mb-1 line-clamp-1">{issue.title}</h3>
                  <div className="flex items-center gap-1.5 text-[12px] text-[#9BA8AB] mb-2">
                    <Icon name="MapPin" size={14} className="text-[#FF9800] flex-shrink-0" />
                    <span className="truncate">{issue.location}</span>
                    <span>·</span>
                    <span className="whitespace-nowrap">{relativeDate(issue.createdAt)}</span>
                  </div>
                  <p className="text-[14px] text-[#CCD0CF]/80 line-clamp-2 mb-4">{issue.description}</p>

                  <div>
                    <div className="flex justify-between text-[11px] uppercase font-semibold mb-1">
                      <span className="text-[#9BA8AB]">Priority score</span>
                      <span className="text-[#FF9800]">{priorityScore(issue)} <span className="text-[#9BA8AB] normal-case font-normal">({issue.anumodanCount} votes × {SEVERITY_WEIGHT[issue.severity]})</span></span>
                    </div>
                    <div className="h-1.5 bg-[#06141B] rounded-full overflow-hidden">
                      <div className="h-full bg-[#FF9800] rounded-full" style={{ width: `${(priorityScore(issue) / topScore) * 100}%` }} />
                    </div>
                  </div>
                </div>

                <div className="px-5 py-4 flex items-center justify-between border-t border-[#253745]">
                  <span className="text-[12px] text-[#9BA8AB]">Benchmark fix: <strong className="text-[#CCD0CF]">{formatINR(CATEGORIES[issue.category].benchmark)}</strong></span>
                  <button onClick={() => onClaim(issue.id)} className="px-5 py-2 bg-[#4A5C6A] hover:bg-[#6BBF4A] hover:text-black text-[#CCD0CF] uppercase font-semibold text-[13px] rounded-lg btn-interact border border-[#9BA8AB]/20">
                    Claim Issue
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'claimed' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {mine.length === 0 ? (
            <div className="md:col-span-2 bg-[#11212D] rounded-xl border border-[#9BA8AB]/15 p-12 text-center">
              <h3 className="font-bebas text-[20px] text-[#CCD0CF]">Workspace empty</h3>
              <p className="text-[14px] text-[#9BA8AB]">Claim an issue from the queue to start work and submit Saboot proof.</p>
            </div>
          ) : (
            mine.map((issue) => {
              const needsProof = issue.status === 'Claimed';
              return (
                <button
                  key={issue.id}
                  onClick={() => (needsProof ? onOpenSaboot(issue) : onOpenPramaan(issue))}
                  className={`text-left bg-[#11212D] border rounded-xl card-shadow p-5 btn-interact ${
                    needsProof ? 'border-[#FF9800]/40 hover:border-[#FF9800]' : issue.status === 'Flagged' ? 'border-[#F44336]/40' : 'border-[#9BA8AB]/20 hover:border-[#6BBF4A]/50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3 gap-2">
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2.5 py-0.5 rounded text-[11px] uppercase font-semibold bg-[#253745] text-[#9BA8AB]">{issue.category}</span>
                      <StatusBadge status={issue.status} />
                    </div>
                    <span className="text-[12px] text-[#9BA8AB] font-mono">{issue.id}</span>
                  </div>

                  <h3 className="font-bebas text-[20px] text-[#CCD0CF] mb-1">{issue.title}</h3>
                  <p className="text-[12px] text-[#9BA8AB] mb-4 flex items-center gap-1">
                    <Icon name="MapPin" size={14} className="text-[#FF9800]" />
                    {issue.location}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-[#253745]">
                    <span className="text-[13px] text-[#9BA8AB]">
                      {issue.verification ? <>Confidence <strong className="text-[#CCD0CF]">{issue.verification.confidence}%</strong></> : 'Proof pending'}
                    </span>
                    <span className={`text-[13px] uppercase font-semibold ${needsProof ? 'text-[#FF9800]' : issue.status === 'Flagged' ? 'text-[#F44336]' : 'text-[#6BBF4A]'}`}>
                      {needsProof ? 'Submit Saboot Proof →' : 'View Pramaan Audit →'}
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SCREEN 4B: SABOOT SUBMISSION                                        */
/* ------------------------------------------------------------------ */

function ScreenSabootSubmission({ issue, onBack, onSubmit }) {
  const [beforeImage, setBeforeImage] = useState(issue.image || null);
  const [afterImage, setAfterImage] = useState(null);
  const [receiptFile, setReceiptFile] = useState(null);
  const [amountSpent, setAmountSpent] = useState('');
  const [description, setDescription] = useState('');
  const [simGpsMismatch, setSimGpsMismatch] = useState(false);
  const [simTamper, setSimTamper] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const autoTimestamp = useMemo(() => `${nowStamp()} IST (GPS sync)`, []);

  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);
  const receiptInputRef = useRef<HTMLInputElement>(null);

  const bench = CATEGORIES[issue.category].benchmark;
  const amount = Number(amountSpent);
  const variance = amount > 0 ? (amount - bench) / bench : null;

  const missing = [
    !afterImage && 'after photo',
    !receiptFile && 'receipt',
    !(amount > 0) && 'amount',
    !description.trim() && 'work description',
  ].filter(Boolean);
  const isFormValid = missing.length === 0;

  const pickImage = (setter) => (e) => {
    const file = e.target.files?.[0];
    if (file) readAsDataUrl(file, setter);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid || submitting) return;
    setSubmitting(true);
    const verification = runPramaan({
      category: issue.category,
      severity: issue.severity,
      reportedCost: amount,
      locationOk: !simGpsMismatch,
      timestampOk: true,
      tamperDetected: simTamper,
      beforeImg: beforeImage,
      afterImg: afterImage,
      workNotes: description.trim(),
    });
    setTimeout(() => onSubmit(issue.id, verification), 600);
  };

  type ImageSlotProps = {
    label: string; image: string | null; inputRef: React.RefObject<HTMLInputElement>;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; tone?: 'green'; hint?: string; onSample?: () => void;
  };

  const ImageSlot = ({ label, image, inputRef, onChange, tone, hint, onSample }: ImageSlotProps) => (
    <div>
      <span className={labelCls}>{label}</span>
      <input type="file" ref={inputRef} accept="image/*" capture="environment" className="hidden" onChange={onChange} />
      {image ? (
        <div className={`relative rounded-lg overflow-hidden border h-48 bg-[#06141B] ${tone === 'green' ? 'border-[#6BBF4A]/40' : 'border-[#9BA8AB]/20'}`}>
          <IssueImage src={image} category={issue.category} alt={label} className="w-full h-full" />
          {tone === 'green' && <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#6BBF4A] text-black text-[10px] font-bold uppercase rounded">Resolved Proof</span>}
          <button type="button" onClick={() => inputRef.current?.click()} className="absolute bottom-2 right-2 px-2.5 py-1 bg-[#11212D]/90 text-[11px] text-[#CCD0CF] uppercase font-semibold rounded btn-interact">Change</button>
        </div>
      ) : (
        <div className={`h-48 border-2 border-dashed rounded-lg bg-[#06141B] flex flex-col items-center justify-center gap-2 ${tone === 'green' ? 'border-[#6BBF4A]/40' : 'border-[#253745]'}`}>
          <button type="button" onClick={() => inputRef.current?.click()} className="flex flex-col items-center text-[#9BA8AB] hover:text-[#CCD0CF] btn-interact">
            <Icon name="UploadCloud" size={28} className={`mb-1 ${tone === 'green' ? 'text-[#6BBF4A]' : 'text-[#4A5C6A]'}`} />
            <span className={`text-[13px] uppercase font-semibold ${tone === 'green' ? 'text-[#6BBF4A]' : ''}`}>Upload photo</span>
            {hint && <span className="text-[11px] text-[#9BA8AB] mt-0.5">{hint}</span>}
          </button>
          {onSample && <button type="button" onClick={onSample} className="text-[11px] uppercase font-semibold text-[#9BA8AB] underline underline-offset-2 hover:text-[#CCD0CF]">or use demo sample</button>}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto w-full">
      <PageHeader title="SUBMIT SABOOT (PROOF OF WORK)" subtitle={`Case ${issue.id} — ${issue.title}`} onBack={onBack} />

      <form onSubmit={handleSubmit} className="bg-[#11212D] border border-[#9BA8AB]/15 rounded-xl p-5 sm:p-8 card-shadow space-y-6">
        <div className="grid sm:grid-cols-2 gap-6">
          <ImageSlot label="1. Before image (from citizen report)" image={beforeImage} inputRef={beforeInputRef} onChange={pickImage(setBeforeImage)} />
          <ImageSlot label="2. After image (mandatory)" image={afterImage} inputRef={afterInputRef} onChange={pickImage(setAfterImage)} tone="green"
            hint="Must be captured at the defect site" onSample={() => setAfterImage(SAMPLE_AFTER_IMG)} />
        </div>

        <div className="grid sm:grid-cols-2 gap-6 pt-4 border-t border-[#253745]">
          <div>
            <span className={labelCls}>3. Cost report & receipts (PDF / image)</span>
            <input type="file" ref={receiptInputRef} accept="image/*,application/pdf" className="hidden" onChange={(e) => e.target.files?.[0] && setReceiptFile(e.target.files[0].name)} />
            <button type="button" onClick={() => receiptInputRef.current?.click()} className="w-full py-3 px-4 border border-[#9BA8AB]/30 rounded-lg bg-[#06141B] flex items-center justify-between gap-3 text-[#CCD0CF] btn-interact">
              <span className="text-[14px] truncate flex items-center gap-2">
                <Icon name="FileText" size={16} className="text-[#9BA8AB] flex-shrink-0" />
                {receiptFile || 'Select contractor invoice / bill'}
              </span>
              <span className="text-[12px] uppercase font-semibold text-[#6BBF4A]">{receiptFile ? 'Attached' : 'Browse'}</span>
            </button>
            {!receiptFile && (
              <button type="button" onClick={() => setReceiptFile(`invoice_${issue.id}.pdf`)} className="mt-1.5 text-[11px] uppercase font-semibold text-[#9BA8AB] underline underline-offset-2 hover:text-[#CCD0CF]">
                or attach demo invoice
              </button>
            )}
          </div>

          <div>
            <label htmlFor="saboot-amt" className={labelCls}>4. Amount spent (INR ₹)</label>
            <input id="saboot-amt" type="number" min="1" inputMode="numeric" required value={amountSpent} onChange={(e) => setAmountSpent(e.target.value)} placeholder={`Benchmark ${formatINR(bench)}`} className={inputCls} />
            <p className="text-[12px] mt-1.5 text-[#9BA8AB]">
              PWD benchmark for {issue.category}: <strong className="text-[#CCD0CF]">{formatINR(bench)}</strong>
              {variance !== null && (
                <span className={`ml-2 font-semibold ${variance <= COST_TOLERANCE ? 'text-[#6BBF4A]' : 'text-[#F44336]'}`}>
                  {variance <= 0 ? `${Math.abs(Math.round(variance * 100))}% under` : `${Math.round(variance * 100)}% over`}
                  {variance > COST_TOLERANCE && ' — will be flagged'}
                </span>
              )}
            </p>
          </div>
        </div>

        <div>
          <label htmlFor="saboot-desc" className={labelCls}>5. Work description & materials used</label>
          <textarea id="saboot-desc" required rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
            placeholder="Repair method, material grade, contractor name, and guarantee period…" className={`${inputCls} resize-none`} />
        </div>

        <div className="p-4 rounded-lg bg-[#06141B] border border-[#9BA8AB]/20 grid sm:grid-cols-2 gap-4">
          <div>
            <span className="block text-[11px] uppercase tracking-wider text-[#9BA8AB] font-semibold mb-1">🔒 Auto-captured geo tag</span>
            <div className="flex items-center gap-2 text-[13px] text-[#CCD0CF] font-mono">
              <Icon name="MapPin" size={16} className="text-[#FF9800] flex-shrink-0" />
              <span>{simGpsMismatch ? '12.9352° N, 77.6245° E (1.8 km off-site)' : issue.location}</span>
            </div>
          </div>
          <div>
            <span className="block text-[11px] uppercase tracking-wider text-[#9BA8AB] font-semibold mb-1">⏰ Hardware NTP timestamp</span>
            <div className="flex items-center gap-2 text-[13px] text-[#CCD0CF] font-mono">
              <Icon name="Clock" size={16} className="text-[#6BBF4A] flex-shrink-0" />
              <span>{autoTimestamp}</span>
            </div>
          </div>
        </div>

        <details className="rounded-lg border border-dashed border-[#9BA8AB]/30 p-4 group">
          <summary className="text-[12px] uppercase font-bold text-[#9BA8AB] cursor-pointer select-none">⚖️ Judge test tools — simulate a failing audit</summary>
          <div className="mt-3 grid sm:grid-cols-2 gap-3">
            {([
              [simGpsMismatch, setSimGpsMismatch, 'Photo taken off-site', 'GPS metadata 1.8 km from the defect'],
              [simTamper, setSimTamper, 'Edited after-photo', 'EXIF conflict + clone-stamp artefacts'],
            ] as [boolean, (v: boolean) => void, string, string][]).map(([val, set, head, sub]) => (
              <label key={head} className="flex items-start gap-3 p-3 rounded-lg bg-[#06141B] cursor-pointer">
                <input type="checkbox" checked={val} onChange={(e) => set(e.target.checked)} className="mt-1 accent-[#F44336]" />
                <span>
                  <span className="block text-[13px] font-semibold text-[#CCD0CF]">{head}</span>
                  <span className="text-[11px] text-[#9BA8AB]">{sub}</span>
                </span>
              </label>
            ))}
          </div>
          <p className="text-[11px] text-[#9BA8AB] mt-2">Tip: entering an amount more than 15% over benchmark also triggers a flag.</p>
        </details>

        <div>
          <button
            type="submit"
            disabled={!isFormValid || submitting}
            className={`w-full py-4 rounded-lg font-semibold text-[16px] uppercase tracking-wider btn-interact card-shadow border ${
              isFormValid ? 'bg-[#4A5C6A] hover:bg-[#6BBF4A] hover:text-black text-[#CCD0CF] border-[#9BA8AB]/30' : 'bg-[#253745]/50 text-[#9BA8AB]/50 border-transparent cursor-not-allowed'
            }`}
          >
            {submitting ? 'Sealing evidence packet…' : 'Submit Saboot for Pramaan AI Verification'}
          </button>
          {!isFormValid && <p className="text-[12px] text-[#9BA8AB] mt-2 text-center">Still needed: {missing.join(', ')}</p>}
        </div>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SCREEN 5: PRAMAAN AI VERIFICATION                                   */
/* ------------------------------------------------------------------ */

type AuditCheckProps = {
  visible: boolean; ok: boolean; title: string; detail: string;
  verdictOk: string; verdictFail: string; children?: React.ReactNode;
};

function AuditCheck({ visible, ok, title, detail, verdictOk, verdictFail, children }: AuditCheckProps) {
  return (
    <div className={`p-5 rounded-xl border transition-all duration-500 ${
      visible ? `bg-[#11212D] opacity-100 translate-y-0 card-shadow ${ok ? 'border-[#9BA8AB]/20' : 'border-[#F44336]/50'}` : 'bg-[#11212D]/20 border-transparent opacity-0 translate-y-4'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${ok ? 'bg-[#6BBF4A]/20 text-[#6BBF4A]' : 'bg-[#F44336]/20 text-[#F44336]'}`}>
            <Icon name={ok ? 'CheckCircle2' : 'XCircle'} size={22} />
          </div>
          <div>
            <h4 className="font-bebas text-[18px] text-[#CCD0CF]">{title}</h4>
            <p className="text-[12px] text-[#9BA8AB]">{detail}</p>
          </div>
        </div>
        <span className={`font-bebas text-[18px] whitespace-nowrap sm:pl-4 ${ok ? 'text-[#6BBF4A]' : 'text-[#F44336]'}`}>
          {ok ? `✓ ${verdictOk}` : `✗ ${verdictFail}`}
        </span>
      </div>
      {children}
    </div>
  );
}

function ScreenAIVerification({ issue, pendingIssue, auditedIssues, user, onSelect, onResubmit, onBack }) {
  const [step, setStep] = useState(0);
  const [runKey, setRunKey] = useState(0);

  useEffect(() => {
    setStep(0);
    const timers = [450, 950, 1500, 2100, 2700, 3400].map((delay, index) => setTimeout(() => setStep(index + 1), delay));
    return () => timers.forEach(clearTimeout);
  }, [issue?.id, issue?.verification?.auditedAt, runKey]);

  const header = (
    <PageHeader
      title="PRAMAAN AI VERIFICATION"
      subtitle="Zero-trust audit of spatial metadata, timestamps, cost variance and photo forensics."
      onBack={onBack}
    >
      {auditedIssues.length > 0 && (
        <select
          value={issue?.id || ''}
          onChange={(e) => onSelect(auditedIssues.find(i => i.id === e.target.value))}
          aria-label="Choose audited case"
          className={`${inputCls} py-2 md:w-80 text-[13px]`}
        >
          {!issue && <option value="">Select an audited case…</option>}
          {auditedIssues.map(i => (
            <option key={i.id} value={i.id}>{i.id} · {i.verification.approved ? 'Approved' : 'Flagged'} · {i.title}</option>
          ))}
        </select>
      )}
    </PageHeader>
  );

  if (!issue) {
    return (
      <div className="max-w-4xl mx-auto w-full">
        {header}
        <div className="bg-[#11212D] rounded-xl border border-[#9BA8AB]/15 p-12 text-center">
          <Icon name="ShieldCheck" size={36} className="mx-auto text-[#4A5C6A] mb-3" />
          <h3 className="font-bebas text-[22px] text-[#CCD0CF]">
            {pendingIssue ? `${pendingIssue.id} has not been audited yet` : 'Pick a case to inspect'}
          </h3>
          <p className="text-[14px] text-[#9BA8AB] max-w-md mx-auto mt-1">
            {pendingIssue
              ? 'Pramaan runs automatically once the assigned officer submits Saboot proof (after photo, receipt and cost).'
              : 'Choose any audited case from the selector above to replay its verification.'}
          </p>
        </div>
      </div>
    );
  }

  const v = issue.verification;
  const scale = Math.max(v.reportedCost, v.benchCost) * 1.15;
  const variancePct = Math.round(v.variance * 100);
  const canResubmit = user.role === 'officer' && issue.status === 'Flagged' && issue.claimedBy === user.id;

  return (
    <div className="max-w-4xl mx-auto w-full">
      {header}

      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 p-4 rounded-xl bg-[#11212D] border border-[#9BA8AB]/15">
        <div className="min-w-0">
          <span className="text-[11px] uppercase text-[#9BA8AB] font-semibold">Case under audit</span>
          <p className="font-bebas text-[20px] text-[#CCD0CF] leading-tight truncate">{issue.id} — {issue.title}</p>
          <p className="text-[12px] text-[#9BA8AB]">Audited {v.auditedAt} · Officer {issue.claimedBy}</p>
        </div>
        <button onClick={() => setRunKey(k => k + 1)} className="px-3 py-2 rounded-lg bg-[#253745] text-[#CCD0CF] text-[12px] uppercase font-bold flex items-center gap-2 btn-interact border border-[#9BA8AB]/20">
          <Icon name="RefreshCw" size={14} /> Replay audit
        </button>
      </div>

      <div className="space-y-4">
        <AuditCheck visible={step >= 1} ok={v.locationOk} title="1. Geo-spatial coordinates"
          detail={v.locationOk ? 'GPS metadata of the after-photo aligns within 8.2 m of the reported hazard.' : 'After-photo GPS places the officer 1.8 km from the reported defect.'}
          verdictOk="Match" verdictFail="Off-site" />

        <AuditCheck visible={step >= 2} ok={v.timestampOk} title="2. NTP hardware timestamp"
          detail={v.timestampOk ? 'Work photographed after ticket issuance with a consistent timestamp sequence.' : 'After-photo timestamp predates the ticket claim — capture sequence is inconsistent.'}
          verdictOk="Sync valid" verdictFail="Clock anomaly" />

        <AuditCheck visible={step >= 3} ok={v.costOk} title="3. Cost reasonableness vs benchmark"
          detail={`Claimed cost evaluated against the PWD schedule of rates (±${COST_TOLERANCE * 100}% tolerance).`}
          verdictOk={`${variancePct <= 0 ? `${Math.abs(variancePct)}% under` : `${variancePct}% over`}`}
          verdictFail={`${variancePct}% over`}>
          <div className="bg-[#06141B] p-4 rounded-lg border border-[#9BA8AB]/15 space-y-3 mt-4">
            {[
              ['Officer reported cost', v.reportedCost, v.costOk ? '#6BBF4A' : '#F44336', 'text-[#CCD0CF]'],
              ['PWD category benchmark', v.benchCost, '#4A5C6A', 'text-[#9BA8AB]'],
            ].map(([label, val, color, textCls]) => (
              <div key={label}>
                <div className="flex justify-between text-[12px] mb-1 font-semibold">
                  <span className={textCls}>{label}</span>
                  <span style={{ color: color === '#4A5C6A' ? '#9BA8AB' : color }}>{formatINR(val)}</span>
                </div>
                <div className="h-3.5 bg-[#253745] rounded-full overflow-hidden relative">
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: step >= 3 ? `${(val / scale) * 100}%` : '0%', background: color }} />
                </div>
              </div>
            ))}
            <p className="text-[11px] text-[#9BA8AB]">Tolerance ceiling: {formatINR(v.benchCost * (1 + COST_TOLERANCE))}</p>
          </div>
        </AuditCheck>

        <AuditCheck visible={step >= 4} ok={!v.tamperDetected} title="4. Image tampering & clone detection"
          detail="Error Level Analysis, GAN artefact scan and camera sensor-noise consistency."
          verdictOk="None detected" verdictFail="EXIF conflict" />

        <div className={`p-5 rounded-xl border transition-all duration-500 ${step >= 5 ? 'bg-[#11212D] border-[#9BA8AB]/20 opacity-100 translate-y-0 card-shadow' : 'bg-[#11212D]/20 border-transparent opacity-0 translate-y-4'}`}>
          <h4 className="font-bebas text-[18px] text-[#CCD0CF] mb-3">5. Visual feature correspondence (before / after)</h4>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <span className="block text-[11px] uppercase font-bold text-[#9BA8AB] mb-1.5">Original citizen defect</span>
              <div className="h-36 sm:h-44 rounded-lg overflow-hidden border border-[#9BA8AB]/20 bg-[#06141B]">
                <IssueImage src={v.beforeImg} category={issue.category} alt="Before" className="w-full h-full" />
              </div>
            </div>
            <div>
              <span className="block text-[11px] uppercase font-bold text-[#6BBF4A] mb-1.5">Saboot resolution proof</span>
              <div className="h-36 sm:h-44 rounded-lg overflow-hidden border border-[#6BBF4A]/40 bg-[#06141B]">
                <IssueImage src={v.afterImg} category={issue.category} alt="After" className="w-full h-full" />
              </div>
            </div>
          </div>
          {v.workNotes && <p className="text-[13px] text-[#CCD0CF]/85 mt-3"><span className="text-[#9BA8AB] uppercase text-[11px] font-semibold">Officer notes: </span>{v.workNotes}</p>}
        </div>

        <div className={`p-6 rounded-xl border transition-all duration-700 ${step >= 6 ? 'bg-[#11212D] border-[#9BA8AB]/30 opacity-100 translate-y-0 card-shadow' : 'bg-[#11212D]/20 border-transparent opacity-0 translate-y-4'}`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-bebas text-[24px] text-[#CCD0CF] mb-1">6. Pramaan composite confidence</h4>
              <p className="text-[13px] text-[#9BA8AB] max-w-md">
                Weighted across geospatial integrity, timestamp sequence, photo forensics and cost tolerance. Auto-approval threshold: {APPROVAL_THRESHOLD}%.
              </p>
            </div>

            <div className="relative w-28 h-28 flex items-center justify-center flex-shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#253745" strokeWidth="8" fill="transparent" />
                <circle cx="50" cy="50" r="40" stroke={v.approved ? '#6BBF4A' : '#F44336'} strokeWidth="8"
                  strokeDasharray="251.2" strokeDashoffset={step >= 6 ? 251.2 - (251.2 * v.confidence) / 100 : 251.2}
                  strokeLinecap="round" fill="transparent" className="transition-all duration-1000 ease-out" />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="font-bebas text-[28px] text-[#CCD0CF] leading-none">{v.confidence}%</span>
                <span className="text-[9px] uppercase text-[#9BA8AB] font-bold">Confidence</span>
              </div>
            </div>
          </div>

          {step >= 6 && (
            <div className="mt-6 pt-6 border-t border-[#253745]">
              {v.approved ? (
                <div className="p-4 rounded-xl bg-[#6BBF4A]/15 border border-[#6BBF4A] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#6BBF4A] text-black flex items-center justify-center font-bold flex-shrink-0">✓</div>
                    <div>
                      <h3 className="font-bebas text-[22px] text-[#6BBF4A] leading-tight m-0">Auto-approved by Pramaan protocol</h3>
                      <p className="text-[12px] text-[#CCD0CF]">All checks passed. Resolution verified and logged on the public team ledger.</p>
                    </div>
                  </div>
                  <div className="sm:text-right">
                    <span className="text-[11px] text-[#9BA8AB] uppercase font-bold block">Reward distributed</span>
                    <span className="font-bebas text-[22px] text-[#6BBF4A] flex items-center gap-1 sm:justify-end">
                      <Icon name="Coins" size={20} /> +{v.coins} Seva Coins
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-[#F44336]/15 border border-[#F44336] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#F44336] text-white flex items-center justify-center font-bold flex-shrink-0">!</div>
                    <div>
                      <h3 className="font-bebas text-[22px] text-[#F44336] leading-tight m-0">Flagged for human review</h3>
                      <p className="text-[12px] text-[#CCD0CF]">Confidence below {APPROVAL_THRESHOLD}%. Escrowed to the Chief Municipal Vigilance Officer; no coins released.</p>
                    </div>
                  </div>
                  {canResubmit ? (
                    <button onClick={() => onResubmit(issue)} className="px-4 py-2 bg-[#F44336] text-white rounded-lg text-[12px] font-bold uppercase btn-interact whitespace-nowrap">Resubmit Saboot</button>
                  ) : (
                    <span className="px-3 py-1.5 bg-[#F44336] text-white rounded text-[12px] font-bold uppercase self-start sm:self-auto">Escrow locked</span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SCREEN 6: PUBLIC TEAM LEDGER                                        */
/* ------------------------------------------------------------------ */

function ScreenPublicLedger({ officers, currentUserId }) {
  const ranked = [...officers].sort((a, b) => b.coins - a.coins).map((o, idx) => ({ ...o, rank: idx + 1 }));
  const podiumTone = ['border-[#FF9800] text-[#FF9800]', 'border-[#CCD0CF] text-[#CCD0CF]', 'border-[#9BA8AB]/60 text-[#9BA8AB]'];

  return (
    <div className="w-full">
      <PageHeader title="PUBLIC TEAM LEDGER" subtitle="Tamper-evident municipal performance ranking, driven only by Pramaan-verified resolutions." />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {ranked.slice(0, 3).map((o, idx) => (
          <div key={o.id} className={`bg-[#11212D] rounded-xl p-5 card-shadow border-t-4 ${podiumTone[idx]} ${o.id === currentUserId ? 'ring-1 ring-[#FF9800]/60' : ''}`}>
            <span className="font-bebas text-[36px] leading-none">#{o.rank}</span>
            <p className="font-semibold text-[#CCD0CF] mt-1">{o.name}{o.id === currentUserId && <span className="text-[11px] text-[#FF9800] uppercase font-bold ml-2">You</span>}</p>
            <p className="text-[12px] text-[#9BA8AB] mb-3">{o.ward}</p>
            <div className="flex justify-between items-end">
              <span className="font-bebas text-[24px] text-[#6BBF4A] flex items-center gap-1"><Icon name="Coins" size={18} />{o.coins.toLocaleString('en-IN')}</span>
              <span className="text-[12px] text-[#9BA8AB]">{o.resolved} resolved</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#11212D] border border-[#9BA8AB]/15 rounded-xl card-shadow overflow-x-auto">
        <table className="w-full min-w-[720px] text-left border-collapse">
          <thead>
            <tr className="border-b border-[#253745] bg-[#06141B]/50">
              {['Rank', 'Officer', 'Ward / Department', 'Resolved', 'Seva Coins', 'Spend-Efficiency'].map((h, i) => (
                <th key={h} className={`py-4 px-5 font-bebas text-[17px] text-[#9BA8AB] tracking-wider ${i === 3 ? 'text-center' : i > 3 ? 'text-right' : ''}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#253745]/60 text-[15px]">
            {ranked.map((off) => {
              const isMe = off.id === currentUserId;
              return (
                <tr key={off.id} className={`transition-colors ${isMe ? 'bg-[#FF9800]/10' : 'hover:bg-[#253745]/30'}`}>
                  <td className="py-4 px-5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bebas text-[18px] ${
                      off.rank === 1 ? 'bg-[#FF9800] text-black' : off.rank === 2 ? 'bg-[#CCD0CF] text-black' : off.rank === 3 ? 'bg-[#4A5C6A] text-white' : 'bg-[#253745] text-[#9BA8AB]'
                    }`}>{off.rank}</div>
                  </td>
                  <td className="py-4 px-5 font-semibold text-[#CCD0CF]">
                    {off.name}
                    {isMe && <span className="ml-2 text-[10px] uppercase font-bold text-[#FF9800] align-middle">You</span>}
                    <span className="block text-[11px] font-mono text-[#9BA8AB] font-normal">{off.id}</span>
                  </td>
                  <td className="py-4 px-5 text-[#9BA8AB] text-[14px]">{off.ward}</td>
                  <td className="py-4 px-5 text-center font-bebas text-[20px] text-[#CCD0CF]">{off.resolved}</td>
                  <td className="py-4 px-5 text-right">
                    <span className="font-bebas text-[22px] text-[#6BBF4A] inline-flex items-center gap-1.5"><Icon name="Coins" size={18} />{off.coins.toLocaleString('en-IN')}</span>
                  </td>
                  <td className="py-4 px-5 text-right">
                    <span className="px-2.5 py-1 rounded bg-[#253745] text-[#6BBF4A] border border-[#9BA8AB]/20 text-[13px] font-semibold">{off.efficiency}%</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SCREEN 7: PROFILE                                                   */
/* ------------------------------------------------------------------ */

function ScreenProfile({ user, issues, officers, onViewPramaan }) {
  const isOfficer = user.role === 'officer';

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="bg-[#11212D] border border-[#9BA8AB]/20 rounded-xl p-5 sm:p-6 card-shadow mb-6 flex items-center gap-5">
        <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-[#253745] border-2 border-[#9BA8AB]/30 flex items-center justify-center font-bebas text-[36px] flex-shrink-0 ${isOfficer ? 'text-[#FF9800]' : 'text-[#6BBF4A]'}`}>
          {user.name.charAt(0)}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h1 className="font-bebas text-[28px] sm:text-[32px] text-[#CCD0CF] leading-tight m-0">{user.name}</h1>
            <span className={`px-2.5 py-0.5 rounded text-[11px] uppercase font-bold tracking-wider ${isOfficer ? 'bg-[#FF9800]/20 text-[#FF9800]' : 'bg-[#6BBF4A]/20 text-[#6BBF4A]'}`}>
              {isOfficer ? 'Municipal Nodal Engineer' : 'Verified Citizen'}
            </span>
          </div>
          <p className="text-[13px] text-[#9BA8AB] mt-1 font-mono truncate">{isOfficer ? 'Employee ID' : 'Citizen ID'}: {user.id}</p>
          {!isOfficer && user.alwaysAnonymous && <p className="text-[12px] text-[#9BA8AB] mt-1">🔒 Posts anonymously by default</p>}
        </div>
      </div>

      {isOfficer
        ? <OfficerProfile user={user} issues={issues} officers={officers} onViewPramaan={onViewPramaan} />
        : <CitizenProfile user={user} issues={issues} onViewPramaan={onViewPramaan} />}
    </div>
  );
}

function OfficerProfile({ user, issues, officers, onViewPramaan }) {
  const me = officers.find(o => o.id === user.id) || { coins: 0, resolved: 0, efficiency: 0 };
  const rank = [...officers].sort((a, b) => b.coins - a.coins).findIndex(o => o.id === user.id) + 1;
  const myAudits = issues.filter(i => i.claimedBy === user.id && i.verification);
  const trend = [20, 35, 45, 60, 75, 88, 100];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatTile label="Total Seva Coins" value={me.coins.toLocaleString('en-IN')} icon="Coins" accent="text-[#6BBF4A]" />
        <StatTile label="Ledger Rank" value={rank > 0 ? `#${rank}` : '—'} icon="Award" accent="text-[#FF9800]" />
        <StatTile label="Issues Resolved" value={me.resolved} icon="CheckCircle2" />
        <StatTile label="Spend-Efficiency" value={`${me.efficiency}%`} icon="TrendingUp" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-[#11212D] border border-[#9BA8AB]/15 rounded-xl p-6 card-shadow">
          <h3 className="font-bebas text-[20px] text-[#CCD0CF] mb-4">Seva coin accumulation (7 weeks)</h3>
          <div className="h-44 flex items-end gap-3 border-b border-[#253745]">
            {trend.map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center justify-end gap-2 h-full">
                <div className={`w-full rounded-t transition-all duration-300 ${idx === trend.length - 1 ? 'bg-[#6BBF4A]' : 'bg-[#4A5C6A] hover:bg-[#6BBF4A]'}`} style={{ height: `${val}%` }} title={`Week ${idx + 1}`} />
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-2">
            {trend.map((_, idx) => <span key={idx} className="flex-1 text-center text-[10px] text-[#9BA8AB]">Wk {idx + 1}</span>)}
          </div>
        </div>

        <div className="bg-[#11212D] border border-[#9BA8AB]/15 rounded-xl p-6 card-shadow">
          <h3 className="font-bebas text-[20px] text-[#CCD0CF] mb-4">Category-wise resolutions</h3>
          <div className="space-y-3">
            {[
              { cat: "Roads & Asphalt", count: 68, color: "#6BBF4A" },
              { cat: "Water & Pipelines", count: 42, color: "#9BA8AB" },
              { cat: "Streetlights", count: 22, color: "#FF9800" },
              { cat: "Drainage / Sanitation", count: 10, color: "#4A5C6A" },
            ].map((item) => (
              <div key={item.cat}>
                <div className="flex justify-between text-[12px] mb-1">
                  <span className="text-[#CCD0CF] font-semibold">{item.cat}</span>
                  <span className="text-[#9BA8AB]">{item.count} closed</span>
                </div>
                <div className="h-2.5 bg-[#06141B] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${(item.count / 68) * 100}%`, background: item.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#11212D] border border-[#9BA8AB]/15 rounded-xl p-6 card-shadow">
        <h3 className="font-bebas text-[20px] text-[#CCD0CF] mb-3">My Pramaan audit history</h3>
        {myAudits.length === 0 ? (
          <p className="text-[14px] text-[#9BA8AB]">No audited Saboot submissions yet.</p>
        ) : (
          <ul className="divide-y divide-[#253745]">
            {myAudits.map(i => (
              <li key={i.id}>
                <button onClick={() => onViewPramaan(i)} className="w-full flex flex-wrap items-center justify-between gap-2 py-3 text-left hover:bg-[#253745]/30 px-2 rounded">
                  <span className="text-[14px] text-[#CCD0CF] font-semibold">{i.id} · {i.title}</span>
                  <span className="flex items-center gap-3">
                    <StatusBadge status={i.status} />
                    <span className="font-bebas text-[18px] text-[#6BBF4A]">+{i.verification.coins}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function CitizenProfile({ user, issues, onViewPramaan }) {
  const reported = issues.filter(i => i.reporterId === user.id);
  const followed = issues.filter(i => i.reporterId !== user.id && (i.isTracked || i.hasVoted));
  const votesGiven = issues.filter(i => i.hasVoted).length;
  const resolvedMine = reported.filter(i => i.status === 'Completed').length;

  const IssueTable = ({ title, rows, empty }) => (
    <div className="bg-[#11212D] border border-[#9BA8AB]/15 rounded-xl p-5 sm:p-6 card-shadow">
      <div className="flex flex-wrap gap-2 items-center justify-between mb-3 pb-3 border-b border-[#253745]">
        <h3 className="font-bebas text-[20px] text-[#CCD0CF]">{title}</h3>
        <span className="text-[12px] text-[#9BA8AB]">Audited issues open their Pramaan certificate</span>
      </div>
      {rows.length === 0 ? (
        <p className="text-[14px] text-[#9BA8AB] py-2">{empty}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left border-collapse">
            <thead>
              <tr className="border-b border-[#253745]">
                {['Issue', 'Category', 'Status', 'Anumodan'].map((h, i) => (
                  <th key={h} className={`py-2 px-3 font-bebas text-[16px] text-[#9BA8AB] ${i === 3 ? 'text-right' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#253745]/60 text-[14px]">
              {rows.map((item) => (
                <tr
                  key={item.id}
                  onClick={item.verification ? () => onViewPramaan(item) : undefined}
                  className={`transition-colors ${item.verification ? 'hover:bg-[#253745]/40 cursor-pointer' : ''}`}
                >
                  <td className="py-3 px-3 font-semibold text-[#CCD0CF]">
                    {item.title}
                    <span className="block text-[11px] font-mono text-[#9BA8AB] font-normal">{item.id}{item.verification && ' · view audit →'}</span>
                  </td>
                  <td className="py-3 px-3 text-[#9BA8AB]">{item.category}</td>
                  <td className="py-3 px-3"><StatusBadge status={item.status} /></td>
                  <td className="py-3 px-3 text-right font-bebas text-[18px] text-[#FF9800]">{item.anumodanCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatTile label="Issues Reported" value={reported.length} icon="PlusCircle" accent="text-[#6BBF4A]" />
        <StatTile label="Resolved & Verified" value={resolvedMine} icon="ShieldCheck" accent="text-[#6BBF4A]" />
        <StatTile label="Anumodan Given" value={votesGiven} icon="Flame" accent="text-[#FF9800]" />
        <StatTile label="Issues Followed" value={followed.length} icon="Bookmark" />
      </div>

      <IssueTable title="My reported grievances" rows={reported} empty="You haven't reported any issues yet — use Post Awaaz to file one." />
      <IssueTable title="Issues I'm following" rows={followed} empty="Track or give an Anumodan on feed issues to follow them here." />
    </div>
  );
}
