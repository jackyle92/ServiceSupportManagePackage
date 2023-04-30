import { LightningElement, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { registerListener, unregisterAllListeners, fireEvent } from 'c/pubsub';

import getCases from '@salesforce/apex/CaseManagementController.getCases';
import approveCase from '@salesforce/apex/CaseManagementController.approveCase';
import rejectCase from '@salesforce/apex/CaseManagementController.rejectCase';
import completeCase from '@salesforce/apex/CaseManagementController.completeCase';

import TIME_ZONE from '@salesforce/i18n/timeZone';

const ACTIONS = [
    { label: 'Approve Estimation', name: 'approve_estimation'}, 
    { label: 'Reject Estimation', name: 'reject_estimation'}
];

const COLUMNS = [
    { label: 'Case Number', fieldName: 'caseNumber', type: 'customCaseNumber', sortable: true, hideDefaultActions: true, wrapText: true, typeAttributes: { caseId: { fieldName: 'id' } } },
    { label: 'Subject', fieldName: 'subject', type: 'text', hideDefaultActions: true, wrapText: true },
    { label: 'Priority', fieldName: 'priority', type: 'text', sortable: true, hideDefaultActions: true, wrapText: true },
    { label: 'Actual Hours', fieldName: 'actualSupportHours', type: 'number', sortable: true, cellAttributes: { alignment: 'left'} },
    { label: 'Estimation Hours', fieldName: 'estimationHours', type: 'number', sortable: true, cellAttributes: { alignment: 'left'} },
    { label: 'Estimation Status', fieldName: 'estimationStatus', sortable: true, type: 'text', sortable: true, cellAttributes: { alignment: 'left'} },
    { label: 'Status', fieldName: 'status', type: 'text', sortable: true, hideDefaultActions: true, wrapText: true },
    { type: 'action', typeAttributes: { rowActions: ACTIONS, menuAlignment: 'right' } },
    { type: 'customCaseCompleteBtn', hideDefaultActions: true, wrapText: true, typeAttributes:
        { 
            caseStatus: {
                fieldName: 'status'
            },
            caseId: {
                fieldName: 'id'
            }
        }
    },
];

export default class CaseManagementCmp extends LightningElement {
    @wire(CurrentPageReference) pageRef;

    @track showSpinner = false;
    
    @track filters = {
        //statuses: ["New", "Planned", "In Progress", "On Hold",  "Ready For Testing", "Accepted", "Done"],
        statuses: ["New", "Planned", "In Progress", "Ready For Testing", "Accepted"],
    }

    @track caseStatusOptions = [
        { label: 'New', value: 'New' },
        { label: 'Planned', value: 'Planned' },
        { label: 'In Progress', value: 'In Progress' },
        { label: 'On Hold', value: 'On Hold' },
        { label: 'Ready For Testing', value: 'Ready For Testing' },
        { label: 'Accepted', value: 'Accepted' },
        { label: 'Done', value: 'Done' }
    ];

    @track columns = COLUMNS;
    @track sortBy;
    @track sortDirection = 'asc';
    @track caseItems = [];

    get isValid() {
        return this.filters.statuses && this.filters.statuses.length;
    }

    renderedCallback() {
    }

    connectedCallback() {
        this.retrieveCases();

        registerListener('caseSavedSuccessfully', this.handleCaseSavedSuccessfully, this);
    }

    disconnectedCallback() {
        unregisterAllListeners(this);
    }

    retrieveCases() {
        if (this.isValid) {
            this.showSpinner = true;
            let requestStr = JSON.stringify(this.filters);
            getCases({requestStr: requestStr})
                .then((result) => {
                    this.caseItems = result;
                    console.log(result);
                })
                .catch((error) => {
                    console.log(error);
                })
                .finally(() => {
                    this.showSpinner = false;
                });
        }
    }

    handleCaseSavedSuccessfully(detail) {
        this.retrieveCases();
    }

    handleStatusChange(event) {
        let selectedOptions = event.detail.selectedValues;
        let statuses = [];
        selectedOptions.forEach((option) => {
            statuses.push(option.value);
        });
        this.filters.statuses = statuses;
        this.retrieveCases();
    }

    handleCaseCompleteBtnClick(event) {
        const id = event.detail.caseId;
        this.showSpinner = true;
        completeCase({caseId: id})
            .then((result) => {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Success',
                    message: 'Case is complete.',
                    variant: 'success'
                }));
                this.handleCaseSavedSuccessfully()
            })
            .catch((error) => {
                this.error = error.message;
                
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Error',
                    message: 'Cannot complete Case.',
                    variant: 'error'
                }));
            })
            .finally(() => {
                this.showSpinner = false;
            });
    }

    /** Table actions **/
    handleRowActions(event) {
        let actionName = event.detail.action.name;
        let row = event.detail.row;
    
        switch (actionName) {
            case 'approve_estimation':
                this.handleApproveEstimate(row.id);
                break;
            case 'reject_estimation':
                this.handleRejectEstimate(row.id);
                break;
            case 'Complete':
                this.handleComplete(row.id);
                break;
        }
      
    }

    handleApproveEstimate(caseId) {
        this.showSpinner = true;
        approveCase({caseId: caseId})
            .then((result) => {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Success',
                    message: 'Estimation was approved successfully.',
                    variant: 'success'
                }));
                this.retrieveCases();
            })
            .catch((error) => {
                this.error = error.message;

                this.dispatchEvent(new ShowToastEvent({
                    title: 'Error',
                    message: 'Cannot approve Case.',
                    variant: 'error'
                }));
            })
            .finally(() => {
                this.showSpinner = false;
            });
    }

    handleRejectEstimate(caseId) {
        this.showSpinner = true;
        rejectCase({caseId: caseId})
            .then((result) => {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Success',
                    message: 'Estimation was approved successfully.',
                    variant: 'success'
                }));
                this.retrieveCases();
            })
            .catch((error) => {
                this.error = error.message;

                this.dispatchEvent(new ShowToastEvent({
                    title: 'Error',
                    message: 'Cannot approve Case.',
                    variant: 'error'
                }));
            })
            .finally(() => {
                this.showSpinner = false;
            });
    }

    handleOnCaseNumberClick(event) {
        let eventValues = {caseId: event.detail.caseId};
        fireEvent(this.pageRef, 'showCaseDetailsModal', eventValues);
    }

    handleSortData(event) {
        this.sortBy = event.detail.fieldName;
        this.sortDirection = event.detail.sortDirection;
        this.sortData(event.detail.fieldName, event.detail.sortDirection);
    }
    
    sortData(fieldname, direction) {
        let parseData = JSON.parse(JSON.stringify(this.caseItems));
        let keyValue = (a) => {
            return a[fieldname];
        };
        let isReverse = direction === 'asc' ? 1 : -1;
        parseData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : ''; // handling null values
            y = keyValue(y) ? keyValue(y) : '';
            return isReverse * ((x > y) - (y > x));
        });
        this.caseItems = parseData;
    }

}