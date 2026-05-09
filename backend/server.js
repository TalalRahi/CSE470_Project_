const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const playerRoutes = require('./routes/playerRoutes');
const matchRoutes = require('./routes/matchRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const trialRoutes = require('./routes/trialRoutes');
const scoutRoutes = require('./routes/scoutRoutes');
const achievementRoutes = require('./routes/achievementRoutes');
const trendRoutes = require('./routes/trendRoutes');

dotenv.config();
connectDB();

const app = express();

// CORS - Allow all origins
app.use(cors({
  origin: '*',
  credentials: true,
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Test endpoint
app.post('/api/test', (req, res) => {
  console.log('TEST ENDPOINT HIT');
  console.log('Body:', req.body);
  res.json({ message: 'Test works', data: req.body });
});

// Auth routes
app.use('/api/auth', authRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/trials', trialRoutes);
app.use('/api/scouts', scoutRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/trends', trendRoutes);

app.get('/', (req, res) => {
  res.send('API running 🚀');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server on port ${PORT} 🚀`);
});