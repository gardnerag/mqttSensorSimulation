var mqtt = require('mqtt'); 
var util = require('./mqtt_Utils');

var client;


function mqttConnect(host, connectHandler, msgHandler) {
 
	if (host == null) {
		host = 'mqtt://localhost:1883';
	}
	var options = {
		reconnectPeriod:10000,
		keepalive:30000
	};

	client = mqtt.connect(host,options);
	
	client.on('connect', function () {
	    //util.logit('connected to mqtt server');
		connectHandler();
	});
	
	client.on('message', function (topic, message) {
	    //console.log(topic + '|' + message);

	    msgHandler(topic, message);
	});

	client.on('reconnect', function () {
	    //util.logit('reconnected to mqtt server');
		connectHandler();
	});
	//return (client);
}
 
 function mqttSubscribe(topic) {
 
	//util.logit('mqttSubscribe: ' + topic);
    client.subscribe(topic);
}

function mqttPublish(topic, message) {
 
	//util.logit('mqttPublish: ' + topic + '|' + message);
	client.publish(topic,message);
}

module.exports.mqttConnect = mqttConnect;
module.exports.mqttSubscribe = mqttSubscribe;
module.exports.mqttPublish = mqttPublish;
