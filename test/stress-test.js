var dds = require("../");
var expect = require('chai').expect;

function createHand() {
	var pips = "AKQJT98765432";
	var deck = [];
	
	for(var i = 0; i < 52; i ++)
		deck.push(i);

	for(var i = 0; i < 52; i ++) {
		var j = Math.random() * (i + 1) | 0;
		var swap = deck[i];
		deck[i] = deck[j];
		deck[j] = swap;		
	}

	var hands = [];

	for (var seat = 0; seat < 4; seat ++) {
		var suits = [[],[],[],[]];

		for (var j = 0; j < 13; j ++) {
			var i = (seat * 13) + j;
			var card = deck[i];
			var suit = Math.floor(card / 13);
			suits[suit].push(card % 13);
		}

		hands[seat] = suits
			.map(suit => suit.sort((c1, c2) => c1 - c2))
			.map(suit => suit.map(pip => pips[pip]).join(""))
			.join(".");
	}


	return "N:" + hands.join(" ");
}

describe("Stress Test", function() {

	it("calls SolveBoard 1000 times", function() {
		var calls = [];

		for (var i = 0; i < 1; i ++) {
			var pbn = createHand();
			//console.log(pbn);

			var deal = {
				trump: dds.SUIT_SPADES,
				first: dds.HAND_NORTH,
				currentTrickRank: [],
				currentTrickSuit: [],
				remainCards: pbn
			}

			var options = {
				target: dds.TARGET_MAXIMUM,
				solutions: dds.SOLUTION_FULL,
				mode: dds.MODE_AUTO_SEARCH
			};

			var result = dds.solveBoard(deal, options);
			calls.push(result);
		}

		return Promise.all(calls)
			.then((results, errors) => {
				console.log(JSON.stringify(errors));
				console.log(JSON.stringify(results));
				expect(errors).to.be.undefined;
			})
			.catch(errors => {
				expect(errors).to.be.undefined;
			});
	});
});
