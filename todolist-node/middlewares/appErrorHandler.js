const response=require('./../libs/responseLib');

let errorHandler=(err, req, res, next)=>{
    let apiResponse=response.generate(true, 'some Error Occurred', 500, null);
    res.send(apiResponse);
}

let notFoundHandler=(req, res, next)=>{
    console.log("requested route not found - show error - 404");
    let apiResponse=response.generate(true, 'Requested URL not found', 404, null);
    res.status(404).send(apiResponse);
    res.send(apiResponse);
}

module.exports={
    errorHandler:errorHandler,
    notFoundHandler:notFoundHandler
}