public without sharing class OrderFormController {
    public OrderFormController() {

    }
    
    /**
     * @Description : get Organization Id
     * @return : orgId
     */
    @AuraEnabled(cacheable=true)
    public static String getOrgId() {
        List<Organization> lstOrgId = new List<Organization>();
        lstOrgId = [SELECT Id, Name, instanceName FROM Organization LIMIT 1];

        if (lstOrgId.size() == 1) {
            System.debug(lstOrgId[0].id);
            return lstOrgId[0].Id;
        }
        return null;
    }
}