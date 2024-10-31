const MongoDbCommmand  = require("../models/mongodb");
const mongoDbCommand = new MongoDbCommmand();
const ObjectId = require('mongodb').ObjectId;
const { getChannel } = require('../helpers/utils/rabbitMQ');

module.exports = {

  createData : async (req, res) =>{
    const { name, address, status, email } = req.body;
    
    try {
      await mongoDbCommand.insertData({
        name: name, 
        address: address,
        status: status
      })

      const channel = await getChannel();
      const emailData = { to: email, subject: 'Welcome!', text: `Hello ${name}, welcome to our service!` };
      channel.assertQueue('email_queue', { durable: true });
      channel.sendToQueue('email_queue', Buffer.from(JSON.stringify(emailData)), { persistent: true });

      res.status(201).json({
        message: "success create user",
        code:201
      })
    } catch (error) {
      res.status(500).json({message: "Internal server error"})
    }
  },

  getAllUser : async (req, res) => {
    try {
      const user = await mongoDbCommand.getAll({
        status:'testing'
      });

      res.status(201).json({
        message:"get all data user",
        data: user.data,
        code:201
      })
      
    } catch (error) {
      res.status(500).json({message: "Internal server error"})
    }
  },

  updateUser : async (req, res) => {
    const { idUser } = req.params;
    try {
      console.log(req.body)

      await mongoDbCommand.updateData({
        _id:new ObjectId(idUser)
      },req.body);

      res.status(200).json({
        message : "update user",
        code:200
      })
      
    } catch (error) {
      res.status(500).json({message: "Internal server error"})
    }
  },

  deleteUser : async (req, res) => {
    const { idUser } = req.params;
    try {
      await mongoDbCommand.deleteUser({
        _id:new ObjectId(idUser)
      });

      res.status(200).json({
        message : "delete user",
        code:200
      })
      
    } catch (error) {
      res.status(500).json({message: "Internal server error"})
    }
  }

}