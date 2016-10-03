var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var config = require('../config.json')['dev'];
var server = require('../server');

var User = require('../models/user');

chai.use(chaiHttp);

describe.skip("/user route", function() {
    this.timeout(10000);

    beforeEach(function (done) {
        // remove all users before each test
        User.remove().exec().then(function(d) {
            done();
        });
    });

    it("user can signup", function(done) {
        chai.request(server)
        .post('/api/user')
        .send({
            email: 'nick@solidopinion.com',
            name: 'nick',
            password: '123456'
        })
        .end(function(err, res) {
            res.should.have.status(200);
            res.body.type.should.equal('internal');
            res.body.should.have.property('createdAt');
            done();
        });
    });

    it("user email should be uniq", function(done) {
        chai.request(server)
        .post('/api/user')
        .send({
            email: 'nick@solidopinion.com',
            name: 'nick',
            password: '123456'
        })
        .end(function(err, res) {
            res.should.have.status(200);
            chai.request(server)
                .post('/api/user')
                .send({
                    email: 'nick@solidopinion.com',
                    name: 'nick',
                    password: '123456'
                })
                .end(function(err, res) {
                    res.should.have.status(500);
                    done();
                });
        });
    });

    it("user signup error handling", function(done) {
        chai.request(server)
            .post('/api/user')
            .send({
                email: 'nick',
                name: 'nick',
                password: '123456'
            })
            .end(function(err, res) {
                res.should.have.status(500);
                done();
            });
    });

});
