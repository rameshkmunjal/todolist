const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const ItemSchema=new Schema({    
    itemId:{type:String, unique:true},
    itemName:{type:String, default:''},//user input 
    listId:{type:String, default:''}, //parentId
    //only on create
    createdOn:{type:Date, default:''},//only on create - current date and time
    creatorId:{type:String, default:''},//only on create - login id
    createdBy:{type:String, default:''},//only on create - login name
    //only on edit
    changeOn:{type:Date},    
    changeBy:{type:String},  //edit or delete - login name  
    personId:{type:String},//id of user - who made change
    isActive:{type:Boolean, default:true}, //set all other false and then new record true
    status:{type:String, default:'open'},//to be changed by user - as - done 
    
    originId:{type:String, default:''},//always remains same in edit/delete
    refkey:{type:String, default:''}
})

mongoose.model('listitem', ItemSchema);
//


