var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var config = require('../config.json')['dev'];
var server = require('../server');
var call = require('./common');
var Requirement = require('../models/requirement');
chai.use(chaiHttp);

describe("requirement, ", function() {
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
                return call.createRequirement('User signup', token1);
            })
            .then(function (res) {
                res.should.have.status(200);
                return call.getRequirement(res.body._id, token1);
            })
            .then(function (res) {
                res.should.have.status(200);
                res.body.title.should.equal('User signup');
                res.body.isRemoved.should.equal(false);
                res.body.should.have.property('createdAt');
                res.body.should.not.have.property('parentId');
                done();
            })
            .catch(function (err) {
                console.log(err);
                process.exit(1);
            });
    });

    it("can be created with valid fields only", function(done) {
        call.signupAndLogin('test1@solidopinion.com', 'test1', '123456')
            .then(function (res) {
                res.should.have.status(200);
                token1 = res.body.token;
                return call.createRequirement('', token1);
            })
            .catch(function (err) {
                err.should.have.status(406);
                done();
            });
    });

    it("can be removed", function(done) {
        call.signupAndLogin('test1@solidopinion.com', 'test1', '123456')
            .then(function (res) {
                res.should.have.status(200);
                token1 = res.body.token;
                return call.createRequirement('User signup', token1);
            })
            .then(function (res) {
                res.should.have.status(200);
                return call.removeRequirement(res.body._id, token1);
            })
            .then(function (res) {
                res.should.have.status(200);
                return call.getRequirement(res.body._id, token1);
            })
            .catch(function (err) {
                err.should.have.status(404);
                done();
            });
    });

    it("can be modified", function(done) {
        call.signupAndLogin('test1@solidopinion.com', 'test1', '123456')
            .then(function (res) {
                res.should.have.status(200);
                token1 = res.body.token;
                return call.createRequirement('User signup', token1);
            })
            .then(function (res) {
                res.should.have.status(200);
                return call.modifyRequirement(res.body._id, { title: 'User login' }, token1);
            })
            .then(function (res) {
                res.should.have.status(200);
                return call.getRequirement(res.body._id, token1);
            })
            .then(function (res) {
                rres.should.have.status(200);
                res.body.title.should.equal('User login');
                done();
            })
            .catch(function (err) {
                console.log(err);
                process.exit(1);
            });
    });


/*
    it("can be modified", function(done) {
        chai.request(server)
            .post('/api/requirements')
            .set('Test', 'yes')
            .send({
                title: 'User signup'
            })
            .end(function(err, res) {
                res.should.have.status(200);
                chai.request(server)
                    .put('/api/requirements/' + res.body._id)
                    .set('Test', 'yes')
                    .send({
                        title: 'User login'
                    })
                    .end(function(err, res) {
                        res.should.have.status(200);
                        chai.request(server)
                            .get('/api/requirements/' + res.body._id)
                            .set('Test', 'yes')
                            .end(function(err, res) {
                                res.should.have.status(200);
                                res.body.title.should.equal('User login');
                                done();
                            });
                    });
            });
    });

    it("can be saved and returned as a tree", function(done) {
        chai.request(server)
            .post('/api/requirements')
            .set('Test', 'yes')
            .send({
                title: 'User can signup'
            })
            .end(function(err, res) {
                res.should.have.status(200);
                chai.request(server)
                    .post('/api/requirements')
                    .set('Test', 'yes')
                    .send({
                        title: 'With Facebook',
                        parent: res.body._id
                    })
                    .end(function(err, res) {
                        res.should.have.status(200);
                        chai.request(server)
                            .get('/api/requirements')
                            .set('Test', 'yes')
                            .end(function(err, res) {
                                res.should.have.status(200);
                                res.should.have.property('body').with.lengthOf(2).and.be.instanceof(Array);
                                res.body[0].title.should.equal('User can signup');
                                res.body[1].title.should.equal('With Facebook');
                                res.body[1].parent.should.equal(res.body[0]._id);
                                done();
                            });
                    });
            });
    });

    it("can filter tree items by part of title text", function(done) {
        chai.request(server)
            .post('/api/requirements')
            .set('Test', 'yes')
            .send({
                title: 'User can signup'
            })
            .end(function(err, res) {
                res.should.have.status(200);
                chai.request(server)
                    .post('/api/requirements')
                    .set('Test', 'yes')
                    .send({
                        title: 'With Facebook',
                        parent: res.body._id
                    })
                    .end(function(err, res) {
                        res.should.have.status(200);
                        chai.request(server)
                            .get('/api/requirements')
                            .query({ title: 'User' })
                            .set('Test', 'yes')
                            .end(function(err, res) {
                                res.should.have.status(200);
                                res.should.have.property('body').with.lengthOf(1).and.be.instanceof(Array);
                                res.body[0].title.should.equal('User can signup');
                                done();
                            });
                    });
            });
    });


    it("doesn't return removed in search", function(done) {
        chai.request(server)
            .post('/api/requirements')
            .set('Test', 'yes')
            .send({
                title: 'User can signup'
            })
            .end(function(err, res) {
                res.should.have.status(200);
                chai.request(server)
                    .delete('/api/requirements/' + res.body._id)
                    .set('Test', 'yes')
                    .end(function(err, res) {
                        res.should.have.status(200);
                        chai.request(server)
                            .get('/api/requirements')
                            .query({ title: 'User' })
                            .set('Test', 'yes')
                            .end(function(err, res) {
                                res.should.have.status(200);
                                res.should.have.property('body').with.lengthOf(0).and.be.instanceof(Array);
                                done();
                            });
                    });
            });
    });

*/
});
