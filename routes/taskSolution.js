var express = require("express");
var router = express.Router();
const { mongodb, dbName, dbUrl, MongoClient } = require("../dbConfig");
const { mongoose, usersModel } = require("../dbTaskSolution");

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


//send solution to dbTaskSolution
router.post("/sendTaskSolution", async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let data = await jwtDecode(token);
    const body = {
      email: data.email,
      task: req.body.task,
      taskSolution: req.body.taskSolution,
      batch: data.batch
    };
    let newUser = await usersModel.create(body);
    res.send({
      statusCode: 200,
      message: "Task Added Successfully",
    });
  } 

 catch (error) {
    console.log(error);
    res.send({ statusCode: 200, message: "Internal Server Error", error });
  }
});

router.get("/getStudentTaskData", async (req, res) => {
  try {
    let newUser = await usersModel.find();
    res.send({
      statusCode: 200,
      data:newUser
    });
  } catch (error) {
    console.log(error);
    res.send({ statusCode: 401, message: "Internal Server Error", error });
  }
});

router.get('/updateMarksNew/:id',async(req,res)=>{
    try {
      let user = await usersModel.findOne({_id:mongodb.ObjectId(req.params.id)})
      console.log(user)
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

  router.put('/updateMarksNew/:id',async(req,res)=>{
    try {
      let user = await usersModel.findOne({_id:mongodb.ObjectId(req.params.id)})
      console.log(user)
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

  router.get("/block/:eTask", async (req, res) => {
    try {
        let token = req.headers.authorization.split(" ")[1];
        let data = await jwtDecode(token);
      let newUser = await usersModel.find({
        "email": data.email,
        "task": req.params.eTask
      });
      res.send({
        statusCode: 200,
        data:newUser[0]
      });
    } catch (error) {
      console.log(error);
      res.send({ statusCode: 401, message: "Internal Server Error", error });
    }
  });
  
module.exports = router;
