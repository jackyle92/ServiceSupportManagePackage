// v1.0.0 - CCP Support (support@crosscloudpartners.com - Cross Cloud Partners) - 6 Feb 2021
// Desc: Create new
// v1.0.1 - Hilbert Nguyen (hilbert.nguyen@crosscloudpartners.com - Cross Cloud Partners) - 15 Dec 2023
// Desc:
// - customTypes modification - added customCaseEstimationStatus
// - import customCaseEstimationStatus
import LightningDatatable from "lightning/datatable";
import { loadStyle } from "lightning/platformResourceLoader";
import customCaseNumber from "./customCaseNumber.html";
import customCaseCompleteBtn from "./customCaseCompleteBtn.html";
import customCaseEstimationStatus from "./customCaseEstimationStatus.html";
import CustomDatatableResource from "@salesforce/resourceUrl/ccpCustomTableStyle";

export default class CcpCustomDatatable extends LightningDatatable {
  hasLoadedStyle = false;
  static customTypes = {
    customCaseNumber: {
      template: customCaseNumber,
      standardCellLayout: true,
      typeAttributes: ["caseId"],
    },
    customCaseCompleteBtn: {
      template: customCaseCompleteBtn,
      standardCellLayout: true,
      typeAttributes: ["caseId", "caseStatus"],
    },
    customCaseEstimationStatus: {
      template: customCaseEstimationStatus,
      standardCellLayout: true,
      typeAttributes: ["caseId","caseEstimationStatus","caseEstimationHours"],
    },
  };

  renderedCallback() {
    if (LightningDatatable.prototype.renderedCallback) {
      // Run this check to bypass lwc jest error
      LightningDatatable.prototype.renderedCallback.call(this);
    }
    if (!this.hasLoadedStyle) {
      this.hasLoadedStyle = true;
      Promise.all([loadStyle(this, CustomDatatableResource)]).then(() => {});
    }
  }
}