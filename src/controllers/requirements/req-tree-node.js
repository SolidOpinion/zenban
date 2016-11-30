import {Behavior} from 'aurelia-framework';
import {bindable} from 'aurelia-framework';
import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(Element, EventAggregator)
export class ReqTreeNode {
    @bindable current = null;
    @bindable dragHandler;
    @bindable parent;

    constructor(element, eventAggregator) {
        this.element = element;
        this.ea = eventAggregator;

        this.handleDrop = e => {
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            var sourcerId = e.dataTransfer.getData('text');
            var targetId = e.target.id;
            console.log(sourcerId + ' to ' + targetId);
            if (sourcerId != targetId)
                this.ea.publish('req-tree-node:move', { child: sourcerId, newParent: targetId });
            return false;
        };
        this.handleDragOver = e => {
            event.preventDefault();
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            return false;
        };
        this.handleDragStart = e => {
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            e.dataTransfer.setData('text/plain', this.current._id);
            return false;
        };

    }

    attached() {
        this.element.addEventListener('dragover', this.handleDragOver);
        this.element.addEventListener('drop', this.handleDrop);
        this.element.addEventListener('dragstart', this.handleDragStart);
    }

    detached() {
        this.element.removeEventListener('drop', this.handleDrop);
        this.element.removeEventListener('dragover', this.handleDragOver);
        this.element.removeEventListener('dragstart', this.handleDragStart);
    }
}