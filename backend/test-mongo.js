const mongoose = require('mongoose');
const uri = "mongodb://gautam4300:gautam4300_@ac-zrm1hsp-shard-00-02.g4npokq.mongodb.net:27017,ac-zrm1hsp-shard-00-00.g4npokq.mongodb.net:27017,ac-zrm1hsp-shard-00-01.g4npokq.mongodb.net:27017/interview_platform?ssl=true&replicaSet=atlas-9dsv8z-shard-0&authSource=admin&appName=Cluster-GG43&retryWrites=true&w=majority";

mongoose.connect(uri)
  .then(() => {
    console.log("SUCCESSFULLY CONNECTED WITH CLASSIC URI");
    process.exit(0);
  })
  .catch(err => {
    console.error("CONNECTION FAILED:", err);
    process.exit(1);
  });
