// Import Libraries
const path = require('path'); // Path for routings
const express = require('express'); // The Framework
const bodyParser = require('body-parser'); // Body Parse to use req.body

// Import Error Controller for both 404 & 500 
const errorController = require('./controllers/error');

// Import DataBase connector
const sequelize = require('./util/database');

// Create an app and make it be an express app
const app = express();

// Set a global configuration value (name, value)
app.set('view engine', 'ejs'); //Make EJS the default view engine
app.set('views', 'views'); // Make the folder where EJS can take the templates


// Importing Routes as "Data" because it can have differente paraments and functions, also the routes
const noAuthRoutes = require('./routes/no-auth');
const accountRoutes = require('./routes/account');
const adminRoutes = require('./routes/admin');
const dashboardRoutes = require('./routes/dashboard');

// User Body Parser (use for all the req.body don't do the whole code)
app.use(bodyParser.urlencoded({extended: false}));

// Use Public Files
app.use(express.static(path.join(__dirname, 'public')));

// Using the Routes
app.use(noAuthRoutes)
app.use('/account-setup', accountRoutes)
app.use('/admin', adminRoutes)
app.use(dashboardRoutes)

// 404
app.use(errorController.get404Page);

// Sync database
sequelize
.sync()
.then(result => {
  app.listen(80);
})
.catch(err => {
  console.log(err)
});

// Run the App over the port 80 >> default >> localhost/