import {inject} from "aurelia-framework";
import {Router} from "aurelia-router";

import {ItemsData} from "../models/itemsData";
import {UsersData} from "../models/usersData";
import {RequirementsData} from "../models/requirementsData";

@inject(ItemsData, Router, RequirementsData, UsersData)
export class AddItem {

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

    get canSave() {
        if (!this.item.title || this.item.title.length < 1) return false;
        if (!this.item.description || this.item.description.length < 1) return false;
        return true;
    }

    save() {
        if (this.item.featureId == "") this.item.featureId = undefined;
        if (this.item.requirementId == "") this.item.requirementId = undefined;
        if (this.item.authorId == "") this.item.authorId = undefined;
        if (this.item.assigneeId == "") this.item.assigneeId = undefined;

        this.data.addNew(this.item)
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