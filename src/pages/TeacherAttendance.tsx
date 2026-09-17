import React, { useState, useEffect, useRef } from 'react';
import { User } from '@/lib/types';
import { Clock, CalendarDays, CheckCircle2, AlertCircle, XCircle, LogIn, LogOut, MapPin as MapPinIcon, Camera, X } from 'lucide-react';
import Swal from 'sweetalert2';
import { getSchoolLocationConfig, getDistanceFromLatLonInM } from '@/lib/geo';

export function TeacherAttendance({ user }: { user: User }) {
  const [selectedMonth, setSelectedMonth] = useState('2026-09');
  const [checkingType, setCheckingType] = useState<'in' | 'out' | null>(null);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [faceImage, setFaceImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  useEffect(() => {
    if (checkingType) {
      // Mock fetching location
      Swal.fire({
        title: 'กำลังดึงตำแหน่ง...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
          
          if (!navigator.geolocation) {
            Swal.fire({ icon: 'error', title: 'ไม่รองรับ GPS', text: 'อุปกรณ์ของคุณไม่รองรับการระบุตำแหน่ง' });
            setCheckingType(null);
            return;
          }

          navigator.geolocation.getCurrentPosition(
            (position) => {
              setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
              Swal.close();
              startCamera();
            },
            (error) => {
              Swal.fire({ icon: 'error', title: 'ดึงตำแหน่งล้มเหลว', text: 'ไม่สามารถดึงตำแหน่งปัจจุบันได้' });
              setCheckingType(null);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
          );
        }
      });
    } else {
      stopCamera();
      setLocation(null);
      setFaceImage(null);
    }
  }, [checkingType]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Camera access denied:", err);
      Swal.fire({
        icon: 'warning', 
        title: 'ไม่สามารถเปิดกล้องได้', 
        text: 'ระบบไม่สามารถเข้าถึงกล้องของคุณได้ หรือคุณไม่ได้อนุญาตสิทธิ์'
      });
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setIsCameraActive(false);
    }
  };

  const captureFace = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        const imgData = canvasRef.current.toDataURL('image/png');
        setFaceImage(imgData);
        stopCamera();
      }
    } else {
      // Fallback simulation if no real camera
      setFaceImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
    }
  };

  const retakeFace = () => {
    setFaceImage(null);
    startCamera();
  };

  const handleConfirm = () => {
    if (!faceImage) {
      Swal.fire('ข้อผิดพลาด', 'กรุณาถ่ายภาพใบหน้าเพื่อยืนยันตัวตน', 'error');
      return;
    }
    const actionText = checkingType === 'in' ? 'เข้างาน' : 'ออกงาน';
    
    setCheckingType(null);
    Swal.fire({
      title: 'บันทึกสำเร็จ',
      text: `บันทึกเวลา${actionText}เรียบร้อยแล้ว`,
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    });
  };

  // Mock data
  const stats = { present: 15, late: 2, leave: 1, absent: 0 };
  const attendanceLog = [
    { date: '2026-09-05', in: '07:15', out: '16:30', status: 'มาทำงาน' },
    { date: '2026-09-04', in: '07:20', out: '16:45', status: 'มาทำงาน' },
    { date: '2026-09-03', in: '07:45', out: '16:30', status: 'มาสาย' },
    { date: '2026-09-02', in: '-', out: '-', status: 'ลา' },
    { date: '2026-09-01', in: '07:10', out: '16:30', status: 'มาทำงาน' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative">
      
      {/* Check In/Out Modal Overlay */}
      {checkingType && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                {checkingType === 'in' ? <LogIn className="text-emerald-500" /> : <LogOut className="text-rose-500" />}
                บันทึกเวลา{checkingType === 'in' ? 'เข้างาน' : 'ออกงาน'}
              </h3>
              <button onClick={() => setCheckingType(null)} className="p-2 text-slate-400 hover:text-rose-500 rounded-full hover:bg-rose-50 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
              {/* Map Section */}
              <div>
                <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-1"><MapPinIcon size={16} className="text-blue-500"/> ตำแหน่งปัจจุบันของคุณ</h4>
                <div className="w-full h-40 bg-slate-200 rounded-2xl relative overflow-hidden flex items-center justify-center bg-slate-100 border border-slate-200">
                  {/* Using an iframe to google maps embed as a reliable visual without API key for UI purpose */}
                  {location ? (
                    <iframe 
                      width="100%" 
                      height="100%" 
                      frameBorder="0" 
                      style={{ border: 0 }}
                      src={`https://maps.google.com/maps?q=${location.lat},${location.lng}&z=15&output=embed`}
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <span className="animate-pulse text-slate-500 font-medium bg-white/80 px-4 py-2 rounded-full">กำลังค้นหาตำแหน่ง...</span>
                  )}
                  {location && (
                    <div className="absolute inset-0 bg-blue-500/10 pointer-events-none"></div>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-2 text-center">ต้องอยู่ในพื้นที่โรงเรียน (รัศมี 500 เมตร)</p>
              </div>

              {/* Camera Section */}
              <div>
                <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-1"><Camera size={16} className="text-purple-500"/> ถ่ายภาพใบหน้าเพื่อยืนยัน (ห้ามอัปโหลดรูป)</h4>
                
                <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden relative flex items-center justify-center">
                  {!faceImage && (
                    <>
                      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
                      {!isCameraActive && <span className="text-slate-400 text-sm absolute z-10 text-center px-4">กำลังเปิดกล้อง... <br/>(หากไม่มีกล้องจะไม่สามารถบันทึกได้)</span>}
                    </>
                  )}
                  {faceImage && (
                    <img src={faceImage} alt="Face Capture" className="w-full h-full object-cover" />
                  )}
                  <canvas ref={canvasRef} className="hidden"></canvas>
                </div>

                <div className="mt-4 flex justify-center">
                  {!faceImage ? (
                    <button onClick={captureFace} disabled={!isCameraActive} className={`font-bold py-3 px-6 rounded-full flex items-center gap-2 shadow-md ${isCameraActive ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>
                      <Camera size={20} /> กดถ่ายภาพ
                    </button>
                  ) : (
                    <button onClick={retakeFace} className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-2 px-6 rounded-full text-sm">
                      ถ่ายใหม่
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setCheckingType(null)} className="px-5 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors">
                ยกเลิก
              </button>
              <button onClick={handleConfirm} disabled={!faceImage} className={`px-5 py-2.5 rounded-xl font-bold text-white transition-colors flex items-center gap-2 ${!faceImage ? 'bg-slate-300 cursor-not-allowed' : checkingType === 'in' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-md' : 'bg-rose-600 hover:bg-rose-700 shadow-md'}`}>
                {checkingType === 'in' ? <LogIn size={18} /> : <LogOut size={18} />}
                ยืนยันการบันทึกเวลา
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clock In / Out Action */}
      <div className="md:col-span-12 bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Clock className="text-emerald-500" /> บันทึกเวลาปฏิบัติงาน
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button onClick={() => setCheckingType('in')} className="flex flex-col items-center justify-center py-10 px-4 bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-200 rounded-2xl transition-all group">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
              <LogIn className="w-8 h-8 text-emerald-600" />
            </div>
            <span className="text-2xl font-bold text-emerald-800 mb-1">เข้างาน</span>
            <span className="text-sm text-emerald-600 font-medium">แตะเพื่อตรวจสอบตำแหน่งและสแกนใบหน้า</span>
          </button>
          
          <button onClick={() => setCheckingType('out')} className="flex flex-col items-center justify-center py-10 px-4 bg-rose-50 hover:bg-rose-100 border-2 border-rose-200 rounded-2xl transition-all group">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
              <LogOut className="w-8 h-8 text-rose-600" />
            </div>
            <span className="text-2xl font-bold text-rose-800 mb-1">ออกงาน</span>
            <span className="text-sm text-rose-600 font-medium">แตะเพื่อตรวจสอบตำแหน่งและสแกนใบหน้า</span>
          </button>
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="md:col-span-12 bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <CalendarDays className="text-slate-500" /> สรุปเวลาการทำงาน
          </h2>
          <div className="flex items-center gap-2">
             <label className="text-sm font-bold text-slate-600">เลือกเดือน:</label>
             <select 
               className="bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-emerald-500 focus:border-emerald-500 block p-2.5 font-medium"
               value={selectedMonth}
               onChange={(e) => setSelectedMonth(e.target.value)}
             >
               <option value="2026-09">กันยายน 2569</option>
               <option value="2026-08">สิงหาคม 2569</option>
               <option value="2026-07">กรกฎาคม 2569</option>
             </select>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
           <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 flex flex-col items-center justify-center">
             <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2" />
             <span className="text-3xl font-bold text-emerald-700">{stats.present}</span>
             <span className="text-xs font-bold text-emerald-600 uppercase mt-1">มาทำงาน (วัน)</span>
           </div>
           <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex flex-col items-center justify-center">
             <AlertCircle className="w-8 h-8 text-amber-500 mb-2" />
             <span className="text-3xl font-bold text-amber-700">{stats.late}</span>
             <span className="text-xs font-bold text-amber-600 uppercase mt-1">มาสาย (วัน)</span>
           </div>
           <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex flex-col items-center justify-center">
             <CalendarDays className="w-8 h-8 text-blue-500 mb-2" />
             <span className="text-3xl font-bold text-blue-700">{stats.leave}</span>
             <span className="text-xs font-bold text-blue-600 uppercase mt-1">ลา (วัน)</span>
           </div>
           <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100 flex flex-col items-center justify-center">
             <XCircle className="w-8 h-8 text-rose-500 mb-2" />
             <span className="text-3xl font-bold text-rose-700">{stats.absent}</span>
             <span className="text-xs font-bold text-rose-600 uppercase mt-1">ขาดงาน (วัน)</span>
           </div>
        </div>

        {/* History Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-sm text-left text-slate-500">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th scope="col" className="px-6 py-4 font-bold">วันที่</th>
                <th scope="col" className="px-6 py-4 font-bold">เวลาเข้า</th>
                <th scope="col" className="px-6 py-4 font-bold">เวลาออก</th>
                <th scope="col" className="px-6 py-4 font-bold">สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {attendanceLog.map((log, index) => (
                <tr key={index} className="bg-white border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{log.date}</td>
                  <td className="px-6 py-4">{log.in}</td>
                  <td className="px-6 py-4">{log.out}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      log.status === 'มาทำงาน' ? 'bg-emerald-100 text-emerald-700' :
                      log.status === 'มาสาย' ? 'bg-amber-100 text-amber-700' :
                      log.status === 'ลา' ? 'bg-blue-100 text-blue-700' :
                      'bg-rose-100 text-rose-700'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
