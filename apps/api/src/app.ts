import express from 'express';
import cors from 'cors';
import employeeRoutes from './routes/employee.routes';
import attendanceRoutes from './routes/attendance.routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Routes ──────────────────────────────────────────────────────────
app.use('/api/employees', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ─── Error Handler ───────────────────────────────────────────────────
app.use(errorHandler);

export default app;
