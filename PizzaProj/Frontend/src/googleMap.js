let map;
let destinationMarker;

function initialize() {
    //Тут починаємо працювати з картою
    var mapProp = {
        center:	new	google.maps.LatLng(50.464379,30.519131),
        zoom: 11
    };

    var html_element = document.getElementById("google-map");
    map = new google.maps.Map(html_element, mapProp);
    //Карта створена і показана

    var point = new google.maps.LatLng(50.464379,30.519131);
    var marker = new google.maps.Marker({
        position: point,
        //map - це змінна карти створена за допомогою new google.maps.Map(...)
        map: map,
        icon: "assets/images/map-icon.png"
    });

    google.maps.event.addListener(map, 'click', function (me) {
        var coordinates = me.latLng;
        geocodeLatLng(coordinates, function(err, address) {
            if(!err) {
                //Дізналися адресу
                // console.log(address);
                $("#address").val(address);
                $("#delivery-address-label").text(address);
            } else {
                console.log("Немає адреси")
            }
        });
        calculateRoute(point, coordinates, updateRoute);
    });

    const addressInput = document.getElementById("address");
    addressInput.onchange = function () {
        let address = $("#address").val();
        geocodeAddress(address, function (err, coordinates) {
            if (err) {
                $("#delivery-time-label").text('невідомий');
                $("#delivery-address-label").text('невідома');
                console.log(err.toString());
            } else {
                geocodeLatLng(coordinates, function(err, address){
                    if (err) {
                        console.log(err.toString());
                    } else {
                        $("#delivery-address-label").text(address);
                        calculateRoute(new google.maps.LatLng(50.464379,30.519131), coordinates, function (err, time) {
                            if(err) {
                                console.log(err.toString());
                                $("#delivery-time-label").text('невідомий');
                                $("#delivery-address-label").text('невідома');
                            } else {
                                // console.log(time.duration);
                                $("#delivery-time-label").text(time.duration.text);
                                //$("#delivery-address-label").text($("#address").val());
                            }
                        });
                    }
                });
                // console.log(address);
            }
        })
    }

    renderer = new google.maps.DirectionsRenderer();
    renderer.setMap(map);
}

// Рахує шлях за координатами кінців відрізка
function calculateRoute (A_latlng, B_latlng, callback) {
    var directionService = new google.maps.DirectionsService();
    directionService.route({
        origin:	A_latlng,
        destination: B_latlng,
        travelMode:	google.maps.TravelMode["DRIVING"]
    }, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            if(destinationMarker) destinationMarker.setMap(null);
            destinationMarker = new google.maps.Marker({
                position: B_latlng,
                //map - це змінна карти створена за допомогою new google.maps.Map(...)
                map: map,
                zIndex: 100,
                icon: "assets/images/home-icon.png"
            });
            renderer.setDirections(response);
            var leg = response.routes[0].legs[0];
            callback(null, {
                duration: leg.duration
            });
        } else {
            callback(new Error("Cannot find direction"));
        }
    });
}

//Коли сторінка завантажилась
google.maps.event.addDomListener(window, 'load', initialize);

// Повертає адресу за координатами
function geocodeLatLng(latlng, callback) {
    //Модуль за роботу з адресою
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'location': latlng}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK && results[1]) {
            var adress = results[1].formatted_address;
            callback(null, adress);
        } else {
            callback(new Error("Can't find adress"));
        }
    });
}

function updateRoute(err, time) {
    if(err) {
        console.log(err.toString());
    } else {
        console.log(time.duration.text);
        $("#delivery-time-label").text(time.duration.text);
    }
}

// Повертає координати за адресою
function geocodeAddress(address, callback) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': address}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK && results[0]) {
            var coordinates = results[0].geometry.location;
            callback(null, coordinates);
        } else {
            callback(new Error("Cannot find address"));
        }
    });
}

module.exports = geocodeAddress;