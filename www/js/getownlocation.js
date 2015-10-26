var yLat,
    xLon;

function getOwnLocation() {
    "use strict"

    // TODO
    var options = { maximumAge: 5000, timeout: 15000, enableHighAccuracy: true };

    navigator.geolocation.getCurrentPosition(onSuccess, onError, options);

    function onSuccess(position) {
        yLat = position.coords.latitude;
        xLon = position.coords.longitude;
    }

    // onError Callback receives a PositionError object
    function onError(error) {

        //console.log('code: '    + error.code    + '\n' +
                    //'message: ' + error.message + '\n');

        // JUST A STUPID FALLBACK... REMOVE LATER!
        navigator.geolocation.getCurrentPosition(onSuccess);

        function onSuccess(position) {
            yLat = position.coords.latitude;
            xLon = position.coords.longitude;
        }
    }
}