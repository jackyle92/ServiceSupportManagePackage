public without sharing class StripePaymentController {


    public static string customerId;
    public static final String CUSTOMER_URL = 'https://api.stripe.com/v1/customers';
    public static final String PAYMENT_URL = 'https://api.stripe.com/v1/payment_methods';
    
    public StripePaymentController() {

    }

    @AuraEnabled
    public static AuraResponse chargeUsingStripe(string wrapperString){
        AuraResponse auraResponse;
        Wrapper wrapper;

        try {
            if(string.isNotBlank(wrapperString)) {
                wrapper = (Wrapper)JSON.deserialize(wrapperString, Wrapper.class);
            }
            if(wrapper != null) {

                // get key
                string key = getSecretKey();

                if(String.isNotBlank(key)) {
                    // create Customer in Stripe
                    APIResponse customerResponse = createCustomerInStripe(wrapper, key);
    
                    if(customerResponse.isSuccess) {
                        customerId = customerResponse.reponse;
                        // create Payment Method in Stripe
                        APIResponse paymentMethodResponse = createPaymentMethodInStripe(wrapper, key, false);
        
                        // create payment method attached to customer 
        
                        // create payment initiate in stripe

                    }

                }

            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        
        return new AuraResponse(false, 'wrong', '');
    }


    /**
     * @function: createPaymentMethodInStripe
     * @return: APIResponse
     * @param: String secreteKey, Wrapper_object Wrapper, Boolean isAttachedToCustomer
     */
    public static APIResponse createPaymentMethodInStripe(Wrapper leadObject, String secretKey, Boolean isAttachedCall) {
        String type = 'pm_card_visa';

        String params;

        Http http = new Http();
        HttpRequest req = new HttpRequest();
        req.setEndpoint(PAYMENT_URL);
        req.setMethod('POST');
        req.setHeader('Authorization','Bearer ' + secretKey);
        req.setHeader('Content-Type', 'application/x-www-form-urlencoded');

        params = 'type=card' + '&card[number]=' + leadObject.cardNumber + '&card[exp_month]=' + leadObject.cardExpiryMonth + '&card[exp_year]=' + leadObject.cardExpiryYear;

        req.setBody(params);

        HttpResponse res = http.send(req);
        System.debug('payment method res: ' + res);
        APIresponse apiResponse = validateResponse(res);

        return apiResponse;
    }


    public static APIResponse createCustomerInStripe(StripePaymentController.Wrapper leadObject, String key){
        String name = leadObject.name;
        String email = leadObject.email;
        String description = leadObject.description;

        Http http = new Http();

        HttpRequest req = new HttpRequest();
        // set params
        String params;
        req.setEndpoint(CUSTOMER_URL);
        req.setMethod('POST');
        req.setHeader('Authorization', 'Bearer '+ key);
        req.setHeader('Content-Type', 'application/x-www-form-urlencoded');

        params = 'email=' + email + '&name=' + name;
        params +=  String.isNotBlank(description) ? '&description=' + description : '';

        req.setBody(params);

        HttpResponse res = http.send(req);
        System.debug(res);
        //create auraresponse to return
        APIResponse apiRespnose = validateResponse(res);

        return apiRespnose;
    }

    public static APIResponse validateResponse(HttpResponse res) {
        APIResponse apiResponse = new APIResponse();
        Map<String,Object> mapOfBody = new Map<String, Object>();

        if(res.getStatusCode() == 200) {
            apiResponse.isSuccess = true;
            apiResponse.message = res.getBody();
            System.debug('response body: ' + res.getBody());
            mapOfBody = (Map<String, Object>)JSON.deserializeUntyped(res.getBody());
            if(mapOfBody != null && !mapOfBody.isEmpty()){
                apiResponse.reponse = String.valueOf(mapOfBody.get('id'));
            }

        } else {
            apiResponse.isSuccess = false;
            apiResponse.message = res.getBody();
        }
        System.debug('apiReponse: ' + apiResponse);
        return apiResponse;
    }

    public static string getSecretKey() {
        String key;
        Stripe_Payment_Setting__mdt stripeDetail = [SELECT Id, DeveloperName, Secret_Key__c FROM Stripe_Payment_Setting__mdt WHERE DeveloperName = 'Stripe_Payment_Setting'];

        if(stripeDetail != null) {
            key = stripeDetail.Secret_Key__c;
        }
        return key;
    }


    public class Wrapper {
        public string id;
        public string cardNumber;
        public string name;
        public string email;
        public integer cardExpiryMonth;
        public integer cardExpiryYear;
        public Double amount;
        public String currencyCode;
        public string description;
        public string stripeId;
        public string cardType;
        public integer cvv;

        public Wrapper (String id, String cardNumber, String name, String email, String stripeId, String cardType, Integer cvv, Double amount, String currencyCode, String description, Integer cardExpiryMonth, Integer cardExpiryYear) {
            this.id = id;
            this.cardNumber = cardNumber;
            this.name = name;
            this.email = email;
            this.cardExpiryMonth = cardExpiryMonth;
            this.cardExpiryYear = cardExpiryYear;
            this.amount = amount;
            this.currencyCode = currencyCode;
            this.description = description;
            this.stripeId = stripeId;
            this.cardType = cardType;
            this.cvv = cvv;
        }
    }

    public class AuraResponse {
        @auraEnabled public Boolean isSuccess;
        @auraEnabled public String message;
        @auraEnabled public String response;

        public AuraResponse() {

        }

        public AuraResponse (Boolean isSuccess, String message, String response) {
            this.isSuccess = isSuccess;
            this.message = message;
            this.response = response;
        }

    }
}