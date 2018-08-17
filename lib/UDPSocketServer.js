//
// Komunikation per RobotSensorInterface (RSI)
// zwischen PC und Roboter-Steuerung per LAN (UDP)
//
var dgram = require('dgram');

var server = dgram.createSocket('udp4');

var maxlength = 5000;
var sendbuffer = new Buffer(maxlength);

function UDPinit(address, port, cbFnMessageReceived)  {

    server.on('listening', function () {
        var address = server.address();
        console.log('UDP Server listening on ' + address.address + ":" + address.port);
    });
    server.on('message', function (message, remote) {
		if (typeof cbFnMessageReceived === "function") {
			cbFnMessageReceived(message,remote);
		}
    });
    server.bind(port, address);
}


function UDPsendBuffer(xml,remote) 
{
	// Achtung logging kostet zeit - hier kritisch!
	
	sendbuffer.write(xml,0);
	
	server.send(sendbuffer, 0, xml.length, remote.port, remote.address, function (err, bytes) {
		if (err) throw err;
	});
}

module.exports.UDPinit = UDPinit;
module.exports.UDPsendBuffer = UDPsendBuffer;

