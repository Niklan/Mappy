/**
 * @file
 * This is script for Google.Maps.
 *
 * We use get(0).getAttribute instead of attr() because Drupal 7 jquery is
 * version 1.4. In this version attr() case sensitive, we don't need this.
 */

(function ($) {
    // Call Google.Maps API v3.
    google.load("maps", "3", {other_params: 'sensor=false', callback: function () {
        // Just optimisation for clear reading code.
        var mappy_tag = $("google, mappy\\:google");
        // Create own array for storage information for each map (from tag).
        var mappy = [];
        // Create array of maps.
        var maps = []
        // We apply map for each tag founded on page.
        mappy_tag.each(function (index) {
            // Instance of tag.
            var mappy_instance = $(this);
            mappy[index] = {
                // Address of map.
                address: mappy_instance.get(0).getAttribute("address").split(";"),
                // Lat. & long. center of map. We set a little bit later.
                center_lat: "",
                center_lng: "",
                // Width of the map. If not present, we get default value from settings.
                width: mappy_instance.get(0).getAttribute("width") > 0 ? mappy_instance.get(0).getAttribute("width") : drupalSettings.mappy.google.width,
                // Height of the map. If not present, we get default value from settings.
                height: mappy_instance.get(0).getAttribute("height") > 0 ? mappy_instance.get(0).getAttribute("height") : drupalSettings.mappy.google.width,
                // Scale of the map.
                zoom: mappy_instance.get(0).getAttribute("zoom") > 0 ? parseInt(mappy_instance.get(0).getAttribute("zoom")) : 17,
                // The map type.
                type: mappy_instance.get(0).getAttribute("type") ? mappy_instance.get(0).getAttribute("type") : "ROADMAP",
                // If TRUE: display zoom control.
                zoomControl: mappy_instance.get(0).getAttribute("zoomControl") == "false" ? false : true,
                // If TRUE: allow users to use street view.
                streetViewControl: mappy_instance.get(0).getAttribute("streetViewControl") == "false" ? false : true,
                // If TRUE: allow users to select map layer.
                mapTypeControl: mappy_instance.get(0).getAttribute("mapTypeControl") == "false" ? false : true,
                // If TRUE: display circle for move the map.
                panControl: mappy_instance.get(0).getAttribute("panControl") == "false" ? false : true,
                // Content for balloons.
                balloonContent: (mappy_instance.attr("balloonContent")) ? mappy_instance.attr("balloonContent").split(";") : false,
                // If FALSE: 'scrolling' page, instead of map zooming.
                scrollWheel: mappy_instance.get(0).getAttribute("scrollwheel") == "false" ? false : true,
                // If TRUE: balloons will merge into one big, before they zoomed enough for seeing separately.
                cluster: mappy_instance.get(0).getAttribute("clusters") == "true" ? true : false,
                // Additional options.
                additionalOptions: mappy_instance.get(0).getAttribute("options") ? eval("("+mappy_instance.get(0).getAttribute("options")+")") : false
            };

            // Is numeric, then it's ready to use coordinates.
            if (mappyLatLongValidate(mappy[index].address)) {
                var latLong = mappy[index].address.toString().split(',');
                mappy[index].center_lat = latLong[0];
                mappy[index].center_lng = latLong[1];
                initialize();
            }
            // Else, we search coordinates by API.
            else {
                // Obtain the coordinates of the first address (for map center).
                $.ajax({
                    url: 'http://maps.googleapis.com/maps/api/geocode/json?address=' + mappy[index].address + '&sensor=false',
                    success: function (data) {
                        mappy[index].center_lat = data.results[0].geometry.location.lat;
                        mappy[index].center_lng = data.results[0].geometry.location.lng;
                        initialize();
                    },
                    async: false
                });
            }

            // Prepare variable for our map.
            maps[index];

            // Initialization of the map.
            function initialize() {
                // Add id tag for apply map.
                mappy_instance.attr('id', 'mappy-google-' + [index]);
                mappy_instance.attr('class', 'mappy google');
                // Add some ccs for map.
                mappy_instance.css({
                    'display': 'block',
                    'width': mappy[index].width,
                    'height': mappy[index].height
                });

                // Map options.
                maps[index] = [];
                maps[index].mapOptions = {
                    zoom: mappy[index].zoom,
                    zoomControl: mappy[index].zoomControl,
                    mapTypeControl: mappy[index].mapTypeControl,
                    streetViewControl: mappy[index].streetViewControl,
                    panControl: mappy[index].panControl,
                    center: new google.maps.LatLng(mappy[index].center_lat, mappy[index].center_lng),
                    mapTypeId: google.maps.MapTypeId[mappy[index].type],
                    scrollwheel: mappy[index].scrollWheel
                };

                // Merge user options with defaults.
                if (mappy[index].additionalOptions) {
                    maps[index].mapOptions = $.extend({}, maps[index].mapOptions, mappy[index].additionalOptions);
                }

                // Create a map.
                maps[index].map = new google.maps.Map(document.getElementById('mappy-google-' + [index]), maps[index].mapOptions);

                // Add markers on the map.
                if (mappy_instance.attr("addressPlacemark") != "false") {
                    // We use markers only for cluster for now.
                    var markers = [];
                    for (var i = 0; i < mappy[index].address.length; i++) {
                        var placemarkLat;
                        var placemarkLng;
                        var placemarkAddress;
                        var placemarkContent = mappy[index].balloonContent[i];

                        $.ajax({
                            url: 'http://maps.googleapis.com/maps/api/geocode/json?address=' + mappy[index].address[i] + '&sensor=false',
                            success: function (data) {
                                placemarkLat = data.results[0].geometry.location.lat;
                                placemarkLng = data.results[0].geometry.location.lng;
                                placemarkAddress = data.results[0].address_components[1].long_name + " " + data.results[0].address_components[0].long_name;
                            },
                            async: false
                        });

                        // Create marker.
                        var marker = new google.maps.Marker({
                            position: new google.maps.LatLng(placemarkLat, placemarkLng),
                            map: maps[index].map,
                            title: placemarkAddress
                        });
                        markers.push(marker);

                        // Add balloon with content.
                        function addInfoWindow(marker, message) {
                            var info = message;

                            var infoWindow = new google.maps.InfoWindow({
                                content: message
                            });

                            google.maps.event.addListener(marker, 'click', function () {
                                infoWindow.open(maps[index].map, marker);
                            });
                        }

                        addInfoWindow(marker, placemarkContent);
                    }

                    if (mappy[index].cluster) {
                        var markerCluster = new MarkerClusterer(maps[index].map, markers);
                    }
                }
            }
        });
    }});
})(jQuery);
