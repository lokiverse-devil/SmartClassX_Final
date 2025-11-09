import db from "./src/config/db.js";

const checkAttendance = () => {
  const sql = `
    SELECT 
      a.id,
      a.student_id,
      u.name as student_name,
      u.email as student_email,
      s.department,
      s.year,
      a.session_type,
      a.marked_at,
      qr.session_type as qr_session_type,
      qr.generated_at as qr_generated_at
    FROM attendance a
    LEFT JOIN student_details s ON a.student_id = s.roll_no
    LEFT JOIN users u ON s.user_id = u.id
    LEFT JOIN qr_codes_admin qr ON a.qr_id = qr.id
    ORDER BY a.marked_at DESC
    LIMIT 10
  `;
  
  db.query(sql, (err, result) => {
    if (err) {
      console.error("❌ Error fetching attendance records:", err);
    } else {
      console.log("📊 ATTENDANCE RECORDS:");
      console.log("=" .repeat(80));
      
      if (result.length === 0) {
        console.log("❌ No attendance records found yet.");
        console.log("💡 Try scanning a QR code to mark attendance first!");
      } else {
        result.forEach((record, index) => {
          console.log(`\n📝 Record #${index + 1}:`);
          console.log(`   Student: ${record.student_name} (${record.student_email})`);
          console.log(`   Roll No: ${record.student_id}`);
          console.log(`   Department: ${record.department} - ${record.year}`);
          console.log(`   Session: ${record.session_type.toUpperCase()}`);
          console.log(`   Marked At: ${new Date(record.marked_at).toLocaleString()}`);
          console.log(`   QR Session: ${record.qr_session_type}`);
          console.log(`   QR Generated: ${new Date(record.qr_generated_at).toLocaleString()}`);
          console.log("-" .repeat(60));
        });
        
        console.log(`\n✅ Total Records: ${result.length}`);
      }
    }
    process.exit(0);
  });
};

checkAttendance();
