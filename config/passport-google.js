const userModelOAuth= require('./userModelOAuth')
const passport = require('passport')
const fs = require('fs')

var GoogleStrategy = require('passport-google-oauth20').Strategy;

require('dotenv').config()

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    
    //console.log(accessToken)
    fs.writeFileSync('accesstoken.txt', accessToken)
    //Find and return or create
    userModelOAuth.findOne({googleId: profile.id}, (err, user) =>{
        if(err)
            return cb(err, null)
        if(!user){
            let newUser = new userModelOAuth({
                googleId: profile.id,
                username: profile.displayName
            })
            newUser.save()
            return cb(null, newUser)
        }else{
            console.log('There is a User', user)
            return cb(null,user)
        }
    })

  }
));

passport.serializeUser(function(user, done) {
    done(null, user.id)
})

passport.deserializeUser(function(id, done){
    userModelOAuth.findById(id, function (err, user){
        done(err, user)
    })
})
