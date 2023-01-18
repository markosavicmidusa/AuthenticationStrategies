//#region npm modules 
const express = require('express')
//#endregion

//#region initializations
const app = express()
//#endregion

//#region Functions

// initialization of global middleware
const middlewareGlobal = (req,res,next) => {
    // We need to register this global middleware on the express app. Like: app.use(middlewareGlobal) 
    // we can add custom properties and use them in the next middleware
    req.customProperty= 'Mila i Dunja'
    console.log('Middleware global function')
    // error simulation
    // const errorObj = new Error('This is a error')
    // next(errorObj);

    next()
}

// middleware 2
const middleware1 = (req,res,next) =>{
    console.log(req.customProperty)
    console.log('Middleware 1 function')
    // reasign custom property
    req.customProperty = 'Mila and Dunja Savic'
    next()
}
// error middleware must be on end of ALL middlewares

const errorHandler = (err,req,res,next) => {
    // We will simulate o from the middleware1
    // We need to register it with app.use(errorMiddleware)
    console.log('Error Handler')
    if(err){
       res.send('<h1>This is the Error</h1>')
    }
}


//#endregion


app.use(middlewareGlobal)
app.use(errorHandler)

app.get('/', middleware1, (req,res,next) =>{
    console.log(req.customProperty)
    res.send({success: true})
})


// starting the Server
app.listen(3000, () => console.log('Running on port:3000...'))