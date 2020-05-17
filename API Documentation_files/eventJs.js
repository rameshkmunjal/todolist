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
    div.innerHTML=`<h2>${api.name}</h2>`+                    
                    `<p>${api.description}</p>`;    
    return div;
}

let createApiDiv=(div , api)=>{
    let h2=document.createElement('h2');
    let boxHeading=document.createTextNode(api.name);
    h2.appendChild(boxHeading);
    div.appendChild(h2);
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
let createSideUl=(sidebar, heading, arr)=>{
    
    let ul1=createUl(arr, heading);
    sidebar.appendChild(ul1);
    console.log(ul1);
    console.log(sidebar);
    return sidebar;
    /*
    let ul2=createUl(emitterArray, "Events");
    sidebar.appendChild(ul2);
    console.log(ul1);
    console.log(sidebar);
*/
}
let loadEventPage=(idName, arr)=>{
    let main=document.getElementById(idName);   
          
    for(let i=0; i < arr.length; i++){
        console.log(arr[i]);
        let apiDiv=document.createElement('div');
        let api=arr[i];               
        apiDiv=exploreApiObject(api);
        console.log(apiDiv); 
        main.appendChild(apiDiv);                      
    }    
}

let init=()=>{ 
    console.log("init function");
    loadEventPage("listenerDiv", listenerArray);
    loadEventPage("emitterDiv", emitterArray);
    let sidebar=document.getElementById('sidebar');
    sidebar=createSideUl(sidebar, "Liseners", listenerArray);
    sidebar=createSideUl(sidebar, "Events", emitterArray);
}

window.onload=init;

