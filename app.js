const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const authRoutes = require('./routes/auth'); // Pastikan ini diekspor dengan benar
const path = require('path');
const app = express();


// Set EJS sebagai template engine
app.set('view engine', 'ejs');

// Middleware
app.use(bodyParser.urlencoded({ extended: false })); // Tambahkan middleware body-parser
app.use(session({
  secret: 'yourSecretKey', // Ganti dengan kunci rahasia yang kuat
  resave: false,
  saveUninitialized: true
}));

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Middleware untuk memeriksa status login
app.use((req, res, next) => {
  if (!req.session.user && req.path !== '/auth/login' && req.path !== '/auth/register') {
    return res.redirect('/auth/login');
  } else if (req.session.user && req.path === '/') {
    return res.redirect('/auth/profile');
  }
  next();
});

// Routes
app.use('/auth', authRoutes); // Pastikan authRoutes adalah router yang valid

app.get('/', (req, res) => {
  if (req.session.user) {
    return res.redirect('/auth/profile');
  } else {
    return res.redirect('/auth/login');
  }
});


// Menjalankan Server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});