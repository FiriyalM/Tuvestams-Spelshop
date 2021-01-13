/*Jesper Jensen*/
var searchForm;  //Reference to website search bar
var logInForm; //Reference to log in form
var createAccForm; //Reference to create account form
var updateAccForm; //Referece to update account form - user page
var searchProductForm;  //Reference to the search product form - admin page
var searchUserForm;  //Reference to the search user form - admin page
var userInfo; //Hold user info from getUserInformation

window.onload = init;

async function init(){
    searchForm = document.getElementById("searchForm");  //Saves reference to the search bar (form)
    searchForm.addEventListener("submit", searchProduct);

    let nav = document.querySelector("nav");  //Reference to the nav bar
    let buttons = nav.querySelectorAll("section button");  //Reference to the category buttons

    for(let i = 0; i < buttons.length; i++){
        buttons[i].onclick = searchConsoleType;  //Assign the buttons to the searchConsleType function
    }

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
        if(sessionStorage.getItem("searchResults") !== null){  //If there are results
            let products = JSON.parse(sessionStorage.getItem("searchResults"));  //Parse the JSON string to json objects
            let amountOfProducts = Object.keys(products).length;  //Count the amount of objects

            for(let i = 0; i < amountOfProducts; i++){  //Create the product sections
                createProductSection(products[i].productId, products[i].productName, products[i].consoleType, products[i].price, products[i].imgPath);
            }

            sessionStorage.removeItem("searchResults");
        }else{
            alert("Din sökning gav inga resultat");
        }
    }

    //If checkout page
    if(document.querySelector("body").getAttribute("id") === "checkout"){
        if(sessionStorage.getItem("cart") !== null){  //If the cart is not empty
            let cart = sessionStorage.getItem("cart");  //Entire cart. Items separated by ",". ex. 6,5,42,2332,
            let amount = 0;  //Holds the amount of products in the cart

            for(let i = 0; i < cart.length; i++){
                if(cart[i] === ","){  //After every "," counts as 1 item
                    amount++;  
                }
            }

            let products = await getCartItems(cart);  //Get the products in the cart as objects
            
            for(let i = 0; i < amount; i++){  //Create the product sections
                createProductSection(products[i].productId, products[i].productName, products[i].consoleType, products[i].price, products[i].imgPath);
            }
            
            document.getElementById("order").style.display = "initial";  //Show order button
            document.getElementById("order").onclick = createOrder;  //Assigns the button to the createOrder function
        }else{  //If the cart is empty
            document.getElementById("order").style.display = "none";  //Hide order button
        }
    }

    //If admin page
    if(document.querySelector("body").getAttribute("id") === "admin"){
        searchProductForm = document.getElementById("searchProduct");  //Search product form on admin site
        searchUserForm = document.getElementById("searchUser");  //Search user form on admin site

        searchProductForm.addEventListener("submit", searchProduct);  //search product on click

        document.getElementById("changeAddForm").submit.addEventListener("click", () =>{  //Create product on click
            createProduct(document.getElementById("changeAddForm"));  //Create product (form reference)
        });
    }

    //If product page
    if(document.querySelector("body").getAttribute("id") === "product"){
        console.log(sessionStorage.getItem("product"));
        getProduct();
        sessionStorage.removeItem("product");
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

    fetch("http://its.teknikum.it:8080/tuvestams-spel-shop/resources/user", {
        method: "GET",
        mode: 'cors',
        headers: {
            'Authorization': 'Basic ' + encrypted
        },
        }).then((response) => {
            console.log(response.status);
            
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
    sessionStorage.removeItem("cart");  //Clears the cart
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

/**
 * Creates a product section 
 * 
 * @param {Int} productId 
 * @param {String} productName 
 * @param {String} console 
 * @param {Int} price 
 * @param {String} imgPath 
 */
function createProductSection(productId, productName, console, price, imgPath){
    let sec = document.createElement("section");  //Product container
    let img = document.createElement("img");  //Path to img
    let link = document.createElement("a");  //Link to product page
    let titleH2 = document.createElement("h2");  //Game title
    let priceH2 = document.createElement("h2");  //Game price
    let consoleH2 = document.createElement("h2"); //Game console

    let btn = document.createElement("button");  //Button

    if(document.querySelector("body").getAttribute("id") === "checkout"){  //If checkout page
        btn.onclick = removeProductFromCart;  //Assign remove cart function
        btn.innerHTML = "Ta bort";  //Changes button text
    }else if(document.querySelector("body").getAttribute("id") === "search"){  //If search page
        btn.onclick = addProductToCart;  //Assign addProductToCart function
        btn.innerHTML = "Lägg till";  //Changes button text
    }

    if(document.querySelector("body").getAttribute("id") === "admin"){ //If admin page
        let btn2 = document.createElement("button");

        btn.innerHTML = "Ta bort";

        btn2.innerHTML = "Ändra";
        btn2.setAttribute("value", productId);

        btn.onclick = deleteProduct;
        btn2.onclick = fillEditForm;

        sec.append(btn2);
    }

    link.setAttribute("href", "./product.html");  //Set link path
    img.setAttribute("src", imgPath);  //Set img path
    titleH2.innerHTML = productName;  //Set game title
    consoleH2.innerHTML = console;  //Set console type
    priceH2.innerHTML = price + " kr";  //Set price
    btn.setAttribute("value", productId);  //Set product id the on button

    link.addEventListener("click", () => {  //When the link is clicked
        sessionStorage.setItem("product", productId)  //Sets id on click
    });
    link.append(titleH2);  //Makes the title a link

    /* Adds the elements to the section */
    sec.append(img);
    sec.append(link);
    sec.append(consoleH2);
    sec.append(priceH2);
    sec.append(btn);

    if(document.querySelector("body").getAttribute("id") === "admin"){  //If admin page
        document.getElementById("productsContainer").append(sec);  //Add the section to the productsContainer
    }else{ //If not admin page
        document.querySelector("article").append(sec);  //Add the sectino to the article
    }
}

/**
 * Adds the clicked product to the cart
 */
function addProductToCart(){  //Adds the product to the cart
    if(sessionStorage.getItem("userName") !== null){  //If the user is logged in
        if(sessionStorage.getItem("cart") !== null){  //If items are added to the cart
            let currentCart = sessionStorage.getItem("cart");  //Gets the cart products
            currentCart += event.target.value + ",";  //Adds the product to the cart

            sessionStorage.setItem("cart", currentCart);  //Updates the cart
        }else{  //Else add first item to the cart
            sessionStorage.setItem("cart", event.target.value + ",");  //Adds the product to the cart
        }
    }else{  //Not logged in
        alert("Du måste vara inloggad för att lägga till en produkt");
    }
}

/**
 * Removes the clicked product from the cart
 */
function removeProductFromCart(){
    let currentCart = sessionStorage.getItem("cart");  //Gets the cart items
    let product = event.target.value;  //Gets the id from the clicked product
    let newCart = currentCart.replace(product + ",", ""); //Removes the item from the cart

    sessionStorage.setItem("cart", newCart);  //Updates the cart
}

/**
 * Takes the value from the search field and checks with the database if the item exists.
 * 
 * If the item(s) exists returns and saves the result in session storage "searchResults" 
 */
async function searchProduct(){
    let searchValue = event.target.searchBar.value.trim();

    let productData = {
        'productName': searchValue
    };

    await fetch("http://its.teknikum.it:8080/tuvestams-spel-shop/resources/product/search/productName", {
        method: "GET",
        mode: 'cors',
        headers: {
            'productName': JSON.stringify(productData)  
        },
        }).then((response) => {
            console.log("Status : " + response.status);

            return response.json();
        }).then(data =>{
            sessionStorage.setItem("searchResults", JSON.stringify(data));  //Add the products to searchResults
        }).catch(err => {
            console.error(err);          
        });
        
    if(document.querySelector("body").getAttribute("id") !== "admin"){
        if(document.querySelector("body").getAttribute("id") === "index"){  //Different url from index
            location.replace("./pages/search.html");
        }else{
            location.replace("./search.html");
        }
    }else{
        let container = document.getElementById("productsContainer");  //Saves reference to the productContainer where the products are created

        while(container.firstChild){  //While the container has children (Previous search), remove until empty
            container.removeChild(container.lastChild);  //Remove last child
        }

        if(sessionStorage.getItem("searchResults") !== null){  //If there are results
            let products = JSON.parse(sessionStorage.getItem("searchResults"));  //Parse the JSON string to json objects
            let amountOfProducts = Object.keys(products).length;  //Count the amount of objects

            for(let i = 0; i < amountOfProducts; i++){  //Create the product sections
                createProductSection(products[i].productId, products[i].productName, products[i].consoleType, products[i].price, products[i].imgPath);
            }

            sessionStorage.removeItem("searchResults");
        }else{
            alert("Din sökning gav inga resultat");
        }
    }

}
    
/**
 * Takes the items from the cart (their ids) and returns the products as objects
 * 
 * items = "65,2,44,5,"
 * @param {String} items 
 */
async function getCartItems(items){
    let products;  //Holds the cart products

    await fetch("http://its.teknikum.it:8080/tuvestams-spel-shop/resources/product/search/productName", {
        method: "GET",
        mode: 'cors',
        headers: {
            'productName': items  
        },
        }).then((response) => {
            console.log("Status : " + response.status);

            return response.json();
        }).then(data =>{
            products = data;
        }).catch(err => {
            console.error(err);
    });

    return products
}

/**
 * Takes the items in the users cart and creates and order for the logged in user 
 */
async function createOrder(){
//json, json, json
    let date = new Date();  
    let month = date.getMonth() + 1;  //Day
    let day = date.getDate();  //Month
    let year = date.getFullYear();  //Year
    
    if(month < 10){  //If the month is ex. 2 i will look like 02 instead. Makes the month double digit
        month = "0" + month;
    }

    let fullDate = year + "-" + month + "-" + day;  //Date format
    let userName = sessionStorage.getItem("userName");  //Logged in user
    let products = [];  //Holds the products orders "{json},{json},{json}"
    let amount = {};  //Holds the amount of each item ordered
    let ids = sessionStorage.getItem("cart").slice(0, -1).split(",");  //Slices removes last ",". Split splits the order ids into an array

    for(let i = 0; i < ids.length; i++){
        var num = ids[i];
        amount[num] = amount[num] ? amount[num] + 1 : 1;  //Adds the amount of each item in amount
    }

    for(let i = 0; i < Object.keys(amount).length; i++){  //Creates the jsons string and parses into object. Adds the object to an array
        products.push(JSON.parse('{"userName":"' + userName + '","productId":' + Object.keys(amount)[i] + ',"amountPurchased":' + amount[Object.keys(amount)[i]] + ',"purchaseDate":"' + fullDate + '"}'));
    }

    console.log(products);

    await fetch("http://its.teknikum.it:8080/tuvestams-spel-shop/resources/order", {
        method: "POST",
        mode: "no-cors",
        headers:{
            "Content-Type": "text/plain"
        },
        body: products
    }).then((response) => {
        if(response.ok){
            document.getElementById("order").innerHTML = "Tillbaka till start";
            document.getElementById("order").onclick = location.replace("../index.html");
            sessionStorage.removeItem("cart");
        }

        console.log("Status : " + response.status);

        return response.json();
    }).catch(err =>{
        console.error(err);
    });
}

async function getOrders(){
    await fetch("http://its.teknikum.it:8080/tuvestams-spel-shop/resources/order", {
        method: "GET",
        mode: 'cors',
        headers: {
            'consoleType': JSON.stringify(consoleType)
        },
        }).then((response) => {
            console.log("Status : " + response.status);

            return response.json();
        }).then(data =>{
            sessionStorage.setItem("searchResults", JSON.stringify(data));  //Add the products to searchResults
        }).catch(err => {
            console.error(err);
    });
}

function createProduct(values){  //values is a reference to the form elements
    let productInfo = {
        "name": values.name.value,
        "consoleType": values.consoleType.value,
        "info": values.info.value,
        "price": values.price.value,
        "imagePath": values.imagePath.value,
        "amountInStock": values.amount.value
    };

    fetch("http://its.teknikum.it:8080/tuvestams-spel-shop/resources/product", {
        method: "POST",
        mode: "no-cors",
        headers:{
            "Content-Type": "text/plain"
        },
        body: JSON.stringify(productInfo)
    }).then((response) => {
        console.log("Status : " + response.status);

        return response.json();
    }).catch(err =>{
        console.error(err);
    });
}

function editProduct(values){  //values is a reference to the form elements
    let productInfo = {
        "name": values.name.value,
        "consoleType": values.consoleType.value,
        "info": values.info.value,
        "price": values.price.value,
        "imagePath": values.imagePath.value,
        "amountInStock": values.amount.value
    };

    fetch("http://its.teknikum.it:8080/tuvestams-spel-shop/resources/product", {
        method: "POST",
        mode: "no-cors",
        headers:{
            "Content-Type": "text/plain"
        },
        body: JSON.stringify(productInfo)
    }).then((response) => {
        console.log("Status : " + response.status);

        return response.json();
    }).catch(err =>{
        console.error(err);
    });
}

function deleteProduct(){
    let id = event.target.value;

    let productId = {
        'productId': id
    };

    fetch("http://its.teknikum.it:8080/tuvestams-spel-shop/resources/product", {
        method: "DELETE",
        mode: 'cors',
        headers: {
            'productId': JSON.stringify(productId)
        },
        }).then((response) => {
            console.log("Status : " + response.status);

            if(response.ok){
                id.parentNode.removeChild(id.parentNode);
            }

            return response.json();
        }).catch(err => {
            console.error(err);
    });
}

async function searchConsoleType(){
    let searchedConsole = event.target.value;

    let consoleType = {
        'consoleType': searchedConsole
    };

    await fetch("http://its.teknikum.it:8080/tuvestams-spel-shop/resources/product/search/consoleType", {
        method: "GET",
        mode: 'cors',
        headers: {
            'consoleType': JSON.stringify(consoleType)
        },
        }).then((response) => {
            console.log("Status : " + response.status);

            return response.json();
        }).then(data =>{
            sessionStorage.setItem("searchResults", JSON.stringify(data));  //Add the products to searchResults
        }).catch(err => {
            console.error(err);
    });

    if(document.querySelector("body").getAttribute("id") === "index"){  //Different url from index
        location.replace("./pages/search.html");
    }else{
        location.replace("./search.html");
    }
}

/*Fetches a product(s) by id*/
async function getProduct(){
    let product;  //Holds the product 

    let productId = {
        'productName': sessionStorage.getItem("product")
    };

    await fetch("http://its.teknikum.it:8080/tuvestams-spel-shop/resources/product/search/productName", {
        method: "GET",
        mode: 'cors',
        headers: {
            'productName': JSON.stringify(productId)
        },
        }).then((response) => {
            console.log("Status : " + response.status);

            const productInfo = response.json();
            return productInfo;
        }).then(data =>{
            console.log(data);
            product = data;  //save the product
        }).catch(err => {
            console.error(err);
    });

    if(document.querySelector("body").getAttribute("id") === "product"){
        let title = document.getElementById("title");  //Game title h2
        let info = document.getElementById("info");  //Game info p
        let consoleType = document.getElementById("consoleType");  //Console type h2
        let stock = document.getElementById("stock");  //Games left h2
        let price = document.getElementById("price");  //Game price h2
        let btn = document.getElementById("addBtn");  //Add product button
    
        /* Assign the values to the respectiv element */
        title.innerHTML = product[0].productName;
        info.innerHTML = product[0].info;
        consoleType.innerHTML = product[0].consoleType;
        stock.innerHTML = product[0].amountInStock + " Kvar";
        price.innerHTML = product[0].price + " Kr";
        btn.setAttribute("value", product[0].productId);
    
        if(product.amount < 1){
            btn.style.disabled = true;
        }else{
            btn.onclick = addProductToCart;
        }
    }else{
        return product;
    }
}

function createOrderSection(){
    let totalPrice = 0;  //Total price of order

    let article = document.createElement("article");  //Order container

    let orderNumber = document.createElement("h1");  //Order number container
    orderNumber.innerHTML = "Order #" + /*Order number here*/"";  //Set order number
    article.append(orderNumber);  //Add order number to the article

    let sections = [];  //Products container
    for(let i = 0; i < /*amountOfDifferentProducts*/1; i++){
        sections[i] = document.createElement("section");

        let title = document.createElement("h2");  //Title elem
        let console = document.createElement("h2");  //Console elem
        let price = document.createElement("h2");  //Price elem

        totalPrice += price;

        title.innerHTML = /*Title here*/"";  //Set title
        console.innerHTML = /*ConsoleType here*/"";  //Set console type
        price.innerHTML = /*Price here*/"kr";  //Set price

        sections[i].append(title);  //Add title to section
        sections[i].append(console);  //Add console type to section
        sections[i].append(price);  //Add price to section

        article.append(sections[i]);  //Add the section to the article
    }

    let total = document.createElement("h1");  //Total price elem
    total.innerHTML = "Totalt: " + totalPrice + "kr";  //Set total price

    document.getElementById("orders").append(article); //Add the order to orders
}

function fillEditForm(){
    sessionStorage.setItem("product", event.target.value);  //Clicked product id saved in product

    let form = document.getElementById("changeAddForm");  //reference to the Admin page change/add form

    getProduct().then(productInfo => {  //Promise from fetch
        sessionStorage.removeItem("product");  //Clear the session storage
    
        /* Fill in the form with the product info */
        form.name.value = productInfo[0].productName;
        form.consoleType.value = productInfo[0].consoleType;
        form.info.value = productInfo[0].info;
        form.price.value = productInfo[0].price;
        form.imagePath.value = productInfo[0].imagePath;
        form.amount.value = productInfo[0].amountInStock;
    
        form.submit.value = "Ändra produckt";  //Change button text  

        form.submit.removeEventListener("click", createProduct, false);

        form.submit.addEventListener("click", ()=>{
            editProduct(form);  //On button click, edit the existing product
        });
    });
}