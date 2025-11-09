use attendo;

CREATE TABLE attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,
    session_type ENUM('check-in', 'check-out') NOT NULL,
    qr_id INT NOT NULL,
    marked_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_attendance_qr FOREIGN KEY (qr_id) REFERENCES qr_codes_admin(id) ON DELETE CASCADE,
    CONSTRAINT fk_attendance_student FOREIGN KEY (student_id) REFERENCES student_details(roll_no) ON DELETE CASCADE
);

-- View to see attendance records with student details
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
JOIN student_details s ON a.student_id = s.roll_no
JOIN users u ON s.user_id = u.id
JOIN qr_codes_admin qr ON a.qr_id = qr.id
ORDER BY a.marked_at DESC;
