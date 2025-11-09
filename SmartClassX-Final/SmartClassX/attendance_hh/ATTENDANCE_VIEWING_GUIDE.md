# 📊 How to View Marked Attendance

## 🎯 **Quick Summary**
After scanning a QR code, attendance is stored in the MySQL database. Here are all the ways to view it:

---

## 🗄️ **1. Database Direct View (Immediate)**

### **View All Attendance Records**
```bash
cd Backend
node view-attendance.js
```

### **What You'll See**
```
📊 ATTENDANCE RECORDS:
================================================================================

📝 Record #1:
   Student: chand (chandsahil2004@gmail.com)
   Roll No: 8439394951
   Department: Computer Science - 3rd year
   Session: CHECK-IN
   Marked At: 10/12/2025, 2:30:45 PM
   QR Session: check-in
   QR Generated: 10/12/2025, 2:00:00 PM
------------------------------------------------------------

✅ Total Records: 1
```

---

## 🌐 **2. Backend API Endpoints (For Developers)**

### **Get All Attendance Records**
```bash
GET http://localhost:5000/api/attendance/records
```

### **Get Specific Student's Attendance**
```bash
GET http://localhost:5000/api/attendance/student/8439394951
```

### **Get Attendance Statistics**
```bash
GET http://localhost:5000/api/attendance/stats
```

---

## 🖥️ **3. Admin Dashboard (Web Interface)**

### **Access Admin Panel**
1. Open: `http://localhost:5173`
2. Login as Admin
3. Navigate to: **Admin Panel → Attendance Reports**

### **Features Available**
- ✅ View all student attendance
- ✅ Filter by date range
- ✅ Filter by department
- ✅ Export to PDF/Excel
- ✅ Real-time statistics

---

## 👨‍🎓 **4. Student Dashboard (Web Interface)**

### **Access Student Panel**
1. Open: `http://localhost:5173`
2. Login as Student
3. Navigate to: **Student Panel → History**

### **Features Available**
- ✅ View personal attendance history
- ✅ Monthly attendance summary
- ✅ Attendance percentage
- ✅ Filter by month

---

## 📱 **5. Real-Time Console Logs**

### **During QR Scanning**
Watch the browser console for:
```
✅ Location validation result (radius 2000m): true
📍 You are within 2000m of campus!
File selected for upload: Screenshot 2025-10-10 112656.png
QR code decoded from image: check-in-k6nspa4q1760075794837-2025-10-10 05:56:34
handleQRScan called, qrData: check-in-k6nspa4q1760075794837-2025-10-10 05:56:34
Sending studentId to backend: 8439394951
Backend response: 200 {"message":"Successfully checked in!","qrSession":"check-in"}
```

---

## 🔍 **6. Database Tables Structure**

### **Main Tables**
- `attendance` - Stores all attendance records
- `qr_codes_admin` - Stores active QR codes
- `student_details` - Student information
- `users` - User authentication data

### **Key Fields**
- `student_id` - Student's roll number
- `session_type` - 'check-in' or 'check-out'
- `marked_at` - When attendance was marked
- `qr_id` - Which QR code was used

---

## 🚀 **7. Testing the Complete Flow**

### **Step 1: Generate Active QR Code**
```bash
cd Backend
node generate-test-qr.js
```

### **Step 2: Scan QR Code**
- Use camera or upload image
- Verify location and WiFi
- Check console for success messages

### **Step 3: View Results**
```bash
cd Backend
node view-attendance.js
```

---

## ⚠️ **Important Notes**

1. **Database Connection**: Make sure MySQL is running
2. **Backend Server**: Ensure `npm start` is running in Backend folder
3. **Frontend Server**: Ensure `npm run dev` is running in Frontend folder
4. **Active QR Code**: Must have an active QR code in database
5. **Location/WiFi**: Student must be on campus and connected to WiFi

---

## 🎯 **Quick Test Commands**

```bash
# Check if attendance table exists
cd Backend && node -e "import('./src/config/db.js').then(db => db.default.query('SHOW TABLES LIKE \"attendance\"', (err,res) => console.log(res)))"

# View recent attendance
cd Backend && node view-attendance.js

# Check active QR codes
cd Backend && node -e "import('./src/config/db.js').then(db => db.default.query('SELECT * FROM qr_codes_admin WHERE is_active=1', (err,res) => console.log(res)))"
```

---

## 📞 **Need Help?**

If you don't see attendance records:
1. Check if QR code was successfully scanned
2. Verify backend server is running
3. Check database connection
4. Ensure student is logged in with correct roll number
5. Verify location and WiFi requirements are met
