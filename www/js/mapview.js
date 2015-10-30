/*
 * MAIN
 */
var main = function() {
    "use strict";
     /*global $, jQuery, google, console, alert*/
    /*jslint browser: true*/

    // Launch phonegap.
    app.initialize();

    // Still needed or not?
    google.maps.visualRefresh = true;

    // Main variables.
    var arr = [],
        id = 0,
        map,
        a = 61.4971800,
        b = 23.7614300,
        busPosition = new google.maps.LatLng(a, b),
        MY_MAPTYPE_ID = 'custom_style',
        featureOpts,
        mapOptions,
        styledMapOptions,
        customMapType,
        follow = 0,
        busCheck = [],
        ownPosition;

    // Initialize the basic functions
    function initialize() {

        var mh,
            mf,
            menuSize,
            tblock,
            start,
            Start;

        // Prevent pinch zoom.
        //tblock = function (e) {
            //if (e.touches.length > 1) {
            //e.preventDefault();
            //}
            //return false;
        //};

        // Add the touch listener.
        //document.body.addEventListener("touchmove", tblock, true);

       $(".ui-panel").on('touchmove', function(ev) {
            if (!jQuery( ev.target ).parents().hasClass( 'touch-moveable' )) {
                 ev.preventDefault();
            }
        });

        // Get the menu heights.
        mh = parseInt($("#main_header").css("height"), 10);
        mf = parseInt($("#main_footer").css("height"), 10);
        menuSize = mh + mf;

        // Set the map canvas height minus header and footer height.
        $("#map-canvas").css("height", $(document).innerHeight() - menuSize - 4);

        // Create the map options.
        featureOpts = [
            {
                stylers: [
                    { hue: '#3CF3CF'},
                    { gamma: 0.5 }
                ]
            },
            {
                elementType: 'labels',
                stylers: [
                    { visibility: 'on' }
                ]
            },
            {
                featureType: 'water',
                stylers: [
                    { gamma: 0.3 }
                ]
            },
            {
                featureType: 'road',
                stylers: [
                ]
            }
        ];

        // Set the map options.
        mapOptions = {

            zoom: 12,
            center: busPosition,
            disableDefaultUI: false,
            disableDoubleClickZoom: true,
            mapTypeControl: false,
            mapTypeControlOptions: {
                mapTypeIds: [google.maps.MapTypeId.ROADMAP, MY_MAPTYPE_ID]
            },
            zoomControl: true,
            panControl: false,
            scaleControl: true,
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.SMALL,
                position: google.maps.ControlPosition.TOP_LEFT
            },
            mapTypeId: MY_MAPTYPE_ID
        };

        // New map.
        map = new google.maps.Map(document.getElementById('map-canvas'),
                                  mapOptions);

        // Create new style.
        styledMapOptions = {
            name: 'Custom Style'
        };

        // Launch the bus on map.
        Start = function() {

            var tempId = id;

            this.id = id;
            this.follower = false;

            id += 1;

            this.line = function(line) {

                var interval = 1500;

                this.stop = myStopFunction;
                this.clear = clear2;
                this.l = line;

                var busses = [],
                    bus,
                    timer,
                    color = "00A0D9";

                // Stop the timer.
                function myStopFunction(check) {

                    clearInterval(timer);

                    if (check === true) {

                        //$("#h").text("removing line(s)");
                    }
                }

                // Clear.
                function clear() {

                    var i;

                    for (i = 0; i < busses.length; i += 1) {

                        busses[i].setMap(null);
                        busses[i] = null;
                    }
                    busses = [];
                }

                // Clear.
                function clear2() {

                    window.setTimeout(function() {

                        var i;

                        for (i = 0; i < busses.length; i += 1) {

                            busses[i].setMap(null);
                            busses[i] = null;
                        }

                        busses = [];

                    }, 5000);

                    setTimeout(function(){$("#h").html("&nbsp;")}, 5000);
                }

                // Timer.
                function myTimer() {

                    //getOwnLocation();
                    var cc;

                    $.ajax({

                        url : "http://data.itsfactory.fi"
                              + "/siriaccess/vm/json?lineRef="
                              + line,

                        dataType : "json",

                        // success
                        success : function(parsed_json) {

                            var t;

                            // Add listeners.
                            function adder() {

                                var distance,
                                    delClick,
                                    posClick,
                                    followClick,
                                    timetableClick;

                                google.maps.event.addListenerOnce(busses[t], 'click', function(e) {

                                    //console.log(e);
                                    // FIRING TWICE????

                                    getOwnLocation();

                                    map.panTo(this.getPosition());

                                    follow = this.id;

                                    ownPosition = new google.maps.LatLng(yLat, xLon);

                                    distance = (google.maps.geometry.spherical.
                                                computeDistanceBetween(this.
                                                position,
                                                ownPosition));

                                    distance = Math.round(distance);

                                    $("#popupText").text(this.from);
                                    $("#popupText2").text(this.to);
                                    $("#popupText3").text("you: " + distance + " m");

                                    //posClick = $("#map-canvas").click(function (e) {

                                        $('#popupBasic').popup("open",
                                                               {transition: "fade" });
                                        //posClick.off();

                                        delClick = $("#del").click(function (e) {

                                            myStopFunction(true);
                                            clear2();
                                            busCheck[tempId] = null;
                                            e.stopImmediatePropagation();
                                            delClick.off();
                                            $('#popupBasic').popup("close");
                                        });

                                        followClick = $("#follow").click(function (e) {

                                            var i;

                                            for (i = 0; i < arr.length; i += 1) {

                                                arr[i].follower = false;
                                            }

                                            arr[tempId].follower = true;

                                            map.setZoom(map.getZoom() + 2);

                                            e.stopImmediatePropagation();
                                            followClick.off();

                                            if (arr[tempId].follower === true) {
                                                $('#popupBasic').popup("close");
                                            }

                                        });

                                        // The add button panel.
                                        timetableClick = $('#timetable').click(function (e) {

                                            //console.log(e);
                                            e.stopImmediatePropagation();
                                            timetableClick.off();
                                            $('#popupBasic').popup("close");

                                            window.open('http://aikataulut.tampere.fi/?lang=en&mobile=1&line=' + arr[tempId].l,'_blank', 'location=no', 'closebuttoncaption=Return');

                                        });

                                    //});
                                });
                            }

                            clear();

                            cc = parsed_json.
                                 Siri.
                                 ServiceDelivery.
                                 VehicleMonitoringDelivery[0].
                                 VehicleActivity;

                            try {

                                for (t = 0; t < cc.length; t += 1) {

                                    a = parsed_json.
                                        Siri.
                                        ServiceDelivery.
                                        VehicleMonitoringDelivery[0].
                                        VehicleActivity[t].
                                        MonitoredVehicleJourney.
                                        VehicleLocation.
                                        Latitude;

                                    b = parsed_json.
                                        Siri.
                                        ServiceDelivery.
                                        VehicleMonitoringDelivery[0].
                                        VehicleActivity[t].
                                        MonitoredVehicleJourney.
                                        VehicleLocation.
                                        Longitude;

                                    busPosition = new google.maps.LatLng(a, b);

                                    // the icon is deprecated!
                                    bus = new google.maps.Marker({
                                        position: busPosition,
                                        map: map,
                                        icon: 'http://chart.apis.google.com'
                                              + '/chart?chst='
                                              + 'd_map_spin&chld=1|0|'
                                              + color
                                              + '|12|_|'
                                              + cc[t].
                                                MonitoredVehicleJourney.
                                                LineRef.
                                                value,
                                        title: String(cc[t].
                                                      MonitoredVehicleJourney.
                                                      VehicleRef.
                                                      value)
                                    });

                                    bus.to = "to: "
                                             + cc[t].
                                             MonitoredVehicleJourney.
                                             DestinationName.
                                             value;

                                    bus.from = "from: "
                                               + cc[t].
                                               MonitoredVehicleJourney.
                                               OriginName.
                                               value;

                                    bus.id = t;

                                    busses.push(bus);

                                    busses[t].setMap(map);

                                    // add click event to busses.
                                    adder();
                                }

                                if (arr[tempId].follower === true) {

                                    map.panTo(busses[follow].getPosition());
                                }

                                start.busses = busses;

                            } catch (e) {

                                myStopFunction(false);

                            }

                            $.mobile.loading('hide');
                        },

                        // the feed is returning "foo" sometimes!
                        error : function(xhr, ajaxOptions, thrownError) {

                            //console.log(ajaxOptions);

                            //console.log(line
                                        //+ " | "
                                        //+ thrownError
                                        //+ " | "
                                        //+ xhr.responseText);
                        }

                    });
                }
                timer = setInterval(function() {
                    myTimer();
                }, interval);

            };

        };

        // The add button panel.
        $('#reset-nav').click(function () {

            for (var i = 0; i < arr.length; i += 1) {
                arr[i].stop(true);
                arr[i].clear();
            }

            for (var j = 0; j < busCheck.length; j += 1) {
                 busCheck[j] = null;
            }

            map.panTo(new google.maps.LatLng(61.4971800, 23.7614300));
        });

        // The add button panel.
        $('#nav').click(function () {

            $.mobile.loading('show');

            $("#info").text("");

            // remove the grid wrapper
            $(".wrapper").remove();

            var list = [], html;

            $.ajax({

                url : "http://data.itsfactory.fi/siriaccess/vm/json",
                dataType : "json",

                // success.
                success : function(parsed_json) {

                    var i,
                        unique,
                        a = list,
                        ccc = parsed_json.Siri.
                              ServiceDelivery.
                              VehicleMonitoringDelivery[0].
                              VehicleActivity;

                    // REMEMBER THIS!!!
                    if (ccc === undefined) {
                        //alert("no busses to show!");
                    }

                    for (i = 0; i < ccc.length; i += 1) {

                        if (ccc[i].MonitoredVehicleJourney.LineRef.value < 10) {

                            list.push("0" + ccc[i].
                                            MonitoredVehicleJourney.
                                            LineRef.
                                            value);
                        } else {

                            list.push(ccc[i].
                                      MonitoredVehicleJourney.
                                      LineRef.
                                      value);
                        }
                    }

                    list.sort();

                    unique = a.filter(function(itm, i, a) {

                        return i === a.indexOf(itm);

                    });

                    unique = $(unique).not(busCheck).get();

                    for (i = 0; i < unique.length; i += 1) {

                        html = '<div class="wrapper"><button id="b'
                               + i
                               + '" class="b" data-theme="f" data-mini="true">'
                               + unique[i]
                               + '</button></div>';


                        if (i < 11) {
                            $("#grid").attr("class", "ui-grid-solo");
                            $('#grid').append('<div id="tempgrid1" class="ui-block-a"></div>').trigger('create');
                            $('#tempgrid1').append(html).trigger('create');
                        }

                        if (i > 10 && i < 22) {
                            $("#grid").attr("class", "ui-grid-a");
                            $('#grid').append('<div id="tempgrid2" class="ui-block-b"></div>').trigger('create');
                            $('#tempgrid2').append(html).trigger('create');
                        }

                        if (i > 21 && i < 33) {
                            $("#grid").attr("class", "ui-grid-b");
                            $('#grid').append('<div id="tempgrid3" class="ui-block-c"></div>').trigger('create');
                            $('#tempgrid3').append(html).trigger('create');
                        }

                        if (i > 32 && i < 44) {
                            $("#grid").attr("class", "ui-grid-c");
                            $('#grid').append('<div id="tempgrid4" class="ui-block-d"></div>').trigger('create');
                            $('#tempgrid4').append(html).trigger('create');
                        }

                        if (i > 43 && i < unique.length) {
                            $("#grid").attr("class", "ui-grid-d");
                            $('#grid').append('<div id="tempgrid5" class="ui-block-e"></div>').trigger('create');
                            $('#tempgrid5').append(html).trigger('create');
                        }
                    }

                    // add bus
                    $('.b').click(function () {

                        var i,
                            t;

                        //$(this).button().button('disable');
                        $(this).attr('disabled','disabled');

                        $.mobile.loading('show');

                        t = $(this).text();

                        if (t.charAt(0) === '0') {

                            start = new Start();

                            arr.push(start);
                            busCheck.push(t);

                            arr[id - 1].line(t.charAt(1));

                        } else {

                            start = new Start();

                            arr.push(start);
                            busCheck.push(t);

                            arr[id - 1].line(t);
                        }

                        //$("#info").text("Line " + t + " added to map!");

                    });

                     $.mobile.loading('hide');
                },

                // Log Errors.
                error : function(e) {
                    //console.log(e);
                }
            });
        });

        // Intialize map.
        customMapType = new google.maps.StyledMapType(featureOpts,
                                                      styledMapOptions);

        // Set to custom map.
        map.mapTypes.set(MY_MAPTYPE_ID, customMapType);
    }

    // Initialize the map listener on load.
    google.maps.event.addDomListener(window, 'load', initialize);

};

main(); // Initialize the main view.