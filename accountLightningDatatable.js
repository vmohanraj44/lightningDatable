import { LightningElement } from 'lwc';
import getAccountDetails from '@salesforce/apex/AccountLightningDatatable.getAccountDetails';
import getContactDetails from '@salesforce/apex/AccountLightningDatatable.getContactDetails';
import getContactsBasedOnSearchWord from '@salesforce/apex/AccountLightningDatatable.getContactsBasedOnSearchWord';
import updateAccountIdToContact from '@salesforce/apex/AccountLightningDatatable.updateAccountIdToContact';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

const COLS=[{label:'Name', fieldName:'Name'},
{label:'Department', fieldName:'Department'},
{label:'Lead Source', fieldName:'LeadSource'},
{label:'Email',fieldName:'Email',type:'email'}
];

export default class AccountLightningDatatable extends LightningElement {
    columns=COLS;
    data=[];
    error;
    searchvalue='';
    AccountValue='';
    options=[];
    connectedCallback(){
       this.getAccountInformation();
       this.getContactInformation();
    }
    getContactInformation(){
        getContactDetails()
    .then(result=>{
        this.data=result;
    })
    .catch(error=>{
        this.error=error;
    })
}
getAccountInformation(){
    getAccountDetails()
    .then(result=>{
        for(const list of result){
            const option = {
                label: list.Name,
                value: list.Id
            };
            this.options = [ ...this.options, option ];
        }
    })
    .catch(error=>{
        this.error=error;
    })
}
    handleChange(event){
        this.searchvalue=event.target.value;
        console.log('--->'+this.searchvalue);
        getContactsBasedOnSearchWord({searchWord:this.searchvalue})
        .then(result=>{
            this.data = result;
        })
        .catch(error=>{
            this.error=error;
        })
}
handleSelectedContact(){
    var selectedRecords =  this.template.querySelector("lightning-datatable").getSelectedRows();
      if(selectedRecords.length > 0 && this.AccountValue!=null){
        console.log('inside')
       updateAccountIdToContact({accountId:this.AccountValue,contactList:selectedRecords})
       .then(result=>{
        if(result=='Contact Added Successfully'){
            this.template.querySelector('lightning-datatable').selectedRows=[];
            this.getContactInformation();
            this.dispatchEvent(new ShowToastEvent({
                title:'Success',
                message:'Contact added to Account Successfully',
                variant:'success'
            })); 
        }
       })
       .catch(error=>{
        this.error=error;
       })
        
      } else {
        this.dispatchEvent(new ShowToastEvent({
            title:'Info',
            message:'Please select an Account and Contact',
            variant:'info'
        }))
      }   
}
handleAccountChange(event){
  this.AccountValue = event.target.value;
  console.log('----->'+this.AccountValue);
}
}