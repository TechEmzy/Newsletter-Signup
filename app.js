// jshint esversion: 6

require('dotenv').config();
//Requiring express and body parser and initializing the constant "app"
const express= require ("express");
const bodyParser= require ("body-parser");
const request= require ("request");

// Creating https module and require it
const https= require ("https");

  // creating new express app
const app= express();

//The public folder which holds the CSS
app.use(express.static("public"));

//Using bod-parser
app.use(bodyParser.urlencoded({extended:true}));

 // My get request
 //Sending the signup.html file to the browser as soon as a request is made on localhost:3000
app.get("/", function(req,res){
  res.sendFile(__dirname + "/signup.html");
});

  //My post request
app.post("/", function(req,res){
  //*******CHANGE THIS ACCORDING TO THE VALUES YOU HAVE ENTERED IN THE INPUT ATTRIBUTE IN HTML***********
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

// My Javascript data object
//Uploading the data to the server
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        }
      }
    ]
  };

// Turning our JavaScript data object into a Flatpack Json
// This is what we are going to send to mailchimp
  const jsonData = JSON.stringify(data);

// Setting up mailchimp
// Mainchimp url and the list or unique ID to be added at the end of the url.
  const url = process.env.MAILCHIMP_URL

  const options = {
    method: "POST",
    auth: process.env.MAILCHIMP_API_KEY
  }

// Making our request
 const request = https.request(url, options, function(response) {
//Sending the signup.html file to the browser as soon as a request is made on localhost:3000
   if (response.statusCode === 200) {
     res.sendFile(__dirname + "/success.html");
   }
   else{
     res.sendFile(__dirname + "/failure.html");
   }


// making a request that will get sent back from the Mailchimp server and using JSON Parse to parse it.
  response.on("data", function(data){
    // console.log(JSON.parse(data));
  })
})

// Passing the jsonData to the Mailchimp Server and specifying we are done with the request.
request.write(jsonData);
request.end();
});

app.post("/failure", function(req,res){
  res.redirect("/")
})

//once port is set up, log "server is running on port 3000".
app.listen(process.env.PORT || 3000, function(){
  console.log("server is set up on port 3000");
});
