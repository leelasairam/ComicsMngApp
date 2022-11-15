import { LightningElement , track ,wire , api } from 'lwc';

export default class ComicsApp extends LightningElement {
    @track ShowHome=true;
    @track ShowBorrow=false;
    @track ShowReturn=false;

    NavigateToComponent(event){
        let link = event.target.dataset.link;
        if(link==="home"){
            this.ShowHome = true;
            this.ShowReturn = false;
            this.ShowBorrow = false;
        }
        else if(link==="borrow"){
            this.ShowHome = false;
            this.ShowReturn = false;
            this.ShowBorrow = true;
        }
        else if(link==="return"){
            this.ShowHome = false;
            this.ShowReturn = true;
            this.ShowBorrow = false;
        }
    }
}