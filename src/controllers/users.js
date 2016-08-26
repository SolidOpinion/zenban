import {inject} from "aurelia-framework";
import {UsersData} from "../models/usersData";

@inject(UsersData)
export class Users {

    constructor(usersData) {
        this.data = usersData;
        this.isForm = false;
        this.user = {};
        this.users = [];
    }

    refreshList() {
        this.data.getList()
            .then(users => {
                this.users = users;
            });
    }

    attached(){
        this.refreshList();
    }

    get canSave() {
        if (!this.user.email || this.user.email.length < 1) {
            return false;
        }
        return true;
    }

    create() {
        this.isForm = true;
        this.user = {};
    }

    save() {
        if (this.user._id != undefined && this.user._id != null) {
            // we are editing
            this.data.update(this.user._id, this.user)
                .then(response => {
                    this.isForm = false;
                    this.refreshList();
                });
        } else {
            // we are creating
            this.data.addNew(this.user)
                .then(response => {
                    this.isForm = false;
                    this.refreshList();
                });
        }
    }

    hide() {
        this.isForm = false;
        this.user = {};
    }

    edit(id) {
        this.data.getOne(id)
            .then(user => {
                this.user = user;
                this.isForm = true;
            });
    }
}