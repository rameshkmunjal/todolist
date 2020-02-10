const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const SubItemSchema=new Schema({    
    subItemId:{type:String, unique:true},    
    subItemName:{type:String, default:''},//user input
    itemId:{type:String, default:''},//unique -system generation    
    //only on create
    createdOn:{type:Date, default:''},//only on create - current date and time
    creatorId:{type:String, default:''},//only on create - login id
    createdBy:{type:String, default:''},//only on create - login name    
    //only on edit
    changeOn:{type:Date},//only on edit/delete - current date and time    
    changeBy:{type:String},  //edit or delete - login name  
    personId:{type:String, default:''},//id of user making change
    isActive:{type:Boolean, default:true}, //set all other false and then new record true
    status:{type:String, default:'open'},//to be changed by user - as - done 

    originId:{type:String, default:''},
    refkey:{type:String, default:''}
})
//
mongoose.model('subItem', SubItemSchema);