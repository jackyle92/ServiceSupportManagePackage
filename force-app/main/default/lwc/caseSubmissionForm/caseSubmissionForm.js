import { LightningElement, api, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { fireEvent } from 'c/pubsub';
import { NavigationMixin } from "lightning/navigation";

import * as ccpUtils from 'c/ccpUtils';

import submitCase from '@salesforce/apex/CaseManagementController.submitCase';
import getContract from '@salesforce/apex/ContractController.getContract';
import getOrgInformationandUser from '@salesforce/apex/ContractController.getOrgInformationandUser';

export default class CaseSubmissionForm extends NavigationMixin(LightningElement) {
    @wire(CurrentPageReference) pageRef;
    @track showSpinner = false;
    @track error;
    @track caseTypeOptions = [
        { label: 'Support Only', value: 'Support Only' },
        { label: 'Training', value: 'Training' },
        { label: 'Support and Training', value: 'Support and Training' },
        { label: 'Technincal Issue', value: 'Technical Issue' }
    ];
    @track priorityOptions = [
        { label: 'High', value: 'High' },
        { label: 'Medium', value: 'Medium' },
        { label: 'Low', value: 'Low' }
    ];
    @track caseModel;
    rDate; // remaining date of the contract
    // isInvalidContract = false;
    orgInfo = {};

    get acceptedFormats() {
        return ['.png','.pdf',  '.doc'];
    }

    get hasFiles() {
        return this.caseModel.files && this.caseModel.files.length;
    }

    get isValid() {
        return this.caseModel.subject && this.caseModel.description && this.caseModel.priority;
    }

    connectedCallback() {
        this.initializeCaseModel();
        // 1. get the orgId, user information (in the connectedCallback);
        getOrgInformationandUser().then(result => {
            this.orgInfo = JSON.parse(result);
            console.log('this.orgInfo: ', this.orgInfo);
        }).catch(err => {
            console.log(err);
        })
    }

    renderedCallback() {
        // console.log('getDom', getDom); 
        getContract().then(result => {
            console.log('contract result: ' , result);
            if(result) {
                this.rDate = ccpUtils.datediff(Date.now(), Date.parse(result.contractEndDate));
                console.log('this.rDate: ', this.rDate);
                switch(result.contractType) {
                    case 'Post Project':
                        if(result.remainingSupportHours <= 0) {
                            this.disableFormSubmit();
                        }
                        break;
                    case 'PayG Contract':
                        break;
                    case 'Prepaid Contract':
                        if(result.remainingSupportHours <= 0 || this.rDate <= 0){
                            this.disableFormSubmit();
                        }
                        break;
                }
                // disalbe renew service contract
                /**
                 * this.remaining date  < 5 ==> enable renew contract
                 * this.remaining date > 5 ==> disable renew contract
                 */
                if(this.rDate > 5) {
                    let renewBtn = this.template.querySelector('.renew-button');
                    // renewBtn.disabled = true;
                    // renewBtn.classList.add('disabledBtn')
                }
            } else {
                this.disableFormSubmit();
            }
        })
    }

    disableFormSubmit() {
        // this.isInvalidContract = true;
        this.template.querySelector('[data-name="subject"]').disabled = true;
        this.template.querySelector('[data-name="description"]').disabled = true;
        this.template.querySelector('[data-name="caseType"]').disabled = true;
        this.template.querySelector('[data-name="priority"]').disabled = true;
        this.template.querySelector('[data-name="attachedFile"]').disabled = true;
        let submitButton = this.template.querySelector('.submit-button');
        submitButton.disabled = true;
        submitButton.classList.add('disabledBtn')
    }


    handleRenewContract() {
        // 1. get the orgId, user information (in the connectedCallback);
        // stored it to the this.orgInfo variable

        // 2. Generate the url, and expend the url by Id, and name of user
        let url = 'https://ccpsupport-dev-ed.my.site.com/renewcontract/s/?' + 'orgId=' + this.orgInfo.orgId.substring(0, 15) + '&firstName=' + this.orgInfo.userFirstName + '&lastName=' + this.orgInfo.userLastName + '&email=' +this.orgInfo.userEmail;
        console.log('url: ' + url);
        // [NavigationMixin.GenerateUrl](pageReference)
        this[NavigationMixin.Navigate]( {
            type: "standard__webPage", 
            attributes: {
                url: url,
            },
        },
        false,
        );

    }


    initializeCaseModel() {
        this.caseModel = {
            subject: '',
            description: '',
            priority: '',
            caseType: '',
            files: []
        }
    }

    handleSave() {
        if (this.isValid) {
            this.showSpinner = true;
            let requestStr = JSON.stringify(this.caseModel);
            submitCase({requestStr: requestStr})
                .then((result) => {
                    this.dispatchEvent(new ShowToastEvent({
                        title: 'Success',
                        message: 'Case was submitted successfully.',
                        variant: 'success'
                    }));
                    
                    fireEvent(this.pageRef, 'caseSavedSuccessfully');

                    this.initializeCaseModel();
                })
                .catch((error) => {
                    this.error = error.message;

                    this.dispatchEvent(new ShowToastEvent({
                        title: 'Error',
                        message: 'Cannot Submit Case.',
                        variant: 'error'
                    }));
                })
                .finally(() => {
                    this.showSpinner = false;
                });
        }
        else {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error',
                message: 'Subject, Description and Priority are required for submission.',
                variant: 'error'
            }));
        }
    }

    handleOnChange(event) {
        let value = ccpUtils.getValueFromEvent(event);
        this.caseModel[event.target.name] = value;
    }

    handleFileUploadChange(event) {
        if (!event.target.files || !event.target.files.length) return;
        
        for (var i = 0; i < event.target.files.length; i++) {
            let file = event.target.files[i];

            let reader = new FileReader();
            reader.onload = e => {
                let base64 = 'base64,';
                let content = reader.result.indexOf(base64) + base64.length;
                let fileContent = reader.result.substring(content);
                this.caseModel.files.push( 
                    { 
                        pathOnClient: file.name, 
                        title: file.name, 
                        versionData: fileContent, 
                        size: parseInt(file.size / 1024) 
                    } 
                );
            };
            reader.readAsDataURL(file);
        };
    }

    handleFileDelete() {
        this.caseModel.files = [];
    }

}