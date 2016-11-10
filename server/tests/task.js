var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var config = require('../config.json')['dev'];
var server = require('../server');

var call = require('./common');

var Request = require('../models/request');
var User = require('../models/user');
var Task = require('../models/task');



chai.use(chaiHttp);

describe("task, ", function() {
    this.timeout(10000);

    var token1;

    beforeEach(function (done) {
        call.cleanup()
            .then(function () {
                done();
            });
    });

/*


    it("can be created", function(done) {
        call.signupAndLogin('test1@solidopinion.com', 'test1', '123456')
            .then(function (res) {
                res.should.have.status(200);
                token1 = res.body.token;
                return call.createRequest('Login problems', 'My login doesnt work as expected', token1 );
            })
            .then(function (res) {
                res.should.have.status(200);
                return call.createTask('Cleanup code', 'tech', res.body._id, token1);
            })
            .then(function (res) {
                res.should.have.status(200);
                return call.getTask(res.body._id, token1);
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
                res.body.author.name.should.equal('test1');
                done();
            })
            .catch(function (err) {
                console.log(err);
                process.exit(1);
            })

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
                return call.createTask('Cleanup code', 'tech', res.body._id, token1);
            })
            .then(function (res) {
                res.should.have.status(200);
                return call.modifyTask(res.body._id, {
                    title: 'Edited cleanup code',
                    description: 'Edited my signup doesnt work as expected',
                    isProblem: true,
                    status: 'In progress',
                    estimation: 2,
                    tags: ['tag1', 'tag2']
                }, token1);
            })
            .then(function (res) {
                res.should.have.status(200);
                return call.getTask(res.body._id, token1);
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
                return call.createTask('Cleanup code', 'tech', res.body._id, token1);
            })
            .then(function (res) {
                res.should.have.status(200);
                return call.removeTask(res.body._id, token1);
            })
            .then(function (res) {
                res.should.have.status(200);
                return call.getTask(res.body._id, token1);
            })
            .catch(function (err) {
                err.should.have.status(404);
                done();
            });
    });

*/
    it("can be returned as a list", function(done) {
        call.signupAndLogin('test1@solidopinion.com', 'test1', '123456')
            .then(function (res) {
                res.should.have.status(200);
                token1 = res.body.token;
                return call.createRequest('Request 1', 'description', token1 );
            })
            .then(function (res) {
                res.should.have.status(200);
                return call.createTask('Task 1 from Request 1', 'tech', res.body._id, token1);
            })
            .then(function (res) {
                res.should.have.status(200);
                return call.createRequest('Request 2', 'description', token1 );
            })
            .then(function (res) {
                res.should.have.status(200);
                return call.modifyRequest(res.body._id, { status: 'In progress' }, token1 );
            })
            .then(function (res) {
                res.should.have.status(200);
                return call.createTask('Task 2 from Request 2', 'tech', res.body._id, token1);
            })
            .then(function (res) {
                res.should.have.status(200);
                return call.getTasks({}, token1);
            })
            .then(function (res) {
                res.should.have.status(200);
                done();
            })
            .catch(function (err) {
                console.log(err);
                process.exit(1);
            });

    });



});

