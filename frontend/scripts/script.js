/*Jesper Jensen*/
var searchForm;
var logInForm; //Reference to log in form
var createAccForm; //Reference to create account form
var updateAccForm; //Referece to update account form - user page
var userInfo; //Hold user info from getUserInformation

window.onload = init;

function init(){
    searchForm = document.getElementById("searchForm");  //Saves reference to the search bar (form)

    searchForm.addEventListener("submit", searchProduct);

    //All pages that has logIn/Create Account form
    if(document.querySelector("body").getAttribute("id") === "index" || document.querySelector("body").getAttribute("id") === "search" || document.querySelector("body").getAttribute("id") === "product"){
        if(sessionStorage.getItem("userName") !== null){  //If logged in, hide log in / create account forms
            document.getElementById("logIn").style.display = "none";  //Hide log in
            document.getElementById("createAcc").style.display = "none";  //Hide create account
            document.getElementById("logOut").style.display = "inherit";  //show log out
    
            updateName(sessionStorage.getItem("userName"));  //Set shown name to logged in user
    
            document.getElementById("userPageButton").onclick = goToUser;  //Goes to the user page
            document.getElementById("logOutButton").onclick = logOut;  //Log out
        }else{  //Else show the forms
            document.getElementById("logIn").style.display = "inherit";  //show log in
            document.getElementById("createAcc").style.display = "inherit";  //show create account
            document.getElementById("logOut").style.display = "none";  // hide log out
        }
       
        logInForm = document.getElementById("logIn");  //Saves reference to the log in form
        createAccForm = document.getElementById("createAcc");  //Saves reference to the create account form
    
        logInForm.addEventListener("submit", logIn);  //Eventlistener submit, runs logIn function
        createAccForm.addEventListener("submit", createAccount);  //Eventlistener submit, runs createAccount function

        createAccForm.addEventListener("keyup", checkFields);  //checks the create account form fields
        logInForm.addEventListener("keyup", checkFields);  //checks the log in for fields
    }

    //If user page - only when logged in
    if(document.querySelector("body").getAttribute("id") === "user"){
        updateAccForm = document.getElementById("updateAcc");  //Saves reference to the update account form
        
        updateAccForm.addEventListener("submit", updateAccount);  //Eventlistener submit, runs update account

        updateAccForm.addEventListener("keyup", checkFields);  //checks the update account form fields
    }

    //If search page
    if(document.querySelector("body").getAttribute("id") === "search"){
        if(sessionStorage.getItem("searchResults") !== null){
            let products = JSON.parse(sessionStorage.getItem("searchResults"));
            let amountOfProducts = Object.keys(products).length;

            for(let i = 0; i < amountOfProducts; i++){
                createProductSection(products[i].id, products[i].name, products[i].consoleType, products[i].price, products[i].imgPath);
            }
        }
    }
}

/**
 * Changes the url to the user page
 */
function goToUser(){
    if(document.querySelector("body").getAttribute("id") === "index"){  //Different file path from index
        location.replace("./pages/user.html");
    }else{
        location.replace("./user.html");
    }
}

/**
 * Checks with the database to see if the user with that passwords exists and returns true/false
 */
function logIn(){
    let name = logInForm.userName.value;  //username
    let pass = logInForm.password.value;  //password

    let encrypted = window.btoa(name + ":" + pass);  //Json to string as Base64

    if(name === "abc" && pass === "abc"){
        sessionStorage.setItem("userName", name);
    }


    fetch("http://its.teknikum.it:8080/tuvestams-spel-shop/resources/user", {
        method: "GET",
        mode: 'cors',
        headers: {
            'Authorization': 'Basic ' + encrypted
        },
        }).then((response) => {
            alert(response.status);
            
            if(response.ok){
                sessionStorage.setItem("userName", name);  //Saves username in sessionStorage
                location.reload();
            }else{
                alert("Fel användarnamn/lösenord");
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
        "password": window.btoa(pass),
        "email": email,
        "phoneNumber": phone,
        "address": address,
        "zipCode": zip,
        "city": city
    };

    fetch("http://its.teknikum.it:8080/tuvestams-spel-shop/resources/user", {
        method: "POST",
        mode: 'no-cors',
        headers: {  
            'Content-Type': 'text/plain'
        },
        body: JSON.stringify(userData)
        }).then((response) => {
            if(response.ok){
                sessionStorage.setItem("userName", name);  //Sparar användare
            }else{
                alert("Det gick inte att skapa kontot")
            }

            console.log(response.status);

            return response.json();
        }).catch(err => {
            console.log(err);
    });
}

/**
 * Takes the input data from the form and fills in the blanks "" where there is no input with
 * the old information and sends it to the database
 */
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

            console.log(response.status);

            return response.json();
        }).catch(err => {
            console.log(err);
    });
}

/**
 * Gets the logged in users information from the database and saves it in userInfo.
 * 
 * Username
 * 
 * Password
 * 
 * Email
 * 
 * Phone
 * 
 * Address
 * 
 * Zip Code
 * 
 * City
 */
function getUserInformation(){
    fetch("http://localhost:8080/Backend/resources/user", {
        method: "GET",
        mode: 'cors',
        headers: {
            'Content-Type': 'text/plain'
        },
        body: sessionStorage.getItem("userName")
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

/**
 * Tests user name with regex and changes style accordingly
 * 
 * @param {*} target 
 */
function checkUserName(target){
    let reg = /\w/;

    testRegex(reg, target.value, target.style); //Tests the regex and changes style acordingly
}

/**
 * Tests password with regex and changes style accordingly
 * 
 * @param {*} target 
 */
function checkPassword(target){
    let reg = /^.+$/;

    testRegex(reg, target.value, target.style); //Tests the regex and changes style acordingly
}

/**
 * Tests email with regex and changes style accordingly
 * 
 * @param {*} target 
 */
function checkEmail(target){
    let reg = /^.+[@].+[.].+$/;

    let cleanedInput = target.value.trim();  //Fixed string

    testRegex(reg, cleanedInput, target.style); //Tests the regex and changes style acordingly
}

/**
 * Tests phone with regex and changes style accordingly
 * 
 * @param {*} target 
 */
function checkPhone(target){
    let reg = /\d/;

    testRegex(reg, target.value, target.style); //Tests the regex and changes style acordingly
}

/**
 * Tests address with regex and changes style accordingly
 * 
 * @param {*} target 
 */
function checkAddress(target){
    let reg = /^\D+\d+.*$/; //Regex

    let cleanedInput = target.value.trim();  //Fixed string

    testRegex(reg, cleanedInput, target.style); //Tests the regex and changes style acordingly
}

/**
 * Tests zip code with regex and changes style accordingly
 * 
 * @param {*} target 
 */
function checkZip(target){
    let reg = /^\d{5}$/;  //Regex

    let cleanedInput = target.value.trim().replace(" ","");  //Fixed string

    testRegex(reg, cleanedInput, target.style); //Tests the regex and changes style acordingly
}

/**
 * Tests city with regex and changes style accordingly
 * 
 * @param {*} target 
 */
function checkCity(target){
    let reg = /^[a-zA-Z]+$/; //Regex 

    let cleanedInput = target.value.trim().replace(" ","");  //Fixed string

    testRegex(reg, cleanedInput, target.style); //Tests the regex and changes style acordingly
}

/**
 * Takes the regualar expression (regex), the value from the input field and the style of the input
 * and tests the value and changes background color if depending on the result. 
 * 
 * Red = invalid
 * 
 * White = valid
 * 
 * @param {*} reg 
 * @param {*} input 
 * @param {*} css 
 */
function testRegex(reg, input, css){
    if(!reg.test(input)){  //If the input doesn't match regex
        css.backgroundColor = "red";  //Show red background
    }else{
        css.backgroundColor = "white";  //Show "normal" background. No errors
    }
}

function createProductSection(productId, productName, console, price, imgPath){
    let sec = document.createElement("section");  //Product container
    let img = document.createElement("img");  //Link to img
    let titleH2 = document.createElement("h2");  //Game title
    let priceH2 = document.createElement("h2");  //Game price
    let consoleH2 = document.createElement("h2"); //Game console

    let btn = document.createElement("button");  //Button

    img.setAttribute("src", imgPath);
    titleH2.innerHTML = productName;
    priceH2.innerHTML = price + " kr";
    consoleH2.innerHTML = console;
    btn.innerHTML = "Lägg till";
    btn.setAttribute("value", productId);

    sec.append(img);
    sec.append(titleH2);
    sec.append(priceH2);
    sec.append(btn);

    document.querySelector("article").append(sec);
}

function addProductToCart(){
    console.log(event.target);
}

function removeProductFromCart(){

}

function searchProduct(){
    let searchValue = searchForm.searchBar.value.trim();

    let productData = {
        'productName': 'Minecraft'
    };

    fetch("http://its.teknikum.it:8080/tuvestams-spel-shop/resources/product/search/ProductName", {
        method: "GET",
        mode: 'no-cors',
        headers: {
            'productName': JSON.stringify(productData)  
        },
        }).then((response) => {
            if(!response.ok){
                alert(searchValue + " gav inga resultat");
            }

            console.log("Status : " + response.status);

            return response.json();
        }).then(data =>{
            let products = {};  //Holds the products

            for(let i = 0; i < data.length; i++){
                products[i] = data[i];  //Add the products found in the database
            }

            sessionStorage.setItem("searchResults", JSON.stringify(products));  //Add the products to searchResults
        }).catch(err => {
            console.log(err);
    });

    /*
    if(document.querySelector("body").getAttribute("id") === "index"){  //Different url from index
        location.replace("./pages/search.html");
    }else{
        location.replace("./search.html");
    }*/
}