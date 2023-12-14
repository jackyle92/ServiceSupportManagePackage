@istest
private with sharing class ContractControllerTest {
    @isTest
    static void testGetContractChartWithoutErr() {
        Test.startTest();
        TestMockData mockTest = new TestMockData();
        mockTest.isErrorMode = false;
        Test.setMock(HttpCalloutMock.class, mockTest);
        String sWithoutError = ContractController.getContractChart('chartMonth');
        Test.stopTest(); 
    }

    @isTest
    static void testGetContractChartWithErr() {
        Test.startTest();
        TestMockData mockTest = new TestMockData();
        mockTest.isErrorMode = true;
        Test.setMock(HttpCalloutMock.class, mockTest);
        String sWithError = ContractController.getContractChart('chartMonth');
        Test.stopTest();
    }

    @isTest
    static void testGetContractWithoutErr() {
        Test.startTest();
        TestMockData mockTest = new TestMockData();
        mockTest.isErrorMode = false;
        Test.setMock(HttpCalloutMock.class, mockTest);
        ApiData.contractModel sWithoutError = ContractController.getContract();
        Test.stopTest();
    }

    @isTest
    static void testGetContractWithErr() {
        Test.startTest();
        TestMockData mockTest = new TestMockData();
        mockTest.isErrorMode = true;
        Test.setMock(HttpCalloutMock.class, mockTest);
        ApiData.contractModel sWithoutError = ContractController.getContract();
        Test.stopTest();
    }
}