public with sharing class ApiManager {

    @AuraEnabled
    public static ApiData.getCasesResult getCases(ApiData.caseRequestModel request) {
        ApiData.clientCredential credential = getCredential();
    
        Map<string, object> mapBody = new Map<string, object>();
        mapBody.put('apiName', 'getCases');
        mapBody.put('clientId', credential.clientId);
        mapBody.put('clientSecretKey', credential.clientSecretKey);
        mapBody.put('payload', request.filters);
        string jsonBody = Json.serialize(mapBody);
        
        actionBase action = new actionBase();
        return (ApiData.getCasesResult)action.execute(ApiData.getCasesResult.class, credential.serviceURL, 'POST', getDefaultHeader(), jsonBody);
    }

    @AuraEnabled
    public static ApiData.getCaseDetailsResult getCaseDetails(ApiData.caseRequestModel request) {
        ApiData.clientCredential credential = getCredential();
        Map<string, object> mapBody = buildBody(credential, 'getCaseDetails', request.filters);
        string jsonBody = Json.serialize(mapBody);
        
        actionBase action = new actionBase();
        return (ApiData.getCaseDetailsResult)action.execute(ApiData.getCaseDetailsResult.class, credential.serviceURL, 'POST', getDefaultHeader(), jsonBody);
    }

    // Jacky - 30 April 2023 - Call getActiveContract method in ApiManager.getActiveContract
    // Hilbert - 21 Oct 2023 - Exception Handling
    @AuraEnabled
    public static ApiData.getContractDetailResult getActiveContract(){
        try {
            ApiData.clientCredential credential = getCredential();
            Map<string, object> mapBody = buildBody(credential, 'getActiveContract', '');
            string jsonBody = JSON.serialize(mapBody);

            System.debug('== jsonBody =='  + jsonBody);

            actionBase action = new actionBase();
            return (ApiData.getContractDetailResult)action.execute(ApiData.getContractDetailResult.class, credential.serviceURL, 'POST', getDefaultHeader(), jsonBody);
        } catch (AuraHandledException e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    // Hilbert - 21 Oct 2023 - Exception Handling
    public static string getBurndownChart(string chartType) {
        try {
            ApiData.clientCredential credential = getCredential();
            Map<string, object> mapBody = buildBody(credential, 'getBurnoutChart', chartType);
            string jsonBody = Json.serialize(mapBody);
             
            actionBase action = new actionBase();
    
            ApiData.burndownChartResult ret = (ApiData.burndownChartResult)action.execute(ApiData.burndownChartResult.class, credential.serviceURL, 'POST', getDefaultHeader(), jsonBody);
            system.debug('ret '+ret);
            return JSON.serialize(ret.data);
        } catch (AuraHandledException e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static ApiData.submitCaseResult submitCases(ApiData.submitCaseRequestModel request){
        ApiData.clientCredential credential = getCredential();
        Map<string, object> mapBody = buildBody(credential, 'createCase', request.caseModel);
        string jsonBody = Json.serialize(mapBody);
        
        actionBase action = new actionBase();
        return (ApiData.submitCaseResult)action.execute(ApiData.submitCaseResult.class, credential.serviceURL, 'POST', getDefaultHeader(), jsonBody);
    }

    @AuraEnabled
    public static ApiData.updateCaseResult updateCase(ApiData.updateCaseRequestModel request){
        ApiData.clientCredential credential = getCredential();
        Map<string, object> mapBody = buildBody(credential, 'updateCase', request.caseModel);
        string jsonBody = Json.serialize(mapBody);
        
        actionBase action = new actionBase();
        return (ApiData.updateCaseResult)action.execute(ApiData.updateCaseResult.class, credential.serviceURL, 'POST', getDefaultHeader(), jsonBody);
    }

    @AuraEnabled
    public static ApiData.completeCaseResult completeCase(ApiData.completeCaseRequestModel request){
        ApiData.clientCredential credential = getCredential();
        Map<string, object> mapBody = buildBody(credential, 'completeCase', request.caseModel);
        string jsonBody = Json.serialize(mapBody);
        
        actionBase action = new actionBase();
        return (ApiData.completeCaseResult)action.execute(ApiData.completeCaseResult.class, credential.serviceURL, 'POST', getDefaultHeader(), jsonBody);
    }

    @AuraEnabled
    public static ApiData.approveCaseResult approveCase(ApiData.approveCaseRequestModel request){
        ApiData.clientCredential credential = getCredential();
        Map<string, object> mapBody = buildBody(credential, 'approveCase', request.caseModel);
        string jsonBody = Json.serialize(mapBody);
        
        actionBase action = new actionBase();
        return (ApiData.approveCaseResult)action.execute(ApiData.approveCaseResult.class, credential.serviceURL, 'POST', getDefaultHeader(), jsonBody);
    }

    @AuraEnabled
    public static ApiData.rejectCaseResult rejectCase(ApiData.rejectCaseRequestModel request){
        ApiData.clientCredential credential = getCredential();
        Map<string, object> mapBody = buildBody(credential, 'rejectCase', request.caseModel);
        string jsonBody = Json.serialize(mapBody);
        
        actionBase action = new actionBase();
        return (ApiData.rejectCaseResult)action.execute(ApiData.rejectCaseResult.class, credential.serviceURL, 'POST', getDefaultHeader(), jsonBody);
    }

    @AuraEnabled
    public static ApiData.createClientCommunicationResult createClientCommunication(ApiData.createClientCommunicationRequestModel request){
        ApiData.clientCredential credential = getCredential();
        
        Map<string, object> mapBody = buildBody(credential, 'createClientCommunication', request.clientCommunication);
        request.clientCommunication.userName = UserInfo.getFirstName() + ' ' + UserInfo.getLastName();
        string jsonBody = Json.serialize(mapBody);
        
        system.debug('createClientCommunication body:' + jsonBody);
        
        actionBase action = new actionBase();
        return (ApiData.createClientCommunicationResult)action.execute(ApiData.createClientCommunicationResult.class, credential.serviceURL, 'POST', getDefaultHeader(), jsonBody);
    }

    private static map<string, object> buildBody(ApiData.clientCredential credential, string apiName, Object payload) {
        Map<string, object> mapBody = new Map<string, object>();
        mapBody.put('apiName', apiName);
        mapBody.put('clientId', credential.clientId);
        mapBody.put('clientSecretKey', credential.clientSecretKey);
        mapBody.put('payload', payload);

        return mapBody;
    }

    private static Map<string, string> getDefaultHeader() {
        Map<string, string> mapHeader = new Map<string, string>();
        mapHeader.put('Content-Type', 'application/json');
       return mapHeader;
    }

    private static ApiData.clientCredential getCredential() {
        ApiData.clientCredential result = new ApiData.clientCredential();
        List<Connection_Setting__mdt> connections = [SELECT Id, Client_Id__c, Client_Secret_Key__c, Service_URL__c
                                                            FROM Connection_Setting__mdt 
                                                            WHERE DeveloperName = 'CCPCaseCreator' 
                                                                AND Is_Active__c = TRUE];
        if (connections != NULL && !connections.isEmpty()) {
            for(Connection_Setting__mdt connection : connections){
                if(string.IsBlank(result.clientId)) result.clientId = connection.Client_Id__c;
                if(string.IsBlank(result.clientSecretKey)) result.clientSecretKey = connection.Client_Secret_Key__c;
                if(string.IsBlank(result.serviceURL)) result.serviceURL = connection.Service_URL__c;
            }
        }
        return result;
    }

    public virtual class actionBase extends CalloutActionBase {
        public override CalloutResultBase processError(Type resultType, CalloutResultBase result, string response) {
            result = (CalloutResultBase)resultType.newInstance();
            return result;
        }
    }

}