import { LightningElement, api, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { fireEvent } from 'c/pubsub';

import * as ccpUtils from 'c/ccpUtils';

import submitCase from '@salesforce/apex/CaseManagementController.submitCase';

export default class CaseSubmissionForm extends LightningElement {
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