//including packages
const mongoose=require('mongoose');
//including files
const response=require('./../libs/responseLib');
const check=require('./../libs/checkLib');

//including model
require('./../models/list');
const ListModel=mongoose.model('List');



let getListById=(req, res)=>{
    ListModel.findOne({listId:req.params.listId})
        .exec((err, singleList)=>{
            if(err){
                console.log(err);
                let apiResponse=response.generate(true, "Some Error Occurred", 500, null);
                res.send(apiResponse);
            } else if(check.isEmpty(singleList)){
                console.log("No such data found");
                let apiResponse=response.generate(true, "No Data Found", 404, null);
                res.send(apiResponse);
            } else {
                let apiResponse=response.generate(false, "Desired Task details fetched successfully", 200, singleList);
                res.send(apiResponse);
            }
        })//exec method ending
}//function ended

module.exports={
    //getAllLists:getAllLists,
    getListById:getListById
}