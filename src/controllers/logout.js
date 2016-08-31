import {inject} from 'aurelia-framework';
import {Auth} from '../models/auth';
import {Router} from "aurelia-router";

@inject(Auth, Router)
export class Logout {

    constructor(auth, router) {
        this.auth = auth;
        this.router = router;
    };

    activate() {
        this.auth.logout();
        this.router.navigate('#/login');
    };
}