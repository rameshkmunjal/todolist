//this file defines configurations of app
let appConfig= {};

appConfig.port=3000;
appConfig.apiVersion='/api/v1';
appConfig.env='env';
appConfig.allowedCorsOrigin='*';
appConfig.db={
    uri:'mongodb://127.0.0.1:27017/taskDB'
}

module.exports={
    port:appConfig.port,
    apiVersion:appConfig.apiVersion,
    env:appConfig.env,
    allowedCorsOrigin:appConfig.allowedCorsOrigin,
    db:appConfig.db
}