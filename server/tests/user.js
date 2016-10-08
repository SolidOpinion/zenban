var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var config = require('../config.json')['dev'];
var server = require('../server');

var User = require('../models/user');

chai.use(chaiHttp);

describe("user, ", function() {
    this.timeout(10000);

    beforeEach(function (done) {
        // remove all users before each test
        User.remove().exec().then(function(d) {
            done();
        });
    });

    it("can signup and login", function(done) {
        chai.request(server)
            .post('/api/users')
            .send({
                email: 'nick@solidopinion.com',
                name: 'nick',
                password: '123456'
            })
            .end(function(err, res) {
                res.should.have.status(200);
                chai.request(server)
                    .post('/api/auth')
                    .send({
                        email: 'nick@solidopinion.com',
                        password: '123456'
                    })
                    .end(function(err, res) {
                        res.should.have.status(200);
                        res.body.should.have.property('token');
                        chai.request(server)
                            .get('/api/auth')
                            .set('Authorization', res.body.token)
                            .end(function(err, res) {
                                res.should.have.status(200);
                                res.body.email.should.equal('nick@solidopinion.com');
                                res.body.type.should.equal('internal');
                                res.body.name.should.equal('nick');
                                res.body.isRemoved.should.equal(false);
                                res.body.should.have.property('createdAt');
                                res.body.should.not.have.property('password');
                                done();
                            });
                    });
            });
    });

    it("can return list", function(done) {
        chai.request(server)
            .post('/api/users')
            .send({
                email: 'test1@solidopinion.com',
                name: 'test1',
                password: '123456'
            })
            .end(function(err, res) {
                res.should.have.status(200);
                chai.request(server)
                    .post('/api/users')
                    .send({
                        email: 'test2@solidopinion.com',
                        name: 'test2',
                        password: '123456'
                    })
                    .end(function(err, res) {
                        res.should.have.status(200);
                        chai.request(server)
                            .get('/api/users')
                            .query({ name: 'test1' })
                            .set('Test', 'yes')
                            .end(function(err, res) {
                                res.should.have.status(200);
                                res.should.have.property('body').with.lengthOf(1).and.be.instanceof(Array);
                                res.body[0].should.not.have.property('password');
                                done();
                            });
                    });
            });
    });


});
