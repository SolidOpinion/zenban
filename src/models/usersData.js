import {inject} from "aurelia-framework";
import {HttpClient} from "aurelia-http-client";
import environment from '../environment';

let searchUrl = environment.api + "/api/search/users";
let baseUrl = environment.api + "/api/users";

@inject(HttpClient)
export class UsersData {
    constructor(httpClient) {
        this.http = httpClient;
    }

    addNew(user) {
        return this.http.post(baseUrl, user)
            .then(response => {
                return response.content;
            })
    }

    getList() {
        return this.http.get(baseUrl)
            .then(response => {
                return response.content;
            })
    }

    search(term) {
        return this.http.post(searchUrl, { search: term })
            .then(response => {
                return response.content;
            })
    }

    getOne(id) {
        return this.http.get(baseUrl + "/" + id)
            .then(response => {
                return response.content;
            })
    }

    update(id, user) {
        return this.http.put(baseUrl + "/" + id, user)
            .then(response => {
                return response.content;
            })
    }

}