const mongodbStore = require("connect-mongodb-session");

function sessionStore(session) {
  const MongoDBStore = mongodbStore(session);

  const sessionStore = new MongoDBStore({
    uri: "mongodb://127.0.0.1:27017",
    databaseName: "auth-demo",
    collection: "sessions",
  });

  sessionStore;
}

module.exports = {
  sessionKey: session,
};
