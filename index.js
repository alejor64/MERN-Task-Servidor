const express = require('express')
const conectDB = require('./config/db')
const cors = require('cors')

//Create Server
const app = express()

//Connect to DB
conectDB()

//Enable CORS
app.use(cors())

//Enable express.json
app.use(express.json({extended: true}))

// App PORT
const PORT = process.env.PORT || 4000

//Import Route
app.use('/api/users', require('./routes/users'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/projects', require('./routes/projects'))
app.use('/api/tasks', require('./routes/tasks'))

//Run App
app.listen(PORT, () => {
    console.log(`Corriendo desde ${PORT}`)
})