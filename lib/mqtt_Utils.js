function getConfig(basisOptions) {

    var options = {};

	process.argv.forEach(function (val, index, array) {

		//console.log(index + ': ' + val);

		if (val.indexOf('options') == 0) {  
			options = JSON.parse(val.split('=')[1].split("'").join("\""));
		}

	});
	
    var allOptions = {};
    //for (var attrname in mqttOptions) { allOptions[attrname] = mqttOptions[attrname]; }
    for (var attrname in basisOptions) { allOptions[attrname] = basisOptions[attrname]; }
    if (options !== undefined) {
        for (var attrname in options) { allOptions[attrname] = options[attrname]; }
    }

	//logit(JSON.stringify(allOptions));

	return(allOptions);
}


function logit(str) {
    //require('util').log(str);
}

function pad(c, o, num, size) {
	var p = '', s = '';
	for (var i=0; i< size; i++) { p+=c;}
	switch (o) {
		case 'left':
		default:
			s = p + num;
			s = s.substr(s.length - size);
			break;
		case 'right':
			s = num + p;
			s = s.substr(0,size);
			break;
	}
    return(s);
}

function getTimestamp() {

	// c# version without accuracy
	var d = new Date().getTime();
	//var tst = d.getTime()*10000;
	
	// javascript version without actual time reference
	//var time = process.hrtime();
	//tst = time[0] * 1e3 + parseInt(time[1]/1000000);
	
	return(d);
}

module.exports.getConfig = getConfig;
module.exports.logit = logit;
module.exports.pad = pad;
module.exports.getTimestamp = getTimestamp;
