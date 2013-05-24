/**
 * @file
 * This is script for Yandex.Maps.
 */

(function($) {
    // Address at which the map is centered.
    var address = $("yandex").attr("address").split(";");
    // The latitude and longitude based on address.
    var address_coordinates;
    // Width of the map.
    var width = $("yandex").attr("width");
    // The height map.
    var height = $("yandex").attr("height");
    // The scale of the map.
    var zoom = $("yandex").attr("zoom");

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
        $("yandex").attr('id', 'map');
        // Add some ccs for map.
        $("yandex").css({
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

            // Array Geocoding addresses and coordinates, as well as adding labels.
            // If the address is greater than 2 then execute massively.
            if (address.length > 1) {
                myMultiGeocoder = new MultiGeocoder({ boundedBy: myMap.getBounds() });
                myMultiGeocoder.geocode(address)
                    .then(
                    function (res) {
                        myMap.geoObjects.add(res.geoObjects);
                    },
                    function (err) {
                        alert(err);
                    }
                );
            }
            // Add placemark to the map if it is requested and is listed only one address.
            else if ($("yandex").attr("address_placemark") == "true") {
                centerPlacemark = new ymaps.Placemark(address_coordinates);
                myMap.geoObjects
                    .add(centerPlacemark);
            }

            // The zoom button.
            if ($("yandex").attr("zoom_control")) {
                var zoom_control = $("yandex").attr("zoom_control").split(",");
                myMap.controls
                    .add('zoomControl', { left: zoom_control[0], top: zoom_control[1] });
            }

            // Small button zoom.
            if ($("yandex").attr("small_zoom_control")) {
                var small_zoom_control = $("yandex").attr("small_zoom_control").split(",");
                myMap.controls
                    .add('smallZoomControl', { left: small_zoom_control[0], top: small_zoom_control[1] });
            }

            // List of type of map.
            if ($("yandex").attr("type_selector") == "true") {
                myMap.controls
                    .add('typeSelector');
            }

            // Map control.
            if ($("yandex").attr("map_tools")) {
                var map_tools = $("yandex").attr("map_tools").split(",");
                myMap.controls
                    .add('mapTools', { left: map_tools[0], top: map_tools[1] });
            }

            // Button showing the traffic jams on the road.
            if ($("yandex").attr("traffic_control")) {
                var trafficControl = new ymaps.control.TrafficControl();
                myMap.controls
                    .add(trafficControl);
            }

            // Create a route.
            if ($("yandex").attr("route")) {
                var route_array = $("yandex").attr("route").split(",")
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
