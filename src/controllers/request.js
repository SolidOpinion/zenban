import {inject} from 'aurelia-framework';
import {Rest} from "../models/rest";
import {Auth} from '../models/auth';
import {Router} from "aurelia-router";
import {LogManager} from 'aurelia-framework';

LogManager.setLevel(LogManager.logLevel.error);

@inject(Rest, Auth, Router, LogManager)
export class Signup {

    error = '';
    currentTab = 'Description';

    request = {};
    isNewRequest = true;

    constructor(rest, auth, router, logManager) {
        this.rest = rest;
        this.auth = auth;
        this.router = router;
        this.logger = logManager.getLogger(this);

        // TODO:  check if we have incomming requests id or if not create a new request

        this.request.isProblem = false;
        this.request.title = '';
        this.request.description = '';
        this.request.author = '';
        this.request.creation_date = '';
    }

    get showError() {
        if (this.error.length > 0) return true;
        return false;
    }

    switchTabTo(tabName) {
        this.currentTab = tabName;
    }

    descriptionSave() {

    }
}