var dds = require("../");
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

	it("validates arguments", function() {
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

		deal.trump = "sausage";
		expect(dds.solveBoard.bind(dds, deal, options)).to.throw(/deal.trump/);

		deal.trump = dds.SUIT_SPADES;
		delete deal.currentTrickRank;

		expect(dds.solveBoard.bind(dds, deal, options)).to.throw(/currentTrickRank/);
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
				expect(err).to.not.be.undefined;
				return undefined;
			})
			.then(function(result) {
				expect(result).to.be.undefined;
			})
	});

	it("uses the current trick", function() {
		var pbn = "N:T... K9... Q.2.. 23...";

		var deal = {
			trump: dds.SUIT_SPADES,
			first: dds.HAND_NORTH,
			currentTrickRank: [14],
			currentTrickSuit: [dds.SUIT_SPADES],
			remainCards: pbn
		}

		var options = {
			target: dds.TARGET_MAXIMUM,
			solutions: dds.SOLUTION_FULL,
			mode: dds.MODE_AUTO_SEARCH
		};

		return dds.solveBoard(deal, options)
			.then(function(result) {
				console.log(JSON.stringify(result));
				expect(result.cards).to.equal(2);

				expect(result.score[0]).to.equal(1);
				expect(result.rank[0]).to.equal(9);
				expect(result.score[1]).to.equal(0);
				expect(result.rank[1]).to.equal(13);

				deal.currentTrickRank = [7];
				deal.currentTrickSuit = [dds.SUIT_SPADES];
				return dds.solveBoard(deal, options);
			})
			.then(function(result) {
				console.log(JSON.stringify(result));
				expect(result.cards).to.equal(2);

				expect(result.score[0]).to.equal(1);
				expect(result.rank[0]).to.equal(13);
				expect(result.score[1]).to.equal(1);
				expect(result.rank[1]).to.equal(9);
			});
	});
});
