const { compareSync, hashSync } = require('bcrypt')
const passport = require('passport');
const UserModel = require('./userModel');
const LocalStrategy = require('passport-local').Strategy;

// TODO: passport.use();

passport.use(new LocalStrategy(
    function (username, password, done){

        UserModel.findOne({ username }, (err,user) => {
            if(err){
                return done(err , null)
            }
            if(!user){
                return done(null, false, {message: 'Incorect username'})
            }
            if(!compareSync(password, user.password)){
                return done(null, false, {message:'Incorect password'})
            }
            
            return done(null, user)
        })

    }
))

passport.serializeUser(function(user, done) {
    done(null, user.id)
})

passport.deserializeUser(function(id, done){
    UserModel.findById(id, function (err, user){
        done(err, user)
    })
})