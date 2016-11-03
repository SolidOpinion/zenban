var chai = require('chai');
var chaiHttp = require('chai-http');
var config = require('../config.json')['dev'];
var server = require('../server');

var Request = require('../models/request');
var User = require('../models/user');
var Task = require('../models/task');

chai.use(chaiHttp);



class Common {

    cleanup() {
        return Task.remove().exec()
            .then(function () {
                return Request.remove().exec();
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