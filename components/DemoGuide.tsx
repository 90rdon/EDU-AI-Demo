import React from 'react';
import { UserRole } from '../types';
import { X, Lightbulb, Target } from 'lucide-react';

interface DemoGuideProps {
  isOpen: boolean;
  onClose: () => void;
  role: UserRole;
  appVersion: 'pilot' | 'future';
}

const DemoGuide: React.FC<DemoGuideProps> = ({ isOpen, onClose, role, appVersion }) => {
  if (!isOpen) return null;

  const getContent = () => {
    // --------------------------------------------------------------------------
    // PILOT VIEW STRATEGY
    // --------------------------------------------------------------------------
    if (appVersion === 'pilot') {
      return {
        title: "The Commercial Insight (First 10 Mins)",
        insight: "Disrupt their thinking. Don't start with features.",
        talkingPoints: [
          "Acknowledge the pain: '15+ disparate systems' is the root cause.",
          "Re-frame: Choosing a COTS vendor (PowerSchool) consolidates this mess under a proprietary lock. That is a monopoly risk.",
          "Our Solution: A True Data Lake (Google BigQuery) that you OWN. We are the implementers, not the gatekeepers.",
          "Pilot View: Show this Looker Studio dashboard. It represents 'meeting them where they are' but on modern infrastructure.",
          "De-Risking: We solve the fragmentation today without limiting your future."
        ],
        action: "Show the filters and the 'Open' nature of the data connection."
      };
    }

    // --------------------------------------------------------------------------
    // FUTURE VISION STRATEGY
    // --------------------------------------------------------------------------
    switch (role) {
      case UserRole.STUDENT:
        return {
          title: "Student Agency & Portfolio",
          insight: "From 'Passive Tracking' to 'Active Ownership'.",
          talkingPoints: [
            "RFP Requirement: Student adding an artifact based on a set goal.",
            "RFP Requirement: IEP/504 Visibility. Show the 'Personalized Plan' tag on goals.",
            "Differentiation: Show the 'Elementary' vs 'High School' toggle. This proves we understand age-appropriate UI.",
            "Strategic Tie: This isn't just a portal; it's a tool to teach students how to analyze their own growth."
          ],
          action: "1. Toggle 'Elementary Mode'. 2. Upload an Artifact. 3. Highlight the IEP/504 tag on the goal."
        };
      case UserRole.PARENT:
        return {
          title: "Parent Transparency & Equity",
          insight: "Breaking down barriers to engagement.",
          talkingPoints: [
            "RFP Requirement: View performance/goals over multiple years.",
            "RFP Requirement: 'What if the parent needs a language other than English?'",
            "Challenger Link: Most portals are static. Ours is a real-time window into the classroom.",
            "Strategic Tie: We use AI to translate complex data into actionable insights for parents."
          ],
          action: "1. Click the 'Español' toggle immediately. 2. Show the longitudinal Line Chart (Math/Reading)."
        };
      case UserRole.TEACHER:
        return {
          title: "Teacher Time Savings",
          insight: "Solving the 'Fragmented Landscape'.",
          talkingPoints: [
            "Problem: Teachers currently sift through 3 systems (Eduphoria, eSchool, Canvas) to prep for a conference.",
            "Solution: The Unified View. All data in one screen.",
            "RFP Requirement: Accessing multi-year data for parent conferences.",
            "AI Demo: Use the 'EDU AI' to group students. This shows 'Just-in-time data' for intervention."
          ],
          action: "1. Launch EDU AI. 2. Ask it to group students based on risk scores."
        };
      case UserRole.PRINCIPAL:
      case UserRole.ADMIN:
        return {
          title: "District & Campus Leadership",
          insight: "Operational Excellence & ROI.",
          talkingPoints: [
            "RFP Requirement: Campus leader identifying students growing but not meeting goals (Cohorts).",
            "RFP Requirement: District Admin accessing TEKS achievement over multiple years.",
            "The 'Data Studio' Tab: This is the 'Kill Shot' against vendor lock-in. Show how we can drag-and-drop Munis (Finance) vs NWEA (Academic).",
            "Strategic Tie: Only an open Data Lake allows you to cross-reference Staffing/Finance data with Student outcomes."
          ],
          action: "1. Go to 'Data Studio' tab. 2. Drag Munis + NWEA. 3. Show the 'Program ROI' chart."
        };
      case UserRole.BOARD:
        return {
          title: "Board Strategic Oversight",
          insight: "Governance & Long-Term Trends.",
          talkingPoints: [
            "RFP Requirement: Board member reviewing district-wide progress.",
            "Focus: High-level trends, not row-level data.",
            "Gap Analysis: Show the equity breakdown (Eco Dis / SPED gaps).",
            "Strategic Tie: We use AI to extract 'Talking Points' for policy meetings."
          ],
          action: "1. Click on Goal 3 (Staff). 2. Use AI to analyze 'Turnover vs Growth'."
        };
      default:
        return {
           title: "Overview",
           insight: "Select a role to see specific demo talking points.",
           talkingPoints: [],
           action: "Switch roles using the bottom switcher."
        };
    }
  };

  const content = getContent();

  return (
    <div className="fixed bottom-20 right-6 z-[100] animate-slideIn">
      <div className="bg-gray-900/95 backdrop-blur text-white p-6 rounded-2xl shadow-2xl border border-gray-700 max-w-sm relative">
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2 mb-4 text-amber-400">
            <Lightbulb size={24} className="fill-current" />
            <span className="font-bold uppercase tracking-wider text-xs">Demo Guide</span>
        </div>

        <h3 className="text-xl font-bold mb-2">{content.title}</h3>
        <p className="text-gray-300 text-sm mb-4 italic">"{content.insight}"</p>

        <div className="space-y-3 mb-6">
            {content.talkingPoints.map((point, i) => (
                <div key={i} className="flex gap-2 text-sm text-gray-200">
                    <div className="mt-1 min-w-[4px] h-[4px] bg-blue-500 rounded-full" />
                    <span>{point}</span>
                </div>
            ))}
        </div>

        <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
            <div className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1">
                <Target size={12} /> Key Action
            </div>
            <p className="text-sm font-bold text-white">{content.action}</p>
        </div>
      </div>
    </div>
  );
};

export default DemoGuide;