import {inject} from 'aurelia-framework';
import {Auth} from '../models/auth';
import {Router} from "aurelia-router";

@inject(Auth, Router)
export class Login {

    heading = "Login";

    email = "";
    password = "";
    loginError = "";

    constructor(auth, router) {
        this.auth = auth;
        this.router = router;
    };

    login() {
        this.auth.login(this.email, this.password)
            .then(response => {
                this.router.navigate('');
            })
            .catch(error => {
                this.loginError = error.message;
            });
    };

    get isLogged() {
        return this.auth.isLogged;
    }

}