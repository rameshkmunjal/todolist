//models/task.js
const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const ListSchema=new Schema({
    listId:{type:String, unique:true},
    listName:{type:String},
    changeOn:{type:Date, default:Date.now()},
    changeId:{type:String, default:''},
    changeBy:{type:String, default:''}   
})

mongoose.model('List', ListSchema);