var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var config = require('../config.json')['dev'];
var server = require('../server');

var call = require('./common')

var Request = require('../models/request');
var User = require('../models/user');
var Task = require('../models/task');



chai.use(chaiHttp);

describe("task, ", function() {
    this.timeout(10000);

    var authorId;
    var request1Id;
    var request2Id;

    beforeEach(function (done) {
        call.cleanup()
            .then(function () {
                return call.createUser('nick@solidopinion.com', 'nick', '123456')
            })
            .then(function (res) {
                authorId = res.body._id;
                return call.createRequest('New signup request', 'Integrate facebook signup', authorId);
            })
            .then(function (res) {
                request1Id = res.body._id;
                return call.createRequest('New login request', 'Integrate facebook login', authorId);
            })
            .then(function (res) {
                request2Id = res.body._id;
                done();
            });
    });



    it("can be created", function(done) {
        call.createTask('Cleanup code', 'tech', authorId, request1Id)
            .then(function (res) {
                res.should.have.status(200);
                return call.getTask(res.body._id, authorId);
            })
            .then(function (res) {
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
            })
            .catch(function (err) {
                console.log(err);
                process.exit(1);
            })
    });


    it("can be modified", function(done) {
        call.createTask('Cleanup code', 'tech', authorId, request1Id)
            .then(function (res) {
                res.should.have.status(200);
                return call.modifyTask(res.body._id, authorId, {
                    title: 'Edited cleanup code',
                    description: 'Edited my signup doesnt work as expected',
                    isProblem: true,
                    status: 'In progress',
                    estimation: 2,
                    tags: ['tag1', 'tag2']
                });
            })
            .then(function (res) {
                res.should.have.status(200);
                return call.getTask(res.body._id, authorId);
            })
            .then(function (res) {
                res.should.have.status(200);
                res.body.title.should.equal('Edited cleanup code');
                res.body.description.should.equal('Edited my signup doesnt work as expected');
                res.body.status.should.equal('In progress');
                res.body.isRemoved.should.equal(false);
                res.body.isProblem.should.equal(true);
                res.body.should.have.property('createdAt');
                res.body.should.have.property('author').and.be.instanceof(Object);
                res.body.author.name.should.equal('nick');
                done();
            })
            .catch(function (err) {
                console.log(err);
                process.exit(1);
            })


    });

    it("can be removed", function(done) {
        call.createTask('Cleanup code', 'tech', authorId, request1Id)
            .then(function (res) {
                res.should.have.status(200);
                return call.removeTask(res.body._id, authorId);
            })
            .then(function (res) {
                res.should.have.status(200);
                return call.getTask(res.body._id, authorId);
            })
            .catch(function (err) {
                err.should.have.status(404);
                done();
            })
    });



/*







    it("can be returned as a list", function(done) {
        createRequest('Signup problems', 'My signup doesnt work as expected')
            .end(function(err, res) {
                modifyRequest(res.body._id, { 'status': 'Closed' })
                    .end(function(err, res) {
                        createTask('Tech task 1', 'tech', requestId).end(function(err, res1) {
                            createTask('Bug 2', 'bug', requestId).end(function(err, res2) {
                                chai.request(server)
                                    .get('/api/tasks')
                                    .set('Test', authorId)
                                    .query()
                                    .end(function(err, res) {
                                        done();
                                    });
                            });
                        });
                    });

    });
*/
    /*
        it("can be returned as a list", function(done) {
            createTask('Tech task 1', 'tech', requestId).end(function(err, res1) {
                createTask('Bug 2', 'bug', requestId).end(function(err, res2) {
                    chai.request(server)
                        .put('/api/tasks/' + res1.body._id)
                        .set('Test', authorId)
                        .send({
                            developer: authorId,
                            isProblem: true,
                            tags: ['tag1', 'tag2'],
                            dependsOn: res1.body._id
                        })
                        .end(function(err, res) {
                            res.should.have.status(200);
                            chai.request(server)
                                .get('/api/tasks')
                                .set('Test', authorId)
                                .query({
                                    title: 'Tech',
                                    request: requestId,
                                    type: 'tech',
                                    developer: authorId,
                                    tag: 'tag1',
                                    isProblem: true,
                                    dependend: true
                                })
                                .end(function(err, res) {
                                    res.should.have.status(200);
                                    res.body.should.be.instanceof(Array).and.have.lengthOf(1);
                                    var task = res.body[0];
                                    task.title.should.equal('Tech task 1');
                                    task.status.should.equal('Backlog');
                                    task.isRemoved.should.equal(false);
                                    task.isProblem.should.equal(true);
                                    task.should.have.property('createdAt');
                                    task.should.have.property('author').and.be.instanceof(Object);
                                    task.author.name.should.equal('nick');
                                    task.request.author.name.should.equal('nick');
                                    done();
                                });
                        });
                });
            });
        });
    */



/*




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

