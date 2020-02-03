const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const SubItemSchema=new Schema({    
    subItemId:{type:String, unique:true },
    subItemName:{type:String, default:''},
    status:{type:String, default:'open'},
    changeDate:{type:Date, default:Date.now() },
    changeBy:{type:String, default:'' },
    changeId:{type:String, default:'' },    
    itemId:{type:String, default:'' }
})
//
mongoose.model('subItem', SubItemSchema);