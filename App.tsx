import React, { useState, useEffect } from 'react';
import { UserRole } from './types';
import RoleSwitcher from './components/RoleSwitcher';
import StudentView from './components/StudentView';
import ParentView from './components/ParentView';
import TeacherView from './components/TeacherView';
import AdminView from './components/AdminView';
import BoardView from './components/BoardView';
import CampusView from './components/CampusView';
import PilotView from './components/PilotView';
import DemoGuide from './components/DemoGuide';
import { LayoutDashboard, ChevronDown, Check, Rocket, Sparkles } from 'lucide-react';

type AppVersion = 'pilot' | 'future';

// Custom Brand Icon Component
const BrandIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 32 32" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="8" fill="#BF5700"/>
    <path d="M16 8 L6 13 L16 18 L26 13 L16 8 Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1" strokeLinejoin="round"/>
    <path d="M10 16 V21 C10 21 13 23 16 23 C19 23 22 21 22 21 V16" stroke="#FFFFFF" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <line x1="26" y1="13" x2="26" y2="20" stroke="#FFFFFF" strokeWidth="1.5"/>
  </svg>
);

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [appVersion, setAppVersion] = useState<AppVersion>('pilot');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDemoGuide, setShowDemoGuide] = useState(false);
  
  // Hint States
  const [hintVisible, setHintVisible] = useState(false); // Pilot Mode Hint
  const [roleHintVisible, setRoleHintVisible] = useState(false); // Future Mode Role Switcher Hint
  
  // Interaction States (to disable hints once used)
  const [hasOpenedMenu, setHasOpenedMenu] = useState(false);
  const [hasSwitchedRole, setHasSwitchedRole] = useState(false);
  
  // Shared state for EdAssist Sidebar to coordinate layout shifts
  const [isAiOpen, setIsAiOpen] = useState(false);

  // Pilot Mode Hint Timer Logic
  useEffect(() => {
    // Stop if not in pilot mode OR if user has already interacted with the menu
    if (appVersion !== 'pilot' || hasOpenedMenu) {
        setHintVisible(false);
        return;
    }

    let timeoutId: any;
    let intervalId: any;
    
    // Sequence: Show for 6s, Hide for 20s, Repeat
    const runCycle = () => {
        setHintVisible(true);
        timeoutId = setTimeout(() => {
            setHintVisible(false);
        }, 6000);
    };

    // Initial delay 1s
    timeoutId = setTimeout(() => {
        runCycle();
        // Start recurring interval after first cycle
        intervalId = setInterval(runCycle, 26000); // 6s show + 20s wait
    }, 1000);

    return () => {
        clearTimeout(timeoutId);
        if (intervalId) clearInterval(intervalId);
    };
  }, [appVersion, hasOpenedMenu]);

  // Future Mode Role Switcher Hint Timer Logic
  useEffect(() => {
    // Stop if not in future mode OR if user has already interacted with role switcher
    if (appVersion !== 'future' || hasSwitchedRole) {
        setRoleHintVisible(false);
        return;
    }

    let timeoutId: any;
    let intervalId: any;
    
    const runCycle = () => {
        setRoleHintVisible(true);
        timeoutId = setTimeout(() => {
            setRoleHintVisible(false);
        }, 6000);
    };

    // Initial delay 1s
    timeoutId = setTimeout(() => {
        runCycle();
        intervalId = setInterval(runCycle, 26000); // 6s show + 20s wait
    }, 1000);

    return () => {
        clearTimeout(timeoutId);
        if (intervalId) clearInterval(intervalId);
    };
  }, [appVersion, hasSwitchedRole]);

  const renderView = () => {
    // Common props for views that support AI Sidebar
    const viewProps = { isAiOpen, setIsAiOpen };

    if (appVersion === 'pilot') {
        return <PilotView />;
    }

    // Future Vision Logic
    switch (role) {
      case UserRole.STUDENT:
        return <StudentView />;
      case UserRole.PARENT:
        return <ParentView {...viewProps} />;
      case UserRole.TEACHER:
        return <TeacherView {...viewProps} />;
      case UserRole.PRINCIPAL:
        return <CampusView {...viewProps} />;
      case UserRole.ADMIN:
        return <AdminView {...viewProps} />;
      case UserRole.BOARD:
        return <BoardView {...viewProps} />;
      default:
        return <StudentView />;
    }
  };

  const toggleMenu = () => {
      setIsMenuOpen(!isMenuOpen);
      setHasOpenedMenu(true); // Disable Pilot hint once clicked
  };
  
  const selectVersion = (v: AppVersion) => {
    setAppVersion(v);
    setIsMenuOpen(false);
    setIsAiOpen(false); // Reset sidebar on version switch
  };

  const handleSetRole = (newRole: UserRole) => {
      setRole(newRole);
      setIsAiOpen(false); // Reset sidebar on role switch
      setHasSwitchedRole(true); // Disable Role Switcher hint once clicked
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative overflow-x-hidden">
      {/* Navigation Bar */}
      <nav className="bg-vt-blue border-b border-vt-darkBlue sticky top-0 z-50 shadow-md">
        <div className={`max-w-7xl mx-auto px-6 h-16 flex items-center justify-between transition-all duration-300 ease-in-out ${isAiOpen ? 'md:mr-[450px]' : ''}`}>
          
          {/* Version Selector / Logo Area */}
          <div className="relative">
            <button 
                onClick={toggleMenu}
                className="flex items-center space-x-3 hover:bg-vt-darkBlue p-2 -ml-4 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-vt-lightBlue text-white group"
            >
                <div className="bg-white rounded-md p-0.5 shadow-sm group-hover:scale-105 transition-transform">
                     <BrandIcon className="w-8 h-8" />
                </div>
                <div className="text-left">
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-white">
                        Lone Star EDU
                        </span>
                        <ChevronDown size={16} className="text-gray-300" />
                    </div>
                    <div className="text-xs font-medium text-gray-300 uppercase tracking-wider">
                        {appVersion === 'future' ? 'Future Vision (Full)' : 'Pilot (MVP)'}
                    </div>
                </div>
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-vt-blue rounded-xl shadow-2xl border border-vt-darkBlue overflow-hidden animate-fadeIn z-50">
                    <div className="p-2 space-y-1">
                        <button 
                            onClick={() => selectVersion('pilot')}
                            className={`w-full flex items-start p-3 rounded-lg transition ${appVersion === 'pilot' ? 'bg-vt-darkBlue' : 'hover:bg-vt-lightBlue'}`}
                        >
                            <div className="mt-1">
                                {appVersion === 'pilot' ? <Check size={16} className="text-white"/> : <LayoutDashboard size={16} className="text-white"/>}
                            </div>
                            <div className="ml-3 text-left">
                                <p className={`font-bold text-sm text-white`}>Pilot (MVP)</p>
                                <p className="text-xs text-gray-300 mt-0.5">Looker Studio Dashboard & Early Warning Indicators</p>
                            </div>
                        </button>

                        <button 
                            onClick={() => selectVersion('future')}
                            className={`w-full flex items-start p-3 rounded-lg transition ${appVersion === 'future' ? 'bg-vt-darkBlue' : 'hover:bg-vt-lightBlue'}`}
                        >
                            <div className="mt-1">
                                {appVersion === 'future' ? <Check size={16} className="text-white"/> : <Rocket size={16} className="text-white"/>}
                            </div>
                            <div className="ml-3 text-left">
                                <p className={`font-bold text-sm text-white`}>Future Vision (Full)</p>
                                <p className="text-xs text-gray-300 mt-0.5">Comprehensive App, AI Integration, & Data Backpacks</p>
                            </div>
                        </button>
                    </div>
                </div>
            )}

            {/* AI Feature Hint (Flashing Indicator) - PILOT */}
            {hintVisible && !isMenuOpen && appVersion === 'pilot' && !hasOpenedMenu && (
                <div className="absolute top-16 left-4 z-50 animate-bounce pointer-events-none">
                    <div className="relative">
                        {/* Up Arrow */}
                        <div className="absolute -top-2 left-6 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-purple-600"></div>
                        {/* Bubble */}
                        <div className="bg-purple-600 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-xl border-2 border-white whitespace-nowrap flex items-center gap-2">
                            <Sparkles size={14} className="text-yellow-300 animate-pulse"/>
                            <span>Click to see Future Vision!</span>
                        </div>
                    </div>
                </div>
            )}
          </div>

          {/* Right Side User Info & Demo Toggle */}
          <div className="flex items-center space-x-4 text-white">
            <div className="hidden md:flex flex-col items-end border-l border-vt-lightBlue pl-4">
               {appVersion === 'future' ? (
                   <>
                    <span className="text-xs font-bold text-gray-300 uppercase">Current View</span>
                    <span className="text-sm font-medium">{role}</span>
                   </>
               ) : (
                   <>
                    <span className="text-xs font-bold text-gray-300 uppercase">Logged In As</span>
                    <span className="text-sm font-medium">District Admin</span>
                   </>
               )}
            </div>
            <div className="w-8 h-8 rounded-full bg-vt-lightBlue overflow-hidden border border-vt-darkBlue">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${appVersion === 'future' ? role : 'admin'}`} alt="Avatar" className="w-full h-full" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {renderView()}
      </main>

      {/* Global Role Switcher - ONLY VISIBLE IN FUTURE MODE */}
      {appVersion === 'future' && (
          <>
            <RoleSwitcher currentRole={role} setRole={handleSetRole} />
            
            {/* Role Switcher Hint (Flashing Indicator) - FUTURE */}
            {roleHintVisible && !hasSwitchedRole && (
                <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-[60] animate-bounce pointer-events-none">
                    <div className="relative flex flex-col items-center">
                        {/* Bubble */}
                        <div className="bg-purple-600 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-xl border-2 border-white whitespace-nowrap flex items-center gap-2 mb-2">
                            <Sparkles size={14} className="text-yellow-300 animate-pulse"/>
                            <span>Explore different Personas!</span>
                        </div>
                        {/* Down Arrow */}
                        <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-purple-600 -mt-2"></div>
                    </div>
                </div>
            )}
          </>
      )}
      
      {/* Demo Guide Overlay */}
      <DemoGuide 
        isOpen={showDemoGuide} 
        onClose={() => setShowDemoGuide(false)} 
        role={role}
        appVersion={appVersion}
      />

      {/* Demo Watermark */}
      <div className="fixed bottom-2 right-4 text-[10px] text-gray-400 pointer-events-none z-0">
        Lone Star USD Demo Build v0.3 • {appVersion === 'future' ? 'Phase 2' : 'Phase 1'}
      </div>
    </div>
  );
};

export default App;