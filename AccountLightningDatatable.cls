public with sharing class AccountLightningDatatable {
    @AuraEnabled
    public static List<Account> getAccountDetails(){
        try {
           return [SELECT Id,Name FROM Account ORDER BY Name ASC LIMIT 10]; 
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static List<Contact> getContactDetails(){
        try {
           return [SELECT Id,Name,Department,LeadSource,Email FROM Contact WHERE AccountId=null ORDER BY Name ASC]; 
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static list<Contact> getContactsBasedOnSearchWord(String searchWord) {
        String strAccName = '%' + searchWord + '%';
        list<Contact> lstAccs = [SELECT Id,Name,Department,LeadSource,Email FROM Contact WHERE Name LIKE :strAccName];

        if(lstAccs.isEmpty()) {
            throw new AuraHandledException('No Record Found..');
        }
        return lstAccs; 
    }
     @AuraEnabled
    public static string updateAccountIdToContact(String accountId,List<Contact> contactList) {
        List<Contact> updateList= new List<Contact>();
        for(contact con:contactList)
        {
            con.AccountId=accountId;
            updateList.add(con);            
        }
        if(!updateList.isEmpty()) {
           Update updateList;
        }
        return 'Contact Added Successfully'; 
    }
}