const mongoose = require('mongoose');
const dns = require('dns');

// Force IPv4 for Windows DNS resolution
try {
  dns.setDefaultResultOrder('ipv4first');
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {}

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI;
    if (!connStr || connStr.includes('ENTER_YOUR_PASSWORD')) {
      console.log('⚠️ MONGODB_URI not configured in backend/.env');
      return;
    }
    
    const conn = await mongoose.connect(connStr, {
      family: 4,
      serverSelectionTimeoutMS: 5000
    });
    console.log(`🍃 MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Atlas Connection Error: ${error.message}`);
  }
};

module.exports = connectDB;
