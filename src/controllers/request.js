import {inject} from 'aurelia-framework';
import {Rest} from "../models/rest";
import {Auth} from '../models/auth';
import {Router} from "aurelia-router";
import {LogManager} from 'aurelia-framework';
import moment from 'moment';
import $ from 'jquery';


LogManager.setLevel(LogManager.logLevel.error);

@inject(Rest, Auth, Router, LogManager)
export class Signup {

    error = '';
    currentTab = 'Description';

    request = {};
    isNewRequest = true;

    newRequirement = '';

    isLoading = false;

    constructor(rest, auth, router, logManager) {
        this.rest = rest;
        this.auth = auth;
        this.router = router;
        this.logger = logManager.getLogger(this);

        this.reqs = [
            {
                name: "one",
                children: [
                    {
                        name: "one-one"
                    },
                    {
                        name: "one-two"
                    }
                ]
            },
            {
                name: "two"
            }
        ]
    }

    attached() {
        $('#title').focus();
    }

    activate(params) {
        if (params.id) {
            this.isNewRequest = false;
            this.isLoading = true;
            this.rest
                .get('requests', params.id)
                .then(response => {
                    this.request = response;
                    this.request.createdAt = moment(this.request.createdAt).format('MMMM Do, YYYY, h:mm a');
                    console.log(this.request);
                    this.isLoading = false;
                })
                .catch(error => {
                    this.isLoading = false;
                    console.log(error);
                    if (error.message != null) {
                        this.error = error.message;
                    } else {
                        this.error = 'unknown error, sorry (' + error.code + ')';
                    }
                });
        } else {
            this.isNewRequest = true;
            this.request.isProblem = false;
            this.request.title = '';
            this.request.description = '';
            this.request.author = '';
            this.request.creation_date = '';

        }
    }

    get showError() {
        if (this.error.length > 0) return true;
        return false;
    }

    switchTabTo(tabName) {
        this.currentTab = tabName;
        if (tabName == 'Requirements')  {
            setTimeout(function() {
                $('#newRequirement').focus();
            }, 100);
        }
        if (tabName == 'Description')  {
            setTimeout(function() {
                $('#title').focus();
            }, 100);
        }
    }

    save() {
        this.isLoading = true;
        if (this.isNewRequest) {
            this.rest
                .create('requests', {
                    title: this.request.title,
                    description: this.request.description
                })
                .then(response => {
                    this.router.navigate('#/request/' + response._id);
                    this.isLoading = false;
                })
                .catch(error => {
                    console.log(error);
                    this.isLoading = false;
                    if (error.message != null) {
                        this.error = error.message;
                    } else {
                        this.error = 'unknown error, sorry (' + error.code + ')';
                    }
                });
        } else {
            this.rest
                .modify('requests', this.request._id, {
                    title: this.request.title,
                    description: this.request.description
                })
                .then(response => {
                    this.router.navigate('#/request/' + response._id);
                    this.isLoading = false;
                })
                .catch(error => {
                    console.log(error);
                    this.isLoading = false;
                    if (error.message != null) {
                        this.error = error.message;
                    } else {
                        this.error = 'unknown error, sorry (' + error.code + ')';
                    }
                });
        }


    };

    addRequirement() {
        this.isLoading = true;
        this.rest
            .create('requirements', {
                title: this.newRequirement
            })
            .then(response => {
                this.isLoading = false;
                this.newRequirement = '';
            })
            .catch(error => {
                console.log(error);
                this.isLoading = false;
                if (error.message != null) {
                    this.error = error.message;
                } else {
                    this.error = 'unknown error, sorry (' + error.code + ')';
                }
            });
    }

}