var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var config = require('../config.json')['dev'];
var server = require('../server');

var Test = require('../models/test');

chai.use(chaiHttp);

describe("test,", function() {
    this.timeout(10000);

    beforeEach(function (done) {
        // remove all users before each test
        Test.remove().exec().then(function(d) {
            done();
        });
    });

    it("can be created", function(done) {
        chai.request(server)
            .post('/api/test')
            .set('Test', 'yes')
            .send({
                name: 'nick'
            })
            .end(function(err, res) {
                res.should.have.status(200);
                chai.request(server)
                    .get('/api/test/' + res.body._id)
                    .set('Test', 'yes')
                    .end(function(err, res) {
                        res.should.have.status(200);
                        res.body.name.should.equal('nick');
                        res.body.isRemoved.should.equal(false);
                        res.body.should.have.property('createdAt');
                        done();
                    });
            });
    });

    it("can be created with valid fields only", function(done) {
        chai.request(server)
            .post('/api/test')
            .set('Test', 'yes')
            .send({
                name: 'n'
            })
            .end(function(err, res) {
                res.should.have.status(406);
                done();
            });
    });

    it("can be found only with valid id", function(done) {
        chai.request(server)
            .get('/api/test/1')
            .set('Test', 'yes')
            .end(function(err, res) {
                res.should.have.status(404);
                done();
            });
    });

});
