-- Create admin user
INSERT INTO "edubuild_users" (id, name, email, password, role, school, state, "createdAt", "updatedAt")
VALUES 
(
  '550e8400-e29b-41d4-a716-446655440002',
  'Admin User',
  'admin@edubuild.com',
  '$2a$10$UQJl2U/v6lx0zVHxQ7o/meMF.6xLBjPKwMl.5nVKUETBYQzPTtpGW',
  'admin',
  'Central School',
  'Delhi',
  NOW(),
  NOW()
);

-- Note: Password hash is for 'admin123' using bcrypt
-- To verify: const bcrypt = require('bcryptjs');
-- bcrypt.compare('admin123', '$2a$10$UQJl2U/v6lx0zVHxQ7o/meMF.6xLBjPKwMl.5nVKUETBYQzPTtpGW');
