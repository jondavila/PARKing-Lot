require('dotenv').config();
const express = require('express');
const layouts = require('express-ejs-layouts');
const app = express();
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('./config/ppConfig');
const isLoggedIn = require('./middleware/isLoggedIn');
const axios = require('axios');
const db = require('./models');
const apiKey = process.env.API_KEY




// environemnt variables
SECRET_SESSION = process.env.SECRET_SESSION;
// console.log('>>>>>>>', SECRET_SESSION);

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(layouts);
app.use(express.urlencoded({extended: false}));

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

// app.get('/', (req, res) => {
//   res.render('index');
// })

app.get("/", (req, res) => {
db.park.findAll({
  order: [
    ['name', 'ASC']
  ]
})
.then(parks => {
  cleanedParks = parks.map(park => park.toJSON());
  let designations = [];
  cleanedParks.forEach(park => {
    if(!designations.includes(park.designation)){
      designations.push(park.designation)
    }
  });
  return res.render('index', {parks: cleanedParks, designations});
  });
})

app.get('/result', (req,res) => {
  return res.render('result')
})

app.post('/result', (req,res) => {
  const parsedCategory = {...req.body};
  console.log(parsedCategory);
  if (parsedCategory.code){
    axios.get(`https://developer.nps.gov/api/v1/parks?limit=500&parkCode=${parsedCategory.code}&api_key=${apiKey}`)
    .then(response => {
      console.log('response data', response.data.data);
      let foundPark = response.data.data; // returns an array with one element
      console.log(foundPark);
      return res.render('result', { data: foundPark });
    })
  } else if (parsedCategory.designation) {
    db.park.findAll({
      where: {
        designation: parsedCategory.designation
      }
    })
    .then(foundParks => {
      const cleanedData = foundParks.map(park => park.toJSON()); // returns an array
      // console.log('found parks', cleanedData);
      return res.render('result', { data: cleanedData });
    })
  }
})

app.get('/park/:parkCode', (req,res) => {
  axios.get(`https://developer.nps.gov/api/v1/parks?limit=500&parkCode=${req.params.parkCode}&api_key=${apiKey}`)
  .then(response => {
    const park = response.data.data[0];
    res.render('park', { park});
  })
  // console.log('req.params.name', req.params.parkCode);
})


app.use('/auth', require('./controllers/auth'));
// app.use('/parks', require('./controllers/parks'))

// Add this above /auth controllers
app.get('/profile', isLoggedIn, (req, res) => {
  const { id, name, email } = req.user.get(); 
  res.render('profile', { id, name, email });
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🎧 You're listening to the smooth sounds of port ${PORT} 🎧`);
});

module.exports = server;
