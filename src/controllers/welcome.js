export class Welcome {

    heading = 'Welcome to the Random Quotes App!';
    info = 'You can get a random quote without logging in, but if you do log in you can get a super secret quote!';


    constructor(usersData) {
        this.data = usersData;
        this.isForm = false;
        this.user = {};
        this.users = [];
    }
}