
var binding = require("../");
binding.SetMaxThreads(2);

var expect = require('chai').expect;

describe("SolveBoard", function() {

	it("returns the right results", function(done) {
		var pbn = "E:AT5.AJT.A632.KJ7 Q763.KQ9.KQJ94.T 942.87653..98653 KJ8.42.T875.AQ42";

		var deal = {
			trump: binding.SUIT_SPADES,
			first: binding.HAND_SOUTH,
			currentTrickRank: [],
			currentTrickSuit: [],
			remainCards: pbn
		}

		result = binding.SolveBoard(deal, binding.TARGET_MAXIMUM, binding.SOLUTION_FULL, 
			binding.MODE_AUTO_SEARCH, 0, function(result) {
				console.log(JSON.stringify(result));		
				done();
			});
	});
});
