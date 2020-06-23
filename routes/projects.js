const express = require('express')
const router = express.Router()
const projectsController = require('../controlers/projectsController')
const auth = require('../middleware/auth')
const {check} = require('express-validator')

//Create projects
//api/projects
router.post('/', 
    auth,
    [
        check('name', 'Project name is required').not().isEmpty()
    ],
    projectsController.createProject
)

//Get all projects
router.get('/', 
    auth,
    projectsController.getProjects
)

//Update porject
router.put('/:id',
    auth,
    [
        check('name', 'Project name is required').not().isEmpty()
    ],
    projectsController.updateProjects
)

//Delete project
router.delete('/:id',
    auth,
    projectsController.deleteProject
)

module.exports = router