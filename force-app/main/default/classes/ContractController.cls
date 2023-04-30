public with sharing class ContractController {
    
    @AuraEnabled
    public static string getContractChart(){
        try {return ApiManager.getBurndownChart();} catch (Exception e) {throw new AuraHandledException(e.getMessage());}
    }
}