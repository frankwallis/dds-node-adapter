var dds = require("../");
dds.setMaxThreads(2);
dds.Promise = require('bluebird');

var expect = require('chai').expect;

describe("calcResultTable", function() {

	it("returns the right results in callback", function(done) {
		var pbn = "E:AT5.AJT.A632.KJ7 Q763.KQ9.KQJ94.T 942.87653..98653 KJ8.42.T875.AQ42";
		var expected = [
			[ 8, 5, 8, 5, 5 ],
			[ 5, 8, 4, 8, 10 ],
			[ 10, 3, 10, 3, 5 ],
			[ 5, 8, 5, 8, 9 ]
		];

		dds.calcResultTable(pbn, function(result, err) {
			expect(result).to.deep.equal(expected);
			done(err);
		});

	});

	it("returns the right results in promise", function() {
		var pbn = "E:AT5.AJT.A632.KJ7 Q763.KQ9.KQJ94.T 942.87653..98653 KJ8.42.T875.AQ42";
		var expected = [
			[ 8, 5, 8, 5, 5 ],
			[ 5, 8, 4, 8, 10 ],
			[ 10, 3, 10, 3, 5 ],
			[ 5, 8, 5, 8, 9 ]
		];

		return dds.calcResultTable(pbn)
			.then(function(result, err) {
				expect(result).to.deep.equal(expected);
			});
	});
});
