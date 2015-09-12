
var dds = require("../");
dds.setMaxThreads(2);

dds.Promise = require('bluebird');
var expect = require('chai').expect;

describe("solveBoard", function() {

	it("returns the right results in callback", function(done) {
		var pbn = "E:AT5.AJT.A632.KJ7 Q763.KQ9.KQJ94.T 942.87653..98653 KJ8.42.T875.AQ42";

		var deal = {
			trump: dds.SUIT_SPADES,
			first: dds.HAND_SOUTH,
			currentTrickRank: [],
			currentTrickSuit: [],
			remainCards: pbn
		}

		var options = {
			target: dds.TARGET_MAXIMUM,
			solutions: dds.SOLUTION_FULL,
			mode: dds.MODE_AUTO_SEARCH
		};

		dds.solveBoard(deal, options, function(result, err) {
			expect(result.cards).to.equal(9);
			done(err);
		});
	});

	it("returns the right results in promise", function() {
		var pbn = "E:AT5.AJT.A632.KJ7 Q763.KQ9.KQJ94.T 942.87653..98653 KJ8.42.T875.AQ42";

		var deal = {
			trump: dds.SUIT_SPADES,
			first: dds.HAND_SOUTH,
			currentTrickRank: [],
			currentTrickSuit: [],
			remainCards: pbn
		}

		var options = {
			target: dds.TARGET_MAXIMUM,
			solutions: dds.SOLUTION_FULL,
			mode: dds.MODE_AUTO_SEARCH
		};

		return dds.solveBoard(deal, options)
			.then(function(result) {
				expect(result.cards).to.equal(9);
				console.log(JSON.stringify(result));
			});
	});

	it("returns errors", function() {
		var pbn = "E:AT5.AJT.A632.KJ7 Q763.KQ9.KQJ94.T 999.87653..98653 KJ8.42.T875.AQ42";

		var deal = {
			trump: dds.SUIT_SPADES,
			first: dds.HAND_EAST,
			currentTrickRank: [],
			currentTrickSuit: [],
			remainCards: pbn
		}

		var options = {
			target: dds.TARGET_MAXIMUM,
			solutions: dds.SOLUTION_FULL,
			mode: dds.MODE_AUTO_SEARCH
		};

		return dds.solveBoard(deal, options)
			.catch(function(err) {
				expect(err).to.be.defined;
				return undefined;
			})
			.then(function(result) {
				expect(result).to.be.undefined;
			})
	});

});
