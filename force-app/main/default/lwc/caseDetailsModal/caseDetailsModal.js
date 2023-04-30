import { LightningElement, track, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { CurrentPageReference } from 'lightning/navigation';
import { registerListener, unregisterAllListeners, fireEvent } from 'c/pubsub';

import * as ccpUtils from 'c/ccpUtils';

import getCaseDetails from '@salesforce/apex/CaseManagementController.getCaseDetails';
import updateCase from '@salesforce/apex/CaseManagementController.updateCase';
import createClientCommunication from '@salesforce/apex/CaseManagementController.createClientCommunication';
// import completeCase from '@salesforce/apex/CaseManagementController.completeCase';

import TIME_ZONE from '@salesforce/i18n/timeZone';

export default class CaseDetailModal extends LightningElement {
    @track showModal = false;
    @track showSpinner = false;
    @track caseModel= {};
    @track hasRendered = false;

    @track priorityOptions = [
        { label: 'High', value: 'High' },
        { label: 'Medium', value: 'Medium' },
        { label: 'Low', value: 'Low' }
    ];

    @track timezoneSidId = TIME_ZONE;

    @track clientCommunication = {
        caseId: '',
        question: '',
        files: []
    }

    // get allowComplete(){
    //     return this.caseModel.status === 'Ready For Testing';
    // }

    get estimationHours() {
        return this.caseModel.estimationHours || 'N/A';
    }

    get estimationStatus() {
        return this.caseModel.estimationStatus || 'N/A';
    }

    get hasFiles() {
        return this.clientCommunication.files && this.clientCommunication.files.length;
    }

    get sendEnquiryDisabled() {
        return !this.clientCommunication || !this.clientCommunication.question;
    }

    get acceptedFormats() {
        return ['.png','.pdf',  '.doc'];
    }

    @wire(CurrentPageReference) pageRef;

    connectedCallback() {
        registerListener('showCaseDetailsModal', this.handleShowCaseDetailsModal, this);
    }

    disconnectedCallback() {
        unregisterAllListeners(this);
    }

    // handleComplete() {
    //     this.showSpinner = true;
    //     completeCase({caseId: this.caseModel.id})
    //         .then((result) => {
    //             this.dispatchEvent(new ShowToastEvent({
    //                 title: 'Success',
    //                 message: 'Case is complete.',
    //                 variant: 'success'
    //             }));
    //             fireEvent(this.pageRef, 'caseSavedSuccessfully');
    //             this.closeModal();
    //         })
    //         .catch((error) => {
    //             this.error = error.message;
                
    //             this.dispatchEvent(new ShowToastEvent({
    //                 title: 'Error',
    //                 message: 'Cannot complete Case.',
    //                 variant: 'error'
    //             }));
    //         })
    //         .finally(() => {
    //             this.showSpinner = false;
    //         });
    // }

    handleSave() {
        let requestStr = JSON.stringify(this.caseModel);

        this.showSpinner = true;
        updateCase({requestStr: requestStr})
            .then((result) => {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Success',
                    message: 'Case was updated successfully.',
                    variant: 'success'
                }));
                
                fireEvent(this.pageRef, 'caseSavedSuccessfully');

                this.closeModal();
            })
            .catch((error) => {
                this.error = error.message;

                this.dispatchEvent(new ShowToastEvent({
                    title: 'Error',
                    message: 'Cannot save Case.',
                    variant: 'error'
                }));
            })
            .finally(() => {
                this.showSpinner = false;
            });
    }

    handleEnquiryOnChange(event) {
        this.clientCommunication.question = ccpUtils.getValueFromEvent(event);
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
                this.clientCommunication.files.push( 
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
        this.clientCommunication.files = [];
    }

    handleSendEnquiry() {
        let requestStr = JSON.stringify(this.clientCommunication);

        this.showSpinner = true;
        createClientCommunication({requestStr: requestStr})
            .then((result) => {
                this.retrieveCaseDetails(this.caseModel.id);
                
                this.clientCommunication = {
                    caseId: this.caseModel.id,
                    question: '',
                    files: []
                }
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                this.showSpinner = false;
            });
    }

    handleOnChange(event) {
        let value = ccpUtils.getValueFromEvent(event);
        this.caseModel[event.target.name] = value;
    }

    handleShowCaseDetailsModal(detail) {
        let caseId = detail.caseId;
        this.retrieveCaseDetails(caseId);
        this.showModal = true;
        this.addStyleWhenOpen();
    }

    retrieveCaseDetails(caseId) {
        this.showSpinner = true;
        getCaseDetails({caseId: caseId})
            .then((result) => {
                this.caseModel = result;
                this.clientCommunication.caseId = this.caseModel.id;
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                this.showSpinner = false;
            });
    }

    closeModal() {
        this.hasRendered = false;
        this.showModal = false;
        
    }

    renderedCallback() {
        if(this.hasRendered == false && this.template.querySelector('.bigTextarea') !==null) {
            this.hasRendered = true;
            const style = document.createElement('style');
            style.innerText = `
                    .bigTextarea textarea {
                        min-height: 250px;
                    }
                `;
            
            if(this.template.querySelector('.bigTextarea') !==null)
                this.template.querySelector('.bigTextarea').appendChild(style);
        }
    }

}