const Project = require('../models/Project')
const {validationResult} = require('express-validator')

exports.createProject = async (req, res) => {

    //Check errors
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    try{
        //Create a new project
        const project = new Project(req.body)

        //Save creator with JWB
        project.creator = req.user.id

        //Save project
        project.save()
        res.json(project)

    } catch(err){
        console.log(err)
        res.status(500).send('An error ocurred')
    }
}


//Get all project from current user
exports.getProjects = async (req, res) =>{
    try{
        const projects = await Project.find({creator: req.user.id}).sort({created: -1})
        res.json({projects})
    } catch(err){
        console.log(err)
        res.status(500).send('An error ocurred')
    }
}


//Update project
exports.updateProjects = async (req, res) =>{
    //Check error
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    //Extract project info
    const {name} = req.body
    const newProject = {}

    if(name){
        newProject.name = name
    }

    try{
        //Check id
        let project = await Project.findById(req.params.id)

        //if project does not exist
        if(!project){
            return res.status(404).json({msg: 'Project not found'})
        }

        //Verify project creator
        if(project.creator.toString() !== req.user.id){
            return res.status(401).json({msg: 'Permission deny'})
        }

        //Update project
        project = await Project.findByIdAndUpdate({_id: req.params.id}, {$set: newProject}, {new: true})

        res.json({project})

    } catch(err){
        console.log(err)
        res.status(500).send('Server error')
    }
}


//Delete project by Id
exports.deleteProject = async (req, res) =>{
    try{
        //Check id
        let project = await Project.findById(req.params.id)

        //if project does not exist
        if(!project){
            return res.status(404).json({msg: 'Project not found'})
        }

        //Verify project creator
        if(project.creator.toString() !== req.user.id){
            return res.status(401).json({msg: 'Permission deny'})
        }

        //Delete project
        await Project.findOneAndRemove({_id: req.params.id})
        res.json({msg: 'Project deleted'})
        
    } catch(err){
        console.log(err)
        res.status(500).send({msg: 'Server error'})
    }
}