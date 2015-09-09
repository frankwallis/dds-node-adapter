var binary = require('node-pre-gyp');
var path = require('path')
var binding_path = binary.find(path.resolve(path.join(__dirname,'./package.json')));
var binding = require(binding_path);

module.exports = binding;

module.exports.SIDE_NS = 0;
module.exports.SIDE_EW = 1;

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