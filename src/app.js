import {EventAggregator} from 'aurelia-event-aggregator';
import {inject} from 'aurelia-dependency-injection';

@inject(EventAggregator)
export class App {

  constructor(eventAggregator) {
    this.eventAggregator = eventAggregator;
    this.currentRoute = "/";
    this.isPipelineOptions = true;
  }

  configureRouter(config, router) {
    this.router = router;

    config.map([
      { route: "", moduleId: "controllers/pipelines", nav: true},
      { route: "item", moduleId: "controllers/addItem", nav: true },
      { route: "item/:id", moduleId: "controllers/editItem" },
      { route: "users", moduleId: "controllers/users" },
      { route: "requirements", moduleId: "controllers/requirements", nav: true },
      { route: "archive", moduleId: "controllers/archive", nav: true }
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



}
