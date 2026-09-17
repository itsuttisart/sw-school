export interface PopupData {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  targetRoles: {
    student: boolean;
    parent: boolean;
    teacher: boolean;
    admin?: boolean;
  };
  isActive: boolean;
  createdAt: string;
  durationDays?: number;
  expiresAt?: string;
}

const defaultPopups: PopupData[] = [
  {
    id: 'welcome-2',
    title: 'ยินดีต้อนรับสู่ภาคเรียนใหม่!',
    content: 'ขอต้อนรับทุกคนเข้าสู่ภาคเรียนที่ 1/2568 ขอให้มีความสุขกับการเรียนการสอนนะครับ อย่าลืมตรวจสอบตารางเรียนและการแจ้งเตือนต่าง ๆ ในระบบ',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop',
    targetRoles: { student: true, parent: true, teacher: true, admin: true },
    isActive: true,
    createdAt: new Date().toISOString(),
    durationDays: 7,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const getPopups = (): PopupData[] => {
  const data = localStorage.getItem('school_popups');
  if (!data) {
    localStorage.setItem('school_popups', JSON.stringify(defaultPopups));
    return defaultPopups;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return defaultPopups;
  }
};

export const savePopups = (popups: PopupData[]) => {
  localStorage.setItem('school_popups', JSON.stringify(popups));
};
