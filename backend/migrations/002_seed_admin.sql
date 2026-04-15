-- Default admin for local / first deploy (portal login: email + password).
-- Password is bcrypt hash of: Vikash@9966
-- Apply after 001_initial_schema.sql

INSERT INTO admin_users (email, password_hash) VALUES (
	'gowithvikash@gmail.com',
	E'$2a$10$FZbQRC6A8m6ys/6Qo2qQ2uNLn5ehAvV1XsQ8jWYTuaFCFRGtvlgSW'
) ON CONFLICT (email) DO NOTHING;
