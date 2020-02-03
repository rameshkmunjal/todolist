
const mongoose= require('mongoose');
const Schema=mongoose.Schema;

const UserSchema=new Schema({
    userId:{type:String, unique:true},
    firstName:{type:String, default:''},
    lastName:{type:String, default:''},
    email:{type:String, default:''},
    password:{type:String, default:''},
    country:{type:String, default:''},
    countryCode:{type:String, default:''},
    mobile:{type:String, default:''},
    friends:[]
})

mongoose.model('User', UserSchema);
