const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const NotificationSchema=new Schema({
    id:{type:String, unique:true},
    type:{type:String, default:''},//which type of table - list/item/subitem
    action:{type:String, default:''},//which action - create/edit/delete/undo
    typeId:{type:String, default:''}, //example - list id/item id/sub item id
    message:{type:String, default:''},
    createdOn:{type:Date, default:Date.now()},
    sendId:{type:String, default:''},//login id
    sendName:{type:String, default:''},//login name
    isActive:{type:Boolean, default:true}
})

mongoose.model('notification', NotificationSchema);