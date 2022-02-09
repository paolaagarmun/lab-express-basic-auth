
require('dotenv/config');

require('./db');

const express = require('express');

const hbs = require('hbs');

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require('./config')(app);

// default value for title local
const projectName = 'lab-express-basic-auth';
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;

//sessions
const session = require("express-session");
const MongoStore = require("connect-mongo");
app.use(
    session({
      secret: process.env.SECRET,
      resave: true,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 600000,
        // secure: true
      },
      store: MongoStore.create({
        mongoUrl: "mongodb://localhost/signup-test",
        ttl: 600000,
      }),
    })
  );



// 👇 Start handling routes here
const index = require('./routes/index');
app.use('/', index);

const authRoute = require('./routes/auth');
app.use('/', authRoute)

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);

module.exports = app;

