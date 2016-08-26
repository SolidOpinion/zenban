import {inject} from "aurelia-framework";
import {ItemsData} from "../models/itemsData";

@inject(ItemsData)
export class Archive {

    constructor(itemsData) {
        this.data = itemsData;
        this.items = [];
    }

    attached(){
        this.data.getClosedList()
            .then(items => {
                this.items = items;
                for(var i=0; i<this.items.length; i++) {
                    this.items[i].updatedTitle = this.getTimeStamp(this.items[i].updated);
                }
                console.log(this.items);
            });

    }

    getTimeStamp(s) {
        var d = new Date(s);
        var date = [ d.getMonth() + 1, d.getDate(), d.getFullYear() ];
        var time = [ d.getHours(), d.getMinutes() ];
        var suffix = ( time[0] < 12 ) ? "AM" : "PM";
        time[0] = ( time[0] < 12 ) ? time[0] : time[0] - 12;
        time[0] = time[0] || 12;
        for ( var i = 1; i < 3; i++ ) {
            if ( time[i] < 10 ) {
                time[i] = "0" + time[i];
            }
        }
        return date.join("/") + " " + time.join(":") + " " + suffix;
    }
}