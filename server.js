const express = require('express');

const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('express-flash')
const logger = require('morgan')
const connectDB = require('./config/database')
const mainRoutes = require('./routes/main')


const app = express()

//Use .env file in config folder
require('dotenv').config({ path: './config/.env' })

// Passport config
require('./config/passport')(passport)


//Connect To Database
connectDB()

//Static Folder
app.use(express.static('public'))

//Body Parsing
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//Logging
app.use(logger('dev'))

// Setup Sessions - stored in MongoDB
app.use(
	session({
		secret: 'keyboard cat',
		resave: false,
		saveUninitialized: false,
		store: new MongoStore({ mongooseConnection: mongoose.connection }),
	})
)

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//Use flash messages for errors, info, ect...
app.use(flash())



//Setup Routes For Which The Server Is Listening
app.use('/', mainRoutes)





const PORT = process.env.PORT || 5000
//Server Running
app.listen(PORT, () => {
	console.log(`Server is running in port ${PORT}`)
})
