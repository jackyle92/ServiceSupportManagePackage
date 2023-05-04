import { LightningElement, api, track } from 'lwc';
import {ShowToastEvent}  from 'lightning/platformShowToastEvent';

export default class CcpOrderFormCmp extends LightningElement {
  showSpinner = false;
  requestOrder = true;
  @track value;

  get contractTermOptions() {
    return [
      {label: '3 Months', value: 3},
      {label: '6 Months', value: 6},
      {label: '12 Months', value: 12},
    ]
  }

  handleTermChange() {
    const event = new ShowToastEvent({
      title: 'Get Help', 
      message: 'This feature is not available at the moment',
    });
    this.dispatchEvent(event);
  }
}