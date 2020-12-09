var logInForm; //Reference to log in form
var createAccForm; //Reference to create account form
var updateAccForm; //Referece to update account form - user page
var userInfo; //Hold user info from getUserInformation

window.onload = init;

function init(){
    //All pages that has logIn/Create Account form
    if(document.querySelector("body").getAttribute("id") === "index" || document.querySelector("body").getAttribute("id") === "search" || document.querySelector("body").getAttribute("id") === "checkout"){
        if(sessionStorage.getItem("userName") !== null){  //If logged in, hide log in / create account forms
            document.getElementById("logIn").style.display = "none";  //Hide log in
            document.getElementById("createAcc").style.display = "none";  //Hide create account
            document.getElementById("logOut").style.display = "initial";  //show log out
    
            updateName(sessionStorage.getItem("userName"));  //Set shown name to logged in user
    
            document.getElementById("logOut").querySelector("button").onclick = logOut;
        }else{  //Else show the forms
            document.getElementById("logIn").style.display = "initial";  //show log in
            document.getElementById("createAcc").style.display = "initial";  //show create account
            document.getElementById("logOut").style.display = "none";  // hide log out
        }
       
        logInForm = document.getElementById("logIn");  //Saves reference to the log in form
        createAccForm = document.getElementById("createAcc");  //Saves reference to the create account form
    
        logInForm.addEventListener("submit", logIn);  //Eventlistener submit, runs logIn function
        createAccForm.addEventListener("submit", createAccount);  //Eventlistener submit, runs createAccount function

        createAccForm.addEventListener("keyup", checkFields);
        logInForm.addEventListener("keyup", checkFields);
    }

    //If user page - only when logged in
    if(document.querySelector("body").getAttribute("id") === "user"){
        updateAccForm = document.getElementById("updateAcc");
        
        updateAccForm.addEventListener("submit", updateAccount);

        updateAccForm.addEventListener("keyup", checkFields);
    }
}

function logIn(){
    let name = logInForm.userName.value;  //username
    let pass = logInForm.password.value;  //password

    let userData = {  //Json object
        "userName": name,
        "password": pass
    };

    let encrypted = window.btoa(JSON.stringify(userData));  //Json to string as Base64

    //Test
    if(name != "" || pass != ""){
        if(name === "abc" && pass === "abc"){
            sessionStorage.setItem("userName", name);
            set
        }else{
            alert("fel anväbndarnamn / lösenord")
        }
    }else{
        alert("du måsstre fytlla i fälten");
    }

    fetch("http://localhost:8080/Backend/resources/user", {
        method: "GET",
        mode: 'cors',
        headers: {
            'Content-Type': 'text/plain'
        },
        body: encrypted
        }).then((response) => {
            if(response.ok){
                sessionStorage.setItem("username", name);  //Saves username in sessionStorage
                location.reload();  //Reloads the page to remove log in and create account forms

                logInForm.disabled = true;
            }else{
                alert("Fel användarnamn/lösenord")
            }

            return response.json();
        }).catch(err => {
            console.log(err);
    });
}

/**
 * Logs out the user. Removes their name from session storange and reloads the page
 */
function logOut(){
    sessionStorage.removeItem("userName");  //Removes the logged in user
    location.reload();  //reloads the page
}

function createAccount(){
    /*           Form values           */
    let name = createAccForm.userName.value;
    let pass = createAccForm.password.value;
    let email = createAccForm.email.value;
    let phone = createAccForm.phone.value;
    let address = createAccForm.address.value;
    let zip = createAccForm.zip.value;
    let city = createAccForm.city.value;

    let userData = {  //User information as json object
        "userName": name,
        "password": pass,
        "email": email,
        "phoneNumber": phone,
        "address": address,
        "zipCode": zip,
        "city": city
    };

    let encrypted = window.btoa(JSON.stringify(userData));  //Json to string as Base64

    fetch("http://localhost:8080/Backend/resources/user", {
        method: "POST",
        mode: 'cors',
        headers: {  
            'Content-Type': 'text/plain'
        },
        body: encrypted  //Encrypted Json object as string
        }).then((response) => {
            if(response.ok){
                sessionStorage.setItem("userName", name);  //Sparar användare
                location.reload();
            }else{
                alert("Det gick inte att skapa kontot")
            }

            return response.json();
        }).catch(err => {
            console.log(err);
    });
}

function updateAccount(){
    let name = updateAccForm.username.value;
    let pass = updateAccForm.password.value;
    let email = updateAccForm.email.value;
    let phone = updateAccForm.phone.value;
    let address = updateAccForm.address.value;
    let zip = updateAccForm.zip.value;
    let city = updateAccForm.city.value;

    let userData = {  //User information as json object
        "userName": name,
        "password": pass,
        "email": email,
        "phoneNumber": phone,
        "address": address,
        "zipCode": zip,
        "city": city
    };

    let encrypted = window.btoa(JSON.stringify(userData));  //Json to string as Base64

    fetch("http://localhost:8080/Backend/resources/user", {
        method: "POST",
        mode: 'cors',
        headers: {  
            'Content-Type': 'text/plain'
        },
        body: encrypted
        }).then((response) => {
            if(response.ok){
                sessionStorage.setItem("userName", name);  //Sparar användare
                location.reload();
            }

            return response.json();
        }).catch(err => {
            console.log(err);
    });
}

function getUserInformation(){
    fetch("http://localhost:8080/Backend/resources/user", {
        method: "GET",
        mode: 'cors',
        headers: {
            'Content-Type': 'text/plain'
        },
        body: encrypted
        }).then((response) => {
            return response.json();
        }).then(data => {
            userInfo = data;
        }).catch(err => {
            console.log(err);
    });
}

/**
 * Changes the name above the log out button to the name of the user that is logged in
 * 
 * @param {String} name 
 */
function updateName(name){
    document.getElementById("logOut").querySelector("h3").innerHTML = name;
}

/**
 * Checks the fields for regex errors and changes style accordingly.
 * Runs a different function for each field
 */
function checkFields(){
    let target = event.target;  //Reference to the input that is being typed in
    let fieldName = target.name;  //Reference to the input name

    let functionName = fieldName[0].toUpperCase() + fieldName.slice(1);  //Makes first letter upper case

    window["check" + functionName](target);  //Calls the function check + input name that begins with upp case for example check + Phone 
}

function checkUserName(target){
    let reg = /\d/;

    testRegex(reg, target.value, target.style); //Tests the regex and changes style acordingly
}

function checkPassword(target){
    let reg = /^.+$/;

    testRegex(reg, target.value, target.style); //Tests the regex and changes style acordingly
}

function checkEmail(target){
    let reg = /^.+[@].+[.].+$/;

    let cleanedInput = target.value.trim();  //Fixed string

    testRegex(reg, cleanedInput, target.style); //Tests the regex and changes style acordingly
}

function checkPhone(target){
    let reg = /\d/;

    testRegex(reg, target.value, target.style); //Tests the regex and changes style acordingly
}

function checkAddress(target){
    let reg = /^\D+\d+.$/; //Regex

    let cleanedInput = target.value.trim();  //Fixed string

    testRegex(reg, cleanedInput, target.style); //Tests the regex and changes style acordingly
}

function checkZip(target){
    let reg = /^\d{5}$/;  //Regex

    let cleanedInput = target.value.trim().replace(" ","");  //Fixed string

    testRegex(reg, cleanedInput, target.style); //Tests the regex and changes style acordingly
}

function checkCity(target){
    let reg = /^[a-zA-Z]+$/; //Regex 

    let cleanedInput = target.value.trim().replace(" ","");  //Fixed string

    testRegex(reg, cleanedInput, target.style); //Tests the regex and changes style acordingly
}

function testRegex(reg, input, css){
    if(!reg.test(input)){  //If the input doesn't match regex
        css.backgroundColor = "red";  //Show red background
    }else{
        css.backgroundColor = "white";  //Show "normal" background. No errors
    }
}