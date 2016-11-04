"use strict";

var chai = require('chai');
var chaiHttp = require('chai-http');
var config = require('../config.json')['dev'];
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


    createRequirement(title, token) {
        return chai.request(server)
            .post('/api/requirements')
            .set('Authorization', token)
            .send({
                title: title
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

    createRequest(title, description, authorId) {
        return chai.request(server)
            .post('/api/requests')
            .set('Test', authorId)
            .send({
                title: title,
                description: description
            });
    }

    createTask(title, type, authorId, requestId) {
        return chai.request(server)
            .post('/api/tasks')
            .set('Test', authorId)
            .send({
                title: title,
                type: type,
                request: requestId
            });
    }

    getTask(id, authorId) {
        return chai.request(server)
            .get('/api/tasks/' + id)
            .set('Test', authorId);
    }

    modifyTask(id, authorId, data) {
        return chai.request(server)
            .put('/api/tasks/' + id)
            .set('Test', authorId)
            .send(data);
    }

    removeTask(id, authorId) {
        return chai.request(server)
            .delete('/api/tasks/' + id)
            .set('Test', authorId);
    }

}


module.exports = new Common();