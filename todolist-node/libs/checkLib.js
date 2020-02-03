'use strict'
//check whether string is empty/undefined/null 
let isEmpty=(value)=>{
    if(value===undefined || value===null || value==='' || value.length===0 ){
        return true;
    } else {
        return false;
    }
}
//export function
module.exports={
    isEmpty:isEmpty
}