import { PrismaClient, AttendanceStatus } from '@prisma/client';

const prisma = new PrismaClient();

const departments = ['Engineering', 'Human Resources', 'Marketing', 'Finance', 'Operations'];
const designations: Record<string, string[]> = {
  Engineering: ['Software Engineer', 'Senior Developer', 'Tech Lead', 'DevOps Engineer'],
  'Human Resources': ['HR Manager', 'Recruiter', 'HR Executive'],
  Marketing: ['Marketing Manager', 'Content Strategist', 'SEO Specialist'],
  Finance: ['Accountant', 'Financial Analyst', 'CFO'],
  Operations: ['Operations Manager', 'Project Coordinator', 'Quality Analyst'],
};

const employees = [
  { employeeId: 'EMP-001', name: 'Arjun Mehta', email: 'arjun.mehta@company.com', phone: '9876543210', department: 'Engineering' },
  { employeeId: 'EMP-002', name: 'Priya Sharma', email: 'priya.sharma@company.com', phone: '9876543211', department: 'Engineering' },
  { employeeId: 'EMP-003', name: 'Rahul Verma', email: 'rahul.verma@company.com', phone: '9876543212', department: 'Human Resources' },
  { employeeId: 'EMP-004', name: 'Sneha Patel', email: 'sneha.patel@company.com', phone: '9876543213', department: 'Marketing' },
  { employeeId: 'EMP-005', name: 'Vikram Singh', email: 'vikram.singh@company.com', phone: '9876543214', department: 'Finance' },
  { employeeId: 'EMP-006', name: 'Ananya Gupta', email: 'ananya.gupta@company.com', phone: '9876543215', department: 'Operations' },
  { employeeId: 'EMP-007', name: 'Karan Joshi', email: 'karan.joshi@company.com', phone: '9876543216', department: 'Engineering' },
  { employeeId: 'EMP-008', name: 'Neha Reddy', email: 'neha.reddy@company.com', phone: '9876543217', department: 'Marketing' },
  { employeeId: 'EMP-009', name: 'Amit Kumar', email: 'amit.kumar@company.com', phone: '9876543218', department: 'Finance' },
  { employeeId: 'EMP-010', name: 'Divya Nair', email: 'divya.nair@company.com', phone: '9876543219', department: 'Human Resources' },
];

function getRandomDesignation(dept: string): string {
  const options = designations[dept] || ['Employee'];
  return options[Math.floor(Math.random() * options.length)];
}

async function main() {
  console.log('🌱 Seeding database...\n');

  // Clear existing data (attendance first due to relation)
  await prisma.attendance.deleteMany();
  await prisma.employee.deleteMany();

  // Create employees
  const createdEmployees = [];
  for (const emp of employees) {
    const created = await prisma.employee.create({
      data: {
        ...emp,
        designation: getRandomDesignation(emp.department),
      },
    });
    createdEmployees.push(created);
    console.log(`  ✅ Created employee: ${created.name} (${created.employeeId})`);
  }

  // Create 30 days of attendance records
  console.log('\n📅 Creating attendance records...\n');
  const today = new Date();

  for (const emp of createdEmployees) {
    for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
      const date = new Date(today);
      date.setDate(date.getDate() - dayOffset);

      // Skip weekends
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) continue;

      // Determine status (85% present, 10% absent, 5% half day)
      const rand = Math.random();
      let status: AttendanceStatus;
      let checkIn: Date | null = null;
      let checkOut: Date | null = null;

      if (rand < 0.85) {
        status = 'PRESENT';
        checkIn = new Date(date);
        checkIn.setHours(8 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 30), 0, 0);
        checkOut = new Date(date);
        checkOut.setHours(17 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 30), 0, 0);
      } else if (rand < 0.95) {
        status = 'ABSENT';
      } else {
        status = 'HALF_DAY';
        checkIn = new Date(date);
        checkIn.setHours(9, Math.floor(Math.random() * 30), 0, 0);
        checkOut = new Date(date);
        checkOut.setHours(13, Math.floor(Math.random() * 30), 0, 0);
      }

      const attendanceDate = new Date(date);
      attendanceDate.setHours(0, 0, 0, 0);

      await prisma.attendance.create({
        data: {
          employeeId: emp.id,
          attendanceDate,
          checkIn,
          checkOut,
          status,
        },
      });
    }
    console.log(`  📊 Created attendance for: ${emp.name}`);
  }

  console.log('\n✨ Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
