const Factory = require("../models/Factory")

async function createFactory(req, res){
  const factory = await Factory.create(req.body)
  res.status(201).json(factory);
}

module.exports = {createFactory}