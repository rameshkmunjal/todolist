const appConfig=require('./../config/appConfig');
//---------------------------function definition-------------------------------------------------------------
let requestIpLogger=(req, res, next)=>{
    let remoteIp=req.connection.remoteAddress+'://'+req.connection.remotePort;
    let realIp=req.headers['X-REAL-IP'];
    console.log(remoteIp+" : "+realIp);

    if(req.method==='OPTIONS'){
        var headers= {};
        headers["Access-Control-Allow-Origin"]="*";
        headers["Access-Control-Allow-Methods"]="POST, GET,  PUT, DELETE, OPTIONS";
        headers["Access-Control-Allow-Credentials"]=false;
        headers["Access-Control-Max-Age"]=86400;
        headers["Access-Control-Allow-Headers"]="X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
        res.writeHead(200, headers);
        res.end();
    }else{
        res.header("Access-Control-Allow-Origin", appConfig.allowedCorsOrigin);
        res.header("Access-Control-Allow-Methods" , "POST, GET,  PUT, DELETE, OPTIONS");
        res.header("Access-Control-Allow-Headers" , "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
        next();
    }
}//function ended
//----------------------------function definitions ended----------------------------------------------------------
//exporting function
module.exports={
    logIp:requestIpLogger
}