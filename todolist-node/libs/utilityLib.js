let getLastNotification=(list)=>{
    let newArr=[];
    newArr=getSortedDescending(list);
    let latestNotification=newArr[0];
    return latestNotification;
}

let getSortedDescending=(list)=>{
    list.sort(function(a, b){          
        if(new Date(a.createdOn) < new Date(b.createdOn)){
          //console.log("hello");
          return 1;
        } else if(new Date(a.createdOn)  > new Date(b.createdOn)){
          return -1;
        } else {
          return 0;
        }
    })
    return list;
}

module.exports={
  getLastNotification:getLastNotification,
  getSortedDescending:getSortedDescending
}