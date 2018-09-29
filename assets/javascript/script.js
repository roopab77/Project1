function buildQueryURL(foodCategory) {
  // queryURL is the url we'll use to query the API

  var appID = "5ed766c5";
  var apiKey = "28992938ae132c1c2a3ed5a1a0bd7a4f";

  var queryURL = "http://api.yummly.com/v1/api/recipes?_app_id=" + appID + "&_app_key=" + apiKey + "&q=" +
    "Easy Italian Recipes" + "&allowedCuisine[]cuisine^" + foodCategory;

    console.log(queryURL);
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
  for (var i = 0; i < RecipeData.matches.length; i++) {
    var recipeLI = $("<li>");
    var recipelink = $("<a>");
    recipelink.addClass("card-link");
    recipelink.text(RecipeData.matches[i].sourceDisplayName);
    recipelink.attr("value", RecipeData.matches[i].id);
    recipelink.attr("href","#");
    recipelink.attr("class", "recipe-link");
    recipeLI.attr("value", RecipeData.matches[i].id);
    recipeLI.html(recipelink);
    recipeUl.append(recipeLI);
  }
}

//Append the ingredients, link to instructions, recipe title and the image 
function GetRecipeDetails(response)
{
  
  $("#recipe-ingredients").empty();
  $("#recipe-image").empty();
  var ingredients = response.ingredientLines;
  $("#recipe-name").text(response.name);  
  var recipeInstructions = $("<a>");
  var ingredientUL = $("<ul>");
  var recipeImage = $("<img>");
  for (var i = 0; i< ingredients.length ; i++)
  {
    console.log(ingredients[i]);
    var ingredientLI = $("<li>");
    ingredientLI.text(ingredients[i]);    
    ingredientUL.append(ingredientLI);
  }
  
  var recipelink = response.source.sourceRecipeUrl;
  var strarr = recipelink.split(".com");  
  recipeInstructions.text(strarr[0] + "....");
  recipeInstructions.attr("href",recipelink);
  recipeInstructions.attr("target","_blank");
  recipeInstructions.attr("rel","nofollow");
  recipeImage.attr("src",response.images[0].hostedLargeUrl);
  $("#recipe-ingredients").append(ingredientUL);
  $("#recipe-ingredients").append("For more instructions click here ");
  $("#recipe-ingredients").append(recipeInstructions);
  $("#recipe-image").append(recipeImage);


}

// Function to empty out the articles
function clear() {
  $("#recipe-list-ul").empty();
}



// CLICK HANDLERS
// ==========================================================

// .on("click") function associated with the Search Button
$("#category").on("click", function (event) {
  // This line allows us to take advantage of the HTML "submit" property
  // This way we can hit enter on the keyboard and it registers the search
  // (in addition to clicks). Prevents the page from reloading on form submit.
  event.preventDefault();

  // Empty the region associated with the articles
  clear();
  var category = $(this).attr("value");
  // Build the query URL for the ajax request to the NYT API
  var queryURL = buildQueryURL(category);

  // Make the AJAX request to the API - GETs the JSON data at the queryURL.
  // The data then gets passed as an argument to the updatePage function
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(updatePage);
});


  $(document).on("click",".recipe-link",function(event){
  console.log($(this));

  var recipeID = $(this).attr("value");
  console.log(recipeID);
  var queryUrlByID = buildQueryURLforID(recipeID);

  $.ajax({
    url: queryUrlByID,
    method: "GET"}).then(function (response) {
    console.log(response);
    GetRecipeDetails(response);
    });
    
});