const LoomManagement = require("../models/LoomManagement");

async function create(req,res){
 const loom = await LoomManagement.create(req.body)
 res.status(204).json(loom)
}

async function list(req,res){
    const looms = await LoomManagement.find()
    res.json(looms)
}

async function deleteLoom(req, res){
    await LoomManagement.findByIdAndDelete(req.params.id)
    res.status(204).send()
}

async function update(req,res){
    const loom = await LoomManagement.findByIdAndUpdate(req.params.id, req.body, {new: true})
    if(!loom) return res.status(404).json({message: "not found"})
    res.json(loom)
}

async function getLoom(req,res){
    const loom = await LoomManagement.findById(req.params.id)
    if(!loom) return res.status(404).json({message: "not found"})
    res.json(loom)
}

module.exports = {create, list, deleteLoom, update, getLoom}