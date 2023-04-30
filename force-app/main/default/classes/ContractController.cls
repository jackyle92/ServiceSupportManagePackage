public with sharing class ContractController {
    
    @AuraEnabled
    public static string getContractChart(){
        try {return ApiManager.getBurndownChart();} catch (Exception e) {throw new AuraHandledException(e.getMessage());}
    }

    /**
     * @author - Jacky
     * @date - 30 April
     * @method - getContract record
     * @discription: call getActiveContract method in ApiManager.getActiveContract
     */
    @AuraEnabled
    public static ApiData.contractModel getContract(){
        try {
            ApiData.getContractDetailResult result = ApiManager.getActiveContract();
            System.debug('==contract data==' + result.data);
            return result.data;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}