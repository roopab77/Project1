//These are default values for NY city.
var latitude = 40.7128;
var longitude = -74.0060;
var category = "";

//Get location
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    //x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  // x.innerHTML = "Latitude: " + position.coords.latitude +
  //  "<br>Longitude: " + position.coords.longitude;

  latitude = position.coords.latitude;
  longitude = position.coords.longitude;

}


function buildQueryURL(foodCategory) {
  // queryURL is the url we'll use to query the API

  var appID = "5ed766c5";
  var apiKey = "28992938ae132c1c2a3ed5a1a0bd7a4f";

  var queryURL = "http://api.yummly.com/v1/api/recipes?_app_id=" + appID + "&_app_key=" + apiKey + "&q=" +
    foodCategory + "&allowedCuisine[]cuisine^" + foodCategory;

  //console.log(queryURL);
  return queryURL;
}

function buildQueryURLforID(recipeID) {
  var appID = "5ed766c5";
  var apiKey = "28992938ae132c1c2a3ed5a1a0bd7a4f";
  var queryUrlByID = "http://api.yummly.com/v1/api/recipe/" + recipeID + "?_app_id=" + appID + "&_app_key=" +
    apiKey;

  return queryUrlByID;
}

function updatePage(RecipeData) {
  var recipeUl = $("#recipe-list-ul");
  recipeUl.empty();
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
  var ingredients = response.ingredientLines;
  $("#recipe-name").text(response.name);
  var recipeInstructions = $("<a>");
  var ingredientUL = $("<ul>");
  var recipeImage = $("<img>");
  for (var i = 0; i < ingredients.length; i++) {
    var ingredientLI = $("<li>");
    ingredientLI.text(ingredients[i]);
    ingredientUL.append(ingredientLI);
  }

  var recipelink = response.source.sourceRecipeUrl;
  var strarr = recipelink.split(".com");
  recipeInstructions.text(strarr[0] + "....");
  recipeInstructions.attr("href", recipelink);
  recipeInstructions.attr("target", "_blank");
  recipeInstructions.attr("rel", "nofollow");
  recipeImage.attr("src", response.images[0].hostedLargeUrl);
  $("#recipe-ingredients").append(ingredientUL);
  $("#recipe-ingredients").append("For more instructions click here ");
  $("#recipe-ingredients").append(recipeInstructions);
  $("#recipe-image").append(recipeImage);


}

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
    console.log(response);
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
// CLICK HANDLERS
// ==========================================================

// .on("click") function associated with the dropdown Button
$(".recipe-category").on("click", function (event) {
  $(".btn:first-child").text($(this).text());
  $(".btn:first-child").val($(this).text());
  event.preventDefault();

  category = $(this).attr("value");
  var queryURL = buildQueryURL(category);
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(updatePage);
});


$(document).on("click", ".recipe-link", function (event) {
  //console.log($(this));

  var recipeID = $(this).attr("value");
  //console.log(recipeID);
  var queryUrlByID = buildQueryURLforID(recipeID);

  $.ajax({
    url: queryUrlByID,
    method: "GET"
  }).then(function (response) {
    //console.log(response);
    GetRecipeDetails(response);
  });

});

//on page load load the carousel with images 
$(document).ready(function () {
  getLocation();

//This is for carousel
$(".vertical-center-4").slick({
  dots: true,
  vertical: true,
  centerMode: true,
  slidesToShow: 4,
  slidesToScroll: 2
});
$(".vertical-center-3").slick({
  dots: true,
  vertical: true,
  centerMode: true,
  slidesToShow: 3,
  slidesToScroll: 3
});
$(".vertical-center-2").slick({
  dots: true,
  vertical: true,
  centerMode: true,
  slidesToShow: 2,
  slidesToScroll: 2
});
$(".vertical-center").slick({
  dots: true,
  vertical: true,
  centerMode: true,
});
$(".vertical").slick({
  dots: true,
  vertical: true,
  slidesToShow: 3,
  slidesToScroll: 3
});
$(".regular").slick({
  dots: true,
  infinite: true,
  slidesToShow: 3,
  slidesToScroll: 3
});
$(".center").slick({
  dots: true,
  infinite: true,
  centerMode: true,
  slidesToShow: 5,
  slidesToScroll: 3
});
$(".variable").slick({
  dots: true,
  infinite: true,
  variableWidth: true
});
$(".lazy").slick({
  lazyLoad: 'ondemand', // ondemand progressive anticipated
  infinite: true
});
});