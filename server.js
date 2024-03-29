require('dotenv').config();
const express = require('express');
const layouts = require('express-ejs-layouts');
const app = express();
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('./config/ppConfig');
const axios = require('axios');
const apiKey = process.env.NP_API_KEY;

// environemnt variables
SECRET_SESSION = process.env.SECRET_SESSION;
// console.log('>>>>>>>', SECRET_SESSION);

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(layouts);
app.use(express.urlencoded({ extended: false }));
app.use(flash());            // flash middleware
app.use(session({
  secret: SECRET_SESSION,    // What we actually will be giving the user on our site as a session cookie
  resave: false,             // Save the session even if it's modified, make this false
  saveUninitialized: true    // If we have a new session, we save it, therefore making that true
}));

// add passport
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log(res.locals);
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});

app.get("/", (req, res) => {
  res.render('index');
})

app.get('/test', (req, res) => {
  axios.get(`https://developer.nps.gov/api/v1/parks?limit=500&parkCode=zion&api_key=${apiKey}`)
    .then(response => {
      console.log('response', response.data.data[0]);
    })
  res.render('test');
})

app.use('/auth', require('./controllers/auth'));
app.use('/park', require('./controllers/park'));
app.use('/profile', require('./controllers/profile'));
app.use('/search', require('./controllers/search'));
app.use('/result', require('./controllers/result'));

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🎧 You're listening to the smooth sounds of port ${PORT} 🎧`);
});

module.exports = server;
