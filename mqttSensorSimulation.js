// node program.js options={id:Bedienpult1,mqttServer:192.168.178.44}

/*
* Project           : Minimal MQTT Sensor Simulation 
*
* Program name      : mqttSensorSimulation.js
*
* Author            : Stephen Gardner
*
*	Contact						:	stephen.gardner@gardner-ag.com
*
*	Company						: gardner ag, Kelterstraße 59, 72669 Unterensingen, Germany
*
* Date created      : 08/17/2018
*
* License						:	MIT License
*
*/

/*
	Include a license text for open source
	Describe how to start the program and override the default options
	Include our contact data
	declare the module using ES6 function declaration format
	put all global variables in a separate object at the top of the code
*/

var hwMqtt = require('./lib/mqtt_Client');
var util = require('./lib/mqtt_Utils');
var hwTypes = require('./lib/structHwTypes');

// ToDo Options => external json file
var defaultOptions = {
	mqttServer: require('../../application/system.config.js').config.brokerIP,
	mqttPort: 1883,
	id: '$a1ea0326_9d24_450f_9b0a_9d32e946e621_D001',
	name: 'OP090-090',
	type: hwTypes.structHwType.SimulationTaster,
	nAIN: 4,
	offset: 0,
	frequency: 100
};

//-----------------------------------------------------------------
var name = 'mqttSensorSimulation';
var mqttLog = require('../../services/common/msDbClientMqttClass');
mqttLog.mqttConnect(mqttLog.mqttServer, null, null);
mqttLog.log(name,'info',{msg:'Startup'});
//-----------------------------------------------------------------

var config;

main();         // Lets start the main program

function main() {

    config = util.getConfig(defaultOptions);

    var server = 'mqtt://' + config.mqttServer + ':' + config.mqttPort;
	console.log(server)
    hwMqtt.mqttConnect(server, connectHandler, msgHandler);
}

var intervalID = 0;

function connectHandler() {

    hwMqtt.mqttSubscribe('qp3/hw/config/to/#');
	publishConfig();

	if (intervalID != 0) {
		clearTimeout(intervalID);
	}
	// if faster than 5ms then use process ticks
	if (config.frequency < 5.0) {
		processLoop();
	} else {
		intervalID = setInterval(sendLoopEndless,config.frequency);
	}
}

function msgHandler(topic, message) {

	console.log(topic)

    if (topic.indexOf('qp3/hw/config/to') == 0) {
		
 		publishConfig();
   }
}

function publishConfig() {

	var cfg = {
		CFG: {
			devDataTyp: config.type,
			devName: config.name,
			devID: config.id,
			nAIN: config.nAIN.toString(),
			nAOT: '000',
			nDIN: '000',
			nDOT: '000'
		}, ERR: '0'
	};

	var cfgStr = JSON.stringify(cfg);
	util.logit(cfgStr);
	hwMqtt.mqttPublish('qp3/hw/config/from', cfgStr);
	mqttLog.log(name,'info',{cfg:cfg});
	console.log(cfg);
}

var msgCounter = 0;
var analogIn = [];

function sendLoopEndless() {

	//           Wichtig !   |    Wichtig !
	//						 v
    var topic = 'qp3/hw/values/AIN/from/devID=' + config.id;
	var tst = util.getTimestamp();

	analogIn[0] = Math.round(Math.sin(Math.PI*tst/18000)*10000)/10000;	// Sinus wave with overlying frequency
	analogIn[1] = Math.round(generateRandomNumber(1,-1)*1000)/100000;	// Random number
	analogIn[2] = Math.round(generateRandomNumber(1,-1)*1000)/100000;	// Random number
	analogIn[3] = parseInt(tst/10000000) % 2;							// Rectangular signal
	
	// offset (62135603999982) is the difference between c# (12:00 1.1.1900) and js (0:00 1.1.1970)
    var msg = { AIN: analogIn, TST: parseInt(tst) + 62135603999982, ERR: 0};
	var msgStr = JSON.stringify(msg);
	
    hwMqtt.mqttPublish(topic, msgStr);		// weiterleiten
	
    msgCounter++;

	mqttLog.log(name,'info',{cc:msgCounter,topic:topic, msg:msg});
}


function generateRandomNumber(max,min) {
	
    var n = Math.random() * (max - min) + min;
	return(n.toPrecision(4));
};


var time = process.hrtime();
var cc = 0;
var lastDiffms = 0;

function processLoop(){

	cc++;
	var diff = process.hrtime(time);
	var diffms = (diff[0] * 1e9 + diff[1])/1000000;
	//console.log('benchmark took %d nanoseconds', diff[0] * 1e9 + diff[1]);
	
	if (cc > 10000 || diffms >= config.frequency) {
		cc = 0;
		lastDiffms = diffms;
		time = process.hrtime();
		sendLoopEndless();
	}	
	setImmediate(processLoop);
}

module.exports.main = main;
