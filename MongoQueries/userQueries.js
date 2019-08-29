const mongo = require("mongodb").MongoClient;
const url = require("../config/keys").mongURI;
const bcrypt = require("bcryptjs");

let dbo;
let userDC;

mongo.connect(
  url,
  { useNewUrlParser: true },
  function(err, db) {
    if (err) {
      console.log(err);
      process.exit(1);
    } else {
      dbo = db.db("MisDB");
      userDC = dbo.collection("userCollection");
    }
  }
);

const addNewUser = async data => {
  try {
    const result = await userDC.insertOne(data);
    //console.log(result);
    return result;
  } catch (e) {
    console.log("error :" + e);
    return e;
  }
};

//all details about an item
const readUser = async data => {
  try {
    let { username, password } = data;
    const result = await userDC.findOne({
      username: username
    });
    if (result != null) {
      const match = await bcrypt.compare(password, result.password);
      if (match) {
        return result;
      }
    } else {
      return null;
    }
  } catch (e) {
    console.log("error :" + e);
    return e;
  }
};

module.exports = { readUser, addNewUser };
