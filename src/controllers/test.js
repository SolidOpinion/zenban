import {inject} from 'aurelia-framework';
import {Rest} from "../models/rest";
import {Auth} from '../models/auth';
import {Router} from "aurelia-router";
import {LogManager} from 'aurelia-framework';

LogManager.setLevel(LogManager.logLevel.error);

@inject(Rest, Auth, Router, LogManager)
export class Signup {

    email = '';
    name = '';
    password = '';

    constructor(rest, auth, router, logManager) {
        this.rest = rest;
        this.auth = auth;
        this.router = router;
        this.logger = logManager.getLogger(this);
        this.error = '';

        this.logger.warn("test");


        this.rest.list('test', {name: 'vasya'})
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.log(error);
            });


/*
        let self = this;
        this.rest.create('test', { name: 'nick' })
            .then(response1 => {
                console.log(response1.name);
                self.rest.modify('test', response1._id, { name: 'nick1' })
                    .then(response2 => {
                        console.log(response2.name);
                        self.rest.get('test', response2._id)
                            .then(response3 => {
                                console.log(response3.isRemoved);
                                self.rest.delete('test', response3._id)
                                    .then(response4 => {
                                        console.log(response4._id);
                                    })
                                    .catch(error => {
                                        console.log(error);
                                    });
                            })
                            .catch(error => {
                                console.log(error);
                            });

                    })
                    .catch(error => {
                        console.log(error);
                    });
            })
            .catch(error => {
                console.log(error);
            });
*/
    }

}