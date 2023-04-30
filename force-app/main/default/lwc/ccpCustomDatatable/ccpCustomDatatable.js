import LightningDatatable from 'lightning/datatable';
import { loadStyle } from 'lightning/platformResourceLoader';
import customCaseNumber from './customCaseNumber.html';
import customCaseCompleteBtn from './customCaseCompleteBtn.html';
import CustomDatatableResource from '@salesforce/resourceUrl/ccpCustomTableStyle'

export default class CcpCustomDatatable extends LightningDatatable {
    hasLoadedStyle = false;
    static customTypes = {
        customCaseNumber: {
            template: customCaseNumber,
            standardCellLayout: true,
            typeAttributes: ['caseId']
        },
        customCaseCompleteBtn: {
            template: customCaseCompleteBtn,
            standardCellLayout: true,
            typeAttributes: ['caseId', 'caseStatus']
        }
    }

    renderedCallback() {
        if (LightningDatatable.prototype.renderedCallback) { // Run this check to bypass lwc jest error
            LightningDatatable.prototype.renderedCallback.call(this);
        }
        if (!this.hasLoadedStyle) {
            this.hasLoadedStyle = true;
            Promise.all([
                loadStyle(this, CustomDatatableResource),
            ]).then(() => { })
        }
    }
}