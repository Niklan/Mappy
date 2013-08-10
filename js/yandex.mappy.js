/**
 * @file
 * This is script for Yandex.Maps.
 */

(function($) {
    // Address at which the map is centered.
    var address = $("yandex, mappy\\:yandex").attr("address").split(";");
    // The latitude and longitude based on address.
    var address_coordinates;
    // Width of the map.
    var width = $("yandex, mappy\\:yandex").attr("width");
    // The height map.
    var height = $("yandex, mappy\\:yandex").attr("height");
    // The scale of the map.
    var zoom = $("yandex, mappy\\:yandex").attr("zoom");
    // Content for balloons.
    var balloonContent = ($("yandex, mappy\\:yandex").attr("balloonContent")) ? $("yandex, mappy\\:yandex").attr("balloonContent").split(";") : false;
    // Disable balloons.
    var addressPlacemark = ($("yandex, mappy\\:yandex").attr("addressPlacemark") == "false") ? false : true;

    // Obtain the coordinates of the first address (for map center).
    $.ajax({
        url: 'http://geocode-maps.yandex.ru/1.x/?format=json&geocode=' + address[0] + '&result=1',
        success: function(data){
            address_coordinates = data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(" ").reverse();
            create_map();
        }
    });

    // Generation of map.
    function create_map() {
        // Add id tag for apply map.
        $("yandex, mappy\\:yandex").attr('id', 'map');
        // Add some ccs for map.
        $("yandex, mappy\\:yandex").css({
            'display': 'block',
            'width': width,
            'height': height
        });

        // Class.
        function MultiGeocoder(options) {
            this._options = options || {};
        }

        // Multigeocoding.
        MultiGeocoder.prototype.geocode = function (requests, options) {
            var self = this,
                opts = ymaps.util.extend({}, self._options, options),
                size = requests.length,
                promise = new ymaps.util.Promise(),
                result = [],
                geoObjects = new ymaps.GeoObjectArray();

            requests.forEach(function (request, index) {
                ymaps.geocode(request, opts).then(
                    function (response) {
                        var geoObject = response.geoObjects.get(0);

                        geoObject && (result[index] = geoObject);
                        --size || (result.forEach(geoObjects.add, geoObjects), promise.resolve({ geoObjects: geoObjects }));
                    },
                    function (err) {
                        promise.reject(err);
                    }
                );
            });

            return promise;
        };

        // Map variable.
        var myMap;

        // Wait until download API. _mm._sc
        ymaps.ready(init);

        function init () {
            // Create a new instance of the map.
            myMap = new ymaps.Map('map', {
                // Coordinates of the center of the map.
                center: address_coordinates,
                // The scale of the map.
                zoom: zoom
            });

            // Add balloon on map;
            function addBalloon(balloonCoordinates, balloonAddress, balloonContent) {
                var coords = balloonCoordinates;
                var address = balloonAddress;
                var content = balloonContent;
                balloon = new ymaps.Placemark(coords, {
                    balloonContent: content,
                    hintContent: address
                }, {
                    preset: 'twirl#blueIcon'
                })
                myMap.geoObjects
                    .add(balloon);
            }

            // Array Geocoding addresses and coordinates, as well as adding labels.
            if (address.length > 0) {
                var geocoding_coord;
                for (var i = 0; i < address.length; i++) {
                    // Prepare balloon content.
                    if (balloonContent[i] != "undefined") {
                        var content = balloonContent[i];
                    }
                    $.ajax({
                        url: 'http://geocode-maps.yandex.ru/1.x/?format=json&geocode=' + address[i] + '&result=1',
                        success: function(data){
                            geocoding_coord = data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(" ").reverse();
                            var address = data.response.GeoObjectCollection.featureMember[0].GeoObject.name;
                            (addressPlacemark) ? addBalloon(geocoding_coord, address, content) : false;
                        },
                        async: false
                    });
                }
            }

            // The zoom button.
            if ($("yandex, mappy\\:yandex").attr("zoomСontrol")) {
                var zoom_control = $("yandex, mappy\\:yandex").attr("zoomСontrol").split(",");
                myMap.controls
                    .add('zoomControl', { left: zoom_control[0], top: zoom_control[1] });
            }

            // Small button zoom.
            if ($("yandex, mappy\\:yandex").attr("smallZoomControl")) {
                var small_zoom_control = $("yandex, mappy\\:yandex").attr("smallZoomControl").split(",");
                myMap.controls
                    .add('smallZoomControl', { left: small_zoom_control[0], top: small_zoom_control[1] });
            }

            // List of type of map.
            if ($("yandex, mappy\\:yandex").attr("mapTypeControl") == "true") {
                myMap.controls
                    .add('typeSelector');
            }

            // Map control.
            if ($("yandex, mappy\\:yandex").attr("map_tools")) {
                var map_tools = $("yandex, mappy\\:yandex").attr("map_tools").split(",");
                myMap.controls
                    .add('mapTools', { left: map_tools[0], top: map_tools[1] });
            }

            // Button showing the traffic jams on the road.
            if ($("yandex, mappy\\:yandex").attr("mapTrafficControl")) {
                var trafficControl = new ymaps.control.TrafficControl();
                myMap.controls
                    .add(trafficControl);
            }

            // Create a route.
            if ($("yandex, mappy\\:yandex").attr("route")) {
                var route_array = $("yandex, mappy\\:yandex").attr("route").split(",")
                var router;
                $("#" + route_array[0]).click(function() {
                    // Address 'from'.
                    var route_address = $("#" + route_array[1]).val();

                    // Generate route.
                    ymaps.route([
                        // Form.
                        route_address,
                        // Where.
                        address_coordinates
                    ], {
                        // Autozooming.
                        mapStateAutoApply: true
                    }).then(function (route) {
                        // Clear previous route.
                        if (router) {
                            myMap.geoObjects
                                .remove(router);
                        }
                        // Route from API.
                        router = route;
                        // Draw route.
                        myMap.geoObjects.add(router);
                        // Get route points .
                        var points = route.getWayPoints();
                        // Bubble type.
                        points.options.set('preset', 'twirl#redStretchyIcon');
                        // Icon and text of 'From' bubble.
                        points.get(0).properties.set('iconContent', 'Ваше местоположение');
                        // Icon and text of 'Where' bubble.
                        points.get(1).properties.set('iconContent', 'Мы здесь!');
                    }, function (error) {
                        // Display error if exept.
                        alert("Error: " + error.message);
                    });
                });
            }
        }
    }
})(jQuery);
