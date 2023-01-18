//#region // npm modules 
const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const mongoose = require('mongoose')
const passport = require('passport')
const { hashSync, compareSync } = require('bcrypt')
const cors = require('cors')
const jwt = require('jsonwebtoken')

// node built in modules
const path = require('path')
const UserModel = require('./config/userModel')
require('dotenv').config()
//#endregion

//#region  // ! configuration of modules

const app = express()

//#region  // ! Session-setup

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.DB_STRING, collectionName: 'sessions'}),
    cookie: {
        maxAge: 1000 * 24 * 60 * 60 
    }
}))

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(cors())
app.set('view engine','ejs')
app.use(express.static(path.join(__dirname, 'public')))
// conecting to our database
mongoose.set('strictQuery', true)
mongoose.connect(process.env.DB_STRING)

//#endregion


// Passport
require('./config/passport')
require('./config/passport-jwt')
require('./config/passport-google')
app.use(passport.initialize())
app.use(passport.session())




// middleware function for oauth protected route
function isLoggedIn(req,res, next){
    req.user ? next() : res.sendStatus(401)
}


//#region // ! GET
app.get('/', (req,res,next) => {
       res.render('home')
})
app.get('/login', (req,res,next) => {
    res.render('login')
})
app.get('/login-jwt', (req,res,next) => {
    res.render('login-jwt')
})
app.get('/login-success', (req, res, next) => {
    res.send('<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>');
})
app.get('/login-failure', (req, res, next) => {
    res.send('<p>Error</p><p>You have not been authorized</p><a href="/">Go to home page</a>')
})
app.get('/register', (req,res,next) => {
    res.render('register')
})
app.get('/register-jwt', (req,res,next) => {
    res.render('register-jwt')
})
app.get('/protected-route', (req,res,next) => {
    
    if(req.isAuthenticated()) {
        res.send('Protected')
    } else {
        res.status(401).send({
            msg: 'Unauthorized'
        })
    }
})
app.get('/protected-route-jwt', passport.authenticate('jwt', { session: false }), (req,res,next) => {
    res.send({
        success: true,
        data: 'Data from the protected-route-jwt'
    })
})
app.get('/protected-route-oauth', isLoggedIn, (req, res, next) => {
    
    console.log(req.isAuthenticated())
    
       res.send({
        success: true,
        message: 'The user has been authenticated !'
       })

})
// LOGOUT
app.get('/logout', (req, res, next) => {
    req.logout()
    res.redirect('/home')
})
//#endregion

//#region // ! POST
app.post('/register', (req,res,next) => {
    const user = new UserModel({
        username: req.body.username,
        password: hashSync(req.body.password, 10)
    })
    user.save().then(user => console.log(user))
    res.send({
        user: user.username,
        password: user.password,
        success: true
    })
})
app.post('/register-jwt', (req,res,next) => {
    const userJwt = new UserModel({
        username: req.body.username,
        password: hashSync(req.body.password, 10)
    })
    userJwt.save().then(userJwt => {
        res.send({
            success: true,
            userJwt: userJwt.username,
            password: userJwt.password
        })
    }).catch(err =>{
        res.send({
            success: false,
            message: 'ERROR -> Unsuccessful registration',
            err
        })
    })
    
})
app.post('/login', passport.authenticate('local', { successRedirect: '/login-success' }))
app.post('/login-jwt', (req,res,next) => {

    console.log('login-jwt')
    //console.log(req.body.username)

    UserModel.findOne({username: req.body.username}).then(user => {
        
        if(!user){
            return res.status(401).send({
                success: false,
                message: 'User not found'
            })
        }
        if(!compareSync(req.body.password, user.password)){
            return res.status(401).send({
                success: false,
                message: 'Incorrect password'
            })
        }

        const payload = {
            sub: user._id,
            user: user.username
        }
    
        const secret = 'secretPrivateKey'
        const token = jwt.sign(payload, secret, {expiresIn: '1d'})
    
        return res.status(200).send({
            success: true,
            message: 'Successfully',
            expiresIn: '1d',
            token: 'Bearer ' + token
        })

    })
})
//#endregion

//#region ! GoogleOAuth
   
app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login-failure', successRedirect: '/protected-route-oauth'}));

//#endregion

app.listen(3000, (req,res, next) =>{
    console.log('Listening on the port 3000')
})