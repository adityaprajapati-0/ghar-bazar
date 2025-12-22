import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { UserRole, Property, UserProfile, Review, ChatSession, Message, Report } from './types';
import LandingGatekeeper from './components/LandingGatekeeper';
import Header from './components/Header';
import DashboardBuyer from './components/DashboardBuyer';
import DashboardSeller from './components/DashboardSeller';
import MobileNavBar from './components/MobileNavBar';
import PropertyDetail from './components/PropertyDetail';
import MapView from './components/MapView';
import AuthModal from './components/AuthModal';
import ProfilePage from './components/ProfilePage';
import ListingWizard from './components/ListingWizard';
import SettingsMenu from './components/SettingsMenu';
import PaymentModal from './components/PaymentModal';
import NotificationCenter from './components/NotificationCenter';
import AdminDashboard from './components/AdminDashboard';
import ChatWindow from './components/ChatWindow';
import ReportModal from './components/ReportModal';
import PropertyManagementConsole from './components/PropertyManagementConsole';
import ChatbotModal from './components/ChatbotModal';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageSquare, Sparkles, X } from 'lucide-react';

const MOCK_USERS: UserProfile[] = [
  {
    id: 'owner_1',
    name: 'Rajesh Malhotra',
    avatar: 'https://i.pravatar.cc/150?u=rajesh',
    phone: '9876543210',
    isVerified: true,
    role: UserRole.SELLER,
    savedProperties: [],
    likedProperties: []
  },
  {
    id: 'owner_2',
    name: 'Priya Kapoor',
    avatar: 'https://i.pravatar.cc/150?u=priya',
    phone: '9123456789',
    isVerified: true,
    role: UserRole.SELLER,
    savedProperties: [],
    likedProperties: []
  }
];

const INITIAL_PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'Modern Skyloft Penthouse',
    price: 45000000,
    location: 'Worli, Mumbai',
    type: 'Apartment',
    beds: 3,
    baths: 4,
    sqft: 2800,
    builtUpArea: 3200,
    furnishingStatus: 'Fully Furnished',
    dimensions: '70 x 40 ft',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800'],
    coordinates: { lat: 18.9986, lng: 72.8174 },
    ownerId: 'owner_1',
    ownerName: 'Rajesh Malhotra',
    reviews: [{ id: 'rev1', authorName: 'Suresh Raina', rating: 5, comment: 'Absolutely stunning views and top-notch amenities.', date: 'Oct 12, 2023' }],
    verified: true,
    featured: true
  },
  {
    id: '2',
    title: 'The Heritage Villa',
    price: 120000000,
    location: 'Civil Lines, Jaipur',
    type: 'Villa',
    beds: 5,
    baths: 6,
    sqft: 6500,
    builtUpArea: 7200,
    furnishingStatus: 'Semi-Furnished',
    dimensions: '100 x 65 ft',
    imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=800'],
    coordinates: { lat: 26.9124, lng: 75.7873 },
    ownerId: 'owner_2',
    ownerName: 'Priya Kapoor',
    reviews: [],
    verified: true,
    featured: false
  },
  {
    id: '3',
    title: 'Imperial Regency Suite',
    price: 65000000,
    location: 'Juhu, Mumbai',
    type: 'Apartment',
    beds: 4,
    baths: 4,
    sqft: 3500,
    imageUrl: 'https://images.unsplash.com/photo-1536376074432-ad7174e1c2b0?auto=format&fit=crop&q=80&w=800',
    images: [],
    coordinates: { lat: 19.1075, lng: 72.8263 },
    ownerId: 'owner_1',
    ownerName: 'Rajesh Malhotra',
    reviews: [],
    verified: true,
    featured: true
  },
  {
    id: '4',
    title: 'Palm Breeze Villa',
    price: 95000000,
    location: 'Lonavala, MH',
    type: 'Villa',
    beds: 6,
    baths: 7,
    sqft: 8000,
    imageUrl: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=800',
    images: [],
    coordinates: { lat: 18.7544, lng: 73.4062 },
    ownerId: 'owner_2',
    ownerName: 'Priya Kapoor',
    reviews: [],
    verified: true,
    featured: false
  },
  {
    id: '5',
    title: 'Azure Heights Estate',
    price: 32000000,
    location: 'Whitefield, Bangalore',
    type: 'Apartment',
    beds: 3,
    baths: 3,
    sqft: 2100,
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800',
    images: [],
    coordinates: { lat: 12.9698, lng: 77.7500 },
    ownerId: 'owner_1',
    ownerName: 'Rajesh Malhotra',
    reviews: [],
    verified: true,
    featured: true
  },
  {
    id: '6',
    title: 'The Orchard Manor',
    price: 75000000,
    location: 'Kasauli, HP',
    type: 'Villa',
    beds: 4,
    baths: 5,
    sqft: 5000,
    imageUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800',
    images: [],
    coordinates: { lat: 30.9013, lng: 76.9649 },
    ownerId: 'owner_2',
    ownerName: 'Priya Kapoor',
    reviews: [],
    verified: true,
    featured: false
  }
];

const TRANSLATIONS: any = {
  'English (India)': {
    explore: 'Explore Estates',
    settings: 'Settings',
    marketplace: 'Premium Marketplace',
    logout: 'Logout',
    bookings: 'My Bookings',
    chat: 'Chat',
    search: 'Search location...',
    sellerDash: 'Estate Console',
    buyerDash: 'Property Hub',
    welcome: 'Welcome',
    inventory: 'My Inventory',
    listNew: 'List New Estate',
    rights: 'All premium rights reserved.',
    footer_desc: 'Redefining the premium real estate experience in India.',
    contact_us: 'Contact Us',
    quick_links: 'Quick Links',
    stats_total: 'Total Estates',
    search_btn: 'Search',
    advanced_filter: 'Advanced Filter'
  },
  'हिन्दी (Hindi)': {
    explore: 'संपत्ति खोजें',
    settings: 'सेटिंग्स',
    marketplace: 'प्रीमियम बाजार',
    logout: 'लॉगआउट',
    bookings: 'मेरी बुकिंग',
    chat: 'बातचीत',
    search: 'स्थान खोजें...',
    sellerDash: 'विक्रेता डैशबोर्ड',
    buyerDash: 'खरीदार हब',
    welcome: 'स्वागत है',
    inventory: 'मेरा इन्वेंटरी',
    listNew: 'नई संपत्ति सूचीबद्ध करें',
    rights: 'सर्वाधिकार सुरक्षित।',
    footer_desc: 'भारत में प्रीमियम रियल एस्टेट अनुभव को फिर से परिभाषित करना।',
    contact_us: 'संपर्क करें',
    quick_links: 'त्वरित संपर्क',
    stats_total: 'कुल संपत्तियाँ',
    search_btn: 'खोजें',
    advanced_filter: 'उन्नत फ़िल्टर'
  }
};

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>(UserRole.NONE);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [users, setUsers] = useState<UserProfile[]>(MOCK_USERS);
  const [reports, setReports] = useState<Report[]>([]);
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [managementPropertyId, setManagementPropertyId] = useState<string | null>(null);
  const [reportingPropertyId, setReportingPropertyId] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [viewingUser, setViewingUser] = useState<UserProfile | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [chatPartner, setChatPartner] = useState<UserProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [highContrast, setHighContrast] = useState(() => localStorage.getItem('highContrast') === 'true');
  const [allowNotifications, setAllowNotifications] = useState(() => localStorage.getItem('allowNotif') !== 'false');
  const [privacyMode, setPrivacyMode] = useState(() => localStorage.getItem('privacyMode') === 'true');
  const [twoFactor, setTwoFactor] = useState(() => localStorage.getItem('twoFactor') === 'true');
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'English (India)');

  const t = useMemo(() => TRANSLATIONS[language] || TRANSLATIONS['English (India)'], [language]);

  const [filters, setFilters] = useState({
    type: 'All',
    minPrice: 0,
    maxPrice: 500000000,
    beds: 'Any',
    furnishing: 'Any'
  });

  const handleLogout = useCallback(() => {
    setRole(UserRole.NONE);
    setUser(null);
    localStorage.clear();
    setCurrentView('home');
  }, []);

  useEffect(() => {
    const savedRole = localStorage.getItem('role') as UserRole;
    if (savedRole) setRole(savedRole);
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
    const savedBookings = localStorage.getItem('bookings');
    if (savedBookings) setBookings(JSON.parse(savedBookings));
    const savedReports = localStorage.getItem('reports');
    if (savedReports) setReports(JSON.parse(savedReports));
  }, []);

  useEffect(() => {
    localStorage.setItem('reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) root.classList.add('dark');
    else root.classList.remove('dark');
    
    if (highContrast) root.classList.add('contrast-high');
    else root.classList.remove('high-contrast');
    
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('highContrast', highContrast.toString());
    localStorage.setItem('privacyMode', privacyMode.toString());
    localStorage.setItem('twoFactor', twoFactor.toString());
    localStorage.setItem('language', language);
  }, [isDarkMode, highContrast, privacyMode, twoFactor, language]);

  const addNotification = useCallback((title: string, desc: string, type: 'success' | 'alert' | 'visit') => {
    if (!allowNotifications) return;
    const newNotif = { id: Date.now(), type, title, desc, time: 'Just now' };
    setNotifications(prev => [newNotif, ...prev.slice(0, 9)]);
    setShowNotifications(true);
    setTimeout(() => setShowNotifications(false), 4000);
  }, [allowNotifications]);

  const handleAdminVerifyProperty = useCallback((id: string, approved: boolean) => {
    const propertyToVerify = properties.find(p => p.id === id);
    if (!propertyToVerify) return;

    if (approved) {
      setProperties(prev => prev.map(p => p.id === id ? { ...p, verified: true } : p));
      addNotification(
        'Listing Approved!', 
        `Your property "${propertyToVerify.title}" has been verified and is now live.`, 
        'success'
      );
    } else {
      setProperties(prev => prev.filter(p => p.id !== id));
      addNotification(
        'Listing Rejected', 
        `Your submission for "${propertyToVerify.title}" was not approved. Please review our marketplace guidelines.`, 
        'alert'
      );
    }
  }, [properties, addNotification]);

  const handleUpdateProperty = useCallback((updated: Property) => {
    setProperties(prev => prev.map(p => p.id === updated.id ? updated : p));
    addNotification('Listing Updated', `Changes to "${updated.title}" have been synced.`, 'success');
  }, [addNotification]);

  const handleRoleSelection = (selectedRole: UserRole) => {
    setRole(selectedRole);
    localStorage.setItem('role', selectedRole);
    setCurrentView('home');
    if (selectedRole === UserRole.ADMIN) {
      const admin: UserProfile = { id: 'admin_1', name: 'System Admin', avatar: 'https://i.pravatar.cc/150?u=admin', phone: '0000000000', isVerified: true, role: UserRole.ADMIN, savedProperties: [], likedProperties: [] };
      setUser(admin);
    }
  };

  const handleAuthSuccess = (userData: UserProfile) => {
    setUser(userData);
    setUsers(prev => [...prev.filter(u => u.id !== userData.id), userData]);
    localStorage.setItem('user', JSON.stringify(userData));
    setShowAuthModal(false);
  };

  const handleStartChat = (partnerId: string) => {
    if (!user) return setShowAuthModal(true);
    const partner = users.find(u => u.id === partnerId);
    if (partner) {
      setChatPartner(partner);
      setCurrentView('chat');
      setSelectedPropertyId(null);
    }
  };

  const handleSubmitReport = (reason: string, details: string) => {
    if (!user || !reportingPropertyId) return;
    const prop = properties.find(p => p.id === reportingPropertyId);
    if (!prop) return;

    const newReport: Report = {
      id: 'rep_' + Date.now(),
      propertyId: reportingPropertyId,
      propertyTitle: prop.title,
      reporterId: user.id,
      reporterName: user.name,
      reason,
      details,
      timestamp: Date.now(),
      status: 'pending'
    };

    setReports(prev => [newReport, ...prev]);
    setProperties(prev => prev.map(p => p.id === reportingPropertyId ? { ...p, reported: true } : p));
    setReportingPropertyId(null);
    addNotification('Report Submitted', 'Administration has been notified for investigation.', 'alert');
  };

  const handleUpdateReportStatus = (reportId: string, status: 'resolved' | 'rejected', adminNote?: string) => {
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, status, adminNote } : r));
    const report = reports.find(r => r.id === reportId);
    if (report && status === 'rejected') {
      const otherReports = reports.filter(r => r.propertyId === report.propertyId && r.id !== reportId && r.status === 'pending');
      if (otherReports.length === 0) {
        setProperties(prev => prev.map(p => p.id === report.propertyId ? { ...p, reported: false } : p));
      }
    }
    addNotification('Report Updated', `Report ${reportId} has been marked as ${status}.`, 'success');
  };

  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      if (role === UserRole.ADMIN) return true;
      if (role === UserRole.SELLER && p.ownerId !== user?.id && !p.verified) return false;
      if (role === UserRole.BUYER && !p.verified) return false;
      
      const matchesSearch = p.location.toLowerCase().includes(searchQuery.toLowerCase()) || p.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filters.type === 'All' || p.type === filters.type;
      const matchesPrice = p.price >= filters.minPrice && p.price <= filters.maxPrice;
      const matchesBeds = filters.beds === 'Any' || (p.beds && p.beds.toString() === filters.beds);
      return matchesSearch && matchesType && matchesPrice && matchesBeds;
    });
  }, [properties, filters, role, user, searchQuery]);

  const liveProperties = useMemo(() => properties.filter(p => p.verified), [properties]);
  const pendingProperties = useMemo(() => properties.filter(p => !p.verified), [properties]);
  const sellerProperties = useMemo(() => properties.filter(p => p.ownerId === user?.id), [properties, user]);

  const activeProperty = useMemo(() => 
    selectedPropertyId ? properties.find(p => p.id === selectedPropertyId) : null
  , [selectedPropertyId, properties]);

  const managementProperty = useMemo(() => 
    managementPropertyId ? properties.find(p => p.id === managementPropertyId) : null
  , [managementPropertyId, properties]);

  return (
    <div className={`min-h-screen flex flex-col transition-all duration-700 ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} ${highContrast ? 'contrast-high' : ''}`}>
      <AnimatePresence>
        {role === UserRole.NONE && <LandingGatekeeper onSelectRole={handleRoleSelection} translations={t} />}
      </AnimatePresence>

      <div className={`${role === UserRole.NONE ? 'blur-3xl scale-110 opacity-0' : 'opacity-100 scale-100'} transition-all duration-1000 flex-grow flex flex-col`}>
        <Header 
          role={role} 
          user={user} 
          onLogout={handleLogout} 
          onOpenSettings={() => setCurrentView('settings')}
          onOpenNotifications={() => setShowNotifications(!showNotifications)}
          onSearchClick={() => setCurrentView(role === UserRole.BUYER ? 'home' : 'inventory')}
          onOpenAdmin={() => setCurrentView('admin')}
          translations={t}
          onTabChange={setCurrentView}
        />

        <AnimatePresence>
          {showNotifications && <NotificationCenter onClose={() => setShowNotifications(false)} isDarkMode={isDarkMode} notifications={notifications} />}
        </AnimatePresence>

        <motion.main key={currentView + role} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex-grow ${currentView === 'property-detail' ? 'pt-0' : 'pt-20'} pb-24 w-full overflow-x-hidden`}>
          {/* BUYER EXPERIENCE */}
          {role === UserRole.BUYER && (
            <>
              {currentView === 'home' && (
                <div className="px-4 md:px-8 lg:px-10">
                  <DashboardBuyer 
                    user={user}
                    properties={filteredProperties}
                    onPropertyClick={(p) => { setSelectedPropertyId(p.id); setCurrentView('property-detail'); }}
                    likedProperties={user?.likedProperties || []}
                    onToggleLike={(id) => {
                      if (!user) return setShowAuthModal(true);
                      const isLiked = user.likedProperties.includes(id);
                      const newUser = { ...user, likedProperties: isLiked ? user.likedProperties.filter(pid => pid !== id) : [...user.likedProperties, id] };
                      setUser(newUser);
                      localStorage.setItem('user', JSON.stringify(newUser));
                    }}
                    savedProperties={user?.savedProperties || []}
                    onToggleSave={(id) => {
                      if (!user) return setShowAuthModal(true);
                      const isSaved = user.savedProperties.includes(id);
                      const newUser = { ...user, savedProperties: isSaved ? user.savedProperties.filter(pid => pid !== id) : [...user.savedProperties, id] };
                      setUser(newUser);
                      localStorage.setItem('user', JSON.stringify(newUser));
                      addNotification(isSaved ? 'Property Removed' : 'Property Saved', isSaved ? 'Listing removed from your collection.' : 'Listing added to your saved collection.', 'success');
                    }}
                    onViewMap={() => setCurrentView('map')}
                    onViewSeller={(sid) => { setViewingUser(users.find(u => u.id === sid) || null); setCurrentView('profile'); }}
                    onReport={setReportingPropertyId}
                    filters={filters}
                    setFilters={setFilters}
                    translations={t}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                  />
                </div>
              )}
              {currentView === 'map' && <MapView onPropertyClick={(p) => { setSelectedPropertyId(p.id); setCurrentView('property-detail'); }} properties={filteredProperties} placeholder={t.search} />}
            </>
          )}

          {/* SELLER EXPERIENCE */}
          {role === UserRole.SELLER && (
            <div className="px-4 md:px-8 lg:px-10">
              {currentView === 'home' && (
                <DashboardSeller 
                  user={user}
                  properties={sellerProperties}
                  onAddProperty={() => setCurrentView('add-property')}
                  onPropertyClick={(p) => { 
                    if (p.verified) {
                      setManagementPropertyId(p.id);
                    } else {
                      setSelectedPropertyId(p.id); 
                      setCurrentView('property-detail');
                    }
                  }}
                  translations={t}
                />
              )}
              {currentView === 'inventory' && (
                <div className="py-12 w-full">
                   <h2 className="text-4xl font-black mb-12 px-2 tracking-tight">{t.inventory}</h2>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                     {sellerProperties.map(p => (
                       <div key={p.id} className="bg-white dark:bg-slate-900 p-8 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-2xl">
                          <img src={p.imageUrl} className="w-full h-64 object-cover rounded-[2.5rem] mb-6 shadow-md" />
                          <h4 className="font-black text-2xl mb-1 tracking-tight">{p.title}</h4>
                          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{p.location}</p>
                          <div className="mt-10 flex justify-between items-center border-t border-slate-50 dark:border-slate-800 pt-8">
                            <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest ${p.verified ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                              {p.verified ? 'Marketplace Ready' : 'In Review'}
                            </span>
                            <button 
                              onClick={() => { 
                                if (p.verified) {
                                  setManagementPropertyId(p.id);
                                } else {
                                  setSelectedPropertyId(p.id); 
                                  setCurrentView('property-detail');
                                }
                              }} 
                              className="text-indigo-600 font-black uppercase text-[10px] tracking-widest hover:translate-x-1 transition-transform"
                            >
                              {p.verified ? 'Manage Console →' : 'View Preview →'}
                            </button>
                          </div>
                       </div>
                     ))}
                   </div>
                </div>
              )}
            </div>
          )}

          {/* ADMIN EXPERIENCE */}
          {role === UserRole.ADMIN && (
            <div className="px-4 md:px-8 lg:px-10">
              <AdminDashboard 
                properties={properties} 
                users={users} 
                reports={reports}
                onVerify={handleAdminVerifyProperty} 
                onOpenProperty={p => { setSelectedPropertyId(p.id); setCurrentView('property-detail'); }} 
                onDeleteProperty={id => setProperties(prev => prev.filter(p => p.id !== id))} 
                onBanUser={id => setUsers(prev => prev.map(u => u.id === id ? { ...u, isBanned: !u.isBanned } : u))} 
                onHandleReport={handleUpdateReportStatus}
              />
            </div>
          )}

          {/* SHARED VIEWS */}
          {currentView === 'property-detail' && activeProperty && (
            <PropertyDetail 
              property={activeProperty} 
              onClose={() => setCurrentView('home')} 
              user={user} 
              onPaymentRequired={() => setShowPaymentModal(true)}
              onChatRequired={() => handleStartChat(activeProperty.ownerId)}
              onAddReview={(r, c) => setProperties(prev => prev.map(p => p.id === activeProperty.id ? { ...p, reviews: [{ id: Date.now().toString(), authorName: user?.name || 'Anon', rating: r, comment: c, date: 'Today' }, ...p.reviews] } : p))}
            />
          )}

          {currentView === 'profile' && (
            <div className="px-4 md:px-8 lg:px-10">
              <ProfilePage 
                user={viewingUser || user} 
                isPublicView={!!viewingUser && viewingUser.id !== user?.id}
                onEdit={u => { setUser(u); localStorage.setItem('user', JSON.stringify(u)); }} 
                onBack={() => { setViewingUser(null); setCurrentView('home'); }}
                onLogout={handleLogout}
              />
            </div>
          )}
          {currentView === 'chat' && <ChatWindow user={user} partner={chatPartner} onClose={() => setCurrentView('home')} translations={t} />}
          {currentView === 'bookings' && (
            <div className="w-full py-12 px-4 md:px-8 lg:px-10">
              <h1 className="text-4xl font-black mb-10 dark:text-white">{t.bookings}</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {bookings.length > 0 ? bookings.map(b => (
                  <div key={b.id} className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-black dark:text-white leading-tight">{b.propertyTitle}</h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Scheduled: {b.date}</p>
                    </div>
                    <div className="mt-8 flex justify-between items-center">
                      <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">{b.status}</span>
                      <button className="text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:underline">Reschedule</button>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-full text-center py-40 bg-white dark:bg-slate-900 rounded-[4rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
                    <p className="text-slate-400 font-black uppercase tracking-widest">No active orders</p>
                  </div>
                )}
              </div>
            </div>
          )}
          {currentView === 'add-property' && <ListingWizard onComplete={p => { setProperties(prev => [{ ...p, ownerId: user?.id || 'anon', verified: false }, ...prev]); setCurrentView('home'); }} />}
          {currentView === 'settings' && (
            <div className="px-4 md:px-8 lg:px-10">
              <SettingsMenu 
                role={role}
                onClose={() => setCurrentView('home')} 
                isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
                highContrast={highContrast} onToggleContrast={() => setHighContrast(!highContrast)}
                allowNotifications={allowNotifications} onToggleNotifications={() => setAllowNotifications(!allowNotifications)}
                /* DO FIX: Fixed the typo setTogglePrivacy -> setPrivacyMode to match the defined state setter */
                privacyMode={privacyMode} onTogglePrivacy={() => setPrivacyMode(!privacyMode)}
                twoFactor={twoFactor} onToggleTwoFactor={() => setTwoFactor(!twoFactor)}
                onOpenOrders={() => setCurrentView('bookings')}
                language={language}
                onSetLanguage={setLanguage}
                onLogout={handleLogout}
              />
            </div>
          )}
        </motion.main>

        <AnimatePresence>
          {showAuthModal && <AuthModal onCancel={() => setShowAuthModal(false)} onSuccess={handleAuthSuccess} role={role} />}
          {reportingPropertyId && <ReportModal propertyId={reportingPropertyId} onCancel={() => setReportingPropertyId(null)} onSubmit={handleSubmitReport} />}
          {managementProperty && (
            <PropertyManagementConsole 
              property={managementProperty} 
              onClose={() => setManagementPropertyId(null)} 
              onUpdate={handleUpdateProperty} 
            />
          )}
          {showPaymentModal && <PaymentModal onClose={() => setShowPaymentModal(false)} onComplete={() => {
            const property = properties.find(p => p.id === selectedPropertyId);
            if (property) {
              const newBooking = { id: Date.now().toString(), propertyTitle: property.title, price: property.price, date: new Date().toLocaleDateString(), status: 'Scheduled' };
              setBookings(prev => [newBooking, ...prev]);
            }
            setShowPaymentModal(false);
            setSelectedPropertyId(null);
            setCurrentView('bookings');
          }} />}
          {showChatbot && (
            <ChatbotModal 
              onClose={() => setShowChatbot(false)} 
              isDarkMode={isDarkMode} 
              liveProperties={liveProperties}
              pendingProperties={pendingProperties}
              user={user}
              currentView={currentView}
              activeProperty={activeProperty}
            />
          )}
        </AnimatePresence>

        {/* Floating Chatbot FAB - Strict Fixed Position Above All Layers */}
        {role !== UserRole.NONE && (
          <motion.button
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowChatbot(!showChatbot)}
            className="fixed bottom-24 right-6 md:bottom-10 md:right-10 z-[200] w-16 h-16 bg-indigo-600 text-white rounded-[2rem] shadow-[0_15px_40px_-5px_rgba(79,70,229,0.5)] flex items-center justify-center group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-700 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-amber-300 animate-pulse" />
              {showChatbot ? <X size={28} /> : <MessageSquare size={28} />}
            </div>
          </motion.button>
        )}

        <MobileNavBar activeTab={currentView} onTabChange={(tab) => { setCurrentView(tab); if (tab !== 'profile') setViewingUser(null); }} role={role} />
      </div>
    </div>
  );
};

export default App;