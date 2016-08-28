var chai = require('chai');
var chaiHttp = require('chai-http');
var request = require('supertest');
var should = chai.should();
var config = require('../config.json')['dev'];
var server = require('../server');

chai.use(chaiHttp);

describe("/user route", function() {

    it("user can signup", function(done) {
        server.cleanupCollection('users');
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
        server.cleanupCollection('users');

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

});
