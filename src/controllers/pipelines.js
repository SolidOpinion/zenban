import {inject} from "aurelia-framework";
import {Router} from "aurelia-router";

import $ from 'jquery';
import {sortable} from 'jquery-ui-dist';
import {ItemsData} from "../models/itemsData";

@inject(ItemsData, Router)
export class Pipelines {

  constructor(itemsData, router) {
    this.data = itemsData;
    this.router = router;

    this.statuses = ['Backlog', 'Ready', 'In progress', 'Done', 'Release', 'Review', 'Closed'];
    this.items = {};

    this.filter = {};
    this.filter.text = "";
    this.filter.isFeatures = true;
    this.filter.isTasks = true;
    this.filter.isBugs = true;
  }

  get _items() {
    var items = {};
    items.totals = {};
    for (var i=0; i<this.items.length; i++) {
      var status = this.items[i].status;
      if (items[status] == undefined) items[status] = [];
      if (items.totals[status] == undefined) items.totals[status] = 0;
      items[status].push(this.items[i]);
      items.totals[status] = items.totals[status] + this.items[i].estimate;
    }
    for (i=0; i<this.statuses.length; i++) {
      var status = this.statuses[i];
      if (items[status] != undefined) items[status].sort(this.compareItems);
    }
    return items;
  }

  set _items(items) {
    this._items = items;
  }

  compareItems(a,b) {
    if (a.order < b.order)
      return -1;
    if (a.order > b.order)
      return 1;
    return 0;
  }

  refresh() {
    this.data.getList(this.filter)
      .then(items => {
        this.items = items.content;
      });
  }

  onBeforeStop(evt, ui) {
    console.log("OnDragStop");
    var newStatus = ui.item.parent().closest('ul').attr('data-status');
    var itemId = ui.item.attr('data-id');
    var self =  $(this).data('injected');
    var order = ui.item.parent().closest('ul').sortable('toArray').toString();

    self.data.updateStatusAndOrder(itemId, newStatus, order).then(function() {
      self.refresh();
    });

    return false;
  }


  attached() {
    var self = this;
    $("ul.items").sortable({
      connectWith: "ul",
      beforeStop: this.onBeforeStop
    })
      .data('injected', self)
      .disableSelection();
    this.refresh();
  }

  switchFeatures() {
    if (this.filter.isFeatures) {
      this.filter.isFeatures = false;
    } else {
      this.filter.isFeatures = true;
    }
    this.refresh();
  }

  switchTasks() {
    if (this.filter.isTasks) {
      this.filter.isTasks = false;
    } else {
      this.filter.isTasks = true;
    }
    this.refresh();
  }

  switchBugs() {
    if (this.filter.isBugs) {
      this.filter.isBugs = false;
    } else {
      this.filter.isBugs = true;
    }
    this.refresh();
  }
}
