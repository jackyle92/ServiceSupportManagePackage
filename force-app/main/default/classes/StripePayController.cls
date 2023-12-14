public with sharing class StripePayController {
    public StripePayController() {

    }
    @AuraEnabled
    public static String makePayment(String amount, String cardNumber, String expiryDate, String cvc) {
        try {
        // Make a callout to the Node.js endpoint for processing the payment
        String endpointUrl = 'http://localhost:3000/payment'; // Replace with your actual endpoint URL
        String payload = 'amount=' + amount + '&cardNumber=' + cardNumber + '&expiryDate=' + expiryDate + '&cvc=' + cvc;
        
        HttpRequest req = new HttpRequest();
        req.setEndpoint(endpointUrl);
        req.setMethod('POST');
        req.setHeader('Content-Type', 'application/x-www-form-urlencoded');
        req.setBody(payload);

        Http http = new Http();
        HttpResponse res = http.send(req);

        if (res.getStatusCode() == 200) {
            // Payment successful - perform necessary actions (e.g., update records, send email)
            return 'success';
        } else {
            // Payment failed - display error message to the user
            return 'failure';
        }
        } catch (Exception e) {
        // Handle any errors and return 'failure' on failure
        return 'failure';
        }
    }
}