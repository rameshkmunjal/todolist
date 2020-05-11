let appendUlHeading=(ul, heading)=>{
    let h3=document.createElement('h3');
    h3Text=document.createTextNode(heading);
    h3.appendChild(h3Text);
    ul.appendChild(h3);
    return ul;
}

let createUl=(arr, heading)=>{    
    let ul=document.createElement('ul');
    ul.setAttribute('class', 'side-ul');
    ul=appendUlHeading(ul, heading);
    for(let i=0; i<arr.length; i++){
        let obj=arr[i];
        console.log(obj);
        let li=document.createElement('li');
        let a = document.createElement('a');
        let href= '#'+obj.name;
        a.setAttribute('href', href);
        let link=document.createTextNode(obj.name);
        a.appendChild(link);
        li.appendChild(a);
        ul.appendChild(li);
        console.log(ul);
    }
    return ul;
}

let addIntro=(div, api)=>{
    div.innerHTML=`<h1>${api.name}</h1>`+                    
                    `<p>${api.description}</p>`;    
    return div;
}

let createApiDiv=(div , api)=>{
    let h1=document.createElement('h1');
    let boxHeading=document.createTextNode(api.name);
    h1.appendChild(boxHeading);
    div.appendChild(h1);
    div = addIntro(div, api);
    //console.log(api.payload);  
    
    return div;
}

let exploreApiObject=(obj)=>{
    //console.log(obj);
    for(x in obj){
        let div=document.createElement('div');
        div.setAttribute('class', 'box'); 
        div.setAttribute('id', obj.name);
        div = createApiDiv(div, obj);
        //console.log(div);
        return div;
    }    
}

let init=()=>{ 
    console.log("init function");
    let main=document.getElementById("listenerDiv");   
          
    for(let i=0; i < listenerArray.length; i++){
        console.log(listenerArray[i]);
        let apiDiv=document.createElement('div');
        let api=listenerArray[i];               
        apiDiv=exploreApiObject(api);
        console.log(apiDiv); 
        main.appendChild(apiDiv);                      
    }
    let sidebar=document.getElementById('sidebar');
    let ul1=createUl(listenerArray, "Listeners");
    sidebar.appendChild(ul1);
    console.log(ul1);
    console.log(sidebar);
    let ul2=createUl(emitterArray, "Events");
    sidebar.appendChild(ul2);
    console.log(ul1);
    console.log(sidebar);

}

window.onload=init;

