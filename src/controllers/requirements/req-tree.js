import {inject} from 'aurelia-framework';
import {Rest} from "../../models/rest";
import {Auth} from '../../models/auth';
import {Router} from "aurelia-router";
import {LogManager} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';

LogManager.setLevel(LogManager.logLevel.error);

@inject(Rest, Auth, Router, LogManager, EventAggregator)
export class ReqTree {

    error = '';
    newRequirement = '';

    isLoading = false;

    constructor(rest, auth, router, logManager, eventAggregator) {
        this.rest = rest;
        this.auth = auth;
        this.router = router;
        this.logger = logManager.getLogger(this);
        this.ea = eventAggregator;
    }

    attached() {
        this.reload();
        $('#title').focus();
        this.moveSubscription = this.ea.subscribe('req-tree-node:move', message => {
            this.isLoading = true;
            this.rest
                .modify('requirements', message.child, {
                    parent: message.newParent
                })
                .then(response => {
                    this.isLoading = false;
                    this.reload();
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
        });
    }


    detached() {
        this.moveSubscription.dispose();
    }

    get showError() {
        if (this.error.length > 0) return true;
        return false;
    }

    reload() {
        this.isLoading = true;
        this.rest
            .list('requirements')
            .then(response => {
                this.isLoading = false;
                this.reqs = response;
                $('#newRequirement').focus();
                console.log(this.reqs);
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
    }

    add() {
        this.isLoading = true;
        this.rest
            .create('requirements', {
                title: this.newRequirement
            })
            .then(response => {
                this.isLoading = false;
                this.newRequirement = '';
                this.reload();
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