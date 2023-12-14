import { LightningElement, api, track } from 'lwc';

export default class StripePayment extends LightningElement {

  @track record = {};
  @track error;

  handleChange(event) {
    this.record[event.target.name] = event.target.value;
  }

  handleCharge() {
    this.error = null;
    const cusInfo = JSON.stringify(this.record);
    console.log(cusInfo);
    let isValid = this.validityCheck();

    if(isValid) {
      // process the payment transaction on stripe
      
    }
  }

  validityCheck() {
    let validity;
    let elements = Array.from(this.template.querySelectorAll('[data-id=checkValidity]'));
    if(elements != undefined && elements != null) {
      validity = elements.reduce((validSofar, inputElement) => {
        inputElement.reportValidity();
        return validSofar && inputElement.checkValidity();
      }, true)
    }
    return validity;
  }
}