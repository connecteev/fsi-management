const bodyParser = require("body-parser");
const logger = require("morgan");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const cookieParser = require("cookie-parser");
//const serveStatic = require('serve-static');
const config = require("./config/secret");
//const history = require('connect-history-api-fallback')

// const staticFileMiddleware = serveStatic(__dirname + '../../dist');
// app.use(staticFileMiddleware);
// app.use(history());
// app.use(staticFileMiddleware);

//Configure mongoose's promise to global promise
mongoose.promise = global.Promise;

mongoose.connect(config.database, function (err) {
  if (err) console.log(err);
  console.log("Connected to DB");
});

module.exports = function (app, express) {
  // app.use(cors({
  //     origin:['http://localhost:8080'],
  //     credentials: true // enable set cookie
  //   }));

  app.use(cors());
  app.use(logger("dev"));
  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: "false"
    })
  );
  app.use(cookieParser()); // read cookies (needed for auth)

  // Passport does not directly manage your session, it only uses the session.
  // So you configure session attributes (e.g. life of your session) via express
  const sessionOpts = {
    saveUninitialized: true, // saved new sessions
    resave: false, // do not automatically write to the session store
    //store: sessionStore,
    secret: config.secret,
    cookie: {
      httpOnly: true,
      maxAge: 2419200000
    } // configure when sessions expires
  };
  app.use(cookieParser(config.secret))
  app.use(session(sessionOpts))

  app.use(passport.initialize())
  app.use(passport.session())
  // pass the instance of our app to the routes.
  require("./routes/index.js")(app);


  // required for passport
  require("./config/passport")(passport); // pass passport for configuration

};
