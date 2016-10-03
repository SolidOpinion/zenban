import {inject} from 'aurelia-framework';
import {HttpClient} from "aurelia-http-client";
import environment from '../environment';
import {LogManager} from 'aurelia-framework';

LogManager.setLevel(LogManager.logLevel.error);

@inject(HttpClient)
export class Rest {

    constructor(httpClient) {
        this.http = httpClient;
        this.endpoint = environment.api;
    }

    create(resource, document) {
        var self = this;
        return new Promise(function(resolve, reject) {
            self.http.post(self.endpoint + "/api/" + resource, document)
                .then(response => {
                    resolve(response.content);
                })
                .catch(error => {
                    reject({ code: error.statusCode, message: error.content.message });
                });
        })
    }

    modify(resource, id, fields) {
        var self = this;
        return new Promise(function(resolve, reject) {
            self.http.put(self.endpoint + "/api/" + resource + "/" + id, fields)
                .then(response => {
                    resolve(response.content);
                })
                .catch(error => {
                    reject({ code: error.statusCode, message: error.content.message });
                });
        })
    }

    delete(resource, id) {
        var self = this;
        return new Promise(function(resolve, reject) {
            self.http.delete(self.endpoint + "/api/" + resource + "/" + id)
                .then(response => {
                    resolve(response.content);
                })
                .catch(error => {
                    reject({ code: error.statusCode, message: error.content.message });
                });
        })
    }

    get(resource, id) {
        var self = this;
        return new Promise(function(resolve, reject) {
            self.http.get(self.endpoint + "/api/" + resource + "/" + id)
                .then(response => {
                    resolve(response.content);
                })
                .catch(error => {
                    reject({ code: error.statusCode, message: error.content.message });
                })
        });
    }

    list(resource, filters) {
        var self = this;
        return new Promise(function(resolve, reject) {
            self.http.createRequest("/api/" + resource + "-list")
                .asGet()
                .withBaseUrl(self.endpoint)
                .withParams(filters)
                .send()
                .then(response => {
                    resolve(response.content);
                })
                .catch(error => {
                    resolve(error.content);
                })
        });
    }



}