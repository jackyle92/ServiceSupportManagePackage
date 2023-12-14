import { LightningElement, api, track } from 'lwc';
import getOrgId from '@salesforce/apex/OrderFormController.getOrgId';

export default class CcpOrderFormCmp extends LightningElement {
  showSpinner = false;
  requestOrder = true;
  @api contact = {};
  orderInfo = {};
  dataSubmission = [];
  contractTermOptions = [
    {label: '3 Months', value: '3'},
    {label: '6 Months', value: '6'},
    {label: '12 Months', value: '12'},
  ];
  
  value = ['3'];

  handleTermChange(event) {
    this.template.querySelector('[data-name="term"]').value = event.detail.value;
  }

  handleFirstNameChange(event) {
    this.contact.firstName = event.target.value;
  }
  handleLastNameChange(event) {
    this.contact.lastName = event.target.value;
  }
  handleEmailChange(event) {
    this.contact.email = event.target.value;
  }
  handlePhoneChange(event){
    this.contact.phone = event.target.value
  }

  handleTotalHoursChange(event) {
    this.orderInfo.totalHours = event.target.value;
  }

  handleTermChange(event) {
    this.orderInfo.term = event.detail.value;
  }

  renderedCallback() {
    getOrgId().then(result=> {
      // console.log(result);
      this.orderInfo.orgId = result;
    })
  }
  handleFormSubmit() {
    this.dataSubmission = [this.contact, this.orderInfo];
    // console.log(this.dataSubmission);
  }
}