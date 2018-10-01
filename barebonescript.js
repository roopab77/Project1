  // Adding click event listen listener to all buttons
  var x = document.getElementById("demo");
  var latitude = 40.7128;
  var longitude = -74.0060;

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      x.innerHTML = "Geolocation is not supported by this browser.";
    }
  }

  function showPosition(position) {
    x.innerHTML = "Latitude: " + position.coords.latitude +
      "<br>Longitude: " + position.coords.longitude;

    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
  }

 // getLocation();

  // Grabbing and storing the data-animal property value from the button
  var foodCategory = "Chinese";
  var latitude = 40.7128;
  var longitude = -74.0060;

  var queryURL = "https://api.yelp.com/v3/businesses/search?term=" + foodCategory + "&latitude=" + latitude + "&longitude=" + longitude;
  var corsURL = "https://cors-anywhere.herokuapp.com/" + queryURL
  $.ajax({
    url: corsURL,
    method: "GET",
    headers: {
      'Authorization': "Bearer fuVkmZQYUYVOHcZ3I8yKQTuSmfEr8EfaInmXRf2OqTHirXDr_Gb___dWPEnxf6MGaEZd6YtL5V5hIZvgg7zbnBG2GJeCdPG2Tmwm9V2k8lKXYUKz4ODh750gbliuW3Yx"
    }

  }).then(function (response) {
    console.log(response);
    var divRow = $("<div>");
    for (var i=0; i<10;i++)
    {
      var divCol = $("<div>").addClass("col-md-2");
      var divCard = $("<div>").addClass("card");
      var imgtag = $("<img>").addClass("card-img-top");
      var divCardbody = $("<div>").addClass("card-body");
      var pcardtext = $("<p>").addClass("card-text");
      imgtag.attr("src",response.businesses[i].image_url);
      imgtag.attr
      pcardtext.append(response.businesses[i].name);
      pcardtext.append(response.businesses[i].display_address);
      divCardbody.append(pcardtext);
      divCard.append(imgtag);
      divCard.append(divCardbody);
      $("#results-appear-here").append(divCard);
      //divCol.append(divCard);
      //divRow.append(divCol);
    }
    
    console.log(divCol);
   
  });

  
        