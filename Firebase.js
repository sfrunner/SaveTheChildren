  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyD056csgljl4TQJI0FoQOsg_6uP3CuXVsM",
    authDomain: "airqualityweathergroupproject.firebaseapp.com",
    databaseURL: "https://airqualityweathergroupproject.firebaseio.com",
    storageBucket: "airqualityweathergroupproject.appspot.com",
    messagingSenderId: "1010836363754"
  };
  firebase.initializeApp(config);
 
 //Global Variables Defined
  var emailAddress;
  var cityToAdd;
  var db = firebase.database();

  //Submission of Email Address
  $("#search").click(function(event){
    $(".city-buttons").remove();
    var locationdataValue = $("#locationdata").val().trim();
    var emailValue = $("#email").val().trim();
    if(emailValue != "" && locationdataValue != ""){
      setTimeout(function(){
        if($("#errorBox").html() == null){
        firebaseFunction(event);
      }
     }, 1000);        
      }
  });
  
  //Recall of Angular myFunction defining new city
  $("#previous").on("click",".city-buttons", function(event){
    console.log(event);
    angular.element("#mycontroller").scope().myFunction(event.target.innerHTML);
  });
  
  
  function firebaseFunction(event){
    emailAddress = $("#email").val().trim().replace(".","").replace("@","").toLowerCase();
    cityToAdd = $("#locationdata").val().trim();
    db.ref("/userRecords/").once("value", function(snapshot){
    //If firebase database is empty and not produce an error when checking if emailAddress already exists
      if(snapshot.val() == null){
        console.log("1");
        db.ref("/userRecords/" + emailAddress + "/" + cityToAdd).set({
          city: cityToAdd,
          timeStamp: firebase.database.ServerValue.TIMESTAMP
        });
        db.ref("/userRecords/" + emailAddress).orderByChild("timeStamp").limitToLast(5).once("value", function(snapshot){
          $.each(snapshot.val(), function(i,val){
           createButtons(val.city);
          });
        });
      }
      //to check if emailAddress already exists in database
      else if(snapshot.val().hasOwnProperty(emailAddress) === false){
        console.log("2");
        console.log(snapshot.val().hasOwnProperty(emailAddress));
        db.ref("/userRecords/" + emailAddress + "/" + cityToAdd).set({
          city: cityToAdd,
          timeStamp: firebase.database.ServerValue.TIMESTAMP
        });
        db.ref("/userRecords/" + emailAddress).orderByChild("timeStamp").limitToLast(5).once("value", function(snapshot){
          $.each(snapshot.val(), function(i,val){
           createButtons(val.city);
          });
        });
      }
    //if emailAddress already exists in database, send and retrieve for buttons
      else if(snapshot.val().hasOwnProperty(emailAddress) === true){
        console.log("3");
        db.ref("/userRecords/" + emailAddress + "/" + cityToAdd).set({
          city: cityToAdd,
          timeStamp: firebase.database.ServerValue.TIMESTAMP
        });
        db.ref("/userRecords/" + emailAddress).orderByChild("timeStamp").limitToLast(5).once("value", function(snapshot){
          $.each(snapshot.val(), function(i,val){
           createButtons(val.city);
          });
        });
      } 
    });
  }
  
  //Function for creating buttons
  function createButtons(val){
    var newBTN = $("<button>");
    newBTN.attr("id","discover");
    newBTN.attr("class","city-buttons");
    newBTN.html(val);
    $("#previous").append(newBTN);
  }
  
  
  
  
  
