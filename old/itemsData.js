import {inject} from "aurelia-framework";
import {HttpClient} from "aurelia-http-client";
import environment from '../environment';

let base = environment.api;
let baseUrl = environment.api + "/api/items";
let searchUrl = environment.api + "/api/search/items";
let boardUrl = environment.api + "/api/board";
let archiveUrl = environment.api + "/api/archive";

@inject(HttpClient)
export class ItemsData {
    constructor(httpClient, configure) {
        this.http = httpClient;
        console.log(environment.api);
    }

    addNew(item) {
        return this.http.post(baseUrl, item)
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

    update(id, item) {

        if (item.requirement != undefined) item.requirement = item.requirement.id;
        if (item.feature != undefined) item.feature = item.feature.id;
        if (item.author != undefined) item.author = item.author.id;
        if (item.assignee != undefined) item.assignee = item.assignee.id;

        return this.http.put(baseUrl + "/" + id, item)
            .then(response => {
                return response.content;
            })
    }

    updateStatusAndOrder(id, status, order) {
        var request = {};
        request.id = id;
        request.status = status;
        request.order = order;
        return this.http.post(boardUrl, request)
            .then(response => {
                return response.content;
            })
    }



    remove(id) {
        return this.http.delete(baseUrl + "/" + id)
            .then(response => {
                return response.content;
            })
    }

    getList(filter) {
        return this.http.createRequest("/api/items")
            .asGet()
            .withBaseUrl(base)
            .withParams(filter)
            .send();

    }

    getClosedList() {
         return this.http.get(archiveUrl)
         .then(response => {
            return response.content;
         });
    }

    search(term) {
        return this.http.post(searchUrl, { search: term })
            .then(response => {
                return response.content;
            })
    }

}
