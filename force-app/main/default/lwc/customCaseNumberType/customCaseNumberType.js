import { LightningElement, api } from 'lwc';

export default class CustomCaseNumberType extends LightningElement {
    @api caseId;
    @api caseNumber;
    
    fireCaseNumberClick() {
        const event = new CustomEvent('casenumberclick', {
            composed: true,
            bubbles: true,
            cancelable: true,
            detail: {
                caseId: this.caseId,
                caseNumber: this.caseNumber
            },
        });
        this.dispatchEvent(event);
    }
}