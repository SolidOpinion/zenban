var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var config = require('../config.json')['dev'];
var server = require('../server');
var call = require('./common');

var Request = require('../models/request');
var User = require('../models/user');


chai.use(chaiHttp);

describe("request, ", function() {
    this.timeout(10000);

    var token1;

    beforeEach(function (done) {
        call.cleanup()
            .then(function () {
                done();
            });
    });


    it("can be created", function(done) {
        call.signupAndLogin('test1@solidopinion.com', 'test1', '123456')
            .then(function (res) {
                res.should.have.status(200);
                token1 = res.body.token;
                return call.createRequest('Login problems', 'My login doesnt work as expected', token1 );
            })
            .then(function (res) {
                res.should.have.status(200);
                return call.getRequest(res.body._id, token1);
            })
            .then(function (res) {
                res.should.have.status(200);
                res.body.title.should.equal('Login problems');
                res.body.description.should.equal('My login doesnt work as expected');
                res.body.status.should.equal('New requests');
                res.body.position.should.equal(1000);
                res.body.isRemoved.should.equal(false);
                res.body.isProblem.should.equal(false);
                res.body.should.have.property('createdAt');
                res.body.should.have.property('author').and.be.instanceof(Object);
                res.body.author.name.should.equal('test1');
                done();
            })
            .catch(function (err) {
                console.log(err);
                process.exit(1);
            });
    });

    it("can be modified", function(done) {
        call.signupAndLogin('test1@solidopinion.com', 'test1', '123456')
            .then(function (res) {
                res.should.have.status(200);
                token1 = res.body.token;
                return call.createRequest('Login problems', 'My login doesnt work as expected', token1 );
            })
            .then(function (res) {
                res.should.have.status(200);
                return call.modifyRequest(res.body._id, {
                    title: 'Signup problems',
                    description: 'My signup doesnt work as expected',
                    isProblem: true,
                    status: 'Waiting for architect'
                }, token1 );
            })
            .then(function (res) {
                res.should.have.status(200);
                return call.getRequest(res.body._id, token1);
            })
            .then(function (res) {
                res.should.have.status(200);
                res.body.title.should.equal('Signup problems');
                res.body.description.should.equal('My signup doesnt work as expected');
                res.body.status.should.equal('Waiting for architect');
                res.body.position.should.equal(1000);
                res.body.isRemoved.should.equal(false);
                res.body.isProblem.should.equal(true);
                res.body.should.have.property('createdAt');
                res.body.should.have.property('author').and.be.instanceof(Object);
                res.body.author.name.should.equal('test1');
                done();
            })
            .catch(function (err) {
                console.log(err);
                process.exit(1);
            });
    });

    it("can be removed", function(done) {
        call.signupAndLogin('test1@solidopinion.com', 'test1', '123456')
            .then(function (res) {
                res.should.have.status(200);
                token1 = res.body.token;
                return call.createRequest('Login problems', 'My login doesnt work as expected', token1 );
            })
            .then(function (res) {
                res.should.have.status(200);
                return call.removeRequest(res.body._id, token1 );
            })
            .then(function (res) {
                res.should.have.status(200);
                return call.getRequest(res.body._id, token1);
            })
            .catch(function (err) {
                err.should.have.status(404);
                done();
            });
    });

    it("can be returned as a list", function(done) {
        call.signupAndLogin('test1@solidopinion.com', 'test1', '123456')
            .then(function (res) {
                res.should.have.status(200);
                token1 = res.body.token;
                return call.createRequest('Login problems', 'My login doesnt work as expected', token1 );
            })
            .then(function (res) {
                res.should.have.status(200);
                return call.createRequest('Signup problems', 'My signup doesnt work as expected', token1 );
            })
            .then(function (res) {
                res.should.have.status(200);
                return call.getRequests({}, token1 );
            })
            .then(function (res) {
                res.should.have.status(200);
                res.should.have.property('body').with.lengthOf(2).and.be.instanceof(Array);
                done();
            })
            .catch(function (err) {
                console.log(err);
                process.exit(1);
            });
    });

    it("can be filtered by a title", function(done) {
        call.signupAndLogin('test1@solidopinion.com', 'test1', '123456')
            .then(function (res) {
                res.should.have.status(200);
                token1 = res.body.token;
                return call.createRequest('Login problems', 'My login doesnt work as expected', token1 );
            })
            .then(function (res) {
                res.should.have.status(200);
                return call.createRequest('Signup problems', 'My signup doesnt work as expected', token1 );
            })
            .then(function (res) {
                res.should.have.status(200);
                return call.getRequests({ title: 'Signup' }, token1 );
            })
            .then(function (res) {
                res.should.have.status(200);
                res.should.have.property('body').with.lengthOf(1).and.be.instanceof(Array);
                done();
            })
            .catch(function (err) {
                console.log(err);
                process.exit(1);
            });
    });


    it("hides closed", function(done) {
        call.signupAndLogin('test1@solidopinion.com', 'test1', '123456')
            .then(function (res) {
                res.should.have.status(200);
                token1 = res.body.token;
                return call.createRequest('Login problems', 'My login doesnt work as expected', token1 );
            })
            .then(function (res) {
                res.should.have.status(200);
                return call.createRequest('Signup problems', 'My signup doesnt work as expected', token1 );
            })
            .then(function (res) {
                res.should.have.status(200);
                return call.modifyRequest(res.body._id, {
                    status: 'Closed'
                }, token1 );
            })
            .then(function (res) {
                res.should.have.status(200);
                return call.getRequests({}, token1 );
            })
            .then(function (res) {
                res.should.have.status(200);
                res.should.have.property('body').with.lengthOf(1).and.be.instanceof(Array);
                done();
            })
            .catch(function (err) {
                console.log(err);
                process.exit(1);
            });
    });

    it("shows closed for archive", function(done) {
        call.signupAndLogin('test1@solidopinion.com', 'test1', '123456')
            .then(function (res) {
                res.should.have.status(200);
                token1 = res.body.token;
                return call.createRequest('Login problems', 'My login doesnt work as expected', token1 );
            })
            .then(function (res) {
                res.should.have.status(200);
                return call.createRequest('Signup problems', 'My signup doesnt work as expected', token1 );
            })
            .then(function (res) {
                res.should.have.status(200);
                return call.modifyRequest(res.body._id, {
                    status: 'Closed'
                }, token1 );
            })
            .then(function (res) {
                res.should.have.status(200);
                return call.getRequests({ showArchive: true }, token1 );
            })
            .then(function (res) {
                res.should.have.status(200);
                res.should.have.property('body').with.lengthOf(2).and.be.instanceof(Array);
                done();
            })
            .catch(function (err) {
                console.log(err);
                process.exit(1);
            });
    });
});

