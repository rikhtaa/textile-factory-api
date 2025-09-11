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
async function updateFactory(req, res){
    const {id} = req.params
    const {name} = req.body
        if (!name || name.trim().length < 2) {
      return res.status(400).json({ error: 'Valid name required (min 2 characters)' });
    }
    const updatedFactory = await Factory.findByIdAndUpdate(id, {name: name.trim() })
    res.status(200).json({message: "Factory name updated", factory: updatedFactory})
}


module.exports = {createFactory, getFactory, deleteFactory, updateFactory}