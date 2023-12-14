global with sharing class TestMockData implements HttpCalloutMock {
    
    public boolean isErrorMode = false;
    
    global HTTPResponse respond(HTTPRequest req) {
        Map<String, Object> untypedObjectMap = (Map<String, Object>)JSON.deserializeUntyped(req.getBody());
        String apiName = (String)untypedObjectMap.get('apiName');

        TestMockDataFactory mockDataFactory = new TestMockDataFactory();
        
        HttpResponse res;
        if (apiName.equalsIgnoreCase('getCases')) {
            res = mockDataFactory.getCasesResponse(req, isErrorMode);
        }
        else if (apiName.equalsIgnoreCase('getCaseDetails')) {
            res = mockDataFactory.getCaseDetailsResponse(req, isErrorMode);
        }
        else if (apiName.equalsIgnoreCase('createCase')) {
            res = mockDataFactory.getCreateCaseResponse(req, isErrorMode);
        }
        else if (apiName.equalsIgnoreCase('updateCase')) {
            res = mockDataFactory.getUpdateCaseResponse(req, isErrorMode);
        }
        else if (apiName.equalsIgnoreCase('completeCase')) {
            res = mockDataFactory.getCompleteCaseResponse(req, isErrorMode);
        }
        else if (apiName.equalsIgnoreCase('rejectCase')) {
            res = mockDataFactory.getRejectCaseResponse(req, isErrorMode);
        }
        else if (apiName.equalsIgnoreCase('approveCase')) {
            res = mockDataFactory.getApproveCaseResponse(req, isErrorMode);
        }
        else if (apiName.equalsIgnoreCase('createClientCommunication')) {
            res = mockDataFactory.getCreateClientCommunicationResponse(req, isErrorMode);
        }
        else if (apiName.equalsIgnoreCase('getBurnoutChart')) {
            res = mockDataFactory.getChartResponse(req, isErrorMode);
        }
        else if (apiName.equalsIgnoreCase('getActiveContract')) {
            res = mockDataFactory.getContractResponse(req, isErrorMode);
        }
        return res;
    }
    
    /************************************************ Nested classes ****************************************************/
    public class TestMockDataFactory {
        
        public HTTPResponse getCasesResponse(HTTPRequest req, boolean isErrorMode) { 
            HttpResponse res = new HttpResponse();
            res.setHeader('Content-Type', 'application/json');
            
            ApiData.caseModel caseModel = new ApiData.caseModel();
            caseModel.id = 'caseId';
            caseModel.caseNumber = 'caseNumber';
            caseModel.caseType = 'Tranning';
            caseModel.caseCreator = 'caseCreator';
            caseModel.subject = 'subject';
            caseModel.description = 'description';
            caseModel.priority = 'Low';
            caseModel.status = 'New';
            caseModel.actualSupportHours = 1;
            caseModel.usedHours = 1;
            caseModel.estimationHours = 3;
            caseModel.estimationStatus = 'Approved';
            caseModel.createdDate = Datetime.now().addDays(-1);
            caseModel.files = new List<ApiData.fileModel>();
            ApiData.fileModel file = new ApiData.fileModel();
            file.pathOnClient = 'test path';
            file.size = 'test path';
            file.title = 'test path';
            file.versionData = 'test path';
            caseModel.files.add(file);

            List<ApiData.caseModel> caseModels = new List<ApiData.caseModel>();
            caseModels.add(caseModel);
            
            ApiData.getCasesResult result = new ApiData.getCasesResult();
            result.status = '200';
            result.success = true;
            result.data = caseModels;

            res.setBody(JSON.serialize(result));
            res.setStatusCode(isErrorMode ? 400 : 200);
            return res;
        }

        public HTTPResponse getChartResponse(HTTPRequest req, boolean isErrorMode) { 
            HttpResponse res = new HttpResponse();
            res.setHeader('Content-Type', 'application/json');

            ApiData.bdChart cModel = new ApiData.bdChart();
            cModel.lables = new list<string>{'test chart'};
            cModel.forcasts = new list<double>{6};
            cModel.actualUses = new list<double>{6};
            cModel.remainingHours = new list<double>{6};
            
            ApiData.burndownChartResult result = new ApiData.burndownChartResult();
            result.status = '200';
            result.success = true;
            result.data = cModel;

            res.setBody(JSON.serialize(result));
            res.setStatusCode(isErrorMode ? 400 : 200);
            return res;
        }
        
        public HTTPResponse getCaseDetailsResponse(HTTPRequest req, boolean isErrorMode) {
            HttpResponse res = new HttpResponse();
            res.setHeader('Content-Type', 'application/json');
            
            ApiData.caseModel caseModel = new ApiData.caseModel();
            caseModel.id = 'caseId';
            caseModel.caseNumber = 'caseNumber';
            caseModel.caseType = 'Tranning';
            caseModel.caseCreator = 'caseCreator';
            caseModel.subject = 'subject';
            caseModel.description = 'description';
            caseModel.priority = 'Low';
            caseModel.status = 'New';
            caseModel.actualSupportHours = 1;
            caseModel.usedHours = 1;
            caseModel.estimationHours = 3;
            caseModel.estimationStatus = 'Approved';
            caseModel.createdDate = Datetime.now().addDays(-1);
            caseModel.files = new List<ApiData.fileModel>();
            ApiData.fileModel file = new ApiData.fileModel();
            file.pathOnClient = 'test path';
            file.size = 'test path';
            file.title = 'test path';
            file.versionData = 'test path';
            caseModel.files.add(file);

            caseModel.clientCommunications = new List<ApiData.clientCommunication>();
            ApiData.clientCommunication clientCommunication = new ApiData.clientCommunication();
            clientCommunication.id = 'clientCommunicationId';
            clientCommunication.caseId = 'caseId';
            clientCommunication.question = 'new question';
            clientCommunication.answer = 'new anwser';
            clientCommunication.userName = UserInfo.getFirstName() + ' ' + UserInfo.getLastName();
            clientCommunication.createdDate = Datetime.now().addDays(-1);
            clientCommunication.files = new List<ApiData.fileModel>();
            ApiData.fileModel file2 = new ApiData.fileModel();
            file2.pathOnClient = 'test path';
            file2.size = 'test path';
            file2.title = 'test path';
            file2.versionData = 'test path';
            clientCommunication.files.add(file2);
            caseModel.clientCommunications.add(clientCommunication);
            
            ApiData.getCaseDetailsResult result = new ApiData.getCaseDetailsResult();
            result.status = '200';
            result.success = true;
            result.data = caseModel;

            res.setBody(Json.serialize(result));
            res.setStatusCode(isErrorMode ? 400 : 200);
            return res;
        }
        
        public HTTPResponse getCreateCaseResponse(HTTPRequest req, boolean isErrorMode) {
            HttpResponse res = new HttpResponse();
            res.setHeader('Content-Type', 'application/json');
            ApiData.submitCaseResult result = new ApiData.submitCaseResult();
            result.status = '200';
            result.success = true;

            result.data = 'true';
            res.setBody(Json.serialize(result));
            res.setStatusCode(isErrorMode ? 400 : 200);
            return res;
        }

        public HTTPResponse getUpdateCaseResponse(HTTPRequest req, boolean isErrorMode) {
            HttpResponse res = new HttpResponse();
            res.setHeader('Content-Type', 'application/json');
            ApiData.submitCaseResult result = new ApiData.submitCaseResult();
            result.status = '200';
            result.success = true;

            result.data = 'true';

            res.setBody(Json.serialize(result));
            res.setStatusCode(isErrorMode ? 400 : 200);
            return res;
        }
        
        public HTTPResponse getRejectCaseResponse(HTTPRequest req, boolean isErrorMode) {
            HttpResponse res = new HttpResponse();
            res.setHeader('Content-Type', 'application/json');
            ApiData.submitCaseResult result = new ApiData.submitCaseResult();
            result.status = '200';
            result.success = true;

            result.data = 'true';

            res.setBody(Json.serialize(result));
            res.setStatusCode(isErrorMode ? 400 : 200);
            return res;
        }
        
        public HTTPResponse getApproveCaseResponse(HTTPRequest req, boolean isErrorMode) {
            HttpResponse res = new HttpResponse();
            res.setHeader('Content-Type', 'application/json');
            ApiData.submitCaseResult result = new ApiData.submitCaseResult();
            result.status = '200';
            result.success = true;

            result.data = 'true';

            res.setBody(Json.serialize(result));
            res.setStatusCode(isErrorMode ? 400 : 200);
            return res;
        }
        public HTTPResponse getCompleteCaseResponse(HTTPRequest req, boolean isErrorMode) {
            HttpResponse res = new HttpResponse();
            res.setHeader('Content-Type', 'application/json');
            ApiData.submitCaseResult result = new ApiData.submitCaseResult();
            result.status = '200';
            result.success = true;

            result.data = 'true';

            res.setBody(Json.serialize(result));
            res.setStatusCode(isErrorMode ? 400 : 200);
            return res;
        }
        
        public HTTPResponse getCreateClientCommunicationResponse(HTTPRequest req, boolean isErrorMode) {
            HttpResponse res = new HttpResponse();
            res.setHeader('Content-Type', 'application/json');

            ApiData.clientCommunication clientCommunication = new ApiData.clientCommunication();
            clientCommunication.id = 'clientCommunicationId';
            clientCommunication.caseId = 'caseId';
            clientCommunication.question = 'new question';
            clientCommunication.answer = 'new answer';
            clientCommunication.userName = UserInfo.getFirstName() + ' ' + UserInfo.getLastName();
            clientCommunication.createdDate = Datetime.now().addDays(-1);
            clientCommunication.files = new List<ApiData.fileModel>();
            ApiData.fileModel file2 = new ApiData.fileModel();
            file2.pathOnClient = 'test path';
            file2.size = 'test path';
            file2.title = 'test path';
            file2.versionData = 'test path';
            clientCommunication.files.add(file2);
            
            ApiData.createClientCommunicationResult result = new ApiData.createClientCommunicationResult();
            result.status = '200';
            result.success = true;
            result.data = clientCommunication;

            res.setBody(Json.serialize(result));
            res.setStatusCode(isErrorMode ? 400 : 200);
            return res;
        }
        
        public HTTPResponse getContractResponse(HTTPRequest req, boolean isErrorMode) { 
            HttpResponse res = new HttpResponse();
            res.setHeader('Content-Type', 'application/json');

            ApiData.contractModel cModel = new ApiData.contractModel();
            cModel.id = '0000x000000AAA0AAO';
            cModel.contractNumber = '00000001';
            cModel.remainingSupportHours = 1.00;
            cModel.contractEndDate = Date.newInstance(2024, 1, 1);
            cModel.contractStartDate = Date.newInstance(2023, 1, 1);
            cModel.contractTerm = 12;
            cModel.status = 'Activated';
            cModel.contractType = 'Prepaid Contract';
            
            ApiData.getContractDetailResult result = new ApiData.getContractDetailResult();
            result.status = '200';
            result.success = true;
            result.data = cModel;

            res.setBody(JSON.serialize(result));
            res.setStatusCode(isErrorMode ? 400 : 200);
            return res;
        }
    }
    
    public class distanceMatrixRequestBody {
        public List<geometry> origins;
        public List<geometry> destinations;
    }
    
    public class geometry {
        public decimal lat;
        public decimal lng;
    }
    
}