var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var should = chai.should();

chai.use(chaiHttp);

describe("Color Code Converter", function() {
    describe("RGB to Hex conversion", function() {
        it("converts the basic colors", function() {
            chai.request(server)
                .get('/api/user')
                .end(function(err, res){
                    res.should.have.status(200);
                    done();
                });
        });
    });

});