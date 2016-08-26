import {inject} from "aurelia-framework";
import {RequirementsData} from "../models/requirementsData";

@inject(RequirementsData)
export class Requirements {

    constructor(requirementsData) {
        this.data = requirementsData;
        this.requirements = {};
        this.isForm = false;
        this.requirement = {};
    }

    refreshTree() {
        this.data.getList()
            .then(requirements => {
                var map = {}, node, roots = [];
                for (var i = 0; i < requirements.length; i++) {
                    node = requirements[i];
                    node.children = [];
                    map[node._id] = i;
                    if (node.hasOwnProperty("parent") && node.parent !== null) {
                        requirements[map[node.parent]].children.push(node);
                    } else {
                        roots.push(node);
                    }
                }
                this.requirements = roots;
            });
    }

    attached(){
        this.refreshTree();
    }

    create(parentId) {
        this.isForm = true;
        this.requirement = {};
        if (parentId != null) this.requirement.parent = parentId;
    }

    edit(id) {
        console.log(id);
        this.data.getOne(id)
            .then(requirement => {
                this.requirement = requirement;
                this.isForm = true;
            });
    }

    remove(id) {
        this.data.remove(id)
            .then(requirement => {
                this.isForm = false;
                this.requirement = {};
                this.refreshTree();
            });
    }

    hide() {
        this.isForm = false;
        this.requirement = {};
    }

    get canSave() {
        if (!this.requirement.title || this.requirement.title.length < 1) {
            return false;
        }
        return true;
    }

    save() {
        if (this.requirement._id != null) {
            // we are editing
            this.data.update(this.requirement._id, this.requirement)
                .then(response => {
                    this.isForm = false;
                    this.refreshTree();
                });
        } else {
            // we are creating
            this.data.addNew(this.requirement)
                .then(response => {
                    this.isForm = false;
                    this.refreshTree();
                });
        }
    }
}