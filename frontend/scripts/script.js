var logInForm; //Reference to log in form
var createAccForm; //Reference to create account form
var updateAccForm; //Referece to update account form - user page

window.onload = init;

function init(){
    if(sessionStorage.getItem("userName") !== null){  //If logged in, hide log in / create account forms
        document.getElementById("logIn").style.display = "none";
        document.getElementById("createAcc").style.display = "none";
        document.getElementById("logOut").style.display = "initial";

        document.getElementById("logOut").querySelector("button").onclick = logOut;
    }else{  //Else show the forms
        document.getElementById("createAcc").style.display = "initial";
        document.getElementById("createAcc").style.display = "initial";
        document.getElementById("logOut").style.display = "none";
    }


    //All pages that has logIn/Create Account form
    if(document.querySelector("body").getAttribute("id") != "user" || document.querySelector("body").getAttribute("id") != "admin" || document.querySelector("body").getAttribute("id") != "checkout"){
        logInForm = document.getElementById("logIn");  //Saves reference to the log in form
        createAccForm = document.getElementById("createAcc");  //Saves reference to the create account form
    
        logInForm.addEventListener("submit", logIn);  //Eventlistener submit, runs logIn function
        createAccForm.addEventListener("submit", createAccount);  //Eventlistener submit, runs createAccount function
    }

    //If user page - only when logged in
    if(document.querySelector("body") === "user"){
        updateAccForm = document.getElementById("updateAcc");
        updateAccForm.addEventListener("submit", updateAccount);
    }
}

function logIn(){
    let name = logInForm.username.value;  //username
    let pass = logInForm.password.value;  //password

    let userData = {  //Json object
        "userName": name,
        "password": pass
    };

    let encrypted = window.btoa(JSON.stringify(userData));  //Json to string as Base64

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

function logOut(){
    sessionStorage.removeItem("userName");
    location.reload();
}

function createAccount(){
    /*           Form values           */
    let name = createAccForm.username.value;
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

}