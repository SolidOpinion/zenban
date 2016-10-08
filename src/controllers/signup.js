import {inject} from 'aurelia-framework';
import {Rest} from "../models/rest";
import {Router} from "aurelia-router";

@inject(Rest, Router)
export class Signup {

    email = '';
    name = '';
    password = '';

    constructor(rest, router) {
        this.rest = rest;
        this.router = router;
        this.error = '';
    };

    signup() {
        this.rest
            .create('users', {
                name: this.name,
                email: this.email,
                password: this.password
            })
            .then(response => {
                this.router.navigate('#/login');
            })
            .catch(error => {
                this.error = error.message;
            });
    };

    get showError() {
        if (this.error.length > 0) return true;
        return false;
    }
}