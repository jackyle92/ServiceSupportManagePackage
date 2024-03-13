// v1.0.0 - Hilbert Nguyen (hilbert.nguyen@crosscloudpartners.com - Cross Cloud Partners) - 15 Dec 2023
// Desc: Create new
import { LightningElement, api, wire } from "lwc";
import { CurrentPageReference } from "lightning/navigation";
import { registerListener, unregisterAllListeners, fireEvent } from "c/pubsub";

export default class CustomCaseEstimationStatusType extends LightningElement {
  @api caseId;
  @api caseEstimationStatus;
  @api caseEstimationHours;
  isEdit = false;

  @wire(CurrentPageReference) pageRef;

  get isEstimationStatusEmpty() {
    return (
      this.caseEstimationStatus === undefined ||
      (this.caseEstimationStatus === "Rejected" && this.isEdit)
    );
  }
  get isApproved() {
    return this.caseEstimationStatus === "Approved";
  }

  estimationStatusEdit() {
    this.isEdit = true;
  }

  estimationStatusCancel() {
    this.isEdit = false;
  }

  handleEstimationSelect(event) {
    const customEvent = new CustomEvent("caseestimationstatusselect", {
      composed: true,
      bubbles: true,
      cancelable: true,
      detail: {
        caseId: this.caseId,
        caseEstimationStatus: event.detail.value,
      },
    });

    this.dispatchEvent(customEvent);
  }

  showModal() {
    let eventValues = { caseId: this.caseId };
    fireEvent(this.pageRef, "showCaseRejectModal", eventValues);
  }
}