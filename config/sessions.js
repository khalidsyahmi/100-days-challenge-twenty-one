const mongodbStore = require("connect-mongodb-session");

//store function
function createSessionStore(session) { // session parameter //the package in app.js
  const MongoDBStore = mongodbStore(session);

  const sessionStore = new MongoDBStore({
    uri: "mongodb://127.0.0.1:27017",
    databaseName: "auth-demo",
    collection: "sessions",
  });

  return sessionStore;
}

//function session attach metadata
function createSessionHeader(sessionStore){ //store parameter
  return{
      secret: "super-secret",
      resave: false,
      saveUninitialized: false,
      store: sessionStore,
      cookie: {
        maxAge: 2 * 24 * 60 * 60 * 1000,
      },
  }
}

module.exports = {
  sessionKey: createSessionStore,
  headerKey: createSessionHeader
};






