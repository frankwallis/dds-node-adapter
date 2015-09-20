var dds = require("../");
dds.setMaxThreads(2);
dds.Promise = require('bluebird');

var expect = require('chai').expect;

describe("calcResultTable", function() {

	it("returns the right results in callback", function(done) {
		// from dds examples
		var pbn = "N:QJ6.K652.J85.T98 873.J97.AT764.Q4 K5.T83.KQ9.A7652 AT942.AQ4.32.KJ3";
		var expected = [
			[ 5, 8, 5, 8 ],
			[ 6, 6, 6, 6 ],
			[ 5, 7, 5, 7 ],
			[ 7, 5, 7, 5 ],
			[ 6, 6, 6, 6 ]
		];

		dds.calcResultTable(pbn, function(result, err) {
			expect(result).to.deep.equal(expected);
			done(err);
		});

	});

	it("returns the right results in promise", function() {
		// from dds examples
		var pbn = "N:QJ6.K652.J85.T98 873.J97.AT764.Q4 K5.T83.KQ9.A7652 AT942.AQ4.32.KJ3";
		var expected = [
			[ 5, 8, 5, 8 ],
			[ 6, 6, 6, 6 ],
			[ 5, 7, 5, 7 ],
			[ 7, 5, 7, 5 ],
			[ 6, 6, 6, 6 ]
		];

		return dds.calcResultTable(pbn)
			.then(function(result, err) {
				expect(result).to.deep.equal(expected);
			});
	});

	it("validates pbn argument", function() {
		expect(() => dds.calcResultTable(null)).to.throw(/should be a PBN string/);
	});

});
