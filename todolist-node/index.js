//importing packages
const express=require('express');
const app=express();
const mongoose=require('mongoose');
const http=require('http');
const fs=require('fs');
const bodyParser=require('body-parser');
//importing middlewares
const globalErrorMiddleware=require('./middlewares/appErrorHandler');
//importing files
const appConfig=require('./config/appConfig');
const socketLib=require('./libs/socketLib');
//------------------------------CORS--------------------------------------------------------------
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    next();
});
//--------------------------------------------------------------------------------------------------
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(globalErrorMiddleware.errorHandler);
//------------importing directories of routes and models-----------------
const routePath='./routes';
const modelPath='./models';
//-----------------including all model files using loop-------------------

fs.readdirSync(modelPath).forEach(function(file){
    if(~file.indexOf('.js')){
        require(modelPath+'/'+file);
    }
})

//----------------including all route files using loop--------------------
fs.readdirSync(routePath).forEach(function(file){
    if(~file.indexOf('.js')){
        let route=require(routePath+'/'+file);
        route.setRouter(app);
    }
})
//---------------------------------------------------------------------------
app.use(globalErrorMiddleware.notFoundHandler);
//----------------------------------------------------------------------------
const server = http.createServer(app);
const socketServer = socketLib.setServer(server);

server.listen(3000);
server.on('listening', onListening);
server.on('error', onError);

function onListening(){
    console.log("server is listening");
    let db=mongoose.connect(appConfig.db.uri, {useNewUrlParser:true})
}

function onError(){
    console.log("Error happened in connecting with server");
}
//---------------------------------------------------------------------------
mongoose.connection.on('error', function(err){
    console.log(err);
})

mongoose.connection.on('open', function(err){
    if(err){
        console.log("some error happened in mongoose connection");
    } else {
        console.log("mongoose connection opened successfully");
    }
})
//------------------------------------------------------------------------------