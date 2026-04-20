import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, LayoutDashboard, Phone, Mail, Clock, 
  RefreshCw, Plus, Menu, X, ChevronRight, FileText, 
  Search, MessageCircle, PhoneCall, Calendar, Send, Info, Bell, Lock, ArrowRight, User as UserIcon, Trash2, Filter, Building, Key, Download
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
const LoginScreen = ({ onLoginSuccess }) => {
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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-200/40 rounded-full blur-3xl pointer-events-none"></div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md relative z-10">
        <div className="flex justify-center mb-6"><div className="bg-emerald-500 p-4 rounded-2xl shadow-lg shadow-emerald-200"><Lock size={32} className="text-white" /></div></div>
        <h1 className="text-2xl font-black text-slate-800 text-center mb-2 tracking-tight">Lead CRM</h1>
        <p className="text-sm text-slate-500 text-center mb-8 font-medium">Log in to manage your prospects.</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative"><div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><UserIcon size={18} className="text-slate-400" /></div><input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full pl-11 pr-4 py-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:ring-2 focus:ring-emerald-500/50 outline-none" /></div>
          <div className="relative"><div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Lock size={18} className="text-slate-400" /></div><input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-11 pr-4 py-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:ring-2 focus:ring-emerald-500/50 outline-none" /></div>
          {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}
          <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-md mt-2">{isLoading ? 'Authenticating...' : 'Secure Login'} <ArrowRight size={18} /></button>
        </form>
      </motion.div>
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

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('new'); 
  const [dateFilter, setDateFilter] = useState('all');

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
  const formatActivityTime = (d) => new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });

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
    return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
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

  const sortedLeads = [...leads].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const filteredLeads = sortedLeads.filter(lead => {
    const term = searchTerm.toLowerCase();
    return (lead.name?.toLowerCase().includes(term) || lead.phone?.includes(term) || getVehicleName(lead).toLowerCase().includes(term)) && applyDateFilterToLead(lead);
  });

  const groupedLeads = { new: filteredLeads.filter(l => l.status === 'new'), contacted: filteredLeads.filter(l => l.status === 'contacted'), followup: filteredLeads.filter(l => l.status === 'followup'), converted: filteredLeads.filter(l => l.status === 'converted') };
  const activeLeadsList = groupedLeads[activeTab];

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
  if (isCheckingAuth) return <div className="h-screen bg-slate-50 flex items-center justify-center font-bold text-slate-400">Loading...</div>;
  if (!isAuthenticated) return <LoginScreen onLoginSuccess={handleLoginSuccess} />;

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans text-slate-800 overflow-hidden">
      <AnimatePresence>{isSidebarOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-slate-900/50 z-40 md:hidden" />}</AnimatePresence>

      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-emerald-100 transition-transform duration-300 flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        
        {/* --- NEW CENTERED PROFILE HEADER --- */}
        <div className="pt-8 pb-6 flex flex-col items-center justify-center border-b border-slate-100 relative bg-slate-50/30">
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden absolute top-4 right-4 text-slate-400"><X size={24} /></button>
          
          <div className="relative mb-3">
            {/* Profile Avatar */}
            <div className="w-20 h-20 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden">
              {userRole === 'superadmin' ? (
                <LayoutDashboard size={32} className="text-emerald-500" />
              ) : (
                <span className="text-4xl font-black text-emerald-600 uppercase">
                  {(companyName && companyName !== 'Agency CRM') ? companyName.charAt(0) : loggedInUser.charAt(0)}
                </span>
              )}
            </div>
            
            {/* Dynamic Notification Badge (Shows number of Follow Ups!) */}
            {groupedLeads?.followup?.length > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[11px] font-black px-2 py-0.5 rounded-full border-2 border-white shadow-sm">
                {groupedLeads.followup.length}
              </div>
            )}
          </div>

          {/* Profile Name */}
          <h1 className="text-base font-black text-slate-800 uppercase tracking-tight text-center truncate w-full px-4">
            {userRole === 'superadmin' ? 'Global Admin' : (companyName !== 'Agency CRM' && companyName ? companyName : loggedInUser)}
          </h1>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            {userRole === 'superadmin' ? 'System Administrator' : 'Client Portal'}
          </span>
        </div>
        {/* ----------------------------------------------------------- */}

        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {userRole === 'superadmin' ? (
            <>
              <p className="text-[11px] font-bold text-slate-400 uppercase mb-4 px-3 mt-2">Client Companies</p>
              <button onClick={() => { setActiveCompany(null); setActiveCampaign(null); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg ${activeCompany === null ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}>
                <Users size={18} /> All Leads Overview
              </button>
              {companies.map(comp => (
                <div key={comp.id} className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg group ${activeCompany?.id === comp.id ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}>
                  <button onClick={() => { setActiveCompany(comp); setActiveCampaign(null); setIsSidebarOpen(false); }} className="flex-1 flex items-center gap-2 text-left truncate"><Building size={16}/><span className="truncate py-1 text-sm">{comp.name}</span></button>
                  <div className="flex items-center gap-1">
                    {activeCompany?.id === comp.id && <ChevronRight size={16} className="text-emerald-500 mr-1" />}
                    <button onClick={(e) => handleDeleteCompany(comp.id, comp.name, e)} className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-600 rounded-md"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              <p className="text-[11px] font-bold text-slate-400 uppercase mb-4 px-3 mt-2">Your Campaigns</p>
              <button onClick={() => { setActiveCampaign(null); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg ${activeCampaign === null ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}>
                <Users size={18} /> All Leads
              </button>
              {campaigns.map(camp => (
                <button key={camp.id} onClick={() => { setActiveCampaign(camp.id); setIsSidebarOpen(false); }} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg group ${activeCampaign === camp.id ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}>
                  <span className="truncate pr-2 text-sm text-left">{camp.name}</span>
                  {activeCampaign === camp.id && <ChevronRight size={16} className="text-emerald-500 flex-shrink-0" />}
                </button>
              ))}
            </>
          )}
        </div>

        {userRole === 'superadmin' && (
          <div className="p-5 border-t border-emerald-50 bg-slate-50/50">
            {showAddCompany ? (
              <form onSubmit={handleAddCompany} className="space-y-3 bg-white p-4 rounded-xl border border-emerald-100 shadow-sm">
                <input required placeholder="Company Name" className="w-full text-sm p-2 border rounded focus:border-emerald-500" value={newCompName} onChange={e => setNewCompName(e.target.value)} />
                <input required placeholder="Login Username" className="w-full text-sm p-2 border rounded focus:border-emerald-500" value={newCompUser} onChange={e => setNewCompUser(e.target.value)} />
                <input required placeholder="Login Password" type="password" className="w-full text-sm p-2 border rounded focus:border-emerald-500" value={newCompPass} onChange={e => setNewCompPass(e.target.value)} />
                <div className="flex gap-2"><button type="submit" className="flex-1 bg-emerald-500 text-white rounded text-sm py-2">Create</button><button type="button" onClick={() => setShowAddCompany(false)} className="flex-1 border rounded text-sm py-2">Cancel</button></div>
              </form>
            ) : (
              <button onClick={() => setShowAddCompany(true)} className="w-full flex justify-center gap-2 py-3 border border-dashed border-emerald-300 bg-emerald-50 rounded-xl text-emerald-600 font-semibold text-sm hover:bg-emerald-100"><Plus size={18} /> Add New Client</button>
            )}
          </div>
        )}
        
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-center">
          <button onClick={handleLogout} className="text-xs font-bold text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg w-full transition-colors border border-red-100">Sign Out Securely</button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 px-4 md:px-8 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sticky top-0 z-30 shadow-sm/30">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 -ml-2"><Menu size={24} /></button>
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 whitespace-nowrap">
              {userRole === 'superadmin' ? (activeCompany ? activeCompany.name : 'Global Overview') : (activeCampaign === null ? 'All Leads' : campaigns.find(c => c.id === activeCampaign)?.name)}
            </h2>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto hide-scrollbar pb-1 sm:pb-0">
            <div className="relative flex-1 sm:w-64 min-w-[200px]"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search size={16} className="text-slate-400" /></div><input type="text" placeholder="Search leads..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:border-emerald-500" /></div>
            
            <button onClick={() => setShowManualLeadModal(true)} className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-emerald-700 transition-colors whitespace-nowrap"><Plus size={16} /><span className="hidden md:inline">Add Lead</span></button>
            
            <button onClick={exportToCSV} className="flex items-center justify-center gap-2 border border-slate-200 px-4 py-2 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 bg-white transition-colors whitespace-nowrap"><Download size={16} /><span className="hidden md:inline">Export CSV</span></button>

            {userRole === 'superadmin' && (
              <button onClick={handleDeleteAllLeads} className="flex items-center justify-center gap-2 border border-red-200 px-4 py-2 rounded-lg text-sm font-bold text-red-600 hover:bg-red-50 bg-white transition-colors whitespace-nowrap"><Trash2 size={16} /><span className="hidden xl:inline">Wipe Leads</span></button>
            )}

            <button onClick={handleForceSync} disabled={refreshing} className="flex items-center justify-center gap-2 border border-slate-200 px-4 py-2 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 bg-white whitespace-nowrap"><RefreshCw size={16} className={refreshing ? 'animate-spin text-emerald-500' : ''} /><span className="hidden md:inline">Sync</span></button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-5xl mx-auto">
            
            {/* ADMIN ONLY: COMPANY DETAILS, TELEGRAM & CAMPAIGNS */}
            {userRole === 'superadmin' && activeCompany && (
              <div className="mb-8 grid md:grid-cols-3 gap-4">
                {/* 1. Login Details */}
                <div className="bg-slate-800 text-white p-5 rounded-2xl shadow-lg border border-slate-700">
                  <div className="flex items-center gap-2 mb-3"><Key size={18} className="text-emerald-400"/><h3 className="font-bold">Client Login</h3></div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-600 font-mono text-sm space-y-1">
                    <p><span className="text-emerald-400">URL:</span> yourdomain.com</p>
                    <p><span className="text-emerald-400">User:</span> {activeCompany.username}</p>
                    <p><span className="text-emerald-400">Pass:</span> {activeCompany.plain_password}</p>
                  </div>
                </div>

                {/* 2. Telegram Configuration */}
                <div className="bg-blue-50 p-5 rounded-2xl shadow-sm border border-blue-200">
                  <div className="flex items-center gap-2 mb-3"><Send size={18} className="text-blue-600"/><h3 className="font-bold text-blue-900">Telegram Bot Setup</h3></div>
                  <div className="space-y-2">
                    <input type="text" placeholder="Bot Token (e.g., 123:ABC...)" value={tgBotToken} onChange={(e)=>setTgBotToken(e.target.value)} className="w-full text-xs p-2 border border-blue-200 rounded outline-none focus:ring-1 focus:ring-blue-500"/>
                    <input type="text" placeholder="Group Chat ID (e.g., -100123...)" value={tgChatId} onChange={(e)=>setTgChatId(e.target.value)} className="w-full text-xs p-2 border border-blue-200 rounded outline-none focus:ring-1 focus:ring-blue-500"/>
                    <button onClick={handleSaveTelegramSettings} disabled={isSavingTg} className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 rounded transition-colors">
                      {isSavingTg ? 'Saving...' : 'Save Telegram Settings'}
                    </button>
                  </div>
                </div>
                
                {/* 3. Campaigns */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                  <div className="flex items-center justify-between mb-3"><h3 className="font-bold flex items-center gap-2 text-slate-800"><LayoutDashboard size={18}/> Campaigns</h3>
                    {!showAddForm && <button onClick={()=>setShowAddForm(true)} className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg hover:bg-emerald-100">+ Add</button>}
                  </div>
                  {showAddForm ? (
                    <form onSubmit={handleAddCampaign} className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <input required placeholder="Campaign Name" className="w-full text-xs p-2 border rounded" value={newCampName} onChange={e => setNewCampName(e.target.value)} />
                      <input required placeholder="Google Sheet ID" className="w-full text-xs p-2 border rounded" value={newCampSheetId} onChange={e => setNewCampSheetId(e.target.value)} />
                      <div className="flex gap-2"><button type="submit" className="flex-1 bg-emerald-500 text-white rounded text-xs py-1.5 font-bold">Save</button><button type="button" onClick={() => setShowAddForm(false)} className="flex-1 border bg-white rounded text-xs py-1.5 font-bold">Cancel</button></div>
                    </form>
                  ) : (
                    <div className="space-y-2 max-h-[100px] overflow-y-auto pr-2">
                      {campaigns.length === 0 ? <p className="text-xs text-slate-400 italic">No campaigns linked yet.</p> : campaigns.map(c => (
                        <div key={c.id} className="flex justify-between items-center p-2 bg-slate-50 rounded-lg border border-slate-100">
                          <span className="text-xs font-bold text-slate-700 truncate">{c.name}</span>
                          <button onClick={(e)=>handleDeleteCampaign(c.id, c.name, e)} className="text-slate-400 hover:text-red-500"><Trash2 size={14}/></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* PIPELINE TABS & FILTERS */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex gap-2 p-1.5 bg-slate-200/50 rounded-xl w-full sm:w-fit overflow-x-auto hide-scrollbar">
                {['new', 'contacted', 'followup', 'converted'].map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all capitalize whitespace-nowrap ${activeTab === tab ? `bg-white shadow-sm border border-slate-200/50 ${tab==='new'?'text-blue-700':tab==='contacted'?'text-amber-700':tab==='followup'?'text-purple-700':'text-emerald-700'}` : 'text-slate-500 hover:text-slate-700'}`}>
                    {tab==='new'?'🆕 ':tab==='contacted'?'📞 ':tab==='followup'?'⏰ ':'✅ '} {tab} <span className={`px-2 py-0.5 rounded-full text-xs ${tab==='new'?'bg-blue-100 text-blue-700':tab==='contacted'?'bg-amber-100 text-amber-700':tab==='followup'?'bg-purple-100 text-purple-700':'bg-emerald-100 text-emerald-700'}`}>{groupedLeads[tab].length}</span>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm"><Filter size={16} className="text-emerald-500" /><select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="p-1 text-sm font-bold text-slate-700 bg-transparent border-none outline-none cursor-pointer"><option value="all">All Time</option><option value="today">Today</option><option value="yesterday">Yesterday</option><option value="this_week">This Week</option><option value="this_month">This Month</option></select></div>
            </div>

            {/* LEADS LIST */}
            {loading ? (<div className="animate-pulse space-y-4"><div className="bg-white h-24 rounded-xl border"></div></div>) : activeLeadsList.length === 0 ? (
              <div className="h-[40vh] flex flex-col items-center justify-center text-slate-400 bg-white border border-dashed border-slate-200 rounded-2xl"><Users size={48} className="mb-4 text-slate-300" /><p className="text-lg font-bold text-slate-500">No leads found.</p></div>
            ) : (
              <div className="grid gap-3">
                <AnimatePresence mode="popLayout">
                  {activeLeadsList.map((lead) => (
                    <motion.div layout key={lead.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} onClick={() => openLeadModal(lead)} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col md:flex-row justify-between gap-4 cursor-pointer hover:border-emerald-300 hover:shadow-md transition-all group relative overflow-hidden">
                      {lead.status === 'followup' && lead.reminder_date && <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>}
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-slate-50 text-slate-600 border border-slate-100 flex items-center justify-center font-bold text-lg">{lead.name ? lead.name.charAt(0).toUpperCase() : '?'}</div>
                        <div>
                          <h3 className="font-bold text-slate-800 text-[16px]">{lead.name}</h3>
                          <p className="text-[13px] text-emerald-600 font-medium mb-1">{getVehicleName(lead).replace(/_/g, ' ')}</p>
                          <div className="flex flex-wrap gap-4 text-[13px] text-slate-500 mt-1">
                            <span className="flex items-center gap-1"><Phone size={13} /> {lead.phone}</span>
                            {/* NEW: DISPLAY THE CREATED DATE HERE */}
                            <span className="flex items-center gap-1 ml-2 border-l pl-2 border-slate-200"><Clock size={13} /> {getLeadDisplayDate(lead)}</span>
                            {lead.status === 'followup' && lead.reminder_date && <span className="flex items-center gap-1 text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded ml-2"><Bell size={12} /> Due: {formatActivityTime(lead.reminder_date)}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 md:justify-end"><span className={`px-3 py-1.5 rounded-lg text-[12px] font-bold tracking-wide border uppercase ${getStatusStyle(lead.status)}`}>{lead.status}</span></div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* --- ADD LEAD MANUAL MODAL --- */}
      <AnimatePresence>
        {showManualLeadModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowManualLeadModal(false)} />
             <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md relative z-10 overflow-hidden">
                <div className="bg-emerald-500 p-6 flex justify-between items-center text-white">
                  <h2 className="text-xl font-black">Add Manual Lead</h2>
                  <button onClick={() => setShowManualLeadModal(false)} className="bg-emerald-600 p-1.5 rounded-full hover:bg-emerald-700"><X size={20} /></button>
                </div>
                <form onSubmit={handleAddManualLead} className="p-6 space-y-4">
                  <div><label className="text-xs font-bold text-slate-500 uppercase">Lead Name</label><input required type="text" value={manualLeadData.name} onChange={e => setManualLeadData({...manualLeadData, name: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 mt-1 focus:ring-2 outline-none" placeholder="e.g. John Doe"/></div>
                  <div><label className="text-xs font-bold text-slate-500 uppercase">Phone Number</label><input required type="tel" value={manualLeadData.phone} onChange={e => setManualLeadData({...manualLeadData, phone: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 mt-1 focus:ring-2 outline-none" placeholder="e.g. 9876543210"/></div>
                  <div><label className="text-xs font-bold text-slate-500 uppercase">Email (Optional)</label><input type="email" value={manualLeadData.email} onChange={e => setManualLeadData({...manualLeadData, email: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 mt-1 focus:ring-2 outline-none" placeholder="john@example.com"/></div>
                  
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Assign to Campaign</label>
                    <select required value={manualLeadData.campaign_id} onChange={e => setManualLeadData({...manualLeadData, campaign_id: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 mt-1 focus:ring-2 outline-none bg-white">
                      <option value="">Select a Campaign...</option>
                      {campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>

                  <div><label className="text-xs font-bold text-slate-500 uppercase">Initial Note (Optional)</label><textarea rows="2" value={manualLeadData.notes} onChange={e => setManualLeadData({...manualLeadData, notes: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 mt-1 focus:ring-2 outline-none resize-none" placeholder="Met at the dealership..."/></div>
                  
                  <button type="submit" disabled={isSavingLead || !manualLeadData.campaign_id} className="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-xl mt-4 disabled:opacity-50">
                    {isSavingLead ? 'Saving...' : 'Save Lead'}
                  </button>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LEAD DETAILS MODAL (Unchanged) */}
      <AnimatePresence>
        {selectedLead && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeLeadModal} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="relative bg-slate-50 w-full max-w-lg h-full flex flex-col shadow-2xl border-l border-slate-200">
              <div className="bg-white px-6 pt-6 pb-4 border-b border-slate-200 z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3"><div className="h-14 w-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-2xl border border-emerald-200">{selectedLead.name ? selectedLead.name.charAt(0).toUpperCase() : '?'}</div><div><h2 className="text-2xl font-black text-slate-800 tracking-tight">{selectedLead.name}</h2><select value={pendingStatus || editStatus} onChange={handleStatusDropdownChange} className={`mt-1 text-xs font-bold uppercase rounded-md border-0 py-1 pl-2 pr-6 cursor-pointer focus:ring-0 ${getStatusStyle(pendingStatus || editStatus)}`}><option value="new">New Lead</option><option value="contacted">Contacted</option><option value="followup">Follow Up</option><option value="converted">Converted</option></select></div></div>
                  <button onClick={closeLeadModal} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200"><X size={20}/></button>
                </div>
                <div className="flex gap-2 w-full"><a href={`tel:${selectedLead.phone}`} className="flex-1 flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2.5 rounded-xl font-bold text-sm border border-blue-200"><PhoneCall size={16}/> Call</a><a href={`https://wa.me/${selectedLead.phone}`} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-2.5 rounded-xl font-bold text-sm border border-emerald-200"><MessageCircle size={16}/> WhatsApp</a></div>
              </div>

              {pendingStatus ? (
                <div className="flex-1 p-6 bg-slate-50 flex flex-col items-center justify-start mt-10">
                  <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200 w-full">
                    <div className="flex items-center gap-3 mb-4"><div className={`p-2 rounded-lg ${getStatusStyle(pendingStatus)}`}><Info size={20} /></div><h3 className="text-lg font-black text-slate-800">Update to {pendingStatus.toUpperCase()}</h3></div>
                    <textarea autoFocus rows="3" placeholder="Add a note..." value={statusNote} onChange={e => setStatusNote(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-none mb-4"/>
                    {pendingStatus === 'followup' && (<div className="mb-5 bg-purple-50 p-4 rounded-xl border border-purple-100"><label className="flex items-center gap-2 text-sm font-bold text-purple-700 mb-2"><Bell size={16} /> Set Reminder</label><input type="datetime-local" value={reminderDate} onChange={(e) => setReminderDate(e.target.value)} className="w-full p-2.5 rounded-lg border border-purple-200 text-sm focus:ring-2 focus:ring-purple-500 outline-none"/></div>)}
                    <div className="flex gap-2"><button onClick={submitStatusChangeNote} disabled={!statusNote.trim()} className="flex-1 bg-emerald-600 disabled:bg-emerald-300 text-white font-bold py-2.5 rounded-xl text-sm">Save Update</button><button onClick={() => { setPendingStatus(null); setStatusNote(''); }} className="px-4 bg-white border border-slate-200 text-slate-600 font-bold py-2.5 rounded-xl text-sm">Cancel</button></div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex bg-white border-b border-slate-200 px-6"><button onClick={() => setModalTab('info')} className={`py-4 px-2 text-sm font-bold border-b-2 ${modalTab === 'info' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500'}`}>Overview & Info</button><button onClick={() => setModalTab('timeline')} className={`ml-6 py-4 px-2 text-sm font-bold border-b-2 ${modalTab === 'timeline' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500'}`}>Activity Timeline</button></div>
                  <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
                    {modalTab === 'info' && (
                      <div className="space-y-6">
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4"><h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b pb-2">Primary Details</h3><div><p className="text-xs font-bold text-slate-500 uppercase">Mobile</p><p className="text-base font-semibold">{selectedLead.phone}</p></div><div><p className="text-xs font-bold text-slate-500 uppercase">Campaign</p><p className="text-base font-semibold">{selectedLead.Campaign?.name || 'Manual'}</p></div><div><p className="text-xs font-bold text-slate-500 uppercase">Vehicle Inquiry</p><p className="text-base font-semibold">{getVehicleName(selectedLead).replace(/_/g, ' ')}</p></div><div><p className="text-xs font-bold text-slate-500 uppercase">Date Created</p><p className="text-base font-semibold">{new Date(selectedLead.createdAt).toLocaleString()}</p></div></div>
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4"><h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b pb-2">Facebook Form Data</h3>{selectedLead.details ? Object.entries(selectedLead.details).map(([k, v]) => (!v || ['full_name','phone','phone_number','id','form_id','ad_id','adset_id','campaign_id'].includes(k)) ? null : <div key={k}><p className="text-xs font-bold text-slate-500 uppercase">{k.replace(/_/g, ' ')}</p><p className="text-sm font-semibold break-words">{v}</p></div>) : <p className="text-sm text-slate-500">No extra details.</p>}</div>
                      </div>
                    )}
                    {modalTab === 'timeline' && (
                      <div className="space-y-6">
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">{!showAddActivity ? <button onClick={() => setShowAddActivity(true)} className="w-full p-4 flex items-center justify-center gap-2 text-emerald-600 font-bold"><Plus size={18} /> Add Note</button> : <div className="p-4 bg-slate-50"><div className="flex gap-2 mb-3">{['note', 'call', 'message', 'meeting'].map(t => <button key={t} onClick={() => setActivityType(t)} className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize border ${activityType === t ? 'bg-emerald-500 text-white' : 'bg-white text-slate-600'}`}>{t}</button>)}</div><textarea rows="3" value={activityContent} onChange={e => setActivityContent(e.target.value)} className="w-full p-3 rounded-xl border text-sm mb-3"/><div className="flex gap-2"><button onClick={handlePostActivity} className="flex-1 bg-emerald-600 text-white font-bold py-2 rounded-xl text-sm">Save</button><button onClick={() => setShowAddActivity(false)} className="px-4 bg-white border text-slate-600 font-bold py-2 rounded-xl text-sm">Cancel</button></div></div>}</div>
                        <div className="pl-4 border-l-2 border-slate-200 space-y-6 relative ml-2">{activities.map(act => <div key={act.id} className="relative"><div className="absolute -left-[25px] top-1 h-6 w-6 rounded-full bg-white border-2 flex items-center justify-center">{getActivityIcon(act.type)}</div><div className="bg-white p-4 rounded-xl border ml-4"><div className="flex justify-between mb-1"><span className="text-xs font-black uppercase text-slate-500">{act.type}</span><span className="text-xs font-semibold text-slate-400">{formatActivityTime(act.createdAt)}</span></div><p className="text-sm font-medium whitespace-pre-wrap">{act.content}</p></div></div>)}</div>
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