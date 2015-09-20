var dds = require("../");
dds.setMaxThreads(2);

var expect = require('chai').expect;

describe("par", function() {

	it("returns right results in callback", function(done) {
		// from dds examples
		var resTable = [
			[ 5, 8, 5, 8 ],
			[ 6, 6, 6, 6 ],
			[ 5, 7, 5, 7 ],
			[ 7, 5, 7, 5 ],
			[ 6, 6, 6, 6 ]
		];

		dds.par(resTable, dds.VULNERABLE_NONE, function(result, err) {
			expect(result.parResults[0]).to.equal("NS -110");
			expect(result.parResults[1]).to.equal("EW 110");
			expect(result.parContractsString[0]).to.equal("NS:EW 2S");
			expect(result.parContractsString[1]).to.equal("EW:EW 2S");
			done(err);
		});
	});

	it("returns right results in promise", function() {
		// from dds examples
		var resTable = [
			[ 5, 8, 5, 8 ],
			[ 6, 6, 6, 6 ],
			[ 5, 7, 5, 7 ],
			[ 7, 5, 7, 5 ],
			[ 6, 6, 6, 6 ]
		];

		return dds.par(resTable, dds.VULNERABLE_NONE)
			.then(function(result, err) {
				expect(result.parResults[0]).to.equal("NS -110");
				expect(result.parResults[1]).to.equal("EW 110");
				expect(result.parContractsString[0]).to.equal("NS:EW 2S");
				expect(result.parContractsString[1]).to.equal("EW:EW 2S");
			});
	});

	it("validates resultTable argument", function() {
		// from dds examples
		var resTable = [
			[ 5, 8, 5, 8 ],
			[ 6, 6, 6, 6 ],
			[ 5, 7, 5, 7 ],
			[ 7, 5, 7, 5 ],
			[ 6, 6, 6 ]
		];

		expect(() => dds.par(resTable, dds.VULNERABLE_NONE)).to.throw(/should be a 5x4 array/);
	});

	it("validates vulnerability argument", function() {
		// from dds examples
		var resTable = [
			[ 5, 8, 5, 8 ],
			[ 6, 6, 6, 6 ],
			[ 5, 7, 5, 7 ],
			[ 7, 5, 7, 5 ],
			[ 6, 6, 6, 6 ]
		];

		expect(() => dds.par(resTable, "sausage")).to.throw(/should be an integer/);
	});

	xit("validates callback argument", function() {
		// from dds examples
		var resTable = [
			[ 5, 8, 5, 8 ],
			[ 6, 6, 6, 6 ],
			[ 5, 7, 5, 7 ],
			[ 7, 5, 7, 5 ],
			[ 6, 6, 6, 6 ]
		];

		expect(() => dds.par(resTable, dds.VULNERABLE_NONE, "sausage")).to.throw(/should be a function/);
	});

	it("observes vulnerability", function() {
		// complex example from web http://www.rpbridge.net/7a23.htm
		var resTable = [
			[ 9, 4, 9, 4 ],
			[ 5, 6, 5, 6 ],
			[ 10, 2, 10, 2 ],
			[ 4, 9, 4, 9 ],
			[ 9, 4, 9, 4 ]
		];

		return dds.par(resTable, dds.VULNERABLE_EW)
			.then(function(result, err) {
				expect(result.parResults[0]).to.equal("NS 200");
				expect(result.parResults[1]).to.equal("EW -200");
				expect(result.parContractsString[0]).to.equal("NS:EW 4Cx");
				expect(result.parContractsString[1]).to.equal("EW:EW 4Cx");
				return dds.par(resTable, dds.VULNERABLE_NONE)
			})
			.then(function(result, err) {
				expect(result.parResults[0]).to.equal("NS 130");
				expect(result.parResults[1]).to.equal("EW -130");
				expect(result.parContractsString[0]).to.equal("NS:NS 4D");
				expect(result.parContractsString[1]).to.equal("EW:NS 4D");
			});
	});
});
