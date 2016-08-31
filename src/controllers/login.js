import {inject} from 'aurelia-framework';
import {Auth} from '../models/auth';
import {Router} from "aurelia-router";

@inject(Auth, Router)
export class Login {

    email = "";
    password = "";
    error = "";

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
                this.error = error.message;
            });
    };

    get isLogged() {
        return this.auth.isLogged;
    }

    get showError() {
        if (this.error.length > 0) return true;
        return false;
    }
}