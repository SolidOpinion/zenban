import {inject} from "aurelia-framework";
import {Router} from "aurelia-router";

import {ItemsData} from "../models/itemsData";
import {UsersData} from "../models/usersData";
import {RequirementsData} from "../models/requirementsData";

@inject(ItemsData, Router, RequirementsData, UsersData)
export class EditItem {

    constructor(itemsData, router, requirementsData, usersData) {
        this.data = itemsData;
        this.rdata = requirementsData;
        this.udata = usersData;
        this.router = router;

        this.item = {};
        this.item.title = "";
        this.item.description = "";
        this.item.type = "feature";
        this.item.estimate = 0;
        this.item.isProblem = false;
        this.item.status = "Backlog";
    }

    activate(params) {
        if (params.id != undefined && params.id.length > 0) {
            this.data.getOne(params.id)
                .then(item => {
                    this.item = item;
                    if (this.item.requirement != undefined) this.item.requirementTitle = this.item.requirement.title;
                    if (this.item.feature != undefined) this.item.featureTitle = this.item.feature.title;
                    if (this.item.author != undefined) this.item.authorTitle = this.item.author.title;
                    if (this.item.assignee != undefined) this.item.assigneeTitle = this.item.assignee.title;
                });
        }
    }



    attached(){
        this.isProblemFocus = false;
        this.isTitleFocus = true;
    }

    switchType(newType) {
        this.item.type = newType;
    }

    switchEstimate(newEstimate) {
        this.item.estimate = newEstimate;
    }

    switchProblem() {
        if (this.item.isProblem) {
            this.item.isProblem = false;
            this.isProblemFocus = false;
            this.isTitleFocus = true;
        } else {
            this.item.isProblem = true;
            this.isProblemFocus = true;
            this.isTitleFocus = false;
        }
    }


    get isClosed() {
        if (this.item.status == "Closed") return true;
        return false;
    }

    get canSave() {
        if (!this.item.title || this.item.title.length < 1) return false;
        if (!this.item.description || this.item.description.length < 1) return false;
        return true;
    }


    restore() {
        this.item.status = "Backlog";
        this.data.update(this.item._id, this.item)
            .then(response => {
                this.router.navigate('/');
            });
    }


    save() {
        this.data.update(this.item._id, this.item)
            .then(response => {
                this.router.navigate('/');
            });
    }

    get hasFeature() {
        if (this.item.type != 'feature') return true;
        return false;
    }

    get hasEstimate() {
        if (this.item.type == 'feature') return false;
        return true;
    }

















}