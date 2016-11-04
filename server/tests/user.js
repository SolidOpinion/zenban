var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var config = require('../config.json')['dev'];
var server = require('../server');
var call = require('./common');
var User = require('../models/user');
chai.use(chaiHttp);

describe.skip("user, ", function() {
    this.timeout(10000);

    beforeEach(function (done) {
        call.cleanup()
            .then(function () {
                done();
            });
    });

    it("can signup and login", function(done) {
        call.createUser('nick@solidopinion.com', 'nick', '123456')
            .then(function (res) {
                res.should.have.status(200);
                return call.createAuth('nick@solidopinion.com', '123456');
            })
            .then(function (res) {
                res.should.have.status(200);
                res.body.should.have.property('token');
                return call.getAuth(res.body.token);
            })
            .then(function (res) {
                res.should.have.status(200);
                res.body.email.should.equal('nick@solidopinion.com');
                res.body.type.should.equal('internal');
                res.body.name.should.equal('nick');
                res.body.isRemoved.should.equal(false);
                res.body.should.have.property('createdAt');
                res.body.should.not.have.property('password');
                done();
            })
            .catch(function (err) {
                console.log(err);
                process.exit(1);
            });
    });

    it("can return list", function(done) {
        call.createUser('test1@solidopinion.com', 'test1', '123456')
            .then(function (res) {
                res.should.have.status(200);
                return call.createUser('test2@solidopinion.com', 'test2', '123456');
            })
            .then(function (res) {
                res.should.have.status(200);
                return call.createAuth('test1@solidopinion.com', '123456');
            })
            .then(function (res) {
                res.should.have.status(200);
                return call.getUsers({ name: 'test1' }, res.body.token);
            })
            .then(function (res) {
                res.should.have.status(200);
                res.should.have.property('body').with.lengthOf(1).and.be.instanceof(Array);
                res.body[0].should.not.have.property('password');
                done();
            })
            .catch(function (err) {
                console.log(err);
                process.exit(1);
            });
    });


});
