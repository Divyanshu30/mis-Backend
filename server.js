const projectData = require("./models/Project");
const userData = require("./models/User");
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const app = express();
const mongo = require("mongodb");
const users = require("./routes/api/users");
const project = require("./routes/api/project");
const port = process.env.PORT || 5000;
const url = require("./config/keys").mongURI;
const misCounter=require('./models/misCounter').misCounter;
const misIntial=require('./models/misCounter').misIntial;
const path =require('path');
let dbo;

allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length, X-Requested-With"
  );
  if ("OPTIONS" === req.method) {
    res.send(200);
  } else {
    next();
  }
};
app.use(allowCrossDomain);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/api/users", users);
app.use("/api/project", project);
app.use(express.static(__dirname +'/dist/mistracking'));
app.get('/*',function (req, res) {
  res.sendFile(path.join(__dirname));
});
app.get('*',function(req,res){
  res.redirect('/')
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//mongo db connectivity and creating or trying to a new create a collection
mongo.MongoClient.connect(
  url,
  { useNewUrlParser: true },
  (err, client) => {
    if (err) {
      console.log(err);
      process.exit(1);
    } else {
      dbo = client.db("MisDB");
      dbo.collection("projectCollection").findOne({}, (err, result) => {
        if (!result) {
          dbo.createCollection(
            "projectCollection",
            {
              validator: { $jsonSchema: projectData }
            },
            (err, res) => {
              if (err) {
                console.log("error in creating project  collection" + err);
                process.exit(1);
              }
              dbo.collection("userCollection").findOne({}, (err, result) => {
              if (!result) {
              dbo.createCollection("userCollection", {
                  validator: { $jsonSchema: userData }
                })
                .then(async result => {
                  console.log("User table created");
                  const salt = bcrypt.genSaltSync(10);
                  const hash = bcrypt.hashSync("amit", salt);
                  let res = await dbo.collection("userCollection").insertOne({ username: "amit", password: hash });
                })
                .catch(err => {
                  console.log("error in creating collection" + err);
                  process.exit(1);  
                });
              }
                else{
              console.log("User table Exists");
              }}
              );
              dbo.collection("misCounter").findOne({}, (err, result) =>
                { 
                  if(!result)
                  {
                    dbo.createCollection("misCounter", {
                      validator: { $jsonSchema: misCounter }
                    })
                    .then(async result => {
                      console.log("MisCounter created");
                       await dbo.collection("misCounter").insertOne(misIntial);
                    })
                    .catch(err => {
                      console.log("error in creating collection" + err);
                      process.exit(1);  
                    });
                     } else { console.log("misCounter Exists"); }
                  });
                
              dbo.collection("projectCollection").createIndex({ trackingId: 1 }, { unique: true });
              console.log("Collection created!");
            }
          );
        } else if (result) {
          console.log("already exists");
        } else {
          console.log("error in creating collection" + err);
          process.exit(1);
        }
      });
    }
  }
);
