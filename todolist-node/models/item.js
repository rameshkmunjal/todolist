const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const ItemSchema=new Schema({    
    itemId:{type:String, unique:true },
    itemName:{type:String, default:''},
    status:{type:String, default:'open'},
    changeOn:{type:Date, default:Date.now() },
    changeBy:{type:String, default:'' },
    changeId:{type:String, default:'' },
    listId:{type:String, default:'' }    
})

mongoose.model('Itm', ItemSchema);


