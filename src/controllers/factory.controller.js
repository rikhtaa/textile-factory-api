const Factory = require("../models/Factory")

async function createFactory(req, res){
  const factory = await Factory.create(req.body)
  res.status(201).json(factory);
}

async function getFactory(req, res){
    const allFactories = await Factory.find()
    res.status(201).json(allFactories)
}
async function deleteFactory(req,res){
  const { id } = req.params
  const deleteFactory = await Factory.findByIdAndDelete(id)
  res.status(204).json({ message: 'Factory deleted', deleteFactory });
}

module.exports = {createFactory, getFactory, deleteFactory}