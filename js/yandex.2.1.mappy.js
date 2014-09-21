/**
 * @file
 * This is script for Yandex.Maps 2.1 (new version).
 *
 * We use get(0).getAttribute instead of attr() because Drupal 7 jquery is
 * version 1.4. In this version attr() case sensitive, we don't need this.
 */

(function ($, Drupal) {

    // Just optimisation for clear reading code.
    var mappy_tag = $("yandex, mappy\\:yandex");
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
            centerCoordinates: "",
            // Width of the map. If not present, we get default value from settings.
            width: mappy_instance.get(0).getAttribute("width") > 0 ? mappy_instance.get(0).getAttribute("width") : drupalSettings.mappy.yandex.width,
            // Height of the map. If not present, we get default value from settings.
            height: mappy_instance.get(0).getAttribute("height") > 0 ? mappy_instance.get(0).getAttribute("height") : drupalSettings.mappy.yandex.height,
            // Scale of the map.
            zoom: mappy_instance.get(0).getAttribute("zoom") > 0 ? parseInt(mappy_instance.get(0).getAttribute("zoom")) : 17,
            // Disable balloons.
            addressPlacemark: (mappy_instance.get(0).getAttribute("addressPlacemark") == "false") ? false : true,
            // Content for balloons.
            balloonContent: (mappy_instance.attr("balloonContent")) ? mappy_instance.attr("balloonContent").split(";") : false,
            // Controls set.
            controlsSet: mappy_instance.get(0).getAttribute("controlsSet") ? mappy_instance.get(0).getAttribute("controlsSet").split(",") : ['default']
        };

        // Is numeric, then it's ready to use coordinates.
        if (mappyLatLongValidate(mappy[index].address)) {
            var latLong = mappy[index].address.toString().split(',');
            mappy[index].centerCoordinates = [];
            mappy[index].centerCoordinates[0] = latLong[0];
            mappy[index].centerCoordinates[1] = latLong[1];
            create_map();
        }
        // Else, we search coordinates by API.
        else {
            // Obtain the coordinates of the first address (for map center).
            $.ajax({
                url: 'http://geocode-maps.yandex.ru/1.x/?format=json&geocode=' + mappy[index].address[0] + '&result=1',
                success: function (data) {
                    mappy[index].centerCoordinates = data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(" ").reverse();
                    create_map();
                }
            });
        }

        // Generation of map.
        function create_map() {
            // Add id tag for apply map.
            mappy_instance.attr('id', 'mappy-yandex-' + [index]);
            mappy_instance.attr('class', 'mappy yandex');
            // Add some ccs for map.
            mappy_instance.css({
                'display': 'block',
                'width': mappy[index].width,
                'height': mappy[index].height
            });

            // Class for multiple geocoding.
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

            // Prepare variable for our map.
            maps[index];

            // Wait until download API. _mm._sc
            ymaps.ready(init);

            function init() {
                // Create a new instance of the map.
                maps[index] = [];
                maps[index].map = new ymaps.Map('mappy-yandex-' + [index], {
                    // Coordinates of the center of the map.
                    center: mappy[index].centerCoordinates,
                    // The scale of the map.
                    zoom: mappy[index].zoom,
                    controls: mappy[index].controlsSet
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
                    });
                    maps[index].map.geoObjects
                        .add(balloon);
                }

                // Array Geocoding addresses and coordinates, as well as adding labels.
                if (mappy[index].address.length > 0) {
                    var geocoding_coord;
                    for (var i = 0; i < mappy[index].address.length; i++) {
                        // Prepare balloon content.
                        if (mappy[index].balloonContent[i] != "undefined") {
                            var content = mappy[index].balloonContent[i];
                        }

                        $.ajax({
                            url: 'http://geocode-maps.yandex.ru/1.x/?format=json&geocode=' + mappy[index].address[i] + '&result=1',
                            success: function (data) {
                                geocoding_coord = data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(" ").reverse();
                                var address = data.response.GeoObjectCollection.featureMember[0].GeoObject.name;
                                (mappy[index].addressPlacemark) ? addBalloon(geocoding_coord, address, content) : false;
                            },
                            async: false
                        });
                    }
                }
            }
        }
    });

})(jQuery, Drupal);
