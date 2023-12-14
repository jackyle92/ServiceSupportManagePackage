/**
 * @description - Card show contract information if contract date close to endate or time remaining closely runout.
 * @Author - Jacky Lee
 * @Date - 30 April 2023
 */
import { LightningElement, api, track } from 'lwc'
import LightningAlert from 'lightning/alert'
import getContract from '@salesforce/apex/ContractController.getContract'
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import * as ccpUtils from 'c/ccpUtils'
import { isNull } from 'c/lodash'

export default class CcpContractInforBannerCmp extends LightningElement {
  closelyExpired
  endDate
  startDate
  contractTerm
  @api hasActiveContract = false
  @track rDate
  @track rSupportHours

  connectedCallback () {
    //get activated contract only
    getContract().then(result => {
      if (result) {
        // console.log('result of Contract: ' + JSON.stringify(result));
        this.hasActiveContract = true
        this.rSupportHours = result.remainingSupportHours
        this.rDate = ccpUtils.datediff(
          Date.now(),
          Date.parse(result.contractEndDate)
        )
        this.endDate = this.changeDateFormat(result.contractEndDate)
        this.startDate = this.changeDateFormat(result.contractStartDate)
        console.log('this.startDate: ', typeof this.startDate)
        this.contractTerm = result.contractTerm
        if (result.contractType == 'Prepaid Contract') {
          if (this.rDate <= 5 || this.rSupportHours <= 5) {
            LightningAlert.open({
              message:
                'The Managed Support contract has closely expired or the support hours has nearly run out. Please make better use of the remaining time or contact support@crosscloudpartners.com to purchase and renew your managed services support',
              theme: 'warning',
              label: 'Attention Managed Services Customers!'
            })
          }
        }
      } else {
        // LightningAlert.open({
        //   message:
        //     'No Active Support Contract. The Managed Support contract has expired. Please contact support@crosscloudpartners.com to purchase and renew your managed services support',
        //   theme: 'error',
        //   label: 'Attention Managed Services Customers!'
        // })
      }
    })
  }

  // Current date value format is "YYYY-MM-DD", change to "DD/MM/YYYY"
  changeDateFormat (date) {
    return date.split('-').reverse().join('/')
  }
}