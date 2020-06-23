const express = require('express')
const router = express.Router()
const taskController = require('../controlers/tasksController')
const auth = require('../middleware/auth')
const {check} = require('express-validator')

//Create Task
//api/tasks
router.post('/',
    auth,
    [
        check('name', 'Name is required').not().isEmpty(),
        check('project', 'Project is required').not().isEmpty()
    ],
    taskController.createTask
)

//Get task by porject
router.get('/',
    auth,
    taskController.getTasks
)

//Update task
router.put('/:id',
    auth,
    taskController.updateTask
)

//Delete tasj
router.delete('/:id',
    auth,
    taskController.deleteTask
)

module.exports = router