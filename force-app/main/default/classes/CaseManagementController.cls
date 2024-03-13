global class CaseManagementController{
    @AuraEnabled
    public static string submitCase(string requestStr){
        ApiData.caseModel caseModel = (ApiData.caseModel)JSON.deserialize(requestStr, ApiData.caseModel.class);
        ApiData.submitCaseRequestModel request = new ApiData.submitCaseRequestModel();
        request.caseModel = caseModel;
        request.caseModel.caseCreator = UserInfo.getFirstName() + ' ' + UserInfo.getLastName();
        System.debug('UserInfo submitCasesubmitCase: ' + UserInfo.getFirstName() + '----' + UserInfo.getLastName());
        System.debug('caseModel submitCasesubmitCase: ' + request.caseModel);
        ApiData.submitCaseResult result = ApiManager.submitCases(request);
        System.debug('result.data submitCasesubmitCase: ' + result.data);
        return result.data;
    }

    @AuraEnabled
    public static string updateCase(string requestStr){
        ApiData.caseModel caseModel = (ApiData.caseModel)JSON.deserialize(requestStr, ApiData.caseModel.class);
        ApiData.updateCaseRequestModel request = new ApiData.updateCaseRequestModel();
        request.caseModel = caseModel;
        System.debug('caseModel----------- ' + caseModel);
        ApiData.updateCaseResult result = ApiManager.updateCase(request);
        System.debug('#updateCaseResult#' + result);

        return result.data;
    }

    @AuraEnabled
    public static string approveCase(string caseId){
        ApiData.approveCaseRequestModel request = new ApiData.approveCaseRequestModel();
        request.caseModel = new ApiData.caseModel();
        request.caseModel.id = caseId;
        ApiData.approveCaseResult result = ApiManager.approveCase(request);
        System.debug('#approveCaseResult#' + result);

        return result.data;
    }

    @AuraEnabled
    public static string completeCase(string caseId){
        ApiData.completeCaseRequestModel request = new ApiData.completeCaseRequestModel();
        request.caseModel = new ApiData.caseModel();
        request.caseModel.id = caseId;
        ApiData.completeCaseResult result = ApiManager.completeCase(request);
        System.debug('#completeCaseResult#' + result);

        return result.data;
    }

    @AuraEnabled
    public static string rejectCase(string caseId){
        ApiData.rejectCaseRequestModel request = new ApiData.rejectCaseRequestModel();
        request.caseModel = new ApiData.caseModel();
        request.caseModel.id = caseId;
        ApiData.rejectCaseResult result = ApiManager.rejectCase(request);
        System.debug('#rejectCaseResult#' + result);

        return result.data;
    }

    @AuraEnabled
    public static List<ApiData.caseModel> getCases(string requestStr){
        ApiData.caseRequestParams filters = (ApiData.caseRequestParams)JSON.deserialize(requestStr, ApiData.caseRequestParams.class);
        ApiData.caseRequestModel request = new ApiData.caseRequestModel();
        request.filters = filters;
        ApiData.getCasesResult result = ApiManager.getCases(request);
        System.debug('#getCasesResult#' + result);

        return result.data;
    }

    @AuraEnabled
    public static ApiData.caseModel getCaseDetails(string caseId){
        ApiData.caseRequestModel request = new ApiData.caseRequestModel();
        request.filters = new ApiData.caseRequestParams();
        request.filters.id = caseId;
        ApiData.getCaseDetailsResult result = ApiManager.getCaseDetails(request);
        System.debug('#getCaseDetails#' + result);

        return result.data;
    }

    @AuraEnabled
    public static ApiData.clientCommunication createClientCommunication(string requestStr){
        ApiData.clientCommunication clientCommunication = (ApiData.clientCommunication)JSON.deserialize(requestStr, ApiData.clientCommunication.class);
        ApiData.createClientCommunicationRequestModel request = new ApiData.createClientCommunicationRequestModel();
        request.clientCommunication = clientCommunication;
        system.debug('requestStr: ' + requestStr);
        ApiData.createClientCommunicationResult result = ApiManager.createClientCommunication(request);
        System.debug('#createClientCommunication#' + result);

        return result.data;
    }

}