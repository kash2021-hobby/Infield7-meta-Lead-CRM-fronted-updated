import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, LayoutDashboard, Phone, Mail, Clock, 
  RefreshCw, Plus, Menu, X, ChevronRight, FileText, 
  Search, MessageCircle, PhoneCall, Calendar, Send, Info, Bell, Lock, ArrowRight, User as UserIcon, Trash2, Filter, Building, Key, Download, Smartphone
} from 'lucide-react';

const API_BASE = 'https://api.ltabai.in/api';

axios.interceptors.request.use(config => {
  const token = localStorage.getItem('crm_auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, error => Promise.reject(error));

// ==========================================
// 1. LOGIN SCREEN
// ==========================================
const LoginScreen = ({ onLoginSuccess, onInstallClick }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true); setError('');
    try {
      const res = await axios.post(`${API_BASE}/login`, { username, password });
      if (res.data.success) {
        localStorage.setItem('crm_auth_token', res.data.token);
        localStorage.setItem('crm_username', res.data.username);
        localStorage.setItem('crm_role', res.data.role);
        localStorage.setItem('crm_company_name', res.data.company_name); 
        onLoginSuccess(res.data.username, res.data.role, res.data.company_name);
      }
    } catch (err) { setError(err.response?.data?.error || 'Login failed.'); } 
    finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen app-bg flex">
      {/* Brand panel */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-900 text-white p-12 flex-col justify-between">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-2xl"></div>
        <div className="absolute bottom-[-120px] left-[-80px] w-[420px] h-[420px] rounded-full bg-teal-300/20 blur-3xl"></div>
        <div className="relative flex items-center gap-3">
          <img src="/logo.png" className="h-10 w-10 object-contain rounded-xl shadow-md" alt="Infield7 Logo" />
          <span className="text-lg font-bold tracking-tight">Infield7 Lead CRM</span>
        </div>
        <div className="relative max-w-md">
          <h2 className="text-4xl font-extrabold leading-tight tracking-tight">Every lead, every follow-up — in one place.</h2>
          <p className="mt-4 text-emerald-100/90 text-base">Leads from your Meta ads arrive automatically. Move them through each stage and never miss a follow-up.</p>
          <div className="mt-10 grid grid-cols-2 gap-3">
            {[['🆕', 'New'], ['📞', 'Contacted'], ['⏰', 'Follow-up'], ['✅', 'Converted']].map(([e, t], i) => (
              <motion.div key={t} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.08 }} className="flex items-center gap-3 bg-white/10 border border-white/15 backdrop-blur rounded-xl px-4 py-3">
                <span className="text-lg">{e}</span><span className="font-semibold text-sm">{t}</span>
              </motion.div>
            ))}
          </div>
        </div>
        <p className="relative text-xs text-emerald-100/70">Secure client portal</p>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <img src="/logo.png" className="h-10 w-10 object-contain rounded-xl shadow-md" alt="Infield7 Logo" />
            <span className="text-lg font-bold tracking-tight text-slate-800">Infield7 Lead CRM</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome back 👋</h1>
          <p className="text-sm text-slate-500 mt-2 mb-8">Sign in to manage your leads and follow-ups.</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="label">Username</label>
              <div className="relative"><div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><UserIcon size={17} className="text-slate-400" /></div><input type="text" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} className="input pl-10 py-3" /></div>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative"><div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><Lock size={17} className="text-slate-400" /></div><input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="input pl-10 py-3" /></div>
            </div>
            {error && <p className="text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2 text-xs font-semibold">{error}</p>}
            <button type="submit" disabled={isLoading} className="btn-primary w-full py-3.5 mt-2 text-[15px]">{isLoading ? 'Signing in...' : 'Sign in'} <ArrowRight size={18} /></button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-200/70 flex flex-col items-center">
            <p className="text-lg font-extrabold text-slate-800 text-center mb-4">Manage leads directly from your phone</p>
            <button type="button" onClick={onInstallClick} className="w-full flex items-center justify-center gap-2 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold transition-all text-base shadow-lg shadow-slate-900/20">
              <Download size={20} />
              Install the Infield7 Lead CRM App
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// ==========================================
// 2. MAIN APP
// ==========================================
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState('');
  const [userRole, setUserRole] = useState('');
  const [companyName, setCompanyName] = useState(''); 
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallModal, setShowInstallModal] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    const promptEvent = window.deferredPwaPrompt || deferredPrompt;
    if (promptEvent) {
      promptEvent.prompt();
      const { outcome } = await promptEvent.userChoice;
      if (outcome === 'accepted') {
        window.deferredPwaPrompt = null;
        setDeferredPrompt(null);
      }
    } else {
      setShowInstallModal(true);
    }
  };

  // Admin State
  const [companies, setCompanies] = useState([]);
  const [activeCompany, setActiveCompany] = useState(null);
  const [showAddCompany, setShowAddCompany] = useState(false);
  const [newCompName, setNewCompName] = useState('');
  const [newCompUser, setNewCompUser] = useState('');
  const [newCompPass, setNewCompPass] = useState('');

  // Telegram State
  const [tgBotToken, setTgBotToken] = useState('');
  const [tgChatId, setTgChatId] = useState('');
  const [isSavingTg, setIsSavingTg] = useState(false);

  // CRM State
  const [campaigns, setCampaigns] = useState([]);
  const [leads, setLeads] = useState([]);
  const [activeCampaign, setActiveCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showMobileAnalytics, setShowMobileAnalytics] = useState(false);
  const [showMobileAdmin, setShowMobileAdmin] = useState(false);
  const appRootRef = useRef(null);
  const lastScrollY = useRef(0);
  const scrollAnchor = useRef(0);
  const headerVisibleRef = useRef(true);
  const toggleLock = useRef(false);
  const scrollTicking = useRef(false);

  // Toggles a CSS class directly on the DOM (no React re-render) for zero-lag scrolling
  const setHeaderSmooth = (visible) => {
    if (headerVisibleRef.current === visible) return;
    headerVisibleRef.current = visible;
    appRootRef.current?.classList.toggle('hdr-collapsed', !visible);
    // Ignore scroll events while the header animates (its height change shifts scrollTop)
    toggleLock.current = true;
    setTimeout(() => { toggleLock.current = false; }, 180);
  };

  const handleMainScroll = (e) => {
    const target = e.currentTarget;
    if (scrollTicking.current) return;
    scrollTicking.current = true;
    requestAnimationFrame(() => {
      scrollTicking.current = false;
      const y = target.scrollTop;
      if (window.innerWidth >= 768) { setHeaderSmooth(true); lastScrollY.current = y; return; }
      if (toggleLock.current) { lastScrollY.current = y; scrollAnchor.current = y; return; }
      if (y < 40) { setHeaderSmooth(true); scrollAnchor.current = y; lastScrollY.current = y; return; }
      const dirDown = y > lastScrollY.current;
      const wasDown = lastScrollY.current > scrollAnchor.current;
      if (dirDown !== wasDown) scrollAnchor.current = lastScrollY.current; // direction changed
      const delta = y - scrollAnchor.current;
      if (delta > 8) setHeaderSmooth(false);
      else if (delta < -8) setHeaderSmooth(true);
      lastScrollY.current = y;
    });
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('new'); 
  const [dateFilter, setDateFilter] = useState('all');
  const [visibleCount, setVisibleCount] = useState(30);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setVisibleCount(30);
  };

  useEffect(() => {
    setVisibleCount(30);
  }, [searchTerm, dateFilter]);

  const [selectedLead, setSelectedLead] = useState(null);
  const [modalTab, setModalTab] = useState('info'); 
  const [activities, setActivities] = useState([]);
  const [editStatus, setEditStatus] = useState('');
  const [pendingStatus, setPendingStatus] = useState(null);
  const [statusNote, setStatusNote] = useState('');
  const [reminderDate, setReminderDate] = useState(''); 
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [activityType, setActivityType] = useState('note');
  const [activityContent, setActivityContent] = useState('');

  const [showAddForm, setShowAddForm] = useState(false);
  const [newCampName, setNewCampName] = useState('');
  const [newCampSheetId, setNewCampSheetId] = useState('');

  // Manual Lead State
  const [showManualLeadModal, setShowManualLeadModal] = useState(false);
  const [manualLeadData, setManualLeadData] = useState({ name: '', phone: '', email: '', campaign_id: '', notes: '' });
  const [isSavingLead, setIsSavingLead] = useState(false);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      r => r, err => { if (err.response?.status === 401 || err.response?.status === 403) handleLogout(); return Promise.reject(err); }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('crm_auth_token');
    if (token) {
      setIsAuthenticated(true);
      setLoggedInUser(localStorage.getItem('crm_username'));
      setUserRole(localStorage.getItem('crm_role'));
      setCompanyName(localStorage.getItem('crm_company_name') || 'Agency CRM');
    }
    setIsCheckingAuth(false);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false); setLoggedInUser(''); setUserRole(''); setCompanyName(''); setActiveCompany(null); setActiveCampaign(null);
  };

  const handleLoginSuccess = (username, role, compName) => {
    setLoggedInUser(username); setUserRole(role); setCompanyName(compName); setIsAuthenticated(true);
  };

  // --- DATA FETCHING ---
  const fetchCompanies = async () => {
    if (userRole !== 'superadmin') return;
    try { const res = await axios.get(`${API_BASE}/companies`); setCompanies(res.data); } catch (e) { console.error(e); }
  };

  // --- CHROME WEB NOTIFICATIONS ENGINE ---
  const [notificationPermission, setNotificationPermission] = useState(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'denied'
  );
  const prevLeadsRef = useRef(null);
  const notifiedIdsRef = useRef(new Set());

  const requestNotificationPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === 'granted') {
        new Notification('🔔 Notifications Enabled!', {
          body: 'You will now receive Chrome alerts for new leads, follow-ups, and overdue tasks.',
          icon: '/pwa-192x192.png'
        });
      }
    } else {
      alert('Browser notifications are not supported on this browser.');
    }
  };

  const checkNotifications = (newLeadsList) => {
    if (typeof window === 'undefined' || !('Notification' in window) || Notification.permission !== 'granted') return;

    if (!prevLeadsRef.current) {
      prevLeadsRef.current = newLeadsList;
      return;
    }

    const prevMap = new Map(prevLeadsRef.current.map(l => [l.id, l]));
    const now = new Date().getTime();

    newLeadsList.forEach(lead => {
      const isNewArrival = !prevMap.has(lead.id);

      // 1. 🆕 NEW LEAD NOTIFICATION
      if (isNewArrival && !notifiedIdsRef.current.has(`new-${lead.id}`)) {
        notifiedIdsRef.current.add(`new-${lead.id}`);
        const veh = lead.details?.['which_is_the_t'] || lead.details?.['ad_name'] || 'Infield7 Lead';
        new Notification('🆕 New Lead Received!', {
          body: `${lead.name || 'New Customer'} - ${veh}\nPhone: ${lead.phone || 'N/A'}`,
          icon: '/pwa-192x192.png',
          tag: `new-lead-${lead.id}`
        });
      }

      // 2. ⏰ & ⚠️ FOLLOW-UP AND OVERDUE NOTIFICATIONS
      if (lead.status === 'followup' && lead.reminder_date) {
        const reminderTime = new Date(lead.reminder_date).getTime();
        const timeDiffMinutes = (reminderTime - now) / 60000;

        if (timeDiffMinutes < 0 && !notifiedIdsRef.current.has(`overdue-${lead.id}`)) {
          notifiedIdsRef.current.add(`overdue-${lead.id}`);
          new Notification('⚠️ Overdue Follow-up Alert!', {
            body: `Follow-up with ${lead.name || 'Customer'} is overdue!\nPhone: ${lead.phone || 'N/A'}`,
            icon: '/pwa-192x192.png',
            tag: `overdue-lead-${lead.id}`
          });
        }
        else if (timeDiffMinutes >= 0 && timeDiffMinutes <= 15 && !notifiedIdsRef.current.has(`due-${lead.id}`)) {
          notifiedIdsRef.current.add(`due-${lead.id}`);
          new Notification('⏰ Scheduled Follow-up Due!', {
            body: `Call ${lead.name || 'Customer'} regarding follow-up.\nPhone: ${lead.phone || 'N/A'}`,
            icon: '/pwa-192x192.png',
            tag: `due-lead-${lead.id}`
          });
        }
      }
    });

    prevLeadsRef.current = newLeadsList;
  };

  const fetchCrmData = async (isSilent = false) => {
    if (!isAuthenticated) return;
    if (!isSilent) setLoading(true);
    try {
      let campUrl = `${API_BASE}/campaigns`;
      let leadUrl = `${API_BASE}/leads`;

      if (userRole === 'superadmin' && activeCompany) {
        campUrl += `?company_id=${activeCompany.id}`;
        leadUrl += `?company_id=${activeCompany.id}`;
      }
      if (activeCampaign) {
        leadUrl += userRole === 'superadmin' && activeCompany ? `&campaign_id=${activeCampaign}` : `?campaign_id=${activeCampaign}`;
      }

      const [campRes, leadRes] = await Promise.all([axios.get(campUrl), axios.get(leadUrl)]);
      setCampaigns(campRes.data);
      setLeads(leadRes.data);
      checkNotifications(leadRes.data);
    } catch (error) { console.error(error); } 
    finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => {
    if (isAuthenticated) {
      if (userRole === 'superadmin') fetchCompanies();
      fetchCrmData();
    }
  }, [isAuthenticated, userRole, activeCompany, activeCampaign]);

  useEffect(() => {
    if (activeCompany) {
      setTgBotToken(activeCompany.telegram_bot_token || '');
      setTgChatId(activeCompany.telegram_chat_id || '');
    }
  }, [activeCompany]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(() => { fetchCrmData(true); }, 15000);
    return () => clearInterval(interval);
  }, [isAuthenticated, userRole, activeCompany, activeCampaign]);

  // --- ACTIONS ---
  const handleForceSync = async () => {
    setRefreshing(true);
    try { await axios.post(`${API_BASE}/sync`); await fetchCrmData(true); } 
    catch (e) { console.error(e); setRefreshing(false); }
  };

  const handleDeleteAllLeads = async () => {
    if (userRole !== 'superadmin') return;
    const confirmInput = window.prompt("🚨 DANGER: This will permanently delete EVERY lead across ALL client companies. Type 'DELETE' to confirm this wipe.");
    if (confirmInput === 'DELETE') {
      setLoading(true);
      try { await axios.delete(`${API_BASE}/leads/all`); alert("Success: All leads wiped."); fetchCrmData(true); } 
      catch (error) { alert("Failed to wipe leads."); } finally { setLoading(false); }
    }
  };

  const handleAddCompany = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      await axios.post(`${API_BASE}/companies`, { name: newCompName, username: newCompUser, password: newCompPass });
      setShowAddCompany(false); setNewCompName(''); setNewCompUser(''); setNewCompPass('');
      fetchCompanies();
    } catch (e) { alert(e.response?.data?.error || "Error"); } finally { setLoading(false); }
  };

  const handleDeleteCompany = async (id, name, e) => {
    e.stopPropagation();
    if (window.confirm(`Delete Company "${name}" and all their leads?`)) {
      await axios.delete(`${API_BASE}/companies/${id}`);
      if (activeCompany?.id === id) { setActiveCompany(null); setCampaigns([]); setLeads([]); }
      fetchCompanies();
    }
  };

  const handleSaveTelegramSettings = async () => {
    if (!activeCompany) return;
    const isSure = window.confirm("Are you sure you want to save/update the Telegram settings for this client?");
    if (!isSure) return; 

    setIsSavingTg(true);
    try {
      await axios.patch(`${API_BASE}/companies/${activeCompany.id}`, { 
        telegram_bot_token: tgBotToken, 
        telegram_chat_id: tgChatId 
      });
      alert("Telegram Configuration Saved Successfully!");
      fetchCompanies();
    } catch (e) { 
      alert("Failed to save settings."); 
    } finally { 
      setIsSavingTg(false); 
    }
  };

  const handleAddCampaign = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      await axios.post(`${API_BASE}/campaigns`, { name: newCampName, sheet_id: newCampSheetId, company_id: activeCompany?.id });
      setShowAddForm(false); setNewCampName(''); setNewCampSheetId(''); fetchCrmData();
    } catch (error) { alert(`Error: ${error.response?.data?.error || "Failed to add campaign."}`); } 
    finally { setLoading(false); }
  };

  const handleDeleteCampaign = async (id, name, e) => {
    e.stopPropagation(); 
    if (window.confirm(`Delete campaign "${name}" and its leads?`)) {
      await axios.delete(`${API_BASE}/campaigns/${id}`);
      if (activeCampaign === id) setActiveCampaign(null); fetchCrmData(true);
    }
  };

  const handleAddManualLead = async (e) => {
    e.preventDefault();
    setIsSavingLead(true);
    try {
      await axios.post(`${API_BASE}/leads`, manualLeadData);
      setShowManualLeadModal(false);
      setManualLeadData({ name: '', phone: '', email: '', campaign_id: '', notes: '' });
      fetchCrmData(true);
      alert("Lead added successfully!");
    } catch (error) {
      alert(`Error: ${error.response?.data?.error || "Failed to add lead."}`);
    } finally {
      setIsSavingLead(false);
    }
  };

  // --- LEAD MODAL ACTIONS ---
  const openLeadModal = (lead) => { setSelectedLead(lead); setEditStatus(lead.status); setModalTab('info'); setPendingStatus(null); setStatusNote(''); setReminderDate(''); fetchActivities(lead.id); };
  const closeLeadModal = () => { setSelectedLead(null); setPendingStatus(null); setStatusNote(''); setReminderDate(''); };
  const fetchActivities = async (id) => { const res = await axios.get(`${API_BASE}/leads/${id}/activities`); setActivities(res.data); };

  const handleStatusDropdownChange = (e) => {
    const newStatus = e.target.value;
    if (['contacted', 'converted', 'followup'].includes(newStatus)) {
      setPendingStatus(newStatus);
      if (newStatus === 'followup') {
        const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1); tomorrow.setHours(10, 0, 0, 0);
        setReminderDate(new Date(tomorrow.getTime() - (tomorrow.getTimezoneOffset() * 60000)).toISOString().slice(0, 16));
      }
    } else { updateLeadStatus(newStatus); }
  };

  const updateLeadStatus = async (newStatus) => {
    setEditStatus(newStatus);
    await axios.patch(`${API_BASE}/leads/${selectedLead.id}`, { status: newStatus });
    setLeads(leads.map(l => l.id === selectedLead.id ? { ...l, status: newStatus } : l));
  };

  const submitStatusChangeNote = async () => {
    if (!statusNote.trim()) return; 
    if (pendingStatus === 'followup' && !reminderDate) return alert("Select reminder date.");
    
    await axios.patch(`${API_BASE}/leads/${selectedLead.id}`, { status: pendingStatus, reminder_date: pendingStatus === 'followup' ? new Date(reminderDate).toISOString() : null });
    let content = `Status updated to ${pendingStatus.toUpperCase()}:\n"${statusNote}"`;
    if (pendingStatus === 'followup') content = `Status updated to FOLLOW UP.\nReminder set for: ${new Date(reminderDate).toLocaleString()}\nNote: "${statusNote}"`;

    const res = await axios.post(`${API_BASE}/leads/${selectedLead.id}/activities`, { type: pendingStatus === 'followup' ? 'call' : 'note', content });

    setLeads(leads.map(l => l.id === selectedLead.id ? { ...l, status: pendingStatus, reminder_date: pendingStatus === 'followup' ? new Date(reminderDate).toISOString() : l.reminder_date } : l));
    setEditStatus(pendingStatus); setActivities([res.data, ...activities]); setPendingStatus(null); setStatusNote(''); setReminderDate(''); setModalTab('timeline');
  };

  const handlePostActivity = async () => {
    if (!activityContent.trim()) return;
    const res = await axios.post(`${API_BASE}/leads/${selectedLead.id}/activities`, { type: activityType, content: activityContent });
    setActivities([res.data, ...activities]); setActivityContent(''); setShowAddActivity(false);
  };

  // --- HELPERS & FILTERS ---
  const getStatusStyle = (s) => ({ 'new':'bg-blue-50 text-blue-700 border-blue-200', 'contacted':'bg-amber-50 text-amber-700 border-amber-200', 'followup':'bg-purple-50 text-purple-700 border-purple-200', 'converted':'bg-emerald-50 text-emerald-700 border-emerald-200' }[s] || 'bg-gray-50 text-gray-700 border-gray-200');
  const getVehicleName = (l) => l.details?.['which_is_the_t'] || l.details?.['ad_name'] || "N/A";
  const leadDateFormatter = useMemo(() => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }), []);
  const formatActivityTime = (d) => leadDateFormatter.format(new Date(d));

  const getActivityIcon = (type) => {
    switch(type) {
      case 'call': return <PhoneCall size={14} className="text-blue-600"/>;
      case 'message': return <MessageCircle size={14} className="text-emerald-600"/>;
      case 'meeting': return <Calendar size={14} className="text-purple-600"/>;
      case 'system': return <Users size={14} className="text-slate-500"/>;
      default: return <FileText size={14} className="text-amber-600"/>;
    }
  };

  // NEW: Gets the exact display date for the lead card
  const getLeadDisplayDate = (lead) => {
    const t = lead.details?.['created_time'] || lead.details?.['timestamp'];
    const dateObj = (t && !isNaN(new Date(t).getTime())) ? new Date(t) : new Date(lead.createdAt);
    return leadDateFormatter.format(dateObj);
  };

  const applyDateFilterToLead = (lead) => {
    if (dateFilter === 'all') return true;

    let dateToUse;
    if (lead.status === 'followup' && lead.reminder_date) {
      dateToUse = new Date(lead.reminder_date);
    } else {
      const originalSheetTime = lead.details?.['created_time'] || lead.details?.['timestamp'];
      if (originalSheetTime && !isNaN(new Date(originalSheetTime).getTime())) {
        dateToUse = new Date(originalSheetTime);
      } else {
        dateToUse = new Date(lead.createdAt);
      }
    }

    const targetDate = new Date(dateToUse); targetDate.setHours(0, 0, 0, 0);
    const today = new Date(); today.setHours(0, 0, 0, 0);

    if (dateFilter === 'today') return targetDate.getTime() === today.getTime();
    if (dateFilter === 'yesterday') {
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      return targetDate.getTime() === yesterday.getTime();
    }
    if (dateFilter === 'tomorrow') {
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      return targetDate.getTime() === tomorrow.getTime();
    }
    if (dateFilter === 'this_week') {
      const startOfWeek = new Date(today); startOfWeek.setDate(today.getDate() - today.getDay()); 
      const endOfWeek = new Date(startOfWeek); endOfWeek.setDate(startOfWeek.getDate() + 6); 
      return targetDate >= startOfWeek && targetDate <= endOfWeek;
    }
    if (dateFilter === 'this_month') return targetDate.getMonth() === today.getMonth() && targetDate.getFullYear() === today.getFullYear();
    return true;
  };

  const sortedLeads = useMemo(() => [...leads].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)), [leads]);
  const filteredLeads = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return sortedLeads.filter(lead =>
      (lead.name?.toLowerCase().includes(term) || lead.phone?.includes(term) || getVehicleName(lead).toLowerCase().includes(term)) && applyDateFilterToLead(lead)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortedLeads, searchTerm, dateFilter]);

  const groupedLeads = useMemo(() => ({ new: filteredLeads.filter(l => l.status === 'new'), contacted: filteredLeads.filter(l => l.status === 'contacted'), followup: filteredLeads.filter(l => l.status === 'followup'), converted: filteredLeads.filter(l => l.status === 'converted') }), [filteredLeads]);
  const activeLeadsList = groupedLeads[activeTab];
  const renderedLeads = useMemo(() => activeLeadsList.slice(0, visibleCount), [activeLeadsList, visibleCount]);

  // CSV EXPORT LOGIC
  const exportToCSV = () => {
    if (filteredLeads.length === 0) return alert("No leads match your current search/date filters to export.");
    
    const headers = ["Name", "Phone", "Email", "Status", "Campaign", "Lead Source", "Vehicle", "Created At"];
    const csvRows = filteredLeads.map(l => [
      l.name || "Unknown",
      l.phone || "",
      l.email || "",
      l.status.toUpperCase(),
      l.Campaign?.name || "Manual Entry",
      l.source_sheet_id === 'manual' ? 'Manual' : 'Google Sheet',
      getVehicleName(l),
      new Date(l.createdAt).toLocaleString()
    ].map(v => `"${(v || '').toString().replace(/"/g, '""')}"`).join(","));

    const csvContent = [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `leads_export_${dateFilter}_${new Date().getTime()}.csv`);
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  // --- RENDER ---
  const STAGES = {
    new:       { label: 'New',       emoji: '🆕', text: 'text-blue-700',    soft: 'bg-blue-50 text-blue-700 ring-blue-200',          dot: 'bg-blue-500',    grad: 'from-blue-500 to-indigo-500',   hint: 'Fresh leads to call' },
    contacted: { label: 'Contacted', emoji: '📞', text: 'text-amber-700',   soft: 'bg-amber-50 text-amber-700 ring-amber-200',       dot: 'bg-amber-500',   grad: 'from-amber-400 to-orange-500',  hint: 'Spoken to once' },
    followup:  { label: 'Follow-up', emoji: '⏰', text: 'text-violet-700',  soft: 'bg-violet-50 text-violet-700 ring-violet-200',    dot: 'bg-violet-500',  grad: 'from-violet-500 to-fuchsia-500', hint: 'Reminder scheduled' },
    converted: { label: 'Converted', emoji: '✅', text: 'text-emerald-700', soft: 'bg-emerald-50 text-emerald-700 ring-emerald-200', dot: 'bg-emerald-500', grad: 'from-emerald-500 to-teal-500',  hint: 'Deal closed' },
  };
  const stageOf = (s) => STAGES[s] || { label: s, emoji: '•', soft: 'bg-slate-50 text-slate-700 ring-slate-200', dot: 'bg-slate-400', grad: 'from-slate-400 to-slate-500', text: 'text-slate-700' };
  const currentStage = pendingStatus || editStatus;

  // --- ANALYTICS (memoized for instant button clicks) ---
  const STAGE_HEX = useMemo(() => ({ new: '#3b82f6', contacted: '#f59e0b', followup: '#8b5cf6', converted: '#10b981' }), []);
  const stageKeys = useMemo(() => ['new', 'contacted', 'followup', 'converted'], []);
  const totalLeads = filteredLeads.length;
  const pct = (n, d) => (d > 0 ? Math.round((n / d) * 1000) / 10 : 0);

  const { conversionRate, engagedCount, contactRate, closeRate, donutSegments, trendDays, trendMax, trendWeekTotal } = useMemo(() => {
    const convRate = pct(groupedLeads.converted.length, totalLeads);
    const engaged = totalLeads - groupedLeads.new.length;
    const contRate = pct(engaged, totalLeads);
    const clsRate = pct(groupedLeads.converted.length, engaged);

    const donutRadius = 54, donutCircumference = 2 * Math.PI * donutRadius;
    let donutOffset = 0;
    const segments = ['new', 'contacted', 'followup', 'converted'].map(k => {
      const len = totalLeads ? (groupedLeads[k].length / totalLeads) * donutCircumference : 0;
      const seg = { k, len, offset: donutOffset };
      donutOffset += len;
      return seg;
    });

    const leadDate = (l) => {
      const t = l.details?.['created_time'] || l.details?.['timestamp'];
      return (t && !isNaN(new Date(t).getTime())) ? new Date(t) : new Date(l.createdAt);
    };

    const tDays = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - (6 - i));
      const targetTime = d.getTime();
      const leadsOnDay = leads.filter(l => {
        const x = leadDate(l);
        x.setHours(0, 0, 0, 0);
        return x.getTime() === targetTime;
      });
      return {
        label: d.toLocaleDateString('en-US', { weekday: 'short' }),
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        total: leadsOnDay.length,
        converted: leadsOnDay.filter(l => l.status === 'converted').length,
        isToday: i === 6
      };
    });

    const tMax = Math.max(1, ...tDays.map(d => d.total));
    const tWeekTotal = tDays.reduce((s, d) => s + d.total, 0);

    return {
      conversionRate: convRate,
      engagedCount: engaged,
      contactRate: contRate,
      closeRate: clsRate,
      donutSegments: segments,
      trendDays: tDays,
      trendMax: tMax,
      trendWeekTotal: tWeekTotal
    };
  }, [leads, totalLeads, groupedLeads]);

  const donutR = 54, donutC = 2 * Math.PI * donutR;

  if (isCheckingAuth) return (
    <div className="h-screen app-bg flex flex-col items-center justify-center gap-3 text-slate-400">
      <div className="h-10 w-10 rounded-full border-4 border-emerald-200 border-t-emerald-500 animate-spin"></div>
      <span className="text-sm font-semibold">Loading...</span>
    </div>
  );
  if (!isAuthenticated) return <LoginScreen onLoginSuccess={handleLoginSuccess} onInstallClick={handleInstallClick} />;

  const displayName = userRole === 'superadmin' ? 'Global Admin' : (companyName !== 'Agency CRM' && companyName ? companyName : loggedInUser);
  const pageTitle = userRole === 'superadmin' ? (activeCompany ? activeCompany.name : 'Global Overview') : (activeCampaign === null ? 'All Leads' : campaigns.find(c => c.id === activeCampaign)?.name);

  return (
    <div ref={appRootRef} className="flex h-screen app-bg text-slate-800 overflow-hidden">
      <AnimatePresence>{isSidebarOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden" />}</AnimatePresence>

      {/* ================= SIDEBAR ================= */}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-[280px] bg-slate-50/50 backdrop-blur-2xl border-r border-slate-200/60 transition-transform duration-300 flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        {/* Brand */}
        <div className="px-6 pt-8 pb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" className="h-9 w-9 object-contain rounded-xl shadow-md" alt="Infield7 Logo" />
            <span className="text-lg font-extrabold tracking-tight text-slate-900">Infield7 Lead CRM</span>
          </div>
          <button id="close-sidebar" onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2 rounded-xl text-slate-400 hover:bg-slate-200/50 transition-colors"><X size={20} /></button>
        </div>

        {/* Profile card */}
        <div className="mx-4 mb-6 p-4 rounded-2xl bg-white shadow-sm border border-slate-200/50 relative">
          <div className="relative flex items-center gap-3">
            <div className="relative">
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300/50 flex items-center justify-center">
                {userRole === 'superadmin' ? <LayoutDashboard size={20} className="text-slate-700" /> : <span className="text-lg font-extrabold text-emerald-600 uppercase">{(companyName && companyName !== 'Agency CRM') ? companyName.charAt(0) : loggedInUser.charAt(0)}</span>}
              </div>
              {groupedLeads?.followup?.length > 0 && (
                <div title="Leads in follow-up" className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center shadow-sm border-2 border-white animate-pulse">{groupedLeads.followup.length}</div>
              )}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-slate-900 truncate capitalize text-[15px]">{displayName}</p>
              <p className="text-[11px] text-emerald-600 font-bold uppercase tracking-wider mt-0.5">{userRole === 'superadmin' ? 'System Admin' : 'Client Portal'}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 pb-4 hide-scrollbar">
          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3 px-2">{userRole === 'superadmin' ? 'Client Companies' : 'Your Campaigns'}</p>
          {userRole === 'superadmin' ? (
            <div className="space-y-1.5">
              <button id="nav-all-companies" onClick={() => { setActiveCompany(null); setActiveCampaign(null); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-sm transition-all duration-200 ${activeCompany === null ? 'bg-white shadow-sm border border-slate-200/60 text-emerald-700 font-bold' : 'text-slate-500 font-medium hover:bg-slate-200/40 hover:text-slate-900 border border-transparent'}`}>
                <div className={`p-1.5 rounded-lg transition-colors ${activeCompany === null ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200/50 text-slate-400'}`}><Users size={16} /></div>
                All Leads Overview
              </button>
              {companies.map(comp => (
                <div key={comp.id} className={`w-full flex items-center justify-between px-2 py-1 rounded-2xl group transition-all duration-200 ${activeCompany?.id === comp.id ? 'bg-white shadow-sm border border-slate-200/60 text-emerald-700' : 'hover:bg-slate-200/40 text-slate-600 border border-transparent'}`}>
                  <button onClick={() => { setActiveCompany(comp); setActiveCampaign(null); setIsSidebarOpen(false); }} className="flex-1 flex items-center gap-3 text-left truncate py-2 pl-1">
                    <div className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${activeCompany?.id === comp.id ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200/50 text-slate-400 group-hover:bg-white group-hover:shadow-sm group-hover:text-slate-600'}`}><Building size={16} /></div>
                    <span className={`truncate text-[13px] ${activeCompany?.id === comp.id ? 'font-bold' : 'font-medium group-hover:text-slate-900'}`}>{comp.name}</span>
                  </button>
                  <button title="Delete company" onClick={(e) => handleDeleteCompany(comp.id, comp.name, e)} className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-1.5">
              <button id="nav-all-leads" onClick={() => { setActiveCampaign(null); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-sm transition-all duration-200 ${activeCampaign === null ? 'bg-white shadow-sm border border-slate-200/60 text-emerald-700 font-bold' : 'text-slate-500 font-medium hover:bg-slate-200/40 hover:text-slate-900 border border-transparent'}`}>
                <div className={`p-1.5 rounded-lg transition-colors ${activeCampaign === null ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200/50 text-slate-400'}`}><Users size={16} /></div>
                All Leads
              </button>
              {campaigns.map(camp => (
                <button key={camp.id} onClick={() => { setActiveCampaign(camp.id); setIsSidebarOpen(false); }} className={`w-full flex items-center justify-between gap-3 px-3 py-3 rounded-2xl text-sm transition-all duration-200 ${activeCampaign === camp.id ? 'bg-white shadow-sm border border-slate-200/60 text-emerald-700 font-bold' : 'text-slate-500 font-medium hover:bg-slate-200/40 hover:text-slate-900 border border-transparent'}`}>
                  <span className="flex items-center gap-3 truncate">
                    <div className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${activeCampaign === camp.id ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200/50 text-slate-400'}`}><LayoutDashboard size={16} /></div>
                    <span className="truncate text-left text-[13px]">{camp.name}</span>
                  </span>
                  {activeCampaign === camp.id && <ChevronRight size={16} className="text-emerald-500 flex-shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </nav>

        {userRole === 'superadmin' && (
          <div className="px-4 py-4">
            {showAddCompany ? (
              <form onSubmit={handleAddCompany} className="space-y-3 bg-white p-4 rounded-2xl shadow-sm border border-slate-200/60">
                <p className="text-xs font-bold text-slate-800">New client company</p>
                <input required placeholder="Company name" className="input bg-slate-50 border-none text-[13px] h-10" value={newCompName} onChange={e => setNewCompName(e.target.value)} />
                <input required placeholder="Login username" className="input bg-slate-50 border-none text-[13px] h-10" value={newCompUser} onChange={e => setNewCompUser(e.target.value)} />
                <input required placeholder="Login password" type="password" className="input bg-slate-50 border-none text-[13px] h-10" value={newCompPass} onChange={e => setNewCompPass(e.target.value)} />
                <div className="flex gap-2 pt-1"><button type="submit" className="btn-primary flex-1 py-2 text-xs">Create</button><button type="button" onClick={() => setShowAddCompany(false)} className="btn-ghost flex-1 py-2 text-xs">Cancel</button></div>
              </form>
            ) : (
              <button id="add-client-btn" onClick={() => setShowAddCompany(true)} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-emerald-700 font-bold text-[13px] bg-emerald-50/80 hover:bg-emerald-100 transition-all border border-emerald-100/50 shadow-sm"><Plus size={18} /> Add New Client</button>
            )}
          </div>
        )}

        <div className="p-4 pt-2">
          <button id="logout-btn" onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-[13px] font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 py-3.5 rounded-2xl transition-all duration-200"><ArrowRight size={16} className="rotate-180" /> Sign out</button>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/70 px-4 md:px-8 py-3 md:py-4 sticky top-0 z-30 transition-all duration-300">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between hdr-flex-gap">
            <div className="hdr-top-wrap">
              <div className="overflow-hidden flex items-center justify-between gap-3 min-w-0 w-full">
                <div className="flex items-center gap-3 min-w-0">
                  <button id="open-sidebar" onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 -ml-2 rounded-lg hover:bg-slate-100"><Menu size={22} /></button>
                  <div className="min-w-0">
                    <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight truncate">{pageTitle}</h1>
                    <p className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>{filteredLeads.length} leads · auto-refreshing</p>
                  </div>
                </div>
                <button 
                  onClick={handleInstallClick}
                  className="flex-shrink-0 flex items-center gap-1.5 px-3 md:px-3.5 py-1.5 md:py-2 rounded-xl bg-slate-900 text-white font-bold text-xs md:text-sm shadow-sm hover:bg-slate-800 transition-all border border-white/10 ml-auto md:ml-4"
                >
                  <Smartphone size={15} className="text-emerald-400" />
                  Get the App
                </button>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-72 w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search size={16} className="text-slate-400" /></div>
                <input id="search-leads" type="text" placeholder="Search name, phone, vehicle..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input pl-9 bg-slate-50/80 w-full" />
              </div>
              <div className="flex items-center justify-center gap-2 overflow-x-auto hide-scrollbar pb-1 sm:pb-0 w-full sm:w-auto">
                <button 
                  id="notification-bell-btn"
                  title={notificationPermission === 'granted' ? 'Chrome Notifications Active' : 'Enable Chrome Notifications'}
                  onClick={requestNotificationPermission} 
                  className={`btn-ghost flex-shrink-0 transition-all ${notificationPermission === 'granted' ? 'text-emerald-700 bg-emerald-50 border-emerald-300 font-bold' : 'text-slate-700 hover:bg-slate-100'}`}
                >
                  <Bell size={16} className={notificationPermission === 'granted' ? 'text-emerald-600 fill-emerald-500' : 'text-slate-500'} />
                  <span className="font-bold text-xs sm:text-sm">{notificationPermission === 'granted' ? 'Alerts On' : 'Alerts'}</span>
                </button>
                <button id="sync-btn" title="Sync leads from Google Sheets" onClick={handleForceSync} disabled={refreshing} className="btn-ghost flex-shrink-0"><RefreshCw size={16} className={refreshing ? 'animate-spin text-emerald-500' : ''} /><span className="hidden md:inline">{refreshing ? 'Syncing' : 'Sync'}</span></button>
                <button id="export-btn" title="Export filtered leads to CSV" onClick={exportToCSV} className="btn-ghost flex-shrink-0"><Download size={16} /><span className="hidden md:inline">Export</span></button>
                {userRole === 'superadmin' && (
                  <button id="wipe-btn" title="Delete all leads" onClick={handleDeleteAllLeads} className="btn-ghost text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300 flex-shrink-0"><Trash2 size={16} /><span className="hidden xl:inline">Wipe</span></button>
                )}
                <button id="add-lead-btn" onClick={() => setShowManualLeadModal(true)} className="btn-primary flex-shrink-0"><Plus size={17} /><span className="hidden sm:inline">Add Lead</span></button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8" onScroll={handleMainScroll}>
          <div className="max-w-6xl mx-auto">

            {/* ADMIN: company panels */}
            {userRole === 'superadmin' && activeCompany && (
              <div className="mb-8">
                <button 
                  onClick={() => setShowMobileAdmin(!showMobileAdmin)}
                  className="w-full flex md:hidden items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-slate-200/70 mb-4 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <Key size={18} className="text-emerald-600" />
                    <span className="font-bold text-slate-800">Admin Controls</span>
                  </div>
                  <ChevronRight size={18} className={`text-slate-400 transition-transform ${showMobileAdmin ? 'rotate-90' : ''}`} />
                </button>
                <div className={`md:grid-cols-3 gap-4 ${showMobileAdmin ? 'grid' : 'hidden md:grid'}`}>
                <div className="rounded-2xl p-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-lg">
                  <div className="flex items-center gap-2 mb-4"><div className="p-1.5 rounded-lg bg-emerald-400/15"><Key size={16} className="text-emerald-300" /></div><h3 className="font-bold text-sm">Client Login</h3></div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between gap-2 bg-white/5 rounded-lg px-3 py-2"><span className="text-slate-400">URL</span><span className="font-mono truncate">yourdomain.com</span></div>
                    <div className="flex justify-between gap-2 bg-white/5 rounded-lg px-3 py-2"><span className="text-slate-400">User</span><span className="font-mono truncate">{activeCompany.username}</span></div>
                    <div className="flex justify-between gap-2 bg-white/5 rounded-lg px-3 py-2"><span className="text-slate-400">Pass</span><span className="font-mono truncate">{activeCompany.plain_password}</span></div>
                  </div>
                </div>

                <div className="card p-5">
                  <div className="flex items-center gap-2 mb-4"><div className="p-1.5 rounded-lg bg-sky-50"><Send size={16} className="text-sky-600" /></div><h3 className="font-bold text-sm text-slate-800">Telegram Alerts</h3></div>
                  <div className="space-y-2">
                    <input type="text" placeholder="Bot token (123:ABC...)" value={tgBotToken} onChange={(e) => setTgBotToken(e.target.value)} className="input text-xs" />
                    <input type="text" placeholder="Group chat ID (-100123...)" value={tgChatId} onChange={(e) => setTgChatId(e.target.value)} className="input text-xs" />
                    <button onClick={handleSaveTelegramSettings} disabled={isSavingTg} className="w-full inline-flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold py-2.5 rounded-xl transition disabled:opacity-60">{isSavingTg ? 'Saving...' : 'Save settings'}</button>
                  </div>
                </div>

                <div className="card p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2"><div className="p-1.5 rounded-lg bg-emerald-50"><LayoutDashboard size={16} className="text-emerald-600" /></div><h3 className="font-bold text-sm text-slate-800">Campaigns</h3></div>
                    {!showAddForm && <button onClick={() => setShowAddForm(true)} className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg hover:bg-emerald-100 transition">+ Add</button>}
                  </div>
                  {showAddForm ? (
                    <form onSubmit={handleAddCampaign} className="space-y-2">
                      <input required placeholder="Campaign name" className="input text-xs" value={newCampName} onChange={e => setNewCampName(e.target.value)} />
                      <input required placeholder="Google Sheet ID" className="input text-xs" value={newCampSheetId} onChange={e => setNewCampSheetId(e.target.value)} />
                      <div className="flex gap-2"><button type="submit" className="btn-primary flex-1 py-2">Save</button><button type="button" onClick={() => setShowAddForm(false)} className="btn-ghost flex-1 py-2">Cancel</button></div>
                    </form>
                  ) : (
                    <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1">
                      {campaigns.length === 0 ? <p className="text-xs text-slate-400 italic py-2">No campaigns linked yet.</p> : campaigns.map(c => (
                        <div key={c.id} className="flex justify-between items-center px-3 py-2 bg-slate-50 rounded-lg group">
                          <span className="text-xs font-semibold text-slate-700 truncate">{c.name}</span>
                          <button title="Delete campaign" onClick={(e) => handleDeleteCampaign(c.id, c.name, e)} className="text-slate-300 hover:text-red-500 transition"><Trash2 size={14} /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                </div>
              </div>
            )}

            {/* ANALYTICS */}
            <div className="mb-8">
              <button 
                onClick={() => setShowMobileAnalytics(!showMobileAnalytics)}
                className="w-full flex lg:hidden items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-slate-200/70 mb-4 transition-all"
              >
                <div className="flex items-center gap-2">
                  <LayoutDashboard size={18} className="text-emerald-600" />
                  <span className="font-bold text-slate-800">Analytics Overview</span>
                </div>
                <ChevronRight size={18} className={`text-slate-400 transition-transform ${showMobileAnalytics ? 'rotate-90' : ''}`} />
              </button>
              
              <section aria-label="Pipeline analytics" className={`lg:grid-cols-12 gap-4 ${showMobileAnalytics ? 'grid' : 'hidden lg:grid'}`}>
              {/* Donut + conversion */}
              <div className="card p-5 lg:col-span-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-800">Stage distribution</h3>
                  <span className="text-[11px] font-semibold text-slate-400">{totalLeads} leads</span>
                </div>
                <div className="flex flex-col sm:flex-row items-center sm:items-start lg:items-center gap-5">
                  <div className="relative w-[140px] h-[140px] flex-shrink-0">
                    <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
                      <circle cx="70" cy="70" r={donutR} fill="none" stroke="#f1f5f9" strokeWidth="16" />
                      {donutSegments.map(s => s.len > 0 && (
                        <circle key={s.k} cx="70" cy="70" r={donutR} fill="none" stroke={STAGE_HEX[s.k]} strokeWidth="16"
                          strokeDasharray={`${s.len} ${donutC - s.len}`} strokeDashoffset={-s.offset} className="transition-all duration-300">
                          <title>{`${STAGES[s.k].label}: ${groupedLeads[s.k].length}`}</title>
                        </circle>
                      ))}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-extrabold text-slate-900 tracking-tight">{conversionRate}%</span>
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Converted</span>
                    </div>
                  </div>
                  <ul className="flex-1 space-y-2.5 min-w-0">
                    {stageKeys.map(k => (
                      <li key={k} className="flex items-center justify-between gap-2 text-sm">
                        <span className="flex items-center gap-2 text-slate-600 font-medium truncate"><span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ background: STAGE_HEX[k] }}></span>{STAGES[k].label}</span>
                        <span className="font-bold text-slate-800">{groupedLeads[k].length} <span className="text-[11px] text-slate-400 font-semibold">{pct(groupedLeads[k].length, totalLeads)}%</span></span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Funnel */}
              <div className="card p-5 lg:col-span-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-800">Conversion funnel</h3>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">{conversionRate}% overall</span>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'All leads', value: totalLeads, color: '#64748b' },
                    { label: 'Reached (contacted+)', value: engagedCount, color: STAGE_HEX.contacted },
                    { label: 'In follow-up', value: groupedLeads.followup.length, color: STAGE_HEX.followup },
                    { label: 'Converted', value: groupedLeads.converted.length, color: STAGE_HEX.converted },
                  ].map((row) => (
                    <div key={row.label}>
                      <div className="flex justify-between text-xs mb-1"><span className="font-semibold text-slate-600">{row.label}</span><span className="font-bold text-slate-800">{row.value}</span></div>
                      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-300" style={{ background: row.color, width: `${pct(row.value, totalLeads)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100">
                  <div><p className="text-[11px] font-semibold text-slate-400">Contact rate</p><p className="text-lg font-extrabold text-amber-600">{contactRate}%</p></div>
                  <div><p className="text-[11px] font-semibold text-slate-400">Close rate (of reached)</p><p className="text-lg font-extrabold text-emerald-600">{closeRate}%</p></div>
                </div>
              </div>

              {/* 7-day trend */}
              <div className="card p-5 lg:col-span-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-bold text-slate-800">Leads – last 7 days</h3>
                  <span className="text-[11px] font-semibold text-slate-400">{trendWeekTotal} total</span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-500 mb-3">
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-emerald-200"></span>Received</span>
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-emerald-500"></span>Converted</span>
                </div>
                <div className="flex items-end justify-between gap-2 h-[132px]">
                  {trendDays.map((d, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full group" title={`${d.date}: ${d.total} received, ${d.converted} converted`}>
                      <span className="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition">{d.total}</span>
                      <div className="relative w-full flex-1 flex items-end">
                        <div className={`w-full rounded-t-md ${d.isToday ? 'bg-emerald-300' : 'bg-emerald-100'} group-hover:bg-emerald-200 relative overflow-hidden transition-all duration-300`} style={{ height: `${(d.total / trendMax) * 100}%` }}>
                          <div className="absolute bottom-0 left-0 right-0 bg-emerald-500 transition-all duration-300" style={{ height: d.total ? `${(d.converted / d.total) * 100}%` : 0 }}></div>
                        </div>
                      </div>
                      <span className={`text-[10px] font-semibold ${d.isToday ? 'text-emerald-700' : 'text-slate-400'}`}>{d.isToday ? 'Today' : d.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
            </div>


            {/* STAGE CARDS (act as tabs) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
              {['new', 'contacted', 'followup', 'converted'].map((tab) => {
                const st = STAGES[tab]; const active = activeTab === tab;
                return (
                  <button id={`tab-${tab}`} key={tab} onClick={() => handleTabChange(tab)}
                    className={`relative text-left p-4 md:p-5 rounded-2xl border transition-all overflow-hidden group ${active ? `bg-gradient-to-br ${st.grad} text-white border-transparent shadow-lg` : 'bg-white border-slate-200/70 hover:border-slate-300 hover:shadow-md'}`}>
                    {active && <div className="absolute -right-6 -bottom-8 w-28 h-28 rounded-full bg-white/15"></div>}
                    <div className="relative flex items-start justify-between">
                      <span className={`text-xl md:text-2xl ${active ? '' : 'grayscale-[30%]'}`}>{st.emoji}</span>
                      {active && <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">Viewing</span>}
                    </div>
                    <p className={`relative mt-3 text-2xl md:text-3xl font-extrabold tracking-tight ${active ? 'text-white' : 'text-slate-900'}`}>{groupedLeads[tab].length}</p>
                    <p className={`relative text-sm font-bold ${active ? 'text-white' : st.text}`}>{st.label}</p>
                    <p className={`relative text-[11px] mt-0.5 hidden md:block ${active ? 'text-white/80' : 'text-slate-400'}`}>{st.hint}</p>
                  </button>
                );
              })}
            </div>

            {/* LIST HEADER + DATE FILTER */}
            <div className="flex items-center justify-between gap-3 mb-4">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${STAGES[activeTab].dot}`}></span>
                {STAGES[activeTab].label} leads
                <span className="text-slate-400 font-semibold">({activeLeadsList.length})</span>
              </h2>
              <div className="flex items-center gap-2 bg-white border border-slate-200 pl-3 pr-1 py-1 rounded-xl shadow-sm">
                <Filter size={15} className="text-emerald-500" />
                <select id="date-filter" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="py-1.5 pr-2 text-sm font-semibold text-slate-700 bg-transparent border-none outline-none cursor-pointer">
                  <option value="all">All Time</option><option value="today">Today</option><option value="yesterday">Yesterday</option><option value="this_week">This Week</option><option value="this_month">This Month</option>
                </select>
              </div>
            </div>

            {/* LEADS LIST */}
            {loading ? (
              <div className="space-y-3">
                {[0, 1, 2, 3].map(i => (
                  <div key={i} className="card p-5 flex items-center gap-4 animate-pulse">
                    <div className="h-12 w-12 rounded-xl bg-slate-100"></div>
                    <div className="flex-1 space-y-2"><div className="h-3.5 w-40 bg-slate-100 rounded"></div><div className="h-3 w-64 bg-slate-100 rounded"></div></div>
                    <div className="h-7 w-24 bg-slate-100 rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : activeLeadsList.length === 0 ? (
              <div className="card py-16 flex flex-col items-center justify-center text-center px-6">
                <div className="h-16 w-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-3xl mb-4">{STAGES[activeTab].emoji}</div>
                <p className="text-lg font-bold text-slate-700">No {STAGES[activeTab].label.toLowerCase()} leads</p>
                <p className="text-sm text-slate-400 mt-1 max-w-sm">{searchTerm || dateFilter !== 'all' ? 'Try clearing your search or changing the date filter.' : 'Leads in this stage will appear here.'}</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {renderedLeads.map((lead) => {
                  const st = stageOf(lead.status);
                  return (
                    <div key={lead.id} onClick={() => openLeadModal(lead)}
                      className="card p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:border-emerald-300 hover:shadow-lg hover:-translate-y-0.5 transition-all group relative overflow-hidden">
                      <div className={`absolute top-0 left-0 w-1 h-full ${st.dot} opacity-80`}></div>
                      <div className="flex items-center gap-4 min-w-0">
                        <div className={`h-12 w-12 flex-shrink-0 rounded-xl bg-gradient-to-br ${st.grad} text-white flex items-center justify-center font-bold text-lg shadow-sm`}>{lead.name ? lead.name.charAt(0).toUpperCase() : '?'}</div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-slate-900 text-[15px] truncate group-hover:text-emerald-700 transition">{lead.name}</h3>
                          <p className="text-[13px] text-slate-500 font-medium truncate capitalize">🚗 {getVehicleName(lead).replace(/_/g, ' ')}</p>
                          <div className="flex flex-wrap items-center gap-2 text-[12px] text-slate-500 mt-2">
                            <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md font-medium"><Phone size={12} /> {lead.phone}</span>
                            <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md font-medium"><Clock size={12} /> {getLeadDisplayDate(lead)}</span>
                            {lead.status === 'followup' && lead.reminder_date && <span className="inline-flex items-center gap-1 text-violet-700 font-bold bg-violet-50 border border-violet-200 px-2 py-0.5 rounded-md"><Bell size={12} /> Due {formatActivityTime(lead.reminder_date)}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 md:justify-end flex-shrink-0">
                        <a href={`tel:${lead.phone}`} onClick={(e) => e.stopPropagation()} title="Call" className="h-9 w-9 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 flex items-center justify-center transition"><PhoneCall size={16} /></a>
                        <a href={`https://wa.me/${lead.phone}`} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} title="WhatsApp" className="h-9 w-9 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 flex items-center justify-center transition"><MessageCircle size={16} /></a>
                        <span className={`ml-1 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold ring-1 ${st.soft}`}><span className={`h-1.5 w-1.5 rounded-full ${st.dot}`}></span>{st.label}</span>
                        <ChevronRight size={18} className="text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition hidden md:block" />
                      </div>
                    </div>
                  );
                })}

                {activeLeadsList.length > visibleCount && (
                  <button 
                    onClick={() => setVisibleCount(prev => prev + 30)}
                    className="w-full py-3.5 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-2xl text-sm font-bold text-slate-700 shadow-sm transition flex items-center justify-center gap-2 mt-2"
                  >
                    Load more leads ({activeLeadsList.length - visibleCount} remaining)
                  </button>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ================= INSTALL GUIDE MODAL ================= */}
      <AnimatePresence>
        {showInstallModal && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowInstallModal(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden">
              <div className="p-6 text-center">
                <div className="h-16 w-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-100 shadow-inner">
                  <Smartphone size={32} />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">Install Infield7 Lead CRM</h3>
                <p className="text-xs text-slate-500 mt-1 mb-5">Follow the steps below for your device to add the app to your home screen:</p>
                
                <div className="space-y-3 text-left">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
                    <span className="h-6 w-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                    <div>
                      <p className="text-xs font-bold text-slate-800">iPhone / iPad (Safari)</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Tap the <b>Share icon</b> at the bottom of Safari ➔ Select <b>Add to Home Screen</b>.</p>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
                    <span className="h-6 w-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Android (Chrome)</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Tap the <b>3 dots menu (⋮)</b> in Chrome ➔ Select <b>Install App</b> or <b>Add to Home Screen</b>.</p>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
                    <span className="h-6 w-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Desktop Computer</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Click the <b>Install Icon</b> in your address bar (top right corner) to install on PC.</p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setShowInstallModal(false)}
                  className="btn-primary w-full py-3 mt-5 text-sm font-bold"
                >
                  Got it!
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= ADD LEAD MODAL ================= */}
      <AnimatePresence>
        {showManualLeadModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setShowManualLeadModal(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden">
              <div className="px-6 pt-6 pb-4 flex justify-between items-start border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/30"><Plus size={20} /></div>
                  <div><h2 className="text-lg font-extrabold text-slate-900">Add a lead</h2><p className="text-xs text-slate-500">It will start in the <b>New</b> stage.</p></div>
                </div>
                <button onClick={() => setShowManualLeadModal(false)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"><X size={20} /></button>
              </div>
              <form onSubmit={handleAddManualLead} className="p-6 space-y-4">
                <div><label className="label">Lead name *</label><input required type="text" value={manualLeadData.name} onChange={e => setManualLeadData({ ...manualLeadData, name: e.target.value })} className="input" placeholder="e.g. John Doe" /></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><label className="label">Phone *</label><input required type="tel" value={manualLeadData.phone} onChange={e => setManualLeadData({ ...manualLeadData, phone: e.target.value })} className="input" placeholder="9876543210" /></div>
                  <div><label className="label">Email</label><input type="email" value={manualLeadData.email} onChange={e => setManualLeadData({ ...manualLeadData, email: e.target.value })} className="input" placeholder="Optional" /></div>
                </div>
                <div>
                  <label className="label">Campaign *</label>
                  <select required value={manualLeadData.campaign_id} onChange={e => setManualLeadData({ ...manualLeadData, campaign_id: e.target.value })} className="input cursor-pointer">
                    <option value="">Select a campaign...</option>
                    {campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div><label className="label">Initial note</label><textarea rows="2" value={manualLeadData.notes} onChange={e => setManualLeadData({ ...manualLeadData, notes: e.target.value })} className="input resize-none" placeholder="Met at the dealership..." /></div>
                <button type="submit" disabled={isSavingLead || !manualLeadData.campaign_id} className="btn-primary w-full py-3">{isSavingLead ? 'Saving...' : 'Save lead'}</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= LEAD DETAILS DRAWER ================= */}
      <AnimatePresence>
        {selectedLead && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={closeLeadModal} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 220 }} className="relative bg-slate-50 w-full max-w-lg h-full flex flex-col shadow-2xl">
              {/* Header */}
              <div className="bg-white px-6 pt-6 pb-5 border-b border-slate-200/70">
                <div className="flex justify-between items-start mb-5">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`h-14 w-14 flex-shrink-0 rounded-2xl bg-gradient-to-br ${stageOf(currentStage).grad} text-white flex items-center justify-center font-extrabold text-2xl shadow-md`}>{selectedLead.name ? selectedLead.name.charAt(0).toUpperCase() : '?'}</div>
                    <div className="min-w-0">
                      <h2 className="text-xl font-extrabold text-slate-900 tracking-tight truncate">{selectedLead.name}</h2>
                      <p className="text-sm text-slate-500 font-medium">{selectedLead.phone}</p>
                    </div>
                  </div>
                  <button id="close-lead-drawer" onClick={closeLeadModal} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600"><X size={20} /></button>
                </div>

                {/* Stage selector */}
                <p className="label">Lead stage — tap to change</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-xl mb-4">
                  {['new', 'contacted', 'followup', 'converted'].map(s => {
                    const st = STAGES[s]; const active = currentStage === s;
                    return (
                      <button id={`stage-${s}`} key={s} onClick={() => { if (s !== currentStage) handleStatusDropdownChange({ target: { value: s } }); }}
                        className={`flex flex-col items-center gap-0.5 py-2 rounded-lg text-[11px] font-bold transition ${active ? `bg-white shadow-sm ${st.text} ring-1 ring-slate-200` : 'text-slate-500 hover:text-slate-700 hover:bg-white/60'}`}>
                        <span className="text-base">{st.emoji}</span>{st.label}
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-2">
                  <a href={`tel:${selectedLead.phone}`} className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-semibold text-sm transition shadow-sm"><PhoneCall size={16} /> Call</a>
                  <a href={`https://wa.me/${selectedLead.phone}`} target="_blank" rel="noreferrer" className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-xl font-semibold text-sm transition shadow-sm"><MessageCircle size={16} /> WhatsApp</a>
                </div>
              </div>

              {pendingStatus ? (
                /* Stage-change form */
                <div className="flex-1 overflow-y-auto p-6">
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
                    <div className="flex items-center gap-3 mb-5">
                      <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${stageOf(pendingStatus).grad} text-white flex items-center justify-center text-xl`}>{stageOf(pendingStatus).emoji}</div>
                      <div>
                        <h3 className="text-base font-extrabold text-slate-900">Move to {stageOf(pendingStatus).label}</h3>
                        <p className="text-xs text-slate-500">A note is required to save this change.</p>
                      </div>
                    </div>
                    <label className="label">What happened? *</label>
                    <textarea autoFocus rows="3" placeholder="e.g. Customer interested, asked for price list..." value={statusNote} onChange={e => setStatusNote(e.target.value)} className="input resize-none mb-4" />
                    {pendingStatus === 'followup' && (
                      <div className="mb-5 bg-violet-50 p-4 rounded-xl border border-violet-100">
                        <label className="flex items-center gap-2 text-sm font-bold text-violet-700 mb-2"><Bell size={16} /> Remind me on</label>
                        <input type="datetime-local" value={reminderDate} onChange={(e) => setReminderDate(e.target.value)} className="input border-violet-200 focus:border-violet-400 focus:ring-violet-500/10" />
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button id="save-stage-btn" onClick={submitStatusChangeNote} disabled={!statusNote.trim()} className="btn-primary flex-1">Save update</button>
                      <button onClick={() => { setPendingStatus(null); setStatusNote(''); }} className="btn-ghost">Cancel</button>
                    </div>
                  </motion.div>
                </div>
              ) : (
                <>
                  {/* Tabs */}
                  <div className="flex bg-white border-b border-slate-200/70 px-6 gap-6">
                    {[['info', 'Details', Info], ['timeline', 'Activity', Clock]].map(([key, label, Icon]) => (
                      <button id={`drawer-tab-${key}`} key={key} onClick={() => setModalTab(key)} className={`flex items-center gap-2 py-3.5 text-sm font-bold border-b-2 transition ${modalTab === key ? 'border-emerald-500 text-emerald-700' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
                        <Icon size={15} /> {label}{key === 'timeline' && activities.length > 0 && <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full">{activities.length}</span>}
                      </button>
                    ))}
                  </div>

                  <div className="flex-1 overflow-y-auto p-6">
                    {modalTab === 'info' && (
                      <div className="space-y-4">
                        <div className="card p-5">
                          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4">Primary details</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                              [Phone, 'Mobile', selectedLead.phone],
                              [LayoutDashboard, 'Campaign', selectedLead.Campaign?.name || 'Manual'],
                              [FileText, 'Vehicle inquiry', getVehicleName(selectedLead).replace(/_/g, ' ')],
                              [Calendar, 'Date created', new Date(selectedLead.createdAt).toLocaleString()],
                            ].map(([Icon, label, val]) => (
                              <div key={label} className="flex gap-3">
                                <div className="h-8 w-8 flex-shrink-0 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400"><Icon size={15} /></div>
                                <div className="min-w-0"><p className="text-[11px] font-semibold text-slate-400">{label}</p><p className="text-sm font-semibold text-slate-800 break-words capitalize">{val}</p></div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="card p-5">
                          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4">Facebook form answers</h3>
                          <div className="divide-y divide-slate-100">
                            {selectedLead.details ? Object.entries(selectedLead.details).map(([k, v]) => (!v || ['full_name', 'phone', 'phone_number', 'id', 'form_id', 'ad_id', 'adset_id', 'campaign_id'].includes(k)) ? null : (
                              <div key={k} className="py-2.5 first:pt-0 last:pb-0">
                                <p className="text-[11px] font-semibold text-slate-400 capitalize">{k.replace(/_/g, ' ')}</p>
                                <p className="text-sm font-semibold text-slate-800 break-words">{v}</p>
                              </div>
                            )) : <p className="text-sm text-slate-400">No extra details.</p>}
                          </div>
                        </div>
                      </div>
                    )}

                    {modalTab === 'timeline' && (
                      <div className="space-y-5">
                        <div className="card overflow-hidden">
                          {!showAddActivity ? (
                            <button id="add-activity-btn" onClick={() => setShowAddActivity(true)} className="w-full p-4 flex items-center justify-center gap-2 text-emerald-700 font-bold text-sm hover:bg-emerald-50 transition"><Plus size={17} /> Log an activity</button>
                          ) : (
                            <div className="p-4">
                              <div className="flex gap-1.5 mb-3 p-1 bg-slate-100 rounded-xl">
                                {['note', 'call', 'message', 'meeting'].map(t => (
                                  <button key={t} onClick={() => setActivityType(t)} className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold capitalize transition ${activityType === t ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>{getActivityIcon(t)} {t}</button>
                                ))}
                              </div>
                              <textarea autoFocus rows="3" placeholder="Write details..." value={activityContent} onChange={e => setActivityContent(e.target.value)} className="input resize-none mb-3" />
                              <div className="flex gap-2"><button onClick={handlePostActivity} className="btn-primary flex-1 py-2">Save</button><button onClick={() => setShowAddActivity(false)} className="btn-ghost py-2">Cancel</button></div>
                            </div>
                          )}
                        </div>

                        {activities.length === 0 ? (
                          <p className="text-center text-sm text-slate-400 py-8">No activity yet.</p>
                        ) : (
                          <div className="relative ml-4 border-l-2 border-dashed border-slate-200 space-y-4">
                            {activities.map(act => (
                              <div key={act.id} className="relative pl-7">
                                <div className="absolute -left-[15px] top-3 h-7 w-7 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center">{getActivityIcon(act.type)}</div>
                                <div className="card p-4">
                                  <div className="flex justify-between items-center mb-1.5">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{act.type}</span>
                                    <span className="text-[11px] font-medium text-slate-400">{formatActivityTime(act.createdAt)}</span>
                                  </div>
                                  <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{act.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
