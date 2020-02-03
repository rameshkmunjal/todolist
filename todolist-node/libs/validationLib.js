//--------------------------validate email--------------------------
//function - to validate email address using regex
let Email=(email)=>{
    let emailRegex=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if(email.match(emailRegex)){
        return email;
    } else{
        return false;
    }
}//function ended
//--------------------------validate password--------------------------
//function - to validate password using regex
let Password=(password)=>{
    let passwordRegex= /^[A-Za-z0-9]\w{8,}$/
    if(password.match(passwordRegex)){
        return password;
    } else{
        return false;
    }
}//function ended
//---------------------functions exported----------------------------------
module.exports={
    Email:Email,
    Password:Password
}
//--------------------------------------------------------------------------