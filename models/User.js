const userCollection = {
  bsonType: "object",
  properties: {
    username: { bsonType: "string" },
    password: { bsonType: "string" },
    role: { bsonType: "string" },
  }
};

module.exports = userCollection;
