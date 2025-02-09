$(document).ready(function () {
    // Init
    $('.image-section').hide();
    $('.loader').hide();
    $('#result').hide();

    // Upload Preview
    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#imagePreview').css('background-image', 'url(' + e.target.result + ')');
                $('#imagePreview').hide();
                $('#imagePreview').fadeIn(650);
            };
            reader.readAsDataURL(input.files[0]);
        }
    }

    $("#imageUpload").change(function () {
        $('.image-section').show();
        $('#btn-predict').show();
        $('#result').text('');
        $('#result').hide();
        readURL(this);
    });

    // Predict
    $('#btn-predict').click(function () {
        var form_data = new FormData($('#upload-file')[0]);

        // Show loading animation
        $(this).hide();
        $('.loader').show();

        // Make prediction by calling api /predict
        $.ajax({
            type: 'POST',
            url: '/predict',
            data: form_data,
            contentType: false,
            cache: false,
            processData: false,
            async: true,
            success: function (data) {
                // Hide loader
                $('.loader').hide();
                $('#result').fadeIn(600);

                // Correctly extract the prediction
                if (data.prediction) {
                    $('#result').text('Result: ' + data.prediction);
                } else if (data.error) {
                    $('#result').text('Error: ' + data.error);
                } else {
                    $('#result').text('Unexpected response');
                }

                console.log('Success!');
            },
            error: function (xhr, status, error) {
                $('.loader').hide();
                $('#result').fadeIn(600);
                $('#result').text('Error: ' + error);
                console.error('Error:', error);
            }
        });
    });

    // Help functionality
    window.showHelp = function () {
        alert("For any support reach out to predicthesign@gmail.com.");
        // Additional actions can be added here, like opening a chatbot or redirecting.
    };
});

// Global variables
let map;
let directionsService;
let directionsRenderer;

// Function to initialize the map
function initMap() {
    const mapElement = document.getElementById("map");
    if (!mapElement) return; // Exit if no map element found

    // Check if data is available (hospitals, restaurants, or gas stations)
    const hospitalsData = JSON.parse(document.getElementById("hospitals-data")?.textContent || "[]");
    const restaurantsData = JSON.parse(document.getElementById("restaurants-data")?.textContent || "[]");
    const gasStationsData = JSON.parse(document.getElementById("gas-stations-data")?.textContent || "[]");
    const userLat = parseFloat(document.getElementById("user-lat")?.textContent);
    const userLng = parseFloat(document.getElementById("user-lng")?.textContent);

    if ((!hospitalsData.length && !restaurantsData.length && !gasStationsData.length) || isNaN(userLat) || isNaN(userLng)) return;

    // Initialize the map
    const userLocation = { lat: userLat, lng: userLng };
    map = new google.maps.Map(mapElement, {
        zoom: 12,
        center: userLocation,
    });

    // Initialize DirectionsService and DirectionsRenderer
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({
        map: map,
        suppressMarkers: true, // Hide default markers
    });

    // Add user location marker
    new google.maps.Marker({
        position: userLocation,
        map: map,
        title: "Your Location",
        icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    });

    // Add hospital markers (if data exists)
    hospitalsData.forEach(hospital => {
        if (hospital.geometry?.location) {
            new google.maps.Marker({
                position: {
                    lat: hospital.geometry.location.lat,
                    lng: hospital.geometry.location.lng,
                },
                map: map,
                title: hospital.name,
            });
        }
    });

    // Add restaurant markers (if data exists)
    restaurantsData.forEach(restaurant => {
        if (restaurant.geometry?.location) {
            new google.maps.Marker({
                position: {
                    lat: restaurant.geometry.location.lat,
                    lng: restaurant.geometry.location.lng,
                },
                map: map,
                title: restaurant.name,
            });
        }
    });

    // Add gas station markers (if data exists)
    gasStationsData.forEach(gasStation => {
        if (gasStation.geometry?.location) {
            new google.maps.Marker({
                position: {
                    lat: gasStation.geometry.location.lat,
                    lng: gasStation.geometry.location.lng,
                },
                map: map,
                title: gasStation.name,
            });
        }
    });

    // Add click event listeners to hospital list items
    document.querySelectorAll('.hospital-item').forEach(item => {
        item.addEventListener('click', () => {
            const hospitalLat = parseFloat(item.getAttribute('data-lat'));
            const hospitalLng = parseFloat(item.getAttribute('data-lng'));
            if (!isNaN(hospitalLat) && !isNaN(hospitalLng)) {
                calculateAndDisplayRoute(userLocation, { lat: hospitalLat, lng: hospitalLng });
            }
        });
    });

    // Add click event listeners to restaurant list items
    document.querySelectorAll('.restaurant-item').forEach(item => {
        item.addEventListener('click', () => {
            const restaurantLat = parseFloat(item.getAttribute('data-lat'));
            const restaurantLng = parseFloat(item.getAttribute('data-lng'));
            if (!isNaN(restaurantLat) && !isNaN(restaurantLng)) {
                calculateAndDisplayRoute(userLocation, { lat: restaurantLat, lng: restaurantLng });
            }
        });
    });

    // Add click event listeners to gas station list items
    document.querySelectorAll('.gas-station-item').forEach(item => {
        item.addEventListener('click', () => {
            const gasStationLat = parseFloat(item.getAttribute('data-lat'));
            const gasStationLng = parseFloat(item.getAttribute('data-lng'));
            if (!isNaN(gasStationLat) && !isNaN(gasStationLng)) {
                calculateAndDisplayRoute(userLocation, { lat: gasStationLat, lng: gasStationLng });
            }
        });
    });
}

// Function to calculate and display the route
function calculateAndDisplayRoute(start, end) {
    directionsService.route(
        {
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode.DRIVING, // You can change this to WALKING, BICYCLING, etc.
        },
        (response, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
                directionsRenderer.setDirections(response);
            } else {
                console.error('Directions request failed:', status);
            }
        }
    );
}

// Load Google Maps API
function loadGoogleMaps() {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBSjSA1N4b9uipsq6U41ye6bngaTJXtMEE&callback=initMap`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
}

// Call loadGoogleMaps when the page loads
$(document).ready(function () {
    loadGoogleMaps();
});