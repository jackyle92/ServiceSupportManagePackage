import { LightningElement, wire } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { CurrentPageReference } from "lightning/navigation";
import { registerListener, unregisterAllListeners, fireEvent } from "c/pubsub";

import * as ccpUtils from "c/ccpUtils";

export default class CaseRejectModal extends LightningElement {
  showModal = false;
  showSpinner = false;
  acceptedFormats = [".png", ".pdf", ".doc"];
  hasRendered = false;

  @wire(CurrentPageReference) pageRef;

  connectedCallback() {
    registerListener(
      "showCaseRejectModal",
      this.handleShowCaseRejectModal,
      this
    );
  }

  renderedCallback() {
    if (this.hasRendered == false) {
      this.hasRendered = true;
      // Add event listener for keydown
      window.addEventListener("keydown", (event) =>
        ccpUtils.handleKeyDown(event, this)
      );
    }
  }

  disconnectedCallback() {
    console.log('disconnectedCallback');
    unregisterAllListeners(this);

    // Remove event listener when component is destroyed
    window.removeEventListener("keydown", (event) =>
      ccpUtils.handleKeyDown(event, this)
    );
  }

  handleShowCaseRejectModal(detail) {
    this.showModal = true;
  }

  closeModal() {
    this.hasRendered = false;
    this.showModal = false;
  }
}