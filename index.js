var binary = require('node-pre-gyp');
var path = require('path')
var binding_path = binary.find(path.resolve(path.join(__dirname,'./package.json')));
var binding = require(binding_path);

module.exports.SIDE_NS = 0;
module.exports.SIDE_EW = 1;

module.exports.HAND_NORTH = 0;
module.exports.HAND_EAST  = 1;
module.exports.HAND_SOUTH = 2;
module.exports.HAND_WEST  = 3;

module.exports.VULNERABLE_NONE = 0;
module.exports.VULNERABLE_BOTH = 1;
module.exports.VULNERABLE_NS   = 2;
module.exports.VULNERABLE_EW   = 3;

module.exports.SUIT_SPADES   = 0;
module.exports.SUIT_HEARTS   = 1;
module.exports.SUIT_DIAMONDS = 2;
module.exports.SUIT_CLUBS    = 3;
module.exports.SUIT_NOTRUMPS = 4;

module.exports.SOLUTION_ONE  = 1;
module.exports.SOLUTION_ALL  = 2;
module.exports.SOLUTION_FULL = 3;

module.exports.TARGET_MAXIMUM = -1;
module.exports.TARGET_ZERO    = 0;
module.exports.TARGET_FULL    = -99;

module.exports.MODE_AUTO_NOSEARCH = 0;
module.exports.MODE_AUTO_SEARCH   = 1;
module.exports.MODE_ALWAYS        = 2;

module.exports.setMaxThreads = function(max) {
	binding.SetMaxThreads(max);
}

module.exports.solveBoard = function(deal, options, callback) {
	var options = options || {};

	if (options.target === undefined)
		options.target = module.exports.TARGET_MAXIMUM;

	if (options.solutions === undefined)
		options.solutions = module.exports.SOLUTION_ALL;

	if (options.mode === undefined)
		options.mode = module.exports.ALWAYS;

	if (options.threadIndex === undefined)
		options.threadIndex = 0;

	if (arguments.length < 3) {
		var deferred = createDeferred();
		binding.SolveBoard(deal, options.target, options.solutions, options.mode, options.threadIndex, deferred.callback);
		return deferred.promise;
	}
	else {
		binding.SolveBoard(deal, options.target, options.solutions, options.mode, options.threadIndex, callback);
		return undefined;
	}
}

module.exports.calcResultTable = function(cards, callback) {
	if (arguments.length < 2) {
		var deferred = createDeferred();
		binding.CalcDDtable(cards, deferred.callback);
		return deferred.promise;
	}
	else {
		binding.CalcDDtable(cards, callback);
		return undefined;
	}
}

module.exports.par = function(resultTable, vulnerable, callback) {
	if (arguments.length < 3) {
		var deferred = createDeferred();
		binding.Par(resultTable, vulnerable, deferred.callback);
		return deferred.promise;
	}
	else {
		binding.Par(resultTable, vulnerable, callback);
		return undefined;
	}
}

// You can provide a Promise implementation
module.exports.Promise = global.Promise;

function createDeferred() {
	var result = {};

	result.promise = new module.exports.Promise(function(resolve, reject) {
		result.resolve = resolve,
		result.reject = reject;
	});

	result.callback = function(res, err) {
		if (err) result.reject(err);
		else result.resolve(res);
	}

	return result;
}