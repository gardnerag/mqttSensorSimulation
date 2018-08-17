var structHwType = {
	unKnown: 0,
	IBR_DDK:1,
	BK9050_Modbus:2,
	MicroEpsilonScanControl:100,
	SimulationTaster:900,
	SimulationDigiInDigiOut:910
};

var hwMsgTypes = {
	configTo: '/hw/config/to',
	configFrom: '/hw/config/from',
	allValues:'/hw/values/#'
};

var hwCommandos = {
	open: 0,
	close: 1,
	reset: 2,
	get: 3,
	set: 4,
	devCmd: 5
};

module.exports.structHwType = structHwType;
module.exports.hwMsgTypes = hwMsgTypes;
module.exports.hwCommandos = hwCommandos;

