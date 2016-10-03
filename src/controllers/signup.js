import {inject} from 'aurelia-framework';
import {Rest} from "../models/rest";
import {Auth} from '../models/auth';
import {Router} from "aurelia-router";


@inject(Rest, Auth, Router)
export class Signup {

    email = '';
    name = '';
    password = '';

    constructor(rest, auth, router) {
        this.rest = rest;
        this.auth = auth;
        this.router = router;
        this.error = '';
    };

    signup() {
        this.rest.create('user', { name: this.name, email: this.email, password: this.password })
            .then(response => {
                this.router.navigate('#/login');
            })
            .catch(error => {
                console.log(error);
                this.error = error.message;
            });
    };

    get showError() {
        if (this.error.length > 0) return true;
        return false;
    }
}