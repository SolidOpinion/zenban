import {Behavior} from 'aurelia-framework';
import {bindable} from 'aurelia-framework';
import {inject} from 'aurelia-framework';

@inject(Element)
export class ReqTreeNode {
    @bindable current = null;

    constructor(element) {
        this.element = element;
        this.handleDrop = e => {
            console.log('Drop');
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            console.log(e.target);
            return false;
        };

        this.handleDragOver = e => {
            event.preventDefault();
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            return false;
        };
    }

    attached() {
        this.element.addEventListener('dragover', this.handleDragOver);
        this.element.addEventListener('drop', this.handleDrop);
    }

    detached() {
        this.element.removeEventListener('drop', this.handleDrop);
        this.element.removeEventListener('dragover', this.handleDragOver);
    }
}