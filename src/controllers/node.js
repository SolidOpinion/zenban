import {bindable} from 'aurelia-framework';
import {inject} from 'aurelia-framework';

export class Node {
    @bindable current;
    @bindable edit;

    sendEdit(id) {
        this.edit({id: id});
    }
}