var dds = require("../");
dds.setMaxThreads(2);
dds.Promise = require('bluebird');

var expect = require('chai').expect;

describe("par", function() {

	it("returns right results in callback", function(done) {
		var resTable = [
			[ 8, 5, 8, 5, 5 ],
			[ 5, 8, 4, 8, 10 ],
			[ 10, 3, 10, 3, 5 ],
			[ 5, 8, 5, 8, 9 ]
		];

		return dds.par(resTable, dds.VULNERABLE_NONE, function(result, err) {
			expect(result.parResults[0]).to.equal("NS 130");
			expect(result.parResults[1]).to.equal("EW -130");
			expect(result.parContractsString[0]).to.equal("NS:NS 4D");
			expect(result.parContractsString[1]).to.equal("EW:NS 4D");
			done(err);
		})
	});

	it("returns right results in promise", function() {
		var resTable = [
			[ 8, 5, 8, 5, 5 ],
			[ 5, 8, 4, 8, 10 ],
			[ 10, 3, 10, 3, 5 ],
			[ 5, 8, 5, 8, 9 ]
		];

		return dds.par(resTable, dds.VULNERABLE_NONE)
			.then(function(result, err) {
				expect(result.parResults[0]).to.equal("NS 130");
				expect(result.parResults[1]).to.equal("EW -130");
				expect(result.parContractsString[0]).to.equal("NS:NS 4D");
				expect(result.parContractsString[1]).to.equal("EW:NS 4D");
			})
	});

	it("observes vulnerability", function() {
		var resTable = [
			[ 8, 5, 8, 5, 5 ],
			[ 5, 8, 4, 8, 10 ],
			[ 10, 3, 10, 3, 5 ],
			[ 5, 8, 5, 8, 9 ]
		];

		return dds.par(resTable, dds.VULNERABLE_BOTH)
			.then(function(result, err) {
				expect(result.parResults[0]).to.equal("NS 130");
				expect(result.parResults[1]).to.equal("EW -130");
				expect(result.parContractsString[0]).to.equal("NS:NS 34D");
				expect(result.parContractsString[1]).to.equal("EW:NS 34D");
			});
	});

});
