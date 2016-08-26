import {inject} from "aurelia-framework";
import {HttpClient} from "aurelia-http-client";
import environment from '../environment';

let baseUrl = environment.api + "/api/requirements";
let searchUrl = environment.api + "/api/search/requirements";

@inject(HttpClient)
export class RequirementsData {
    constructor(httpClient) {
        this.http = httpClient;
    }

    addNew(requirement) {
        return this.http.post(baseUrl, requirement)
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

    update(id, requirement) {
        return this.http.put(baseUrl + "/" + id, requirement)
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

    getList() {
        return this.http.get(baseUrl)
            .then(response => {
                return response.content;
            })
    }

    search(term) {
        return this.http.post(searchUrl, { search: term })
            .then(response => {

                for (var i=0; i<response.content.length; i++) {
                    response.content[i].title = '[ ' + response.content[i].requirementCode + ' ]  ' + response.content[i].title;
                }
                return response.content;
            })
    }

}