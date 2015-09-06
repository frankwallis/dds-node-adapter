
var binding = require("../");
binding.SetMaxThreads(2);

var assert = require('assert');

describe("CalcDDtable", function() {

	it("returns the right results", function() {
		var pbn = "E:AT5.AJT.A632.KJ7 Q763.KQ9.KQJ94.T 942.87653..98653 KJ8.42.T875.AQ42";
		var expected = [ 
			[ 8, 5, 8, 5, 5 ],
			[ 5, 8, 4, 8, 10 ],
			[ 10, 3, 10, 3, 5 ],
			[ 5, 8, 5, 8, 9 ] 
		];

		result = binding.CalcDDtable(pbn);
		assert.deepEqual(expected, result);
	});
});
