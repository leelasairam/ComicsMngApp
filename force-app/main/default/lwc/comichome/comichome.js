import { LightningElement, wire, track} from 'lwc';
import GetComics from '@salesforce/apex/ComicClass.GetComics';
import GetUsers from '@salesforce/apex/ComicClass.GetUsers';
import ChangeQuantity from '@salesforce/apex/ComicClass.ChangeQuantity';
import GetTransactions from '@salesforce/apex/ComicClass.GetTransactions';
import SetStatusReturn from '@salesforce/apex/ComicClass.SetStatusReturn';
import IncreaseQuntity from '@salesforce/apex/ComicClass.IncreaseQuntity';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class Comichome extends LightningElement {
    @track Comics=[];
    @track Users=[];
    @track Transactions=[];
    @track Modal=false;
    @track ComicId;
    @track Comic_Query = 'SELECT Id, category__c, comic__c, country__c, Name, language__c, Quantity__c, Availability__c, written__c, released__c, Year__c FROM Comic__c WHERE Availability__c=true ORDER BY CreatedDate DESC LIMIT 10';
    @track Basic_ComicQuery = 'SELECT Id, category__c, comic__c, country__c, Name, language__c, Quantity__c, Availability__c, written__c, released__c, Year__c FROM Comic__c';
    @track User_Query = 'SELECT Id, Name__c, Address__c, Phone__c FROM Comic_User__c ORDER BY CreatedDate DESC LIMIT 5';
    @track Transaction_Query = 'SELECT Id,IsReturned__c, Name, Comic__r.comic__c,Comic_User__r.Name__c,Status__c,LastModifiedDate, CreatedDate FROM Comic_Transaction__c WHERE Status__c = \'Borrowed\' ORDER BY CreatedDate DESC LIMIT 5';
    @track languageq='';
    @track genreq='';
    @track yearq='';
    @track load = false;
    get Genres() {
        return [
            { label: 'Fantasy', value: 'Fantasy' },
            { label: 'Drama', value: 'Drama' },
            { label: 'War', value: 'War' },
            { label: 'Action', value: 'Action' },
            { label: 'Documentary', value: 'Documentary' },
            { label: 'Thriller', value: 'Thriller' },
            { label: 'Animation', value: 'Animation' },
            { label: 'Children', value: 'Children' },
            { label: 'Western', value: 'Western' },
            { label: 'Comedy', value: 'Comedy' },
            { label: 'Horror', value: 'Horror' },
            { label: 'Romance', value: 'Romance' },
            { label: 'Adventure', value: 'Adventure' },
            { label: 'Sci-Fi', value: 'Sci-Fi' },
        ];
    }

    get Languages() {
        return [
            { label: 'English', value: 'English' },
            { label: 'Chinese', value: 'Chinese' },
            { label: 'French', value: 'French' },
            { label: 'German', value: 'German' },
        ];
    }

    connectedCallback(){
        this.GetComicRecords();
        this.GetUsersRecords();
        this.GetTransactionRecords();
    }

    async GetComicRecords(){
        try{
            this.load = true;
            this.Comics = await GetComics({q:this.Comic_Query});
            this.load = false;
        }
        catch(error){
            console.log(error);
        }
    }

    async GetUsersRecords(){
        try{
            this.load = true;
            this.Users = await GetUsers({q:this.User_Query});
            this.load = false;
        }
        catch(error){
            console.log(error);
        }
    }

    async GetTransactionRecords(){
        try{
            this.load = true;
            this.Transactions = await GetTransactions({q:this.Transaction_Query});
            this.load = false;
        }
        catch(error){
            console.log(error);
        }
    }

    async ShowModal(event){
        this.ComicId = event.target.dataset.cid;
        this.Modal=true;
    }

    HideModal(){
        this.Modal=false;
    }


    ChangeComicQuantity(){
        ChangeQuantity({TID:this.ComicId})
        .then(result => {
            console.log("Updated");
            this.GetComicRecords();
        })
        .catch(error => {
            console.log(error);
        });
        this.Toast = {title : "Success!",messsage : "Borrowed Successfully",varient : "success"};
        this.HideModal();
        const event = new ShowToastEvent({
            title: "Success",
            message: "comic borrowed successfully",
            variant: "success",
            mode: 'dismissable'
        });
        this.dispatchEvent(event);
    }

    SearchComics(){
        let ComicSearch = this.template.querySelector(".comic-search").value;
        if(ComicSearch!=null && ComicSearch!=undefined && ComicSearch!="" && ComicSearch!=" "){
            this.Comic_Query = 'SELECT Id, category__c, comic__c, country__c, Name, language__c, Quantity__c, Availability__c, written__c, released__c, Year__c FROM Comic__c WHERE comic__c LIKE \'%'+ComicSearch+'%\' ORDER BY CreatedDate DESC';
            this.GetComicRecords();
        }
    }

    SearchUser(){
        let UserSearch = this.template.querySelector(".user-search").value;
        if(UserSearch!=null && UserSearch!=undefined && UserSearch!="" && UserSearch!=" "){
            this.User_Query = `SELECT Id, Name__c, Address__c, Phone__c FROM Comic_User__c WHERE Name__c LIKE \'%${UserSearch}%\' ORDER BY CreatedDate DESC`;
            this.GetUsersRecords();
        }

    }

    SearchTransaction(){
        let TransactionSearch = this.template.querySelector(".transaction-search").value;
        if(TransactionSearch!=null && TransactionSearch!=undefined && TransactionSearch!="" && TransactionSearch!=" "){
            this.Transaction_Query = `SELECT Id,IsReturned__c, Name, Comic__r.comic__c,Comic_User__r.Name__c,Status__c,LastModifiedDate, CreatedDate FROM Comic_Transaction__c WHERE Name = \'${TransactionSearch}\' ORDER BY CreatedDate DESC`;
            this.GetTransactionRecords();
        }
    }

    GetUserTransactions(event){
        let UserId = event.target.dataset.uid;
        this.Transaction_Query = `SELECT Id,IsReturned__c, Name, Comic__r.comic__c,Comic_User__r.Name__c,Status__c,LastModifiedDate, CreatedDate FROM Comic_Transaction__c WHERE Comic_User__c = \'${UserId}\' AND Status__c = \'Borrowed\' ORDER BY CreatedDate DESC`;
        this.GetTransactionRecords();
    }

    ChangeTransactionStatus(event){
        let cid;
        let TransactionId = event.target.dataset.tid;
        SetStatusReturn({TID:TransactionId})
        .then(result => {
            console.log("Updated");
            cid=result;
            IncreaseQuntity({ComicId:cid})
            .then(result => {
                console.log("Done");
            })
            .catch(error => {
                console.log(error);
            });
            this.GetTransactionRecords();
            this.GetComicRecords();
            const event = new ShowToastEvent({
                title: "Success",
                message: "transaction updated successfully",
                variant: "success",
                mode: 'dismissable'
            });
            this.dispatchEvent(event);
        })
        .catch(error => {
            console.log(error);
        });
    }

    handleGenre(){
        
        this.genreq = this.template.querySelector(".genre").value;
    }

    handleLanguage(){
        
        this.languageq = this.template.querySelector(".language").value;
    }

    handleYear(){
        
        this.yearq = this.template.querySelector(".year").value;
        
    }

    Filter(){
        let GenreQuery =this.genreq != '' ? "AND category__c="+"'"+this.genreq+"'"+' ' : '';
        let LanguageQuery = this.languageq != '' ? "AND language__c="+"'"+this.languageq+"'"+' ' : '';
        let YearQuery = this.yearq != '' ? "AND year__c="+this.yearq+' ' : '';
        let Query = this.Basic_ComicQuery + GenreQuery + LanguageQuery + YearQuery;
        this.Comic_Query = Query.replace("AND", " WHERE");
        //console.log(this.Comic_Query);
        this.GetComicRecords();
    }

    ResetFilters(){
        this.Comic_Query = 'SELECT Id, category__c, comic__c, country__c, Name, language__c, Quantity__c, Availability__c, written__c, released__c, Year__c FROM Comic__c WHERE Availability__c=true ORDER BY CreatedDate DESC LIMIT 20';
        this.GetComicRecords();
    }
}