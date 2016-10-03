import {Rest} from '../models/rest';
import {inject} from 'aurelia-framework';

@inject(Rest)
export class Welcome {

    constructor(rest) {
        this.rest = rest;
    }
}