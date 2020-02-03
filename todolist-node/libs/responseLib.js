//generate response with the help of params
let generate=(err, message, status, data)=>{
    let response={
        error:err,
        message:message,
        status:status,
        data:data
    }
    return response;
}
//function - exported
module.exports={
    generate:generate
}