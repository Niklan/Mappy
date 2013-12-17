/**
 * @file
 * This is main script of Mappy. His route other js files.
 */

(function ($) {
    $(document).ready(function () {
        // If found mappy:yandex tag, we attach Yandex Maps script.
        if ($("yandex").length || $("mappy\\:yandex").length) {
            // First we connect Yandex.Maps API script.
            $.getScript("http://api-maps.yandex.ru/2.0/?load=package.full&lang=ru-RU", function () {
                // If script loaded, then load our script.
                $.getScript("/" + drupalSettings.mappy.location + "/js/yandex.mappy.js");
            });
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
    });
})(jQuery);