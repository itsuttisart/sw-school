import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { User } from '@/lib/types';
import { getPopups, PopupData } from '@/lib/popupStore';

export function WelcomePopup({ user }: { user: User }) {
  const [activePopup, setActivePopup] = useState<PopupData | null>(null);

  useEffect(() => {
    // wait a brief moment for smooth effect
    const timer = setTimeout(() => {
      const popups = getPopups();
      const dismissedIds = JSON.parse(sessionStorage.getItem(`dismissedPopups_${user.id}`) || '[]');
      
      // Find the first active popup that applies to the user and hasn't been dismissed
      const popupToShow = popups.find(p => {
        // Check if expired
        if (p.expiresAt && new Date(p.expiresAt) < new Date()) {
          return false;
        }
        if (!p.isActive) return false;
        if (dismissedIds.includes(p.id)) return false;
        
        // check role
        if (user.role === 'admin' && p.targetRoles.admin) return true;
        if (user.role === 'teacher' && p.targetRoles.teacher) return true;
        if (user.role === 'student' && p.targetRoles.student) return true;
        if (user.role === 'parent' && p.targetRoles.parent) return true;
        
        return false;
      });

      if (popupToShow) {
        setActivePopup(popupToShow);
      }
    }, 1000); // show 1 second after mount

    return () => clearTimeout(timer);
  }, [user]);

  const handleDismiss = () => {
    if (!activePopup) return;
    const dismissedIds = JSON.parse(sessionStorage.getItem(`dismissedPopups_${user.id}`) || '[]');
    sessionStorage.setItem(`dismissedPopups_${user.id}`, JSON.stringify([...dismissedIds, activePopup.id]));
    setActivePopup(null);
  };

  if (!activePopup) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div 
        className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
        onClick={e => e.stopPropagation()}
      >
        {activePopup.imageUrl ? (
          <div className="h-48 w-full bg-slate-100 relative">
            <img src={activePopup.imageUrl} alt={activePopup.title} className="w-full h-full object-cover" />
            <button 
              onClick={handleDismiss}
              className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          <div className="flex justify-end p-4 pb-0">
             <button 
              onClick={handleDismiss}
              className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        )}
        
        <div className="p-6 md:p-8 text-center">
          <h2 className="text-xl font-bold text-slate-800 mb-3">{activePopup.title}</h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-6 whitespace-pre-wrap">
            {activePopup.content}
          </p>
          <Button onClick={handleDismiss} className="w-full bg-indigo-600 hover:bg-indigo-700 shadow-md text-white">
            รับทราบ
          </Button>
        </div>
      </div>
    </div>
  );
}
