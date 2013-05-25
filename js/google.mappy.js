/**
 * @file
 * This is script for Yandex.Maps.
 */

(function($) {
    // Call Google.Maps API v3.
    google.load("maps", "3", {other_params:'sensor=false', callback: function(){
        // Address at which the map is centered.
        var address = $("google").attr("address").split(";");
        // The latitude and longitude based on address.
        var address_lat;
        var address_lng;
        // Width of the map.
        var width = $("google").attr("width");
        // The height map.
        var height = $("google").attr("height");
        // The scale of the map.
        var zoom = parseInt($("google").attr("zoom"));
        // Zoom control.
        var zoomControl = $("google").attr("zoom_control") == "false" ? false : true;
        // The initial enabled/disabled state of the Street View Pegman control.
        var streetViewControl = $("google").attr("streetViewControl") == "false" ? false : true;
        // The initial enabled/disabled state of the Map type control.
        var mapTypeControl = $("google").attr("mapTypeControl") == "false" ? false : true;
        // The enabled/disabled state of the Pan control.
        var panControl = $("google").attr("panControl") == "false" ? false : true;

        // Obtain the coordinates of the first address (for map center).
        $.ajax({
            url: 'http://maps.googleapis.com/maps/api/geocode/json?address=' + address[0] + '&sensor=false',
            success: function(data){
                address_lat = data.results[0].geometry.location.lat;
                address_lng = data.results[0].geometry.location.lng;
                initialize();
            }
        });

        var map;
        function initialize() {
            // Add id tag for apply map.
            $("google").attr('id', 'map');
            // Add some ccs for map.
            $("google").css({
                'display': 'block',
                'width': width,
                'height': height
            });

            // Map options.
            var mapOptions = {
                zoom: zoom,
                zoomControl: zoomControl,
                mapTypeControl: mapTypeControl,
                streetViewControl: streetViewControl,
                panControl: panControl,
                center: new google.maps.LatLng(address_lat, address_lng),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            // Create a map.
            map = new google.maps.Map(document.getElementById('map'),
                mapOptions);

            // Add markers on the map.
            console.log(("google").attr("centerPlacemark"));
            if (("google").attr("centerPlacemark") == "true") {
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(address_lat, address_lng),
                    map: map
                });
            }
        }
    }});
})(jQuery);
