/**
 * @description - Card show contract information if contract date close to endate or time remaining closely runout.
 * @Author - Jacky Lee
 * @Date - 30 April 2023
 */
import { LightningElement} from 'lwc';
import LightningAlert from 'lightning/alert';
import getContract from '@salesforce/apex/ContractController.getContract';
import * as ccpUtils from 'c/ccpUtils';

export default class CcpContractInforBannerCmp extends LightningElement {
  closeExpired;
  expired;
  endDate;
  activeContract;
  remainingDate;


  renderedCallback() {
    getContract().then(result => {
      console.log('Contract banner cmp result: ', result);
      this.remainingDate = ccpUtils.datediff(Date.now(), Date.parse(result.contractEndDate));
      if(this.remainingDate < 10) {
        this.closeExpired = true;
        this.endDate = result.contractEndDate;
        if(this.remainingDate <= 0) {
          this.expired = true;
          LightningAlert.open({
            message: 'Sorry! your contract was expired. Please renew your contract by button [Renew Contact].',
            theme: 'error', // a red theme intended for error states
            label: 'Contract has been expired!', // this is the header text
          });
          //Alert has been closed
        }
      }
    });
  }

  handleRenewContract() {
    console.log('handle Renew Contract');
  }

}