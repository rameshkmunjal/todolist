const check=require('./checkLib');
const redis=require('redis');
const host="18.188.89.46";
const port="6379";
const client=redis.createClient(port, host);

client.on('connect', ()=>{
    console.log("redis connection is set up");
})

client.on('error', (err)=>{
    console.log("error happened in redis connection" + JSON.stringify(err));
})

let getAllUsersInHash=(hashName, callback)=>{
    client.HGETALL(hashName, (err, result)=>{
        if(err){
            console.log(err);
        } else if(check.isEmpty(result)){
            console.log(result);
            callback(null, {});
        } else {
            console.log(result);
            callback(null, result);
        }
    })
}

let setNewOnlineUserInHash=(hashName, key, value, callback)=>{
    client.HMSET(hashName, [key, value], (err, result)=>{
        if(err){
            console.log("error in setNewOnlineUserInHash function" + JSON.stringify(err));
            callback(err, null);
        } else{
            console.log("inside else block - setNewOnlineUserInHash");
            console.log(result);
            callback(null, result);
        }
    })
}

let deleteUserFromHash=(hashName, key)=>{
    client.HDEL(hashName, key);
    return true;
}

module.exports={
    getAllUsersInHash:getAllUsersInHash,
    setNewOnlineUserInHash:setNewOnlineUserInHash,
    deleteUserFromHash:deleteUserFromHash
}

