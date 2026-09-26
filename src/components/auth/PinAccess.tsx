import { FormEvent, useEffect, useState } from 'react';
import { Delete, LockKeyhole, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { User } from '@/lib/types';
import { setUserPin, verifyUserPin } from '@/lib/authStore';

type PinAccessProps = {
  user: User;
  mode: 'setup' | 'unlock';
  onSuccess: (pin?: string) => void | Promise<void>;
  onCancel: () => void;
};

export function PinAccess({ user, mode, onSuccess, onCancel }: PinAccessProps) {
  const [activeField, setActiveField] = useState<'pin' | 'confirmation'>('pin');
  const [pin, setPin] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!lockedUntil) return;
    const timer = window.setInterval(() => {
      if (Date.now() >= lockedUntil) {
        setLockedUntil(0);
        setAttempts(0);
      }
    }, 500);
    return () => window.clearInterval(timer);
  }, [lockedUntil]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (isSubmitting || (mode === 'unlock' && Date.now() < lockedUntil)) return;

    if (!/^\d{6}$/.test(pin)) {
      setError('กรุณากำหนด PIN เป็นตัวเลข 6 หลัก');
      return;
    }
    if (mode === 'setup' && (/^(\d)\1{5}$/.test(pin) || ['123456', '654321', '112233', '121212'].includes(pin))) {
      setError('PIN นี้คาดเดาง่ายเกินไป กรุณาเลือกชุดตัวเลขอื่น');
      return;
    }
    if (mode === 'setup' && pin !== confirmation) {
      setError('PIN ทั้งสองช่องไม่ตรงกัน');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      if (mode === 'setup') {
        await setUserPin(user.id, pin);
        await onSuccess(pin);
      } else if (await verifyUserPin(user.id, pin)) {
        await onSuccess();
      } else {
        const nextAttempts = attempts + 1;
        setAttempts(nextAttempts);
        setPin('');
        if (nextAttempts >= 5) {
          setLockedUntil(Date.now() + 30_000);
          setError('ใส่ PIN ผิดครบ 5 ครั้ง ลองใหม่ได้ใน 30 วินาที');
        } else {
          setError(`PIN ไม่ถูกต้อง เหลืออีก ${5 - nextAttempts} ครั้ง`);
        }
      }
    } catch {
      setError('บันทึก PIN ไม่สำเร็จ กรุณาลองใหม่');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateDigits = (value: string, setter: (digits: string) => void) => {
    setter(value.replace(/\D/g, '').slice(0, 6));
    setError('');
  };

  const addDigit = (digit: string) => {
    setError('');
    if (activeField === 'confirmation' && mode === 'setup') {
      if (confirmation.length < 6) setConfirmation(current => current + digit);
      return;
    }

    if (pin.length >= 6) return;
    const nextPin = pin + digit;
    setPin(nextPin);
    if (mode === 'setup' && nextPin.length === 6) setActiveField('confirmation');
  };

  const deleteDigit = () => {
    setError('');
    if (activeField === 'confirmation' && mode === 'setup') {
      setConfirmation(current => current.slice(0, -1));
      return;
    }
    setPin(current => current.slice(0, -1));
  };

  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#F1F5F9] p-4 font-sans text-slate-800">
      <section className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white">
          {mode === 'setup' ? <ShieldCheck size={28} /> : <LockKeyhole size={28} />}
        </div>
        <h1 className="text-xl font-bold">{mode === 'setup' ? 'ตั้ง PIN สำหรับเข้าใช้งานครั้งถัดไป' : 'ปลดล็อก SW-SCHOOL'}</h1>
        <p className="mt-2 text-sm text-slate-500">{user.name} · {user.role}</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="pin" className="mb-2 block text-sm font-semibold text-slate-700">
              {mode === 'setup' ? 'PIN 6 หลัก' : 'กรอก PIN 6 หลัก'}
            </label>
            <Input
              id="pin"
              type="password"
              inputMode="none"
              autoComplete={mode === 'setup' ? 'new-password' : 'current-password'}
              pattern="[0-9]{6}"
              maxLength={6}
              value={pin}
              onFocus={() => setActiveField('pin')}
              onChange={event => updateDigits(event.target.value, setPin)}
              readOnly
              className="h-12 text-center text-xl tracking-[0.4em]"
              autoFocus
              required
            />
          </div>

          {mode === 'setup' && (
            <div>
              <label htmlFor="pin-confirm" className="mb-2 block text-sm font-semibold text-slate-700">ยืนยัน PIN</label>
              <Input
                id="pin-confirm"
                type="password"
                inputMode="none"
                autoComplete="new-password"
                pattern="[0-9]{6}"
                maxLength={6}
                value={confirmation}
                onFocus={() => setActiveField('confirmation')}
                onChange={event => updateDigits(event.target.value, setConfirmation)}
                readOnly
                className="h-12 text-center text-xl tracking-[0.4em]"
                required
              />
            </div>
          )}

          <div className="mx-auto grid max-w-xs grid-cols-3 gap-2" aria-label="แป้นตัวเลข PIN">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(digit => (
              <button
                key={digit}
                type="button"
                aria-label={`เลข ${digit}`}
                onClick={() => addDigit(digit)}
                disabled={isSubmitting || (mode === 'unlock' && Date.now() < lockedUntil)}
                className="h-12 rounded-xl border border-slate-200 bg-slate-50 text-lg font-semibold text-slate-800 transition-colors hover:bg-emerald-50 active:bg-emerald-100 disabled:opacity-50"
              >
                {digit}
              </button>
            ))}
            <span aria-hidden="true" />
            <button
              type="button"
              aria-label="เลข 0"
              onClick={() => addDigit('0')}
              disabled={isSubmitting || (mode === 'unlock' && Date.now() < lockedUntil)}
              className="h-12 rounded-xl border border-slate-200 bg-slate-50 text-lg font-semibold text-slate-800 transition-colors hover:bg-emerald-50 active:bg-emerald-100 disabled:opacity-50"
            >
              0
            </button>
            <button
              type="button"
              aria-label="ลบตัวเลขล่าสุด"
              onClick={deleteDigit}
              disabled={isSubmitting}
              className="flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition-colors hover:bg-rose-50 hover:text-rose-600 active:bg-rose-100 disabled:opacity-50"
            >
              <Delete size={20} />
            </button>
          </div>

          {error && <p role="alert" className="text-sm font-medium text-rose-600">{error}</p>}

          <Button type="submit" disabled={isSubmitting || (mode === 'unlock' && Date.now() < lockedUntil)} className="h-12 w-full">
            {isSubmitting ? 'กำลังตรวจสอบ...' : mode === 'setup' ? 'บันทึก PIN' : 'ปลดล็อก'}
          </Button>
        </form>

        <button type="button" onClick={onCancel} className="mt-4 w-full py-2 text-sm font-semibold text-slate-500 hover:text-slate-800">
          {mode === 'setup' ? 'ยกเลิกและกลับไปเข้าสู่ระบบ' : 'ออกจากบัญชีนี้'}
        </button>
      </section>
    </main>
  );
}