const express = require('express');

const db = require('./data/dbConfig.js');

const server = express();

server.use(express.json());

//Object model: {name: "Account", budget: 10.00}

//POST (Create)
server.post("/", async (req,res) =>{
  try{
    const acct = req.body;
    const created = await db("accounts").insert(acct);
    res.status(200).json(created);
  }catch(err){
    res.status(500).json({message: "There was an error adding the data", error: err});
  }
})

//GET (Read)
server.get("/", async (req,res) => {
  try{
    const accts = await db.select("*").from("accounts");
    res.status(200).json(accts);
  }catch(err){
    res.status(500).json({message: "There was an error fetching the data", error: err});
  }
})

server.get("/:id", async (req,res) => {
  try{
    const {id} = req.params;
    const acct = await db.select("*").from("accounts").where({id});
    acct.length
      ? res.status(200).json(acct)
      : res.status(400).json({message: "Account ID not valid"});
  }catch(err){
    res.status(500).json({message: "Error getting data", error: err});
  }
})

//PUT (Update)
server.put("/:id", async (req,res) =>{
  try{
    const newData = req.body;
    const updated = await db("accounts").where({id: req.params.id}).update(newData);
    if (req.body.name && !isNaN(req.body.budget)){ 
      
      res.status(200).json();
    } else {
      res.status(404).json({message: "Please include the account name and budget in your request"});
    }
  }catch(err){
    res.status(500).json({message: "Error updating data", error: err});
  }
})

//DELETE
server.delete("/:id", async (req,res) => {
  try{
    const delCount = await db('accounts').where({id: req.params.id}).del();
    res.status(200).json({message: `Deleted ${delCount} records`});
  }catch(err){
    res.status(500).json({message: "There was an error deleting the item", error: err});
  }
})


module.exports = server;