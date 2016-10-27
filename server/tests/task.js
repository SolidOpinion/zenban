var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var config = require('../config.json')['dev'];
var server = require('../server');

var Request = require('../models/request');
var User = require('../models/user');
var Task = require('../models/task');

chai.use(chaiHttp);

describe("task, ", function() {
    this.timeout(10000);

    var authorId;
    var requestId;

    function createTask(title, description) {
        return chai.request(server)
            .post('/api/tasks')
            .set('Test', authorId)
            .send({
                title: title,
                description: description
            });
    }

    beforeEach(function (done) {
        // remove all users before each test
        Request.remove().exec().then(function() {
            User.remove().exec().then(function() {
                chai.request(server)
                    .post('/api/users')
                    .send({
                        email: 'nick@solidopinion.com',
                        name: 'nick',
                        password: '123456'
                    })
                    .end(function(err, res) {
                        authorId = res.body._id;
                        chai.request(server)
                            .post('/api/requests')
                            .set('Test', authorId)
                            .send({
                                title: 'New signup request',
                                description: 'Integrate facebook signup'
                            })
                            .end(function(err, res) {
                                requestId = res.body._id;
                                done();
                            });
                    });
            });
        });
    });


    it("can be created", function(done) {
        chai.request(server)
            .post('/api/tasks')
            .set('Test', authorId)
            .send({
                title: 'Cleanup code',
                type: 'tech',
                request: requestId
            })
            .end(function(err, res) {
                res.should.have.status(200);
                chai.request(server)
                    .get('/api/tasks/' + res.body._id)
                    .set('Test', authorId)
                    .end(function(err, res) {
                        res.should.have.status(200);
                        res.body.title.should.equal('Cleanup code');
                        res.body.status.should.equal('Backlog');
                        res.body.type.should.equal('tech');
                        res.body.estimation.should.equal(0);
                        res.body.isRemoved.should.equal(false);
                        res.body.isProblem.should.equal(false);
                        res.body.should.have.property('createdAt');
                        res.body.should.have.property('author').and.be.instanceof(Object);
                        res.body.author.name.should.equal('nick');
                        done();
                    });
            });
    });
/*
    it("can be modified", function(done) {
        chai.request(server)
            .post('/api/tasks')
            .set('Test', authorId)
            .send({
                title: 'Login problems',
                description: 'My login doesnt work as expected'
            })
            .end(function(err, res1) {
                chai.request(server)
                    .put('/api/requests/' + res1.body._id)
                    .set('Test', authorId)
                    .send({
                        title: 'Signup problems',
                        description: 'My signup doesnt work as expected',
                        isProblem: true,
                        status: 'Waiting for architect'
                    })
                    .end(function(err, res) {
                        res.should.have.status(200);
                        chai.request(server)
                            .get('/api/requests/' + res.body._id)
                            .set('Test', authorId)
                            .end(function(err, res) {
                                res.should.have.status(200);
                                res.body.title.should.equal('Signup problems');
                                res.body.description.should.equal('My signup doesnt work as expected');
                                res.body.status.should.equal('Waiting for architect');
                                res.body.position.should.equal(1000);
                                res.body.isRemoved.should.equal(false);
                                res.body.isProblem.should.equal(true);
                                res.body.should.have.property('createdAt');
                                res.body.should.have.property('author').and.be.instanceof(Object);
                                res.body.author.name.should.equal('nick');
                                done();
                            });
                    });
            });
    });
*/
    /*
    it("can be removed", function(done) {
        chai.request(server)
            .post('/api/requests')
            .set('Test', authorId)
            .send({
                title: 'Login problems',
                description: 'My login doesnt work as expected'
            })
            .end(function(err, res1) {
                chai.request(server)
                    .delete('/api/requests/' + res1.body._id)
                    .set('Test', authorId)
                    .end(function(err, res) {
                        res.should.have.status(200);
                        chai.request(server)
                            .get('/api/requests/' + res.body._id)
                            .set('Test', authorId)
                            .end(function(err, res) {
                                res.should.have.status(404);
                                done();
                            });
                    });
            });
    });

    it("can be returned as a list", function(done) {
        chai.request(server)
            .post('/api/requests')
            .set('Test', authorId)
            .send({
                title: 'Login problems',
                description: 'My login doesnt work as expected'
            })
            .end(function() {
                chai.request(server)
                    .post('/api/requests')
                    .set('Test', authorId)
                    .send({
                        title: 'Signup problems',
                        description: 'My signup doesnt work as expected'
                    })
                    .end(function(err, res) {
                        res.should.have.status(200);
                        chai.request(server)
                            .get('/api/requests')
                            .set('Test', authorId)
                            .end(function(err, res) {
                                res.should.have.property('body').with.lengthOf(2).and.be.instanceof(Array);
                                done();
                            });
                    });
            });
    });

    it("can be filtered by a title", function(done) {
        chai.request(server)
            .post('/api/requests')
            .set('Test', authorId)
            .send({
                title: 'Login problems',
                description: 'My login doesnt work as expected'
            })
            .end(function() {
                chai.request(server)
                    .post('/api/requests')
                    .set('Test', authorId)
                    .send({
                        title: 'Signup problems',
                        description: 'My signup doesnt work as expected'
                    })
                    .end(function(err, res) {
                        res.should.have.status(200);
                        chai.request(server)
                            .get('/api/requests')
                            .query({ title: 'Signup' })
                            .set('Test', authorId)
                            .end(function(err, res) {
                                res.should.have.property('body').with.lengthOf(1).and.be.instanceof(Array);
                                done();
                            });
                    });
            });
    });

    it("hides closed", function(done) {
        createRequest('Login problems', 'My login doesnt work as expected')
            .end(function(err, res) {
                createRequest('Signup problems', 'My signup doesnt work as expected')
                    .end(function(err, res) {
                        modifyRequest(res.body._id, { 'status': 'Closed' })
                            .end(function(err, res) {
                                chai.request(server)
                                    .get('/api/requests')
                                    .set('Test', authorId)
                                    .end(function(err, res) {
                                        res.should.have.property('body').with.lengthOf(1).and.be.instanceof(Array);
                                        done();
                                    });
                            });
                    });
            });
    });

    it("shows closed for archive", function(done) {
        createRequest('Login problems', 'My login doesnt work as expected').end(function(err, res) {
            createRequest('Signup problems', 'My signup doesnt work as expected').end(function(err, res) {
                modifyRequest(res.body._id, { 'status': 'Closed' }).end(function(err, res) {
                    chai.request(server)
                        .get('/api/requests')
                        .query({ showArchive: true })
                        .set('Test', authorId)
                        .end(function(err, res) {
                            res.should.have.property('body').with.lengthOf(2).and.be.instanceof(Array);
                            done();
                        });
                });
            });
        });
    });

    it("comment can be added", function(done) {
        createRequest('Login problems', 'My login doesnt work as expected').end(function(err, res) {
            addComment('This is a test comment', res.body._id).end(function() {
                chai.request(server)
                    .get('/api/requests/' + res.body._id)
                    .set('Test', authorId)
                    .end(function(err, res) {
                        res.body.should.have.property('comments').with.lengthOf(1).and.be.instanceof(Array);
                        done();
                    });
            });
        });
    });

    it("comment can be removed", function(done) {
        createRequest('Login problems', 'My login doesnt work as expected').end(function(err, res) {
            addComment('This is a test comment', res.body._id).end(function() {
                chai.request(server)
                    .get('/api/requests/' + res.body._id)
                    .set('Test', authorId)
                    .end(function(err, res) {
                        console.log(res.body);
                        removeComment(res.body._id, res.body.comments[0]._id).end(function() {
                            chai.request(server)
                                .get('/api/requests/' + res.body._id)
                                .set('Test', authorId)
                                .end(function(err, res) {
                                    res.body.should.have.property('comments').with.lengthOf(0).and.be.instanceof(Array);
                                    done();
                                });
                            done();
                        });
                    });
            });
        });
    });
*/
});

