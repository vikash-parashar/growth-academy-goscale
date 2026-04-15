-- Test data for development and testing
-- Test Student: user_id = teststudent, password = TestStudent@2024
-- Test Admin: email = testadmin@gopher.lab, password = TestAdmin@2024
-- Apply after 002_seed_admin.sql

-- Insert test student (bcrypt hash cost 10 for "TestStudent@2024")
INSERT INTO students (first_name, last_name, email, phone, whatsapp_number, user_id, password_hash, goal, status) VALUES (
	'Test',
	'Student',
	'teststudent@gopher.lab',
	'+919876543210',
	'+919876543210',
	'teststudent',
	'$2a$10$/FE1Ld392dix2Wi2JikJIOc.DG5xshjne.VZFe15ovLbdWuKOiAka',
	'Learn Go and systems thinking',
	'active'
) ON CONFLICT (email) DO NOTHING;

-- Insert test admin (bcrypt hash cost 10 for "TestAdmin@2024")
INSERT INTO admin_users (email, password_hash) VALUES (
	'testadmin@gopher.lab',
	'$2a$10$/FE1Ld392dix2Wi2JikJIOc.DG5xshjne.VZFe15ovLbdWuKOiAka'
) ON CONFLICT (email) DO NOTHING;
