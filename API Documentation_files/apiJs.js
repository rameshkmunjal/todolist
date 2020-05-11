let createUl=()=>{
    let sidebar=document.getElementById('sidebar');
    let ul=document.createElement('ul');
    ul.setAttribute('class', 'side-ul');
    for(let i=0; i<objArray.length; i++){
        let obj=objArray[i];
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
    sidebar.appendChild(ul);
}
let appendDivHeading=(div, heading)=>{
    let textNode=document.createTextNode(heading);
    let h=document.createElement('span');
    h.setAttribute('class', 'heading');
    h.appendChild(textNode);
    div.appendChild(h);
    return div;
}

let appendTableHeading=(table)=>{
    let tr=document.createElement('tr');
    let th1=document.createElement('th');
    let th2=document.createElement('th');
    let th3=document.createElement('th');
    let h1=document.createTextNode("Field");
    let h2=document.createTextNode("Type");
    let h3=document.createTextNode("Description");
    th1.appendChild(h1);
    th2.appendChild(h2);
    th3.appendChild(h3);
    tr.appendChild(th1);
    tr.appendChild(th2);
    tr.appendChild(th3);
    table.appendChild(tr);
    return table;
}
let appendTableContents=(table, prop)=>{
    for(let i=0; i < prop.length; i++){ 
        //console.log(prop[i].field);       
        let tr=document.createElement('tr');
        let td1=document.createElement('td');
        let td2=document.createElement('td');
        let td3=document.createElement('td');
        //console.log(x);
        let a=prop[i].field;
        let b=prop[i].type;
        let c=prop[i].description;
        //console.log(a+"  : "+b+"  : "+c);
        let text1=document.createTextNode(a);
        let text2=document.createTextNode(b);
        let text3=document.createTextNode(c);
        td1.appendChild(text1);
        td2.appendChild(text2);
        td3.appendChild(text3);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        table.appendChild(tr);
    }
    return table;
}

let appendTable=(div, prop, heading)=>{     
    div=appendDivHeading(div, heading);    
    let table=document.createElement('table');
    table=appendTableHeading(table);
    table=appendTableContents(table, prop);   
    div.appendChild(table);
    return div;    
}

let addIntro=(div, api)=>{
    div.innerHTML=`<h1>${api.name}</h1>`+
                    `<span class="reqMode">${api.reqMode}</span><br/>`+
                    `<p class="urlBand">${api.url}</p><p>${api.intro}</p>`;    
    return div;
}

let createApiDiv=(div , api)=>{
    let h1=document.createElement('h1');
    let boxHeading=document.createTextNode(api.name);
    h1.appendChild(boxHeading);
    div.appendChild(h1);
    div = addIntro(div, api);
    //console.log(api.payload);  
    div = appendTable(div, api.payload, "Parameter");
    div = appendTable(div, api.success, "Success : 200");
    div = appendTable(div, api.error, "Error");
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
    let main=document.getElementById("main");   
          
    for(let i=0; i < objArray.length; i++){
        let apiDiv=document.createElement('div');
        let api=objArray[i];               
        apiDiv=exploreApiObject(api);
        //console.log(apiDiv); 
        main.appendChild(apiDiv);                      
    }
    createUl();
}

window.onload=init;

