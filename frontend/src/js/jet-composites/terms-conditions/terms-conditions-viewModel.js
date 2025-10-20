/**
  Copyright (c) 2015, 2025, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/
'use strict';
define(
    ['knockout', 'ojL10n!./resources/nls/terms-conditions-strings', 'ojs/ojcontext', 'ojs/ojknockout'], function (ko, componentStrings, Context) {
    
    function ExampleComponentModel(context) {
        var self = this;
        
        //At the start of your viewModel constructor
        var busyContext = Context.getContext(context.element).getBusyContext();
        var options = {"description": "Web Component Startup - Waiting for data"};
        self.busyResolve = busyContext.addBusyState(options);

        self.composite = context.element;

        self.goToRegistration = function(){
        const payload = {
        cnic: OnboardingStore.cnic,    
        username: OnboardingStore.username,
        password: OnboardingStore.password  
    };

    if (!payload.cnic || !payload.username || !payload.password) {
        alert("Missing user information. Please go back and complete all required fields.");
        return;
    }

    console.log("Sending Create Account Request:", payload);
    console.log("Global Store before Create Account:", OnboardingStore);

    axios.post('http://localhost:8080/api/onboarding/create-user', payload)
        .then(response => {
            console.log("Account Created Successfully:", response.data);
            
            OnboardingStore.accountStatus = "REGISTERED";
            
            delete OnboardingStore.password;
            
            context.element.dispatchEvent(new CustomEvent('onNext', { bubbles: true }));
        })
        .catch(error => {
            console.error("Error creating account:", error);
            self.isLoading(false);
            
            if (error.response) {
                const msg = typeof error.response.data === 'string' 
                    ? error.response.data 
                    : error.response.data.message || 'Account creation failed';
                alert(`Error: ${msg}`);
            } else {
                alert("Server error. Please try again later.");
            }
        });
      }
      
      self.goBacktoLoginDetails2 = function(){
        console.log(context.element);
        
        
        context.element.dispatchEvent(
          new CustomEvent('onBack', {bubbles: true})
        )
      }

        self.messageText = ko.observable('Hello from terms-conditions');
        self.properties = context.properties;
        self.res = componentStrings['terms-conditions'];
        
        self.busyResolve();
    };
    
    //Lifecycle methods - uncomment and implement if necessary 
    //ExampleComponentModel.prototype.activated = function(context){
    //};

    //ExampleComponentModel.prototype.connected = function(context){
    //};

    //ExampleComponentModel.prototype.bindingsApplied = function(context){
    //};

    //ExampleComponentModel.prototype.disconnected = function(context){
    //};

    //ExampleComponentModel.prototype.propertyChanged = function(context){
    //};

    return ExampleComponentModel;
});
