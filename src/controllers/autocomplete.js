import {bindable, inject} from 'aurelia-framework';
import $ from 'jquery';

export class Autocomplete {
    @bindable placeholder;
    @bindable minTermLength;
    @bindable loader;
    @bindable value;
    @bindable valueId;

    constructor(element) {
        this.isShown = false;
        this.items = [];
        this.selected = {};
        this.value = "";
        this.valueId = "";
    }

    attached() {

    }

    inputKeyPressed(event) {
        if (this.value.length > this.minTermLength - 1)  {
            this.loader.search(this.value)
                .then(res => {
                    this.items = res;
                    this.isShown = true;

                });
        } else {
            this.isShown = false;
        }

        return true;
    }

    itemSelected(event) {
        var item = $(event.target);
        var selected = item.attr('data-id');
        while (selected === undefined && item) {
            item = item.parent();
            selected = item.attr('data-id');
        }
        if (selected !== undefined) {
            this.hasFocus = false;
            var val = item.attr('data-value');
            this.valueId = selected;
            this.value = val;
            this.selected.id = selected;
            this.selected.value = val;
            this.isShown = false;
            this.items = [];
        }

    }

    hideSuggestions() {
        this.isShown = false;

        if (this.selected.id && this.selected.id == this.valueId && this.value != "") {
            this.value = this.selected.value;
        } else {
            this.selected = {};
            this.value = "";
            this.valueId = "";
        }
        this.hasFocus = false;
    }




}