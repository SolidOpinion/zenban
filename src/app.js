import {EventAggregator} from 'aurelia-event-aggregator';
import {inject} from 'aurelia-dependency-injection';
import {bindable} from 'aurelia-framework';
import {Auth} from './models/auth';


@inject(EventAggregator, Auth)
export class App {

    constructor(eventAggregator, auth) {
        this.eventAggregator = eventAggregator;
        this.currentRoute = "/";
        this.isPipelineOptions = true;
        this.auth = auth;
    }

    configureRouter(config, router) {
        this.router = router;

        config.map([
            { route: "", moduleId: "controllers/welcome", nav: true, title: "Welcome", name: "welcome"},
            { route: "signup", moduleId: "controllers/signup", nav: false, title: "Signup", name: "signup"},
            { route: "login", moduleId: "controllers/login", nav: false, title: "Login", name: "login"},
            { route: "logout", moduleId: "controllers/logout", nav: false, title: "Logout", name: "logout"},
            { route: "test", moduleId: "controllers/test", nav: false, title: "Test", name: "test"},
            { route: "secret", moduleId: "controllers/secret", nav: true, title: "Secret", name: "secret"}
        ]);
    }

    navigationSuccess(event) {
        let instruction = event.instruction;
        this.currentRoute = instruction.fragment;
        if (this.currentRoute == "/" ) {
          this.isPipelineOptions = true;
        } else {
          this.isPipelineOptions = false;
        }
    }

    attached() {
        this.subscription = this.eventAggregator.subscribe(
          'router:navigation:success',
          this.navigationSuccess.bind(this));
    }

    detached() {
        this.subscription.dispose();
    }

    get isLogged() {
        return this.auth.isLogged;
    }

    get user() {
        return this.auth.user;
    }

}
