@istest
public with sharing class CaseManagementControllerTest {
    
    @isTest
    static void testSubmitCase() {
        Test.startTest();
        TestMockData mockTest = new TestMockData();
        Test.setMock(HttpCalloutMock.class, mockTest);

        ApiData.caseModel caseModel = new ApiData.caseModel();
        caseModel.subject = 'test subject';
        caseModel.caseType = 'Tranning';
        caseModel.caseCreator = 'test creator';
        caseModel.description = 'test description';
        caseModel.priority = 'Low';
        caseModel.files = new List<ApiData.fileModel>();
        ApiData.fileModel file = new ApiData.fileModel();
        file.pathOnClient = 'test path';
        file.size = 'test size';
        file.title = 'test title';
        file.versionData = 'test data';
        caseModel.files.add(file);

        string result = CaseManagementController.submitCase(JSON.serialize(caseModel));
        System.assertEquals('true', result);
        Test.stopTest();
    }

    @isTest
    static void testUpdateCase() {
        Test.startTest();
        TestMockData mockTest = new TestMockData();
        Test.setMock(HttpCalloutMock.class, mockTest);

        ApiData.caseModel caseModel = new ApiData.caseModel();
        caseModel.id = 'caseId';
        caseModel.subject = 'update subject';
        caseModel.caseType = 'Tranning';
        caseModel.caseCreator = 'update creator';
        caseModel.description = 'update description';
        caseModel.priority = 'Low';
        caseModel.estimationHours = 3;
        caseModel.estimationStatus = 'Approved';
        caseModel.actualSupportHours = 1;
        caseModel.caseNumber = 'caseNumber';
        caseModel.status = 'New';
        caseModel.usedHours = 1;

        string result = CaseManagementController.updateCase(JSON.serialize(caseModel));
        System.assertEquals('true', result);
        Test.stopTest();
    }

    @isTest
    static void testApproveCase() {
        Test.startTest();
        TestMockData mockTest = new TestMockData();
        Test.setMock(HttpCalloutMock.class, mockTest);

        string result = CaseManagementController.approveCase('caseId');
        System.assertEquals('true', result);

        Test.stopTest();
    }

    @isTest
    static void testCompleteCase() {
        Test.startTest();
        TestMockData mockTest = new TestMockData();
        Test.setMock(HttpCalloutMock.class, mockTest);

        string result = CaseManagementController.completeCase('caseId');
        System.assertEquals('true', result);

        Test.stopTest();
    }

    @isTest
    static void testRejectCase() {
        Test.startTest();
        TestMockData mockTest = new TestMockData();
        Test.setMock(HttpCalloutMock.class, mockTest);

        string result = CaseManagementController.rejectCase('caseId');
        System.assertEquals('true', result);

        Test.stopTest();
    }

    @isTest
    static void testGetCases() {
        Test.startTest();
        TestMockData mockTest = new TestMockData();
        Test.setMock(HttpCalloutMock.class, mockTest);
        
        DateTime currentTime = DateTime.now();
        ApiData.caseRequestParams request = new ApiData.caseRequestParams();
        request.priority = 'Low';
        request.statuses = new List<string> {'New'};
        request.caseCreator = 'test creator';
        request.startDate = currentTime.addDays(-3).format();
        request.endDate = currentTime.format();

        List<ApiData.caseModel> caseModels = CaseManagementController.getCases(JSON.serialize(request));
        System.assertEquals(1, caseModels.size());
        System.assertEquals('Low', caseModels.get(0).priority);
        System.assertEquals('New', caseModels.get(0).status);
        System.assertEquals(TRUE, caseModels.get(0).createdDate > currentTime.addDays(-3));
        System.assertEquals(TRUE, caseModels.get(0).createdDate < currentTime);

        Test.stopTest();
    }

    @isTest
    static void testGetCaseDetails() {
        Test.startTest();
        TestMockData mockTest = new TestMockData();
        Test.setMock(HttpCalloutMock.class, mockTest);
        
        ApiData.caseRequestParams request = new ApiData.caseRequestParams();
        request.id = 'caseId';

        ApiData.caseModel caseModel = CaseManagementController.getCaseDetails(JSON.serialize(request));
        System.assertEquals('caseId', caseModel.id);
        
        Test.stopTest();
    }

    @isTest
    static void testCreateClientCommunication() {
        Test.startTest();
        TestMockData mockTest = new TestMockData();
        Test.setMock(HttpCalloutMock.class, mockTest);

        ApiData.clientCommunication clientCommunication = new ApiData.clientCommunication();
        clientCommunication.caseId = 'caseId';
        clientCommunication.question = 'new question';
        clientCommunication.attachmentLink = 'new attachmentLink';
        clientCommunication.answer = 'new answer';
        clientCommunication.userName = UserInfo.getFirstName() + ' ' + UserInfo.getLastName();
        clientCommunication.files = new List<ApiData.fileModel>();
        ApiData.fileModel file = new ApiData.fileModel();
        file.pathOnClient = 'test path';
        file.size = 'test size';
        file.title = 'test title';
        file.versionData = 'test data';
        clientCommunication.files.add(file);

        ApiData.clientCommunication result = CaseManagementController.createClientCommunication(JSON.serialize(clientCommunication));
        System.assertEquals('caseId', result.caseId);
        System.assertEquals('new question', result.question);
        System.assertEquals('new answer', result.answer);
        Test.stopTest();
    }
}