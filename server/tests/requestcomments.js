var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var config = require('../config.json')['dev'];
var server = require('../server');
var call = require('./common');

var Request = require('../models/request');
var User = require('../models/user');


chai.use(chaiHttp);

describe.skip("request, ", function() {
    this.timeout(10000);

    var token1, rid;

    beforeEach(function (done) {
        call.cleanup()
            .then(function () {
                done();
            });
    });


    it("comment can be added", function(done) {
        call.signupAndLogin('test1@solidopinion.com', 'test1', '123456')
            .then(function (res) {
                res.should.have.status(200);
                token1 = res.body.token;
                return call.createRequest('Login problems', 'My login doesnt work as expected', token1 );
            })
            .then(function (res) {
                res.should.have.status(200);
                rid = res.body._id;
                return call.createRequestComment(rid, 'Test comment', token1);
            })
            .then(function (res) {
                res.should.have.status(200);
                return call.getRequest(rid, token1);
            })
            .then(function (res) {
                res.body.should.have.property('comments').with.lengthOf(1).and.be.instanceof(Array);
                done();
            })
            .catch(function (err) {
                console.log(err);
                process.exit(1);
            });

    });

    it("comment can be removed", function(done) {
        call.signupAndLogin('test1@solidopinion.com', 'test1', '123456')
            .then(function (res) {
                res.should.have.status(200);
                token1 = res.body.token;
                return call.createRequest('Login problems', 'My login doesnt work as expected', token1);
            })
            .then(function (res) {
                res.should.have.status(200);
                rid = res.body._id;
                return call.createRequestComment(rid, 'Test comment', token1);
            })
            .then(function (res) {
                res.should.have.status(200);
                rid = res.body._id;
                return call.removeRequestComment(rid, res.body.comments[0]._id, token1);
            })
            .then(function (res) {
                res.should.have.status(200);
                return call.getRequest(rid, token1);
            })
            .then(function (res) {
                res.body.should.have.property('comments').with.lengthOf(0).and.be.instanceof(Array);
                done();
            })
            .catch(function (err) {
                console.log(err);
                process.exit(1);
            });
    });
});

