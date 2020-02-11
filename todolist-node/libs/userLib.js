//including packages
const mongoose=require('mongoose');
//including library files
const response=require('./../libs/responseLib');
const check=require('./../libs/checkLib');

//including models
require('./../models/user');
const UserModel=mongoose.model('User');


let getContactList=(data, contactCB)=>{
    console.log("pageOwnerId in getContactList : " + data.pageOwnerId);

    let getFriends=()=>{
        
        return new Promise((resolve, reject)=>{
            
            UserModel.findOne({userId:data.pageOwnerId})
                .exec((err, userData)=>{
                    if(err){
                        let apiResponse=response.generate(true, "Some error occurred", 500, null);
                        reject(apiResponse);
                    } else if(check.isEmpty(userData)){
                        let apiResponse=response.generate(true, "No Data found", 404, null);
                        reject(apiResponse);
                    } else {

                        let friends=userData.friends;

                        resolve(friends);
                    }
            })//exec endec
        })//Promise ended
    }//getFriends ended
    
    let getContacts=(friends)=>{
        console.log("friends : "+ friends);
        return new Promise((resolve, reject)=>{
        UserModel.find()
            .exec((err, users)=>{
            if(err){                
                let apiResponse=response.generate(true, "Some error occurred", 500, null);
                reject(apiResponse);
            } else if(check.isEmpty(users)){                
                let apiResponse=response.generate(true, "No Data Found", 404, null);
                reject(apiResponse);
            } else {                
                console.log("all users : "+ JSON.stringify(users));
                let contactsArr=[];
                
                
                let userArr=users.filter(function(user){
                    return user.userId !== data.pageOwnerId;
                })
                console.log("friends : " + friends); 
                console.log("users : " + userArr);                
                let filterArr=[];
                if(friends.length > 0){
                    for(let j=0; j < friends.length; j++){
                        for(let i=0; i< userArr.length; i++){
                        if(userArr[i].userId !== friends[j].friendId){
                            filterArr.push(userArr[i]);                                                                                   
                        }
                    }
                  }
                } else {
                    filterArr=userArr;
                }
                    
                console.log("filtered users iuyiy : " + filterArr); 
                for(let i=0; i < filterArr.length; i++){
                    let user=filterArr[i];
                    console.log("user : "+JSON.stringify(user));
                    let data={
                        id:user.userId,
                        fullName:user.firstName+" "+user.lastName
                    }
                    contactsArr.push(data);
                }
                console.log(contactsArr);
                resolve(contactsArr);                
            }
        })//exec ended
      })//Promise ended
    } //getContacts ended

    getFriends()
        .then(getContacts)
        .then((resolve)=>{
            let apiResponse=response.generate(false, "Contacts fetch successfully", 200, resolve);
            
            contactCB(apiResponse);
        })
        .catch((err)=>{            
            contactCB(err);
        })    
}
//---------------------------------------------------------------------------------------------
let getFriendList=(data, friendCB)=>{
    UserModel.findOne({userId:data.userId})
        .exec((err, result)=>{
            if(err){
                //console.log(err);
                let apiResponse=response.generate(true, "Some Error Occurred", 500, null);
                friendCB(apiResponse);
            } else if(check.isEmpty(result)){
                //console.log("data not found");
                let apiResponse=response.generate(true, "No such data found", 404, null);
                friendCB(apiResponse);
            } else {
                let friends=result.friends;
                let apiResponse=response.generate( false, "User's friends data fetched successfully", 200, friends);
                apiResponse.pageOwnerId=data.userId;
                friendCB(apiResponse);
            }
        })
}
//----------------------------------------------------------------------------------------------------------
module.exports={
    getContactList:getContactList,
    getFriendList:getFriendList
}