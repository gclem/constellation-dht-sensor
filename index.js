/*
* constellation-dht-sensor
* Retrieve temperature & humitidy from a dht sensor
* Push to Constellation platform
*/

var ConstellationHub = require('constellation-nodejs');
var ctx = new ConstellationHub();

var forgeValueObject = (temperature, humidity, room) => {
    return {
        "Temperature": temperature,
        "Humidity" : humidity,
        "Room": room,
        "Category": "Ambient Sensor",
    };
}

var getValues = (ctx) => {

    //// Refreshing settings
    var settings = ctx.hub.server.requestSettings();

    if (!settings || !settings.dht || !settings.room || !settings.gpio)
    {
        ctx.hub.server.writeLog("You must set setting values to use this package : dht(11,22) ,  gpio, room.", "error");
        return;
    }

    sensor.read(settings.dht, settings.gpio, function(err, temperature, humidity) {
        if (!err) {
            forgeValueObject(temperature.toFixed(1), humidity.toFixed(1), settings.room);
            ctx.hub.server.pushStateObject("" + currency, po, "Sensor.DHTAmbientSensor", 0);
        } else ctx.hub.server.writeLog("Error while retrieving values from DHT Sensor : ", error);
    });
}

//// Create a Sentinel Hub
ctx.Sentinel("Corulag")
    .then((ctx) => {
        ctx.on('connected', () => {
            console.log("Connected to platform Constellation");
            setInterval(getValues.bind(null, ctx), 10000)
        });
        return ctx.connect();
    });