const Task = require('../models/Tasks')
const Project = require('../models/Project')
const {validationResult} = require('express-validator')

//Create new Task
exports.createTask = async (req, res) =>{
    //Check errors
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    //Check project
    try{
        const {project} = req.body
        const currentProject = await Project.findById(project)
        if(!currentProject){
            return res.status(404).json({msg: 'Projecto not found'})
        }

        //Verify project owner
        if(currentProject.creator.toString() !== req.user.id){
            return res.status(401).json({msg: 'Permission deny'})
        }

        //Create task
        const task = new Task(req.body)
        await task.save()
        res.json({task})

    } catch(err){
        console.log(err)
        res.status(500).send('An error ocurred')
    }

}


//Get all tasks
exports.getTasks = async (req, res) => {
    try{
        //Check project
        const {project} = req.query
        const currentProject = await Project.findById(project)
        if(!currentProject){
            return res.status(404).json({msg: 'Projecto not found'})
        }

        //Verify project owner
        if(currentProject.creator.toString() !== req.user.id){
            return res.status(401).json({msg: 'Permission deny'})
        }

        //Get projects
        const task = await Task.find({project})
        res.json(task)

    } catch(err){
        console.log(err)
        res.status(500).send('An error ocurred')
    }
}


//Update task
exports.updateTask = async (req, res) => {
    try{
        //Check project and task
        const {project, name, state} = req.body

        let currentTask = await Task.findById(req.params.id)

        if(!currentTask){
            return res.status(404).json({msg: 'Task not found'})
        }

        const currentProject = await Project.findById(project)

        //Verify project owner
        if(currentProject.creator.toString() !== req.user.id){
            return res.status(401).json({msg: 'Permission deny'})
        }

        //Create obj
        const newTask = {}

        newTask.name = name
        newTask.state = state

        //Save task
        currentTask = await Task.findOneAndUpdate({_id: req.params.id}, newTask, {new: true})
        res.json({currentTask})

    }catch(err){
        console.log(err)
        res.status(500).send('An error ocurred')
    }
}


//Delete Task
exports.deleteTask = async (req, res) => {
    try{
        //Check project and task
        const {project} = req.query

        let currentTask = await Task.findById(req.params.id)

        if(!currentTask){
            return res.status(404).json({msg: 'Task not found'})
        }

        const currentProject = await Project.findById(project)

        //Verify project owner
        if(currentProject.creator.toString() !== req.user.id){
            return res.status(401).json({msg: 'Permission deny'})
        }

       //Delete task
       await Task.findOneAndRemove({_id: req.params.id})
       res.json({msg: 'Task deleted'})
    } catch(err){
        console.log(err)
        res.status(500).send('An error ocurred')
    }
}