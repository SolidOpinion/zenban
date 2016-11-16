var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var call = require('./common');
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

    it.skip("can be created with valid fields only", function(done) {
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
                res.should.have.status(200);
                res.body.title.should.equal('User login');
                done();
            })
            .catch(function (err) {
                console.log(err);
                process.exit(1);
            });
    });

    it("can be returned as a tree", function(done) {
        call.signupAndLogin('test1@solidopinion.com', 'test1', '123456')
            .then(function (res) {
                res.should.have.status(200);
                token1 = res.body.token;
                return call.createRequirement('User can signup', token1);
            })
            .then(function (res) {
                res.should.have.status(200);
                return call.createRequirement('With Facebook', token1, res.body._id);
            })
            .then(function (res) {
                res.should.have.status(200);
                return call.createRequirement('User can login', token1);
            })
            .then(function (res) {
                res.should.have.status(200);
                return call.getRequirements({}, token1);
            })
            .then(function (res) {
                res.should.have.status(200);
                res.should.have.property('body').with.lengthOf(2).and.be.instanceof(Array);
                res.body[0].title.should.equal('User can signup');
                res.body[1].title.should.equal('User can login');
                res.body[0].should.have.property('children').with.lengthOf(1).and.be.instanceof(Array);
                done();
            })
            .catch(function (err) {
                console.log(err);
                process.exit(1);
            });
    });

    it("can filter tree items by part of title text", function(done) {
        call.signupAndLogin('test1@solidopinion.com', 'test1', '123456')
            .then(function (res) {
                res.should.have.status(200);
                token1 = res.body.token;
                return call.createRequirement('User can signup', token1);
            })
            .then(function (res) {
                res.should.have.status(200);
                return call.createRequirement('With Facebook', token1, res.body._id);
            })
            .then(function (res) {
                res.should.have.status(200);
                return call.getRequirements({ title: 'User' }, token1);
            })
            .then(function (res) {
                res.should.have.status(200);
                res.should.have.property('body').with.lengthOf(1).and.be.instanceof(Array);
                res.body[0].title.should.equal('User can signup');
                done();
            })
            .catch(function (err) {
                console.log(err);
                process.exit(1);
            });
    });

    it("doesn't return removed in search", function(done) {
        call.signupAndLogin('test1@solidopinion.com', 'test1', '123456')
            .then(function (res) {
                res.should.have.status(200);
                token1 = res.body.token;
                return call.createRequirement('User can signup', token1);
            })
            .then(function (res) {
                res.should.have.status(200);
                return call.removeRequirement(res.body._id, token1);
            })
            .then(function (res) {
                res.should.have.status(200);
                return call.getRequirements({ title: 'User' }, token1);
            })
            .then(function (res) {
                res.should.have.status(200);
                res.should.have.property('body').with.lengthOf(0).and.be.instanceof(Array);
                done();
            })
            .catch(function (err) {
                console.log(err);
                process.exit(1);
            });
    });


    it("doesn't allow to remove parents with active childs", function(done) {
        var r;
        call.signupAndLogin('test1@solidopinion.com', 'test1', '123456')
            .then(function (res) {
                res.should.have.status(200);
                token1 = res.body.token;
                return call.createRequirement('User can signup', token1);
            })
            .then(function (res) {
                r = res.body._id;
                res.should.have.status(200);
                return call.createRequirement('With Facebook', token1, res.body._id);
            })
            .then(function (res) {
                res.should.have.status(200);
                return call.removeRequirement(r, token1);
            })
            .catch(function (err) {
                err.should.have.status(406);
                done();
            });
    });



});
