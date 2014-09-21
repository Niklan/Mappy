/**
 * @file
 * This is main script of Mappy. His route other js files.
 */

/**
 * This function check address for coordinates.
 * Is parameter coordinates '58.0000,56.0000', function return true;
 */
function mappyLatLongValidate(latLongString) {
    var latLong = latLongString.toString().split(',');
    var lat = latLong[0];
    var long = latLong[1];

    // Latitude must be in range -90 to 90.
    if (lat < -90 || lat > 90) {
        return false;
    }
    // Longtitude must be in range -180 to 180.
    else if (long < -180 || long > 180) {
        return false
    }
    else if (!isNaN(lat) && !isNaN(long)) {
        return true;
    }
    else {
        return false;
    }
}

(function ($, Drupal) {

    Drupal.behaviors.mappy = {
        attach: function (context, settings) {
            // If found mappy:yandex tag, we attach Yandex Maps script.
            if ($("yandex").length || $("mappy\\:yandex").length) {
                // This way we load localized strings. We do it in this file,
                // cuz there is behavior and Drupal can parse this strings and
                // prepare our localized strings.
                Drupal.t('Your location');
                Drupal.t("We're here!");

                // Old version. 2.0
                if (drupalSettings.mappy.yandex.version == 1) {
                    // First we connect Yandex.Maps API script.
                    $.getScript("http://api-maps.yandex.ru/2.0/?load=package.full&lang=ru-RU", function () {
                        // If script loaded, then load our script.
                        $.getScript("/" + drupalSettings.mappy.location + "/js/yandex.mappy.js");
                    });
                }
                // New version 2.1.x
                else if (drupalSettings.mappy.yandex.version == 2) {
                    // First we connect Yandex.Maps API script.
                    $.getScript("http://api-maps.yandex.ru/2.1/?load=package.full&lang=ru-RU", function () {
                        // If script loaded, then load our script.
                        $.getScript("/" + drupalSettings.mappy.location + "/js/yandex.2.1.mappy.js");
                    });
                }
            }

            // If found mappy:google tag, we attach Google Maps script.
            if ($("google").length || $("mappy\\:google").length) {
                // First, we load main Google script.
                $.getScript("https://www.google.com/jsapi", function () {
                    // If enabled clusters, we must load additional library.
                    if ($("google, mappy\\:google").attr("clusters")) {
                        $.getScript("http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/src/markerclusterer.js");
                    }
                    // Finally, we load our script for handle tag.
                    $.getScript("/" + drupalSettings.mappy.location + "/js/google.mappy.js");
                });
            }
        }
    }

})(jQuery, Drupal);
