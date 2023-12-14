public without sharing class ContractController {
        
    // Hilbert - 20 Oct 2023 - Exception handler is implemented in ApiManager
    @AuraEnabled
    public static string getContractChart(string chartType){
        string result = ApiManager.getBurndownChart(chartType);
        System.debug('==contract chart data==' + result);
        return result;
    }

    // Jacky - 30 April 2023 - Call getActiveContract method in ApiManager.getActiveContract
    // Hilbert - 20 Oct 2023 - Exception handler is implemented in ApiManager
    @AuraEnabled
    public static ApiData.contractModel getContract(){
        ApiData.getContractDetailResult result = ApiManager.getActiveContract();
        System.debug('==contract data==' + result);
        return result.data;
    }

    /**
     * @function getOrgInformationandUser()
     * @param none
     * @return object with org information and user information
     * 
     */

     @AuraEnabled
     public static String getOrgInformationandUser() {
        String orgId = '';
        try {
            // get orgId
            orgId = String.valueOf(UserInfo.getOrganizationId());
            System.debug('OrgId: ' + orgId);


            // get user info
            String userFirstName = UserInfo.getFirstName();
            String userLastName =  UserInfo.getLastName();
            String userEmail = UserInfo.getUserEmail();

            // create object and return it
            ContractController.OrgInformation orgInfo =  new ContractController.OrgInformation(orgId, userEmail, userFirstName, userLastName);

            return JSON.serialize(orgInfo);
        } catch (Exception e) {
            system.debug(e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }
     }
    public class OrgInformation {
        private String orgId {get;set;}
        private String userEmail {get;set;}
        private String userFirstName {get;set;}
        private String userLastName {get;set;}

        public OrgInformation (){
        }
        public OrgInformation(String orgId, String email, String firstName, String lastName) {
            this.orgId = orgId;
            this.userEmail = email;
            this.userFirstName = firstName;
            this.userLastName = lastName;
        }
    }
}