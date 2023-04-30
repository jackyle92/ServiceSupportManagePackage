public with sharing abstract class CalloutActionBase {

    public static final integer DEFAULT_TIMEOUT = 60000;

    public virtual CalloutResultBase execute(Type resultType, string endPoint, string httpMethod, Map<string, string> mapHeader, string body) {
        CalloutResultBase result;
        try {
            Http h = new Http();
            HttpRequest req = prepareHttpRequest(endPoint, httpMethod, mapHeader, body);
            
            system.debug('#req.getBody()# ' + req.getBody());
            
            HttpResponse res = h.send(req);
            string response = res.getBody();
            string status = res.getStatus();
            integer statusCode = res.getStatusCode();
            system.debug('#body# ' + body);
            system.debug('#request# ' + req);
            system.debug('#response: ' + response);
            if (statusCode >= 400) {
                result = processError(resultType, result, response);
                result.success = false;
            }
            else {
                result = processResponse(resultType, result, response);
                result.success = true;
            }
            result.status = status;
            result.statusCode = statusCode;
        }
        catch (Exception ex) {
            result = (CalloutResultBase)resultType.newInstance();
            result.success = false;
            result.message = ex.getMessage() + ' - ' + ex.getStackTraceString();
        }
        return result;
    }
    protected abstract CalloutResultBase processError(Type resultType, CalloutResultBase result, string response);
    protected virtual CalloutResultBase processResponse(Type resultType, CalloutResultBase result, string response) {
        return (CalloutResultBase)Json.deserialize(response, resultType);
    }
    /******************************************* Private methods *******************************************/
    private HttpRequest prepareHttpRequest(string endPoint, string httpMethod, Map<string, string> mapHeader, string body) {
        HttpRequest request = new Httprequest();
        request.setEndpoint(endPoint);
        if (!string.isBlank(body)) {
            request.setBody(body);
        }
        else {
            request.setHeader('Content-length', '0');
        }
        if (httpMethod == 'PATCH') {
            request.setHeader('X-HTTP-Method-Override', 'PATCH');
        }
        for (string headerKey : mapHeader.keySet()) {
            string headerValue = mapHeader.get(headerKey);
            request.setHeader(headerKey, headerValue);
        }
        httpMethod = httpMethod == 'PATCH' ? 'POST' : httpMethod;
        request.setMethod(httpMethod);
        request.setTimeout(DEFAULT_TIMEOUT);
        return request;
    }

}