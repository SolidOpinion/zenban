import {inject} from 'aurelia-framework';
import {UsersData} from "../models/usersData";
import {Auth} from '../models/auth';


@inject(UsersData, Auth)
export class Signup {

    heading = 'Sign Up';

    email = '';
    name = '';
    password = '';

    signupError = '';

    constructor(usersData, auth) {
        this.usersData = usersData;
        this.auth = auth;
    };

    signup() {
        var userInfo = { name: this.name, email: this.email, password: this.password }
        var self = this;

        this.usersData.addNew(userInfo)
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.log(error);
            });


        /*
        return this.auth.signup(userInfo)
        .then((response) => {
            console.log("Signed Up!");
        })
        .catch(error => {
            error.json().then(function(e){
                self.signupError = e.message;
            });
        });
*/
    };
}