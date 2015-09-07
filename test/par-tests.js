var dds = require("../");
dds.SetMaxThreads(2);

var expect = require('chai').expect;

describe("Par", function() {

	it("is correct for no-one vulnerable", function(done) {
		var resTable = [ 
			[ 8, 5, 8, 5, 5 ],
			[ 5, 8, 4, 8, 10 ],
			[ 10, 3, 10, 3, 5 ],
			[ 5, 8, 5, 8, 9 ] 
		];

		dds.Par(resTable, dds.VULNERABLE_NONE, function(result) {
			expect(result.parResults[0]).to.equal("NS 130");
			expect(result.parResults[1]).to.equal("EW -130");
			expect(result.parContractsString[0]).to.equal("NS:NS 4D");
			expect(result.parContractsString[1]).to.equal("EW:NS 4D");
			done();
		});

	});

});
