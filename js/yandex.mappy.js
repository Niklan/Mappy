/**
 * @file
 * This is script for Yandex.Maps.
 */

(function($) {
    // Address of placemark and map center.
    var address = $("yandex").attr("address");
    // Longtitude and latitude for address.
    var address_coordinates;
    // Width of map.
    var width = $("yandex").attr("width");
    // Height of map.
    var height = $("yandex").attr("height");
    // Map zooming.
    var zoom = $("yandex").attr("zoom");

    // Get address coordinates.
    $.ajax({
        url: 'http://geocode-maps.yandex.ru/1.x/?format=json&geocode=' + address + '&result=1',
        success: function(data){
            address_coordinates = data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(" ").reverse();
            create_map();
        }
    });

    // Creation of the map.
    function create_map() {
        // Add id tag for apply map.
        $("yandex").attr('id', 'map');
        // Add some ccs for map.
        $("yandex").css({
            'display': 'block',
            'width': width,
            'height': height
        });

        // Map variable.
        var myMap;

        // Wait for loading API.
        ymaps.ready(init);

        function init () {
            // Create new Map.
            myMap = new ymaps.Map('map', {
                // Center of the map.
                center: address_coordinates,
                // Zoom of the map.
                zoom: zoom
            });

            // Placemark on address.
            if ($("yandex").attr("address_placemark") == "true") {
                centerPlacemark = new ymaps.Placemark(address_coordinates);
                myMap.geoObjects
                    .add(centerPlacemark);
            }

            // Add zoom control to map.
            if ($("yandex").attr("zoom_control")) {
                var zoom_control = $("yandex").attr("zoom_control").split(",");
                myMap.controls
                    .add('zoomControl', { left: zoom_control[0], top: zoom_control[1] });
            }

            // Add small zoom control to map.
            if ($("yandex").attr("small_zoom_control")) {
                var small_zoom_control = $("yandex").attr("small_zoom_control").split(",");
                myMap.controls
                    .add('smallZoomControl', { left: small_zoom_control[0], top: small_zoom_control[1] });
            }

            // Selector of the map type.
            if ($("yandex").attr("type_selector") == "true") {
                myMap.controls
                    .add('typeSelector');
            }

            // Map tools.
            if ($("yandex").attr("map_tools")) {
                var map_tools = $("yandex").attr("map_tools").split(",");
                myMap.controls
                    .add('mapTools', { left: map_tools[0], top: map_tools[1] });
            }

            // Traffic control.
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
