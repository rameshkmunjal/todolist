//models/task.js
const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const ListSchema=new Schema({
    listId:{type:String, unique:true},//unique -system generation will not change
    listName:{type:String, default:''},//user input 
    //only on create
    createdOn:{type:Date, default:''},//only on create - current date and time
    creatorId:{type:String, default:''},//only on create - login id
    createdBy:{type:String, default:''},//only on create - login name
    //only on edit
    changeOn:{type:Date},    
    changeBy:{type:String},  //edit or delete - login name  
    personId:{type:String},//id of person doing change
    isActive:{type:Boolean, default:true}, //set all other false and then new record true
    status:{type:String, default:'open'},//to be changed by user - as - done
    
    originId:{type:String, default:''},
    refkey:{type:String, default:''}
})

mongoose.model('List', ListSchema);
//