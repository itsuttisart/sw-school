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

      const popupToShow = popups.find(p => {
        const now = new Date();

        if (p.expiresAt && new Date(p.expiresAt) < now) {
          return false;
        }

        if (!p.isActive) return false;

        const targetRoles = p.targetRoles || { student: false, parent: false, teacher: false, admin: false };
        if (user.role === 'admin' && targetRoles.admin) return true;
        if (user.role === 'teacher' && targetRoles.teacher) return true;
        if (user.role === 'student' && targetRoles.student) return true;
        if (user.role === 'parent' && targetRoles.parent) return true;

        return false;
      });

      setActivePopup(popupToShow || null);
    }, 1000);

    return () => clearTimeout(timer);
  }, [user]);

  const handleDismiss = () => {
    if (!activePopup) return;
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
