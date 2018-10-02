// FB key
var config = {
  apiKey: "AIzaSyBd48dzN-XI4-K8ay8IdXIlkm1__G5_NS8",
  authDomain: "quisine-49ccf.firebaseapp.com",
  databaseURL: "https://quisine-49ccf.firebaseio.com",
  projectId: "quisine-49ccf",
  storageBucket: "quisine-49ccf.appspot.com",
  messagingSenderId: "962399784259"
};
firebase.initializeApp(config);

var database = firebase.database();

//  Create Firebase event for adding employee to the database and a row in the html when a user adds an entry 

database.ref().on("child_added", function(childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a variable.
  var recName = childSnapshot.val().recipeName;
  var ingredients = childSnapshot.val().ingredients;
  var image = childSnapshot.val().imageLink;
  var recLink = childSnapshot.val().recipeLink;

  console.log("ingredients:" + ingredients);
  console.log("recipe Name: " + recName);
  console.log("recipelink" + recLink);
  console.log("imagelink " + image);

  var divCard = $("<div>").addClass("card");
  var imgtag = $("<img>").addClass("card-img-top img-recipe");
  var divCardbody = $("<p>").addClass("card-body recipe-card");
  var pcardtext = $("<p>").addClass("card-text recipe-name");
  imgtag.attr("src", image);
  imgtag.attr
  pcardtext.append(recName);
  pcardtext.append("<br/>" + ingredients);
  pcardtext.append("<br/>" + recLink);
  //console.log(response.businesses[i].name,response.businesses[i].display_address);
  divCardbody.append(pcardtext);
  divCard.append(imgtag);
  divCard.append(divCardbody);
  $("#details-appear-here").append(divCard);



  // var divCard = $("<div>").addClass("card");
  // var imgtag = $("<img>").addClass("card-img-top img-recipe");
  // var divCardbody = $("<div>").addClass("card-body recipe-card");
  // var pcardtext = $("<p>").addClass("card-text recipe-name");
  // imgtag.attr("src", image);
  // imgtag.attr
  // pcardtext.append(recName);
  // pcardtext.append("<br/>" + ingredients);
  // pcardtext.append("<br/>" + recLink);
  // //console.log(response.businesses[i].name,response.businesses[i].display_address);
  // divCardbody.append(pcardtext);
  // divCard.append(imgtag);
  // divCard.append(divCardbody);
  // $("#details-appear-here").append(divCard);

});
