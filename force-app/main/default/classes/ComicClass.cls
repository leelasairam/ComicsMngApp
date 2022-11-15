public with sharing class ComicClass {
    public ComicClass() {

    }

    @AuraEnabled(cacheable=false)
    public static list<Comic__c> GetComics(String q){
        try {
            list<Comic__c>Comics = database.query(q);
            return Comics;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static list<Comic_User__c> GetUsers(String q){
        try {
            list<Comic_User__c>Users = database.query(q);
            return Users;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void ChangeQuantity(String TID){
        try {
            Comic__c C = [SELECT Id, Quantity__c FROM Comic__c WHERE Id=:TID];
            C.Quantity__c-=1;
            update C;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static list<Comic_Transaction__c> GetTransactions(String q){
        try {
            list<Comic_Transaction__c> Transactions = database.query(q);
            return Transactions;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static String SetStatusReturn(String TID){
        try {
            Comic_Transaction__c CT = [SELECT Id, Comic__r.Id, Status__c FROM Comic_Transaction__c WHERE Id=:TID];
            CT.Status__c = 'Returned';
            update CT;
            return CT.Comic__r.Id;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void IncreaseQuntity(String ComicId){
        try {
            Comic__c C = [SELECT Id, Quantity__c FROM Comic__c WHERE Id = : ComicId];
            C.Quantity__c += 1;
            update C;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
