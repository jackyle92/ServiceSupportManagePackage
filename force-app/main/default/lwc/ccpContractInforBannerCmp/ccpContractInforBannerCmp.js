/**
 * @description - Card show contract information if contract date close to endate or time remaining closely runout.
 * @Author - Jacky Lee
 * @Date - 30 April 2023
 */
import { LightningElement} from 'lwc';
import LightningAlert from 'lightning/alert';
import getContract from '@salesforce/apex/ContractController.getContract';
import {ShowToastEvent}  from 'lightning/platformShowToastEvent';
import * as ccpUtils from 'c/ccpUtils';

export default class CcpContractInforBannerCmp extends LightningElement {
  closeExpired;
  expired;
  endDate;
  activeContract;
  remainingDate;


  constructor() {
    super();
    getContract().then(result => {
      console.log('Contract banner cmp result: ', result);
      this.remainingSupportHours = result.remainingSupportHours;
      this.remainingDate = ccpUtils.datediff(Date.now(), Date.parse(result.contractEndDate));
      if(this.remainingDate < 10 || result.remainingSupportHours <= 1) {
        this.closeExpired = true;
        this.endDate = result.contractEndDate;
        // Give the alert if remaining date < 0
        if(this.remainingDate <= 0) {
          this.remainingDate = 0;
          this.expired = true;
          LightningAlert.open({
            message: "No Active Support Contract. The Managed Support contract has expired due to insufficient hours or contract expired. Please contact support@crosscloudpartners.com to purchase and renew your managed services support",
            theme: 'error', // a red theme intended for error states
            label: 'Attention Managed Services Customers!', // this is the header text
          });
        }
      }
    });
  }

  handleRenewContract() {
    const event = new ShowToastEvent({
      title: 'Feature unavailable', 
      message: 'This feature is not available at the moment',
    });
    this.dispatchEvent(event);
  }

}