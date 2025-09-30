/**
  Copyright (c) 2015, 2025, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/
'use strict';
define(
    ['knockout', 'ojL10n!./resources/nls/account-details-strings', 'ojs/ojcontext', 'ojs/ojknockout'], function (ko, componentStrings, Context) {
    
    function ExampleComponentModel(context) {
        var self = this;

    self.selectedView = ko.observable('accno');
    
    self.showAccNo = function() {
      self.selectedView('accno');
      console.log("Account no tab:", context.properties.selectedView);

    };
    
    self.showIBAN = function() {
      self.selectedView('iban');
      console.log("IBAN tab:", context.properties.selectedView);

    };
        
        //At the start of your viewModel constructor
        var busyContext = Context.getContext(context.element).getBusyContext();
        var options = {"description": "Web Component Startup - Waiting for data"};
        self.busyResolve = busyContext.addBusyState(options);

        self.composite = context.element;

        //Example observable
        self.messageText = ko.observable('Hello from account-details');
        self.properties = context.properties;

        self.goToLoginDetails = function(){
        console.log(context.element);
        
        
        context.element.dispatchEvent(
          new CustomEvent('onNext', {bubbles: true})
        )
      }
      self.goBacktoAccount = function(){
        console.log(context.element);
        
        
        context.element.dispatchEvent(
          new CustomEvent('onBack', {bubbles: true})
        )
      }
      // ✅ Account Number Observables and Validation
self.accountNumber = ko.observable('');
self.accError = ko.observable('');

// Auto-check validity
self.isAccValid = ko.computed(() => {
  const cleanAcc = self.accountNumber().replace(/-/g, '');
  return cleanAcc.length === 14 && /^[0-9]{14}$/.test(cleanAcc);
});

// ✅ Format Account Number (auto-dash, only digits)
self.formatAccountNo = function(_, event) {
  let value = event.target.value.replace(/[^0-9]/g, ''); // allow only digits
  if (value.length > 14) value = value.slice(0, 14);     // restrict to 14 digits

  // Add dash after 5 digits → XXXXX-XXXXXXXXX
  let formatted = '';
  for (let i = 0; i < value.length; i++) {
    formatted += value[i];
    if (i === 4) formatted += '-';
  }

  self.accountNumber(formatted);

  // Error message handling
  if (value.length < 14) {
    self.accError('Account number must be 14 digits long.');
  } else {
    self.accError('');
  }
};

// ✅ Validation when Next is clicked
self.validateAndNextAcc = function() {
  const cleanAcc = self.accountNumber().replace(/-/g, '');
  if (cleanAcc.length !== 14) {
    self.accError('Please enter a valid 14-digit Account Number.');
    return;
  }
  self.accError('');
  self.goToLoginDetails(); // Proceed if valid
};

        self.res = componentStrings['account-details'];
        // Example for parsing context properties
        // if (context.properties.name) {
        //     parse the context properties here
        // }

        //Once all startup and async activities have finished, relocate if there are any async activities
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
