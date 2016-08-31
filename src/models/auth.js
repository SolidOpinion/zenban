import {inject} from 'aurelia-framework';
import {HttpClient} from "aurelia-http-client";
import environment from '../environment';

@inject(HttpClient)
export class Auth {

    constructor(httpClient) {
        this.isLogged = false;
        this.user = {};

        this.http = httpClient;

        if (localStorage.getItem('zenBanAuthToken')) {
            this.getUser();
        }

    }

    login(email, password) {
        var self = this;
        return new Promise(function(resolve, reject) {
            self.http.post(environment.api + "/api/auth", { email: email, password: password })
                .then(response => {
                    self.token = response.content.token;
                    localStorage.setItem('zenBanAuthToken', self.token);
                    console.log(response);
                    self.getUser();
                    resolve();
                })
                .catch(error => {
                    console.log(error);
                    reject(error.content);
                });
        })
    }

    getUser() {
        this.http.configure(x => {
            x.withHeader('Authorization', localStorage.getItem('zenBanAuthToken'));
        });

        this.http
            .get(environment.api + "/api/user")
            .then(response => {
                console.log(response);
                this.user = response.content;
                this.token = localStorage.getItem('zenBanAuthToken');
                this.isLogged = true;
            })
            .catch(error => {
                console.log(error);
                this.token = '';
                this.isLogged = false;
                this.user = {};
                localStorage.removeItem('zenBanAuthToken');
            });

    }

    logout() {
        this.token = '';
        this.isLogged = false;
        this.user = {};
        localStorage.removeItem('zenBanAuthToken');
    }


}