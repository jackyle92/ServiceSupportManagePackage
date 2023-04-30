@istest
private with sharing class ContractControllerTest {
    @isTest
    static void testChartDetails() {
        Test.startTest();
        TestMockData mockTest = new TestMockData();
        Test.setMock(HttpCalloutMock.class, mockTest);
        String s  = ContractController.getContractChart();
        Test.stopTest();
    }
}