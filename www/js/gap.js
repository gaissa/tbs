/*
 * SETUP FOR PHONEGAP / CORDOVA.
 */
var app = {

    // Application constructor.
    initialize: function() {
        "use strict";

        this.bindEvents();
    },

    // Bind event listeners.
    bindEvents: function() {
        "use strict";
        /*jslint browser: true*/

        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    // Deviceready event handler.
    onDeviceReady: function() {
        "use strict";
        /*global $, jQuery, google, console, alert*/
        /*jslint browser: true*/

        app.receivedEvent('deviceready');
        
        // Check the user location to warm up the GPS :)
        getOwnLocation();

        // Fix the browser bug.
        $('#map-canvas').on('click', 'a', function(e){
            e.preventDefault();
            window.open($(this).attr('href'), '_blank', 'location=no', 'closebuttoncaption=Return');
        });

        // Catch the back key.
        function onBackKeyDown() {

            if($.mobile.activePage.is('#mainPage')){

                $("#popup-prompt").popup("open");

                $("#quit-yes").on('click', function(){
                    navigator.app.clearCache();
                    navigator.app.exitApp();
                });

                $("#quit-no").on('click', function(){
                    $("#popup-prompt").popup("close");
                });

            } else {
                navigator.app.backHistory();
            }
        }

        //document.addEventListener("menubutton", onMenuKeyDown, false);
        document.addEventListener("backbutton", onBackKeyDown, false);
    },

    // Update DOM on a received event.
    receivedEvent: function(id) {
        "use strict";

        //console.log('Received Event: ' + id);
    }
};

app.initialize(); // Launch phonegap.