const dns = require('dns');
// Explicitly use Google & Cloudflare IPv4 DNS servers
dns.setServers(['8.8.8.8', '1.1.1.1']);

const mongoose = require('mongoose');

const uri = "mongodb+srv://ypraveenraj1908_db_user:c952OIe9VBvPgAdz@cluster0.tfbnzk.mongodb.net/interviewx?retryWrites=true&w=majority";

console.log('Testing Atlas connection with Google DNS...');

mongoose.connect(uri)
  .then(() => {
    console.log('SUCCESS: Connected to MongoDB Atlas!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Atlas Error:', err);
    process.exit(1);
  });
