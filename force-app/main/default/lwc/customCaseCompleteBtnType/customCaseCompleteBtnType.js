import { LightningElement, api, track } from 'lwc';

export default class CustomCaseCompleteBtnType extends LightningElement {
    @api caseId;
    @api caseStatus;
    @api
    get isDisabled() {
        return this.caseStatus !== 'Ready For Testing';
    }
    set isDisabled(value) {
        this.setAttribute('disabled', value);
    }

    fireCaseCompleteBtnClick() {
        const event = new CustomEvent('casecompletebtnclick', {
            composed: true,
            bubbles: true,
            cancelable: true,
            detail: {
                caseId: this.caseId,
            },
        });

        this.dispatchEvent(event);
    }
}