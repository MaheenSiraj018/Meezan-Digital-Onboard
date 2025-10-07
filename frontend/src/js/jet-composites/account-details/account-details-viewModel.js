/**
  Copyright (c) 2015, 2025, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/
'use strict';
define(
    ['knockout', 'ojL10n!./resources/nls/account-details-strings', 'ojs/ojcontext', 'ojs/ojknockout'], function (ko, componentStrings, Context) {
    
    function AccountDetailsComponentModel(context) {
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
      //Account Number Observables and Validation
self.accountNumber = ko.observable('');
self.accError = ko.observable('');

// Auto-check validity
self.isAccValid = ko.computed(() => {
  const cleanAcc = self.accountNumber().replace(/-/g, '');
  return cleanAcc.length === 14 && /^[0-9]{14}$/.test(cleanAcc);
});

// Format Account Number (auto-dash, only digits)
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

// Validation when Next is clicked
// self.validateAndNextAcc = function() {
//   const cleanAcc = self.accountNumber().replace(/-/g, '');
//   const cnic = OnboardingStore.cnic;

//   if (cleanAcc.length !== 14) {
//     self.accError('Please enter a valid 14-digit Account Number.');
//     return;
//   }
//   self.accError('');
//   self.goToLoginDetails(); 
// };
// ✅ Validation when Next is clicked
self.validateAndNextAcc = function () {
  const cleanAcc = self.accountNumber().replace(/-/g, '');
  const cnic = OnboardingStore.cnic; // Retrieve CNIC from store

  // Step 1️⃣: Frontend Validation
  if (cleanAcc.length !== 14 || !/^[0-9]{14}$/.test(cleanAcc)) {
    self.accError('Please enter a valid 14-digit Account Number.');
    return;
  }

  if (!cnic) {
    self.accError('CNIC not found. Please go back and verify CNIC first.');
    return;
  }

  self.accError(''); // clear frontend error

  // Step 2️⃣: Call Verify Account API
  axios.post('http://localhost:8080/api/onboarding/verify-account', { accountNumber: cleanAcc })
    .then(accountRes => {
      console.log("✅ Account Verified:", accountRes.data);

      // Step 3️⃣: Call Verify User API
      return axios.post('http://localhost:8080/api/onboarding/verify-user', {
        cnic: cnic,
        accountNumber: cleanAcc
      });
    })
    .then(userRes => {
      console.log("✅ CNIC + Account Matched:", userRes.data);

      // Save Data Globally
      OnboardingStore.accountNumber = self.accountNumber();
      OnboardingStore.user = userRes.data;
      OnboardingStore.userId = userRes.data.userId || null;

      // Step 4️⃣: Proceed to Next Screen
      self.goToLoginDetails();
    })
    .catch(error => {
      console.error("❌ Error verifying account/user:", error);

      // Handle specific error messages
      if (error.response) {
        const msg = typeof error.response.data === 'string'
          ? error.response.data
          : error.response.data.message || 'Verification failed';
        self.accError(msg);
      } else {
        self.accError('Server error. Please try again.');
      }
    });
};


        self.res = componentStrings['account-details'];
        // Example for parsing context properties
        // if (context.properties.name) {
        //     parse the context properties here
        // }

        //Once all startup and async activities have finished, relocate if there are any async activities
        self.busyResolve();
    };
    
 

    return AccountDetailsComponentModel;
});
