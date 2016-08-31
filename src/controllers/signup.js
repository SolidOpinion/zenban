import {inject} from 'aurelia-framework';
import {UsersData} from "../models/usersData";
import {Auth} from '../models/auth';
import {Router} from "aurelia-router";


@inject(UsersData, Auth, Router)
export class Signup {

    email = '';
    name = '';
    password = '';

    constructor(usersData, auth, router) {
        this.usersData = usersData;
        this.auth = auth;
        this.router = router;
        this.error = '';
    };

    signup() {
        var userInfo = { name: this.name, email: this.email, password: this.password }
        var self = this;

        this.usersData.addNew(userInfo)
            .then(response => {
                this.router.navigate('#/login');
            })
            .catch(error => {
                this.error = error.content.message;
            });
    };

    get showError() {
        if (this.error.length > 0) return true;
        return false;
    }
}