const express = require("express");
const router = express.Router();
const query = require("../../MongoQueries/projectQueries");
const verifyToken = require("./verifyJwt");
const jwt = require("jsonwebtoken");

//@route    POST /api/project/addProject
//@desc     add new project / item
//@access   Private
router.post("/addProject", verifyToken, (req, res) => {
  let returnData = {authData:'', status:'', result:''}
  jwt.verify(req.token, "misJwtKey", (err, authData) => {
    if (err) {
      //console.log("err" + err)
          return res.status(403).json( err );
      } else {
      query.addNewProject(req.body)
      .then((result) => {
          if(result.code)
              throw result;
          returnData.authData = authData;
          returnData.status = 1;
          returnData.result = result;
          return res.status(200).json( returnData );
        })
        .catch((err) => {
         // console.log(err)
           if(err.code===11000)
            { 
              returnData.authData = authData;
              returnData.status = 0;
              returnData.result = "Duplicate Tracking  Id";
             return res.status(400).json(returnData);}
           else
            {  returnData.authData = authData;
              returnData.status = 1;
              returnData.result = "Error with Database contact admin";
             return res.status(400).json(returnData);}
        });
    }
  });
});

//@route    POST /api/project/updateProjectItem
//@desc     Update a project based on tracking id
//@access   Private
router.post("/updateProjectItem", verifyToken, (req, res) => {
  let returnData = {authData:'', status:'', result:''}
  jwt.verify(req.token, "misJwtKey", (err, authData) => {
    if (err) {
      return res.status(403).json( err );
    } else {
      query.updateItem(req.body)
        .then(result => {
          if(result==null)
          throw result;
          returnData.authData = authData;
          returnData.status = 1;
          returnData.result = result;
          return res.status(200).json(returnData);
        })
        .catch(err => {
          // console.log(err)
          if(err===null)
          {   returnData.authData = authData;
              returnData.status = 2;
              returnData.result = "Not data with such initials exists";
             return res.status(400).json(returnData);
          }
          else{
          returnData.authData = authData;
          returnData.status = 1;
          returnData.result = "Error with Database contact admin";
          return res.status(400).json(returnData);}
        });
    }
  });
});

//@route    POST /api/project/getProjectByName
//@desc     Project by name route
//@access   Private
router.post(`/getProjectByName`, verifyToken, (req, res) => {
  let returnData = {authData:'', status:'', result:''}
  jwt.verify(req.token, "misJwtKey", (err, authData) => {
    if (err) {
      return res.status(403).send( err );
    } else {
        query.readProject(req.body.projectName)
        .then(result => {
          
          if(result.length===0|| !result)
            throw result
          returnData.authData = authData;
          returnData.status = 1;
          returnData.result = result;
          return res.status(200).json(returnData);
        })
        .catch(err =>  {
          // console.log(err)
          if(err.length===0)
          {   returnData.authData = authData;
              returnData.status = 2;
              returnData.result = "Not data with such initials exists";
             return res.status(400).json(returnData);
          }
          else{
          returnData.authData = authData;
          returnData.status = 1;
          returnData.result = "Error with Database contact admin";
          return res.status(400).json(returnData);}
        });
    }
  });
});


//@route    GET /api/project/getProjectById/:id
//@desc     Project by tracking id route
//@access   Private
router.get(`/getProjectById/:id`, verifyToken, (req, res) => {
  let returnData = {authData:'', status:'', result:''}
  jwt.verify(req.token, "misJwtKey", (err, authData) => {
    if (err) {
      return res.status(403).send( err );
    } else {
      query.readTrackingId(req.params.id)
        .then(result => {
          if(!result)
          throw result;
          returnData.authData = authData;
          returnData.status = 1;
          returnData.result = result;
          return res.status(200).json(returnData);
        })
        .catch(err => {
          // console.log(err)
          if(err===null)
          {   returnData.authData = authData;
              returnData.status = 2;
              returnData.result = "Not data with such initials exists";
             return res.status(400).json(returnData);
          }
          else{
          returnData.authData = authData;
          returnData.status = 1;
          returnData.result = "Error with Database contact admin";
          return res.status(400).json(returnData);}
        });
    }
  });
})

//@route    GET /api/project/allProjects
//@desc     All projects route
//@access   Private
router.get(`/allProjects`, verifyToken, (req, res) => {
  let returnData = {authData:'', status:'', result:''}
  jwt.verify(req.token, "misJwtKey", (err, authData) => {
    if (err) {
      return res.status(403).send( err );
    } else {
      query.allProject()
        .then(result => {
          if(result.length===0|| !result)
            throw result;
          returnData.authData = authData;
          returnData.status = 1;
          returnData.result = result;
          return res.status(200).json(returnData);
        })
        .catch(err => {
          // console.log(err)
          if(err.length===0)
          {   returnData.authData = authData;
              returnData.status = 0;
              returnData.result = [];
             return res.status(200).json(returnData);
          }
          else{
          returnData.authData = authData;
          returnData.status = 1;
          returnData.result = "Error with Database contact admin";
          return res.status(400).json(returnData);}
        });
    }
  });
});

router.get(`/removeProjectByMe`, verifyToken, (req, res) => {
  let returnData = {authData:'', status:'', result:''}
  jwt.verify(req.token, "misJwtKey", (err, authData) => {
    if (err) {
      return res.status(403).send( err );
    } else {
      query.removeProject()
        .then(result => {
          if(result.length===0|| !result)
            throw result;
          returnData.authData = authData;
          returnData.status = 1;
          returnData.result = result;
          return res.status(200).json(returnData);
        })
        .catch(err => {
          // console.log(err)
          if(err.length===0)
          {   returnData.authData = authData;
              returnData.status = 0;
              returnData.result = [];
             return res.status(200).json(returnData);
          }
          else{
          returnData.authData = authData;
          returnData.status = 1;
          returnData.result = "Error with Database contact admin";
          return res.status(400).json(returnData);}
        });
    }
  });
});

module.exports = router;
