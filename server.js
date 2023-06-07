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
const apiKey = process.env.NP_API_KEY;
const mapApiKey = process.env.MAP_API_KEY;




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

// app.get('/', (req, res) => {
//   res.render('index');
// })

app.get("/", (req, res) => {
  res.render('index');
})

app.get("/search", (req, res) => {
  db.park.findAll({
    order: [
      ['name', 'ASC']
    ]
  })
    .then(parks => {
      cleanedParks = parks.map(park => park.toJSON());
      let designations = [];
      cleanedParks.forEach(park => {
        if (!designations.includes(park.designation)) {
          designations.push(park.designation)
        }
      });
      return res.render('search', { parks: cleanedParks, designations });
    })
    .catch(error => {
      console.log('error', error);
      let message = 'Cannot find data. Please try again...';
      res.render('error', { message });
    });
})

app.get('/result', (req, res) => {
  let message = "Search needed to view results. Please return to the home page."
  return res.render('error', { message })
})

app.post('/result', (req, res) => {
  const parsedCategory = { ...req.body };
  console.log(parsedCategory);
  if(!parsedCategory.code && !parsedCategory.designation){
    let message = 'Please input a search request'
    res.render('error', { message });
  } else if (parsedCategory.code) {
    axios.get(`https://developer.nps.gov/api/v1/parks?limit=500&parkCode=${parsedCategory.code}&api_key=${apiKey}`)
      .then(response => {
        let foundPark = response.data.data; // returns an array with one element
        return res.render('result', { data: foundPark });
      })
      .catch(error => {
        console.log('error', error);
        let message = 'Cannot find park. Please try again...';
        res.render('error', { message });
      });
  } else if (parsedCategory.designation) {
    db.park.findAll({
      where: {
        designation: parsedCategory.designation
      },
      order: [
        ['name', 'ASC']
      ]
    })
      .then(foundParks => {
        const cleanedData = foundParks.map(park => park.toJSON()); // returns an array
        // console.log('found parks', cleanedData);
        return res.render('result', { data: cleanedData });
      })
      .catch(error => {
        console.log('error', error);
        let message = `Cannot find parks that match ${parsedCategory.designation}`;
        res.render('error', { message });
      });
  }
})


// app.get('/profile', isLoggedIn, (req, res) => {
//   const { id, name, email } = req.user.get();
//   res.render('profile', { id, name, email });
// });

// app.get('/profile/favorites', isLoggedIn, (req, res) => {
//   const { id, name, email } = req.user.get();
//   db.user.findOne({
//     where: {
//       id: id
//     }
//   })
//     .then(user => {
//       user.getParks()
//         .then(parks => {
//           if (parks.length > 0) {
//             res.render('favorites', { id, name, email, parks })
//           } else {
//             res.render('favorites', { id, name, email, parks: { fullName: 'Go find some parks!' } })
//           }
//         })
//         .catch(error => {
//           console.log('error', error);
//           let message = 'Cannot load parks. Please try again later...';
//           res.render('error', { message });
//         });
//     })
//     .catch(error => {
//       console.log('error', error);
//       let message = 'Cannot find user. Please try again later...';
//       res.render('error', { message });
//     })
// })

// app.get('/profile/remove/:parkCode', isLoggedIn, (req, res) => {
//   db.user.findOne({ where: { id: req.user.id } })
//     .then(user => {
//       db.park.findOne({ where: { parkCode: req.params.parkCode } })
//         .then(park => {
//           user.removePark(park)
//             .then(relationInfo => {
//               res.redirect('/profile/favorites');
//             })
//             .catch(error => {
//               console.log('error', error);
//               let message = 'Cannot add park. Please try again...';
//               res.render('error', { message });
//             });
//         })
//         .catch(error => {
//           console.log('error', error);
//           let message = 'Cannot find park. Please try again...';
//           res.render('error', { message });
//         });
//     })
//     .catch(error => {
//       console.log('error', error);
//       let message = 'Cannot find user. Please try again...';
//       res.render('error', { message });
//     });
// })


// app.post('/profile', isLoggedIn, (req, res) => {
//   // console.log('req.code', req.body.code);
//   // res.json({ message: req.body})
//   db.user.findOne({ where: { id: req.user.id } })
//     .then(user => {
//       db.park.findOne({ where: { parkCode: req.body.code } })
//         .then(park => {
//           user.addPark(park)
//             .then(relationInfo => {
//               res.redirect('/profile');
//             })
//             .catch(error => {
//               console.log('error', error);
//               let message = 'Cannot add park. Please try again...';
//               res.render('error', { message });
//             });
//         })
//         .catch(error => {
//           console.log('error', error);
//           let message = 'Cannot find park. Please try again...';
//           res.render('error', { message });
//         });
//     })
//     .catch(error => {
//       console.log('error', error);
//       let message = 'Cannot find user. Please try again...';
//       res.render('error', { message });
//     });
// })

app.get('/test', (req, res) => {
  res.render('test');
})
app.use('/auth', require('./controllers/auth'));
app.use('/park', require('./controllers/park'));
app.use('/profile', require('./controllers/profile'));


const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🎧 You're listening to the smooth sounds of port ${PORT} 🎧`);
});

module.exports = server;
