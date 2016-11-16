"use strict";

var chai = require('chai');
var chaiHttp = require('chai-http');

process.env.NODE_ENV = 'test';
var server = require('../server');

var Request = require('../models/request');
var User = require('../models/user');
var Task = require('../models/task');
var Requirement = require('../models/requirement');

chai.use(chaiHttp);



class Common {

    cleanup() {
        return Task.remove().exec()
            .then(function () {
                return Request.remove().exec();
            })
            .then(function () {
                return Requirement.remove().exec();
            })
            .then(function () {
                return User.remove().exec();
            });
    }

/**
 * USER
 */


    createUser(email, name, password) {
        return chai.request(server)
            .post('/api/users')
            .send({
                email: email,
                name: name,
                password: password
            });
    }

    createAuth(email, password) {
        return chai.request(server)
            .post('/api/auth')
            .send({
                email: email,
                password: password
            })
    }

    getAuth(token) {
        return chai.request(server)
            .get('/api/auth')
            .set('Authorization', token);
    }

    signupAndLogin(email, name, password) {
        let _self = this;
        return this.createUser(email, name, password)
            .then(function (res) {
                return _self.createAuth(email, password);
            });
    }


    getUsers(filter, token) {
        return chai.request(server)
            .get('/api/users')
            .query(filter)
            .set('Authorization', token);
    }

/**
 * REQUIREMENT
 */


    createRequirement(title, token, parent) {
        return chai.request(server)
            .post('/api/requirements')
            .set('Authorization', token)
            .send({
                title: title,
                parent: parent
            })
    }

    getRequirement(id, token) {
        return chai.request(server)
            .get('/api/requirements/' + id)
            .set('Authorization', token);
    }

    removeRequirement(id, token) {
        return chai.request(server)
            .delete('/api/requirements/' + id)
            .set('Authorization', token);
    }

    modifyRequirement(id, data, token) {
        return chai.request(server)
            .put('/api/requirements/' + id)
            .set('Authorization', token)
            .send(data);
    }

    getRequirements(data, token) {
        return chai.request(server)
            .get('/api/requirements')
            .query(data)
            .set('Authorization', token);
    }

/**
 * REQUEST
 */

    createRequest(title, description, token) {
        return chai.request(server)
            .post('/api/requests')
            .set('Authorization', token)
            .send({
                title: title,
                description: description
            });
    }

    getRequest(id, token) {
        return chai.request(server)
            .get('/api/requests/' + id)
            .set('Authorization', token);
    }

    modifyRequest(id, data, token) {
        return chai.request(server)
            .put('/api/requests/' + id)
            .set('Authorization', token)
            .send(data);
    }

    removeRequest(id, token) {
        return chai.request(server)
            .delete('/api/requests/' + id)
            .set('Authorization', token);
    }

    getRequests(data, token) {
        return chai.request(server)
            .get('/api/requests')
            .query(data)
            .set('Authorization', token);
    }

    createRequestComment(rid, body, token) {
        return chai.request(server)
            .post('/api/requestcomments/' + rid)
            .set('Authorization', token)
            .send({
                body: body
            });
    }

    removeRequestComment(rid, cid, token) {
        return chai.request(server)
            .delete('/api/requestcomments/' + rid + '/' + cid)
            .set('Authorization', token);
    }


/**
 * TASK
 */

    createTask(title, type, requestId, token) {
        return chai.request(server)
            .post('/api/tasks')
            .set('Authorization', token)
            .send({
                title: title,
                type: type,
                request: requestId
            });
    }

    getTask(id, token) {
        return chai.request(server)
            .get('/api/tasks/' + id)
            .set('Authorization', token);
    }

    modifyTask(id, data, token) {
        return chai.request(server)
            .put('/api/tasks/' + id)
            .set('Authorization', token)
            .send(data);
    }

    removeTask(id, token) {
        return chai.request(server)
            .delete('/api/tasks/' + id)
            .set('Authorization', token);
    }

    getTasks(data, token) {
        return chai.request(server)
            .get('/api/tasks')
            .query(data)
            .set('Authorization', token);
    }

    createTaskComment(tid, body, token) {
        return chai.request(server)
            .post('/api/taskcomments/' + tid)
            .set('Authorization', token)
            .send({
                body: body
            });
    }

    removeTaskComment(tid, cid, token) {
        return chai.request(server)
            .delete('/api/taskcomments/' + tid + '/' + cid)
            .set('Authorization', token);
    }


}


module.exports = new Common();