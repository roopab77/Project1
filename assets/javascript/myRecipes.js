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
var uid = localStorage.getItem("uid");

// upon successful login, in the callback say uid = result.user.uid

var database = firebase.database();

//  Create Firebase event for adding employee to the database and a row in the html when a user adds an entry 

database.ref(uid).on("child_added", function(childSnapshot) {
  //console.log(childSnapshot.val());

  // Store everything into a variable.
  var recName = childSnapshot.val().recipeName;
  var ingredients = childSnapshot.val().ingredients;
  var image = childSnapshot.val().imageLink;
  var recLink = childSnapshot.val().recipeLink;
  var recipeID = childSnapshot.val().recipeID;
  var keyinFB = childSnapshot.key;
  //console.log(ingredients);

  var divCard = $("<div>").addClass("card main-card");
  divCard.attr("style","height: 250px; width: 95%; margin:10px; min-width:95%");
  var divCardHeader = $("<div>").addClass("card-header");
  var h5CardTitle = $("<h5>").addClass("card-title");
  var divCardBody = $("<div>").addClass("card-body");
  divCardBody.attr("style", "overflow:auto");
  var divrow = $("<div>").addClass("row");
  var divcol1 = $("<div>").addClass("col-6");
  var divcol2 = $("<div>").addClass("col-3");
  var divcol3 = $("<div>").addClass("col-3");
  var deleteButton = $("<button>").addClass("btn btn-secondary delete-RecipefromFB");
  var ulTag = $("<ul>");
  var imgTag = $("<img>");
  imgTag.attr("style"," height: 200px;");
  var recipelinkTag = $("<div>").addClass("card-footer");
  var aHref = $("<a>");
  var strarr = recLink.split(".com");

  //var arrayIngredients = JSON.parse(ingredients,"");
  h5CardTitle.text(recName);
  aHref.attr("href",recLink);

  aHref.text(strarr[0] + "....");  
  imgTag.attr("src",image);
  //console.log(ingredients.length);
  for(var i=0;i<ingredients.length;i++)
  {
    var liTag = $("<li>");
    liTag.text(ingredients[i]);
    ulTag.append(liTag);
  }
  deleteButton.text("Delete");
  deleteButton.attr("id", keyinFB);
  divcol1.append(ulTag);
  divcol2.append(imgTag);
  divcol3.append(deleteButton);
  divrow.append(divcol1);
  divrow.append(divcol2);
  divrow.append(divcol3);
  divCardBody.append(divrow);
  divCardHeader.append(h5CardTitle);
  divCard.append(divCardHeader);
  divCard.append(divCardBody);
  recipelinkTag.append("For more details - ");
  recipelinkTag.append(aHref);
  divCard.append(recipelinkTag);

  
  $("#details-appear-here").append(divCard);

});

$(document).on("click", ".delete-RecipefromFB", function (event) {
  
  
  database.ref(uid + "/" + $(this).attr("id")).remove();
 // database.ref(uid + "/" + $(this).attr("id")).remove()
  //alert($(this).attr("id"));
  $( this ).parent().parent().parent().parent().attr("class","");
  $( this ).parent().parent().parent().parent().attr("style","height:0px"); 
  $( this ).parent().parent().parent().parent().empty();
  
  
});



