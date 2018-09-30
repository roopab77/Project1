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
    // $("#results-appear-here").append("Latitude: " + latitude + "Longitude: " + latitude);

    $("button").on("click", function () {
      // Grabbing and storing the data-food property value from the button
      var foodCategory = $(this).attr("data-food");

      // Constructing a queryURL using the foodCategory 

      // var yelpId = "oyikWtp5SyiqR1Dp14yt_A";
      // var yelpSecret =
        // "fuVkmZQYUYVOHcZ3I8yKQTuSmfEr8EfaInmXRf2OqTHirXDr_Gb___dWPEnxf6MGaEZd6YtL5V5hIZvgg7zbnBG2GJeCdPG2Tmwm9V2k8lKXYUKz4ODh750gbliuW3Yx";
      var queryURL = "https://api.yelp.com/v3/businesses/search?term=" + foodCategory + "&latitude=" + latitude + "&longitude=" + longitude;
      // "&location=new+york+city+nj";
      // "&latitude=40.82783908257346&longitude=-74.10162448883057";
      var corsURL = "https://cors-anywhere.herokuapp.com/" + queryURL
      $.ajax({
        url: corsURL,
        method: "GET",
        headers: {
          'Authorization': "Bearer fuVkmZQYUYVOHcZ3I8yKQTuSmfEr8EfaInmXRf2OqTHirXDr_Gb___dWPEnxf6MGaEZd6YtL5V5hIZvgg7zbnBG2GJeCdPG2Tmwm9V2k8lKXYUKz4ODh750gbliuW3Yx"
        }

        // 7AownLPDeOyidmxHDJXanfrmJglhs4fRNLDmNCIFHkNvTS2FsZgtXCAbAl5j_zIFKzVYUTJ28e5AbCBInDC_NN0a0RqqGm5D2ErzP0vtjM8IuGCJWoqolUWjfxOrWnYx"
      }).then(function (response) {
        // i = 0;
        console.log(response);
        var result = response.businesses;
        // looping and writing the first 5 responses from the search object
        for (i = 0; i < 5; i++) {

          if (result[i].image_url === "" || result[i].price === "" || result[i].rating === "") {

            return false;
          } else {
            console.log("Name: " + result[i].name);
            console.log("Image URL: " + result[i].image_url);
            console.log("Address: " + result[i].location.display_address[0]);
            console.log(result[i].location.display_address[1]);
            console.log("Phone: " + result[i].display_phone);
            console.log("Price: " + result[i].price);
            console.log("Rating: " + result[i].rating);

            // $("#results-appear-here").append("Name: " + result[i].name);
            // $("#results-appear-here").append("  Image URL: " + result[i].image_url);
            // $("#results-appear-here").append("  Address: " + result[i].location.display_address[0]);
            // $("#results-appear-here").append(result[i].location.display_address[1]);
            // $("#results-appear-here").append("  Phone: " + result[i].display_phone);
            // $("#results-appear-here").append("  Price: " + result[i].price);
            // $("#results-appear-here").append("  Rating: " + result[i].rating);
            // $("#image-holder").html('<img src = result[i].image_url />');

            var restaurantDiv = $("<div>");

            var p1 = $("<h6>").text("Name: " + result[i].name);
            var p = $("<p>").text("Rating: " + result[i].rating);
            p.addClass("rating");
            var p2 = $("<p>").text("Price: " + result[i].price);
            p2.addClass("price");
            var p3 = $("<p>").text("Address: " + result[i].location.display_address[0]);
            var p4 = $("<p>").text(result[i].location.display_address[1]);
            var p5 = $("<p>").text("  Phone: " + result[i].display_phone);


            var restaurantImage = $("<img>");
            restaurantImage.addClass("photo");
            restaurantImage.attr("src", result[i].image_url);
            console.log(restaurantImage);
            
            restaurantDiv.append(restaurantImage);
            restaurantDiv.append(p1);
            restaurantDiv.append(p);
            restaurantDiv.append(p2);
            restaurantDiv.append(p3);
            restaurantDiv.append(p4);
            restaurantDiv.append(p5);


            $("#results-appear-here").prepend(restaurantDiv);

          }
        }

      })

    });