$(document).ready(function () {

  //This is for Google sigin

  var provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope("profile");
  provider.addScope("email");

  // global variable for FB
  var ingredientsforFB = [];
  var recipenameforFB = "";
  var recipeLinkforFB = "";
  var imagelinkforFB = "";
  var recipeIDforFB = "";
  var CategoryforFB = "";


  //These are default values for NY city.

  var latitude = 40.7128;
  var longitude = -74.0060;
  var category = "";
  var TopTrendingrecipe = "";

  //Get current location of the user 
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      //x.innerHTML = "Geolocation is not supported by this browser.";
    }
  }

  //this is used to get the current location of the user 
  function showPosition(position) {
    // x.innerHTML = "Latitude: " + position.coords.latitude +
    //  "<br>Longitude: " + position.coords.longitude;

    latitude = position.coords.latitude;
    longitude = position.coords.longitude;

  }

  //Builds query to get the initial recipes based on category
  function buildQueryURL(foodCategory) {
    // queryURL is the url we'll use to query the API

    var appID = "5ed766c5";
    var apiKey = "28992938ae132c1c2a3ed5a1a0bd7a4f";

    var queryURL = "https://api.yummly.com/v1/api/recipes?_app_id=" + appID + "&_app_key=" + apiKey + "&q=" +
      foodCategory + "&allowedCuisine[]cuisine^" + foodCategory;
    //For FB
    CategoryforFB = foodCategory;
    //console.log(queryURL);
    return queryURL;
  }

  //Builds a query to get details of the recipe with recipe ID 
  function buildQueryURLforID(recipeID) {
    var appID = "5ed766c5";
    var apiKey = "28992938ae132c1c2a3ed5a1a0bd7a4f";
    var queryUrlByID = "https://api.yummly.com/v1/api/recipe/" + recipeID + "?_app_id=" + appID + "&_app_key=" +
      apiKey;

    return queryUrlByID;
  }

  //On page load fill the  page with top trending recipes and the details of the top recipe 
  function TopTrendingRecipesOnPageLoad() {
    var queryURL = buildQueryURL("trending");
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function (matches) {

      updatePage(matches);

      var recipeID = TopTrendingrecipe;

      var queryUrlByID = buildQueryURLforID(recipeID);
      //console.log("onload url to pull details   " + queryUrlByID);

      $.ajax({
        url: queryUrlByID,
        method: "GET"
      }).then(function (response) {
        //console.log(response);
        GetRecipeDetails(response);
      });
    });
  }

  //Get the list of recipes for the specific category selected in the dropdown menu
  function updatePage(RecipeData) {
    var recipeUl = $("#recipe-list-ul");
    recipeUl.empty();
    TopTrendingrecipe = RecipeData.matches[0].id;
    //console.log("Toptrendingrecipe  " + TopTrendingrecipe);
    for (var i = 0; i < RecipeData.matches.length; i++) {
      var recipeLI = $("<li>");
      var recipelink = $("<a>");
      recipelink.addClass("card-link");
      recipelink.text(RecipeData.matches[i].recipeName);
      recipelink.attr("value", RecipeData.matches[i].id);
      recipelink.attr("href", "#");
      recipelink.attr("class", "recipe-link");
      recipeLI.attr("value", RecipeData.matches[i].id);
      recipeLI.html(recipelink);
      recipeUl.append(recipeLI);
    }
    LoadRestaurants();
  }

  //Append the ingredients, link to instructions, recipe title and the image 
  function GetRecipeDetails(response) {

    $("#recipe-ingredients").empty();
    $("#recipe-image").empty();
    $(".nutrients-row").empty();
    var ingredients = response.ingredientLines;
    $("#recipe-name").text(response.name);
    // For FB
    recipeNameforFB = response.name;
    var recipeInstructions = $("<a>");
    var ingredientUL = $("<ul>");
    var recipeImage = $("<img>");
    for (var i = 0; i < ingredients.length; i++) {
      var ingredientLI = $("<li>");
      ingredientLI.text(ingredients[i]);
      ingredientUL.append(ingredientLI);
      // For FB
      ingredientsforFB.push(ingredients[i]);
    }

    var recipelink = response.source.sourceRecipeUrl;
    //For saving into firebase
    imagelinkforFB = response.images[0].hostedLargeUrl;
    recipeLinkforFB = recipelink;
    var strarr = recipelink.split(".com");
    recipeInstructions.text(strarr[0] + "....");
    recipeInstructions.attr("href", recipelink);
    recipeInstructions.attr("target", "_blank");
    recipeInstructions.attr("rel", "nofollow");
    recipeImage.attr("src", response.images[0].hostedLargeUrl);
    recipeImage.addClass("img-fluid");
    $("#recipe-ingredients").append(ingredientUL);
    $("#recipe-ingredients").append("For more instructions click here ");
    $("#recipe-ingredients").append(recipeInstructions);
    $("#recipe-image").append(recipeImage);

    // NUTRITION FACTS BUTTON AND INFO GET----------------
    var nutritionBtn = $("<button>")
    nutritionBtn
      .addClass("btn btn-info")
      .attr({
        "type": "button",
        "data-toggle": "collapse",
        "data-target": "#nutrition-table",
        "aria-expanded": "false",
        "aria-controls": "nutrition-table"
      })
      .text("Nutrition Facts");
    $("#nutrition-btn-container").html(nutritionBtn);

    var nutrients = response.nutritionEstimates;

    for (var i = 0; i < nutrients.length; i++) {
      if (nutrients[i].attribute === "ENERC_KCAL") {
        $("<td>")
          .text("Calories:")
          .appendTo($("#calories"));
        $("<td>")
          .text(Math.round(nutrients[i].value) + " " + nutrients[i].unit.abbreviation)
          .appendTo($("#calories"));
      }

      if (nutrients[i].attribute === "FAT") {
        $("<td>")
          .text("Total Fat:")
          .appendTo($("#fat"));
        $("<td>")
          .text(Math.round(nutrients[i].value) + " " + nutrients[i].unit.abbreviation)
          .appendTo($("#fat"));
      }

      if (nutrients[i].attribute === "CHOLE") {
        $("<td>")
          .text("Cholesterol:")
          .appendTo($("#cholesterol"));
        $("<td>")
          .text(Math.round(nutrients[i].value) + " " + nutrients[i].unit.abbreviation)
          .appendTo($("#cholesterol"));
      }

      if (nutrients[i].attribute === "NA") {
        $("<td>")
          .text("Sodium:")
          .appendTo($("#sodium"));
        $("<td>")
          .text(Math.round(nutrients[i].value) + " " + nutrients[i].unit.abbreviation)
          .appendTo($("#sodium"));
      }

      if (nutrients[i].attribute === "CHOCDF") {
        $("<td>")
          .text("Total Carbohydrates:")
          .appendTo($("#carbs"));
        $("<td>")
          .text(Math.round(nutrients[i].value) + " " + nutrients[i].unit.abbreviation)
          .appendTo($("#carbs"));
      }

      if (nutrients[i].attribute === "FIBTG") {
        $("<td>")
          .text("Dietary Fiber:")
          .appendTo($("#fiber"));
        $("<td>")
          .text(Math.round(nutrients[i].value) + " " + nutrients[i].unit.abbreviation)
          .appendTo($("#fiber"));
      }

      if (nutrients[i].attribute === "SUGAR") {
        $("<td>")
          .text("Total Sugars:")
          .appendTo($("#sugars"));
        $("<td>")
          .text(Math.round(nutrients[i].value) + " " + nutrients[i].unit.abbreviation)
          .appendTo($("#sugars"));
      }

      if (nutrients[i].attribute === "PROCNT") {
        $("<td>")
          .text("Protein:")
          .appendTo($("#protein"));
        $("<td>")
          .text(Math.round(nutrients[i].value) + " " + nutrients[i].unit.abbreviation)
          .appendTo($("#protein"));
      }
    };

  };

  //From the yelp API get the restaurant details 
  function LoadRestaurants() {
    //var foodCategory = $(".recipe-category").attr("value");

    foodCategory = category;
    var queryURL = "https://api.yelp.com/v3/businesses/search?term=" + foodCategory + "&latitude=" + latitude + "&longitude=" + longitude;
    var corsURL = "https://cors-anywhere.herokuapp.com/" + queryURL
    //console.log(corsURL);
    $.ajax({
      url: corsURL,
      method: "GET",
      headers: {
        'Authorization': "Bearer fuVkmZQYUYVOHcZ3I8yKQTuSmfEr8EfaInmXRf2OqTHirXDr_Gb___dWPEnxf6MGaEZd6YtL5V5hIZvgg7zbnBG2GJeCdPG2Tmwm9V2k8lKXYUKz4ODh750gbliuW3Yx"
      }

    }).then(function (response) {
      // console.log(response);
      var divRow = $("<div>");
      $("#results-appear-here").empty();
      for (var i = 0; i < 6; i++) {

        var divCard = $("<div>").addClass("card");
        var imgtag = $("<img>").addClass("card-img-top img-restaurants");
        var divCardbody = $("<div>").addClass("card-body restaurant-card");
        var pcardtext = $("<p>").addClass("card-text restaurant-name");
        imgtag.attr("src", response.businesses[i].image_url);
        imgtag.attr
        pcardtext.append(response.businesses[i].name);
        pcardtext.append("<br/>" + response.businesses[i].location.display_address);
        pcardtext.append("<br/>Price" + response.businesses[i].price + "   Rating :" + response.businesses[i].rating);
        //console.log(response.businesses[i].name,response.businesses[i].display_address);
        divCardbody.append(pcardtext);
        divCard.append(imgtag);
        divCard.append(divCardbody);
        $("#results-appear-here").append(divCard);
        //divCol.append(divCard);
        //divRow.append(divCol);
      }



    });
  }

  //This function checks if you are already signed in 
  function CheckIfSignedIn()
  {
    var uid = localStorage.getItem("uid");
    if(uid)
    {
      $("#myRecipes").attr("style","visibility:visible");
      $("#signin").attr("style","visibility:hidden");
    }
    else
    {
      $("#myRecipes").attr("style","visibility:hidden");
      $("#signin").attr("style","visibility:visible");
    }

  }

  function authorizedUserSetup(userid){

    if(userid)
    {
      console.log(userid);
    $("#myRecipes").attr("style","visibility:visible");
    $("#signin").attr("style","visibility:hidden");
    }

  }
  // CLICK HANDLERS
  // ==========================================================

  // .on("click") function associated with the dropdown Button
  $(".recipe-category").on("click", function (event) {
    $(".btn:first-child").text($(this).text());
    $(".btn:first-child").val($(this).text());
    event.preventDefault();
    //$("#recipe-details").empty();

    category = $(this).attr("value");

    var queryURL = buildQueryURL(category);
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(updatePage);
  });

  //When earch recipe title is clicked bring the ingredients image and link and nutriotion facts of the recipe
  $(document).on("click", ".recipe-link", function (event) {
    //console.log($(this));

    var recipeID = $(this).attr("value");
    //console.log(recipeID);
    var queryUrlByID = buildQueryURLforID(recipeID);
    //For FB
    recipeIDforFB = recipeID;


    $.ajax({
      url: queryUrlByID,
      method: "GET"
    }).then(function (response) {
      //console.log(response);
      GetRecipeDetails(response);
    });

  });

  //To save the recipes to firebase 
  $("#myRecipes").on("click", function (event) {
    event.preventDefault();
    var uid = localStorage.getItem("uid");
    
    // Creating array to save to FB
    if (uid ) {
      console.log(uid);
      var myRecipe = {

        recipeName: recipeNameforFB,
        ingredients: ingredientsforFB,
        imageLink: imagelinkforFB,
        recipeLink: recipeLinkforFB,
        recipeID: recipeIDforFB,
        recipeCategory: CategoryforFB

      }

      // Saving to FB
      database.ref(uid).push(myRecipe);
    } else {
      return false;
    }

  });

  //Google Signin 

  $("#signin").on("click",function(event){
     //Google Authentication

     firebase.auth().signInWithPopup(provider).then(function (result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;

      authorizedUserSetup(result.user.uid);
      localStorage.setItem("uid", result.user.uid);   
     
      // ...
    }).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
    

  });
  //on page load display the top trending recipes


  //Initializing firebase
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
  $(".regular").slick({
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    useTransform: false,
    responsive: [
      {
        breakpoint: 1100,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 720,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  });
  getLocation();
  TopTrendingRecipesOnPageLoad();
  CheckIfSignedIn();

});