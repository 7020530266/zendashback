var express = require("express");
var router = express.Router();
const { mongoose, usersModel } = require("../dbWebcode");
const { mongodb, dbName, dbUrl, MongoClient } = require("../dbConfig");
const { render } = require("jade");
const { token } = require("morgan");
const client = new MongoClient(dbUrl);
const {
  hashPassowrd,
  hashCompare,
  createToken,
  jwtDecode,
  validate,
  authenticate,
} = require("../auth");

//create task and send to db
router.post("/sendWebcodeData", async (req, res) => {
  try {
    let newUser = await usersModel.create(req.body);
    res.send({
      statusCode: 200,
      message: "Task Added Successfully",
    });
  } catch (error) {
    console.log(error);
    res.send({ statusCode: 200, message: "Internal Server Error", error });
  }
});


router.get("/getWebcodeData", async (req, res) => {
  try {
    let users = await usersModel.find();
    // console.log(users, "1");
    res.send({
      statusCode: 200,
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.send({ statusCode: 401, message: "Internal Server Error", error });
  }
});

router.get('/getWebData/:id',async(req,res)=>{
  try {
    let user = await usersModel.findOne({_id:mongodb.ObjectId(req.params.id)})
    // console.log(user)
    if(user)
    {
      
      res.send(user)
      }
    else
      res.send({statusCode:400,message:"User does not exists"})
  } catch (error) {
    console.log(error)
    res.send({statusCode:400,message:"Internal Server Error",error})
  }
})

router.put('/updateWebMarks/:id',async(req,res)=>{
  try {
    let user = await usersModel.findOne({_id:mongodb.ObjectId(req.params.id)})
    // console.log(user)
    if(user)
    {
       user.batch = req.body.batch
       user.task =req.body.task
      user.email =req.body.email
      user.taskSolution =req.body.taskSolution
      user.marks =req.body.marks
      await user.save()
      res.send({statusCode:200,message:"User data saved successfully"})
      }
    else
      res.send({statusCode:400,message:"User does not exists"})
  } catch (error) {
    console.log(error)
    res.send({statusCode:400,message:"Internal Server Error",error})
  }
})

module.exports = router;
