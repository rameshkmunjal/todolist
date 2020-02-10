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
                
                let contactsArr=[];                

                for(let i=0; i < users.length; i++){
                    if(users[i].userId===data.pageOwnerId){
                        console.log("user matched");
                        users.splice(i, 1); 
                        //console.log("users " + JSON.stringify(users));                       
                    }                    
                }
               /*
                for(let i=0; i< users.length; i++){
                    for(let j=0; j < friends.length; j++){
                        if(users[i].userId===friends[j].friendId){
                            console.log("Matched");                            
                            users.splice(i, 1);
                            if(users.length===0){
                                j=friends.length;
                            }                                                                                    
                        }
                    }
                }
                */
                //console.log(users);
                for(let i=0; i < users.length; i++){
                    let user=users[i];
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

module.exports={
    getContactList:getContactList
}