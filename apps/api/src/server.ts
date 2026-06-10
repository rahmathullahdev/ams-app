import dotenv from 'dotenv';
dotenv.config();

import app from './app';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📋 Health: http://localhost:${PORT}/api/health`);
  console.log(`👥 Employees: http://localhost:${PORT}/api/employees`);
  console.log(`📊 Attendance: http://localhost:${PORT}/api/attendance/today/stats\n`);
});
