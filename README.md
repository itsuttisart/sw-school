# SW-SCHOOL

ระบบบริหารจัดการสถานศึกษาแบบ SPA สำหรับใช้งานในหน้าจอ desktop และ mobile

## โครงสร้างโปรเจ็กต์

- Vite + React + TypeScript
- Tailwind CSS
- PWA support
- GitHub Pages deployment

## ข้อกำหนดเบื้องต้น

- Node.js 18+ หรือ 20+
- npm

## รันโปรเจ็กต์แบบ local

1. ติดตั้ง dependency
   ```bash
   npm install
   ```

2. รัน dev server
   ```bash
   npm run dev -- --host 0.0.0.0
   ```

3. เปิดเว็บในเบราว์เซอร์
   ```text
   http://localhost:3000/
   ```

## Build สำหรับ production

```bash
npm run build
```

ไฟล์ build จะถูกสร้างที่โฟลเดอร์ `dist/`

## Deploy ไปยัง GitHub Pages

โปรเจ็กต์นี้มี workflow ที่พร้อม deploy แล้วที่:

- [.github/workflows/deploy.yml](.github/workflows/deploy.yml)

### ขั้นตอน

1. ตรวจสอบ repo ของคุณว่าอยู่ใน branch `main`
2. Push code ขึ้น GitHub
3. เข้าไปที่ Repository → Settings → Pages
4. เลือก Source เป็น `GitHub Actions`
5. รอ workflow ทำงานและ deploy เสร็จ

### URL ที่คาดว่าจะได้

```text
https://<username>.github.io/sw-school/
```

ถ้า repo name เป็น `sw-school` ตามค่าใน config จะ deploy ที่ path `/sw-school/`

## หมายเหตุด้าน deployment

- base path ใน [vite.config.ts](vite.config.ts) ถูกตั้งไว้สำหรับ GitHub Pages แล้ว
- PWA manifest และ asset path ถูกกำหนดให้ทำงานกับ repo path ของ GitHub Pages ได้

## การเข้าใช้งานระบบ

ใช้ข้อมูลตัวอย่างที่อยู่ใน [src/lib/data.ts](src/lib/data.ts) เช่น:

- Admin
  - username: `admin`
  - password: `password123`

- Teacher
  - phone: `0812345678`
  - password: `password123`

- Student
  - studentId: `65001`
  - password: `password123`

- Parent
  - phone: `0898765432`
  - password: `password123`

## ปัญหาที่พบและแก้ไขแล้ว

- Vite dependency corruption
- Popup ไม่แสดงตามเงื่อนไข role/time
- Logout บน mobile ไม่เห็น
- Responsive mobile layout improvement

## สคริปต์ที่ใช้

```bash
npm run dev
npm run build
npm run preview
```

## บทสรุป

หากต้องการ deploy จาก GitHub ให้ทำแค่:

```bash
git add .
git commit -m "Deploy SW-SCHOOL"
git push origin main
```

แล้ว GitHub Actions จะทำการ build และ deploy ให้เองโดยอัตโนมัติ
