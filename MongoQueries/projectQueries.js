const mongo = require("mongodb").MongoClient;
const url = require("../config/keys").mongURI;
let dbo;
let projectsCollection;
let misCounter;
mongo.connect(
  url,
  { useNewUrlParser: true },
  function(err, db) {
    if (err) {
      console.log(err);
      process.exit(1);
    } else {
      dbo = db.db("MisDB");
      projectsCollection = dbo.collection("projectCollection");
      counter =dbo.collection("misCounter");
    }
  }
);

// add a new project
const addNewProject = async data => {
  try {
    let res = await getNextSequenceValue("trackingId", true).then(res=>res)
                                                      .catch(err=>err)
      console.log(res);
     data.trackingId=res;
    const result = await projectsCollection.insertOne(data);
     if(!result.errmsg){
       return readTrackingId(data.trackingId);
     }
     else{
    data.trackingId=getNextSequenceValue("trackingId", false);
    //console.log(data.trackingId);
    return result
     }}
    catch (e) {
    
    console.log("error :" + e);
    data.trackingId=getNextSequenceValue("trackingId", false);
    //console.log(data.trackingId);
    return e;
  }
};

//tracking id incrementer
const getNextSequenceValue = async(sequenceName , inc) => {
 try{ let sequenceDocument = await counter.findOneAndUpdate({"_id": sequenceName },
     inc?{$inc:{"sequence_value":1}}:{$inc:{"sequence_value": -1}},
     {upsert:true, returnNewDocument : true }
  );
  let count=sequenceDocument.value.sequence_value.toString();
  // console.log(count.length);
   if(count.length<4)
   {  
     let zero="";
     for(let i=count.length; i<4;i++)
      zero="0"+zero;
      return "JAVA"+zero+count;
   }
   else
    return "JAVA"+count ;
}
catch (e) {
  console.log("err"+ e);
  return  null;
}
}

//all details about an item
const readTrackingId = async data => {
  try {
    //console.log(data);
    const result = await projectsCollection.findOne({"trackingId": data});
    return result;
  } catch (e) {
    return e;
  }
};
//read all details about a project
const readProject = async data => {
  try {
    console.log(data);
    const result = await projectsCollection.find({ "projectName": data }).sort({"trackingId":1}).toArray();
    //console.log(result);
    return result;
  } catch (e) {
    console.log("error :" + e);
    return e;
  }
};

//add an item in existing project
const updateItem = async data => {
  try {
    const {trackingId } = data;
    //console.log(projectItems, projectName);
    const result = await projectsCollection.updateOne(
      { trackingId: trackingId },{$set:data}
    );
    //console.log(result);
    if (result.errmsg) {
      return result;
    } else {
      return readTrackingId(data.trackingId);
    }
  } catch (e) {
    console.log("error :" + e);
    return e;
  }
};

const allProject = async data => {
  try {
    //console.log(data);
    const result = await projectsCollection.find({}).sort({trackingId:1}).toArray();
    // console.log(result);
    return result;
  } catch (e) {
    console.log("error :" + e);
    return e;
  }
};

const removeProject = async data => {
  try {
    //console.log(data);
    const result = await projectsCollection.remove({})
    // console.log(result);
    return result;
  } catch (e) {
    console.log("error :" + e);
    return e;
  }
};

module.exports = {
  readTrackingId,
  addNewProject,
  updateItem,
  readProject,
  allProject,
  removeProject
};
