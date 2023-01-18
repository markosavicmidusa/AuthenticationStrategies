const passport = require('passport')
const UserModel = require('./userModel')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

// Verification part
const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'secretPrivateKey'
}
const strategy = new JwtStrategy(options, ( payload, done ) => {

    UserModel.findOne({_id: payload.sub})
    .then(user => {
        if(user){
            return done(null, user)
        }else{
            return done(null, false)
        }
    })
    .catch(err => done(err, null))
})

passport.use(strategy)

