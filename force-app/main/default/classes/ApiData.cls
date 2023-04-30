global with sharing virtual class ApiData {

    global virtual class clientCredential {
        @AuraEnabled public string clientId {get; set;}
        @AuraEnabled public string clientSecretKey {get; set;} 
        @AuraEnabled public string serviceURL {get; set;} 
    }

   
    
    global virtual class caseModel {
        @AuraEnabled public string id {get; set;}
        @AuraEnabled public string caseNumber {get; set;}
        @AuraEnabled public string caseType {get; set;}
        @AuraEnabled public string caseCreator {get; set;}
        @AuraEnabled public string subject {get; set;}
        @AuraEnabled public string description {get; set;}
        @AuraEnabled public string priority {get;set;}
        @AuraEnabled public string status {get; set;}
        @AuraEnabled public Decimal actualSupportHours {get; set;}
        @AuraEnabled public decimal usedHours {get; set;}
        @AuraEnabled public decimal estimationHours {get; set;}
        @AuraEnabled public string estimationStatus {get; set;}
        @AuraEnabled public Datetime createdDate {get; set;}

        @AuraEnabled public List<fileModel> files {get; set;}
        @AuraEnabled public List<clientCommunication> clientCommunications {get; set;}
    }

    public class clientCommunication {
        @AuraEnabled public string id {get; set;}
        @AuraEnabled public string caseId {get; set;}
        @AuraEnabled public string question {get; set;}
        @AuraEnabled public string answer {get; set;}
        @AuraEnabled public string userName {get; set;}
        @AuraEnabled public DateTime createdDate {get; set;}

        @AuraEnabled public List<fileModel> files {get; set;}
    }
    
    global virtual class fileModel {
        @AuraEnabled public string pathOnClient {get; set;}
        @AuraEnabled public string title {get; set;}
        @AuraEnabled public string versionData {get; set;}
        @AuraEnabled public string size {get; set;}
    }

    global class createClientCommunicationRequestModel {
        @AuraEnabled public clientCommunication clientCommunication {get; set;}
    }

    global class createClientCommunicationResult extends CalloutResultBase {
        @AuraEnabled public clientCommunication data {get; set;}
    }
    
    global class submitCaseRequestModel {
        @AuraEnabled public caseModel caseModel {get; set;}
    }

    global class submitCaseResult extends CalloutResultBase {
        @AuraEnabled public string data {get; set;}
    }

    global class updateCaseRequestModel {
        @AuraEnabled public caseModel caseModel {get; set;}
    }

    global class  updateCaseResult extends CalloutResultBase {
        @AuraEnabled public string data {get; set;}
    }

    global class approveCaseRequestModel {
        @AuraEnabled public caseModel caseModel {get; set;}
    }

    global class approveCaseResult extends CalloutResultBase {
        @AuraEnabled public string data {get; set;}
    }

    global class completeCaseRequestModel {
        @AuraEnabled public caseModel caseModel {get; set;}
    }

    global class completeCaseResult extends CalloutResultBase {
        @AuraEnabled public string data {get; set;}
    }

    public class burndownChartResult extends CalloutResultBase {
        public bdChart data;
    }

    public class bdChart{
        public list<string> lables;
        public list<double> forcasts;
        public list<double> actualUses;
        public list<double> remainingHours;
    }

    global class rejectCaseRequestModel {
        @AuraEnabled public caseModel caseModel {get; set;}
    }

    global class rejectCaseResult extends CalloutResultBase {
        @AuraEnabled public string data {get; set;}
    }

    global class getCasesResult extends CalloutResultBase {
        @AuraEnabled public List<caseModel> data {get; set;}
    }

    global class getCaseDetailsResult extends CalloutResultBase {
        @AuraEnabled public caseModel data {get; set;}
    }

    global class caseRequestModel {
        @AuraEnabled public caseRequestParams filters {get; set;}
    }

    global class caseRequestParams {
        @AuraEnabled public string id {get; set;}
        @AuraEnabled public string caseCreator {get; set;}
        @AuraEnabled public string priority {get; set;}
        @AuraEnabled public List<string> statuses {get; set;}
        @AuraEnabled public string startDate {get; set;}
        @AuraEnabled public string endDate {get; set;}
    }
}