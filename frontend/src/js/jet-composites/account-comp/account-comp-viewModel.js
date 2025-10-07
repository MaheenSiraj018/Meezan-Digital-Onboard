/**
  Copyright (c) 2015, 2025, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/
*/


'use strict';
define(
  ['knockout','ojL10n!./resources/nls/account-comp-strings', 'ojs/ojcontext', 'ojs/ojknockout'],
  function (ko, componentStrings, Context) {

    function AccountCompViewModel(context) {

      var self = this;
      self.selectedView = ko.observable('individual');
      self.activeTabName = ko.observable('Individual');

      self.showIndividual = function () {
        self.selectedView('individual');
        self.activeTabName('Individual');

      };

      self.showSoleProp = function () {
        self.selectedView('sole');
        self.activeTabName('Sole Proprietor');
      };
      self.showDebitCard = function () {
        self.selectedView('debit');
        self.activeTabName('Debit Card');
      };

      self.showSmartWallet = function () {
        self.selectedView('wallet');
        self.activeTabName('Smart Wallet');
      };

      self.showForeignNational = function () {
        self.selectedView('foreign');
        self.activeTabName('Foreign National');
      };




      // At the start of your viewModel constructor
      var busyContext = Context.getContext(context.element).getBusyContext();
      var options = { "description": "Web Component Startup - Waiting for data" };
      self.busyResolve = busyContext.addBusyState(options);

      self.composite = context.element;

      // Example observable
      self.messageText = ko.observable('Hello from account-comp');

      // Localized resources
      self.res = componentStrings['account-comp'];

      // Expose context properties
      self.properties = context.properties;


      self.goToDetails = function () {
        console.log(context.element);


        context.element.dispatchEvent(
          new CustomEvent('onNext', { bubbles: true })
        )
      }

      self.cnicNumber = ko.observable('');
      self.cnicError = ko.observable('');
      OnboardingStore.cnic = self.cnicNumber;
      console.log(OnboardingStore.cnic);

      // Automatically check CNIC validity
      self.isCNICValid = ko.computed(() => {
        const cleanCNIC = self.cnicNumber().replace(/-/g, '');
        return cleanCNIC.length === 13 && /^[0-9]{13}$/.test(cleanCNIC);
      });

      // Format CNIC as user types and disallow alphabets or special chars
      self.formatCNIC = function (_, event) {
        let value = event.target.value.replace(/[^0-9]/g, ''); // remove alphabets & special chars
        if (value.length > 13) value = value.slice(0, 13);     // max 13 digits

        // add dashes at correct positions (5 and 12)
        let formatted = '';
        for (let i = 0; i < value.length; i++) {
          formatted += value[i];
          if (i === 4 || i === 11) formatted += '-';
        }

        self.cnicNumber(formatted);

        // Validation message handling
        if (value.length < 13) {
          self.cnicError('CNIC must be 13 digits long.');
        } else {
          self.cnicError('');
        }
      };

      // Validate on Next button click
      // self.validateAndNext = function () {
      //   const cleanCNIC = self.cnicNumber().replace(/-/g, '');
      //   if (cleanCNIC.length !== 13) {
      //     self.cnicError('Please enter a valid 13-digit CNIC number.');
      //     return;
      //   }
      //   self.cnicError('');
        
      //   self.goToDetails(); // Proceed if valid
      // };
      self.validateAndNext = function () {
  const cleanCNIC = self.cnicNumber().replace(/-/g, '');

  // ✅ Step 1: Frontend Validation
  if (cleanCNIC.length !== 13 || !/^[0-9]{13}$/.test(cleanCNIC)) {
    self.cnicError('Please enter a valid 13-digit CNIC number.');
    return;
  }

  self.cnicError(''); // clear frontend error

  // ✅ Step 2: Backend API Call
  axios.post(`http://localhost:8080/api/onboarding/verify-cnic`, { cnic: cleanCNIC })
    .then(response => {
      console.log("✅ CNIC Verification Response:", response.data);

      // ✅ Backend returns full user object if valid
      if (response.status === 200 && response.data && response.data.cnic) {
        // Save CNIC globally for future screens
        OnboardingStore.cnic = self.cnicNumber();

        // Proceed to next screen
        self.goToDetails();
      } else {
        // Fallback if unexpected response
        self.cnicError('CNIC not found in records.');
      }
    })
    .catch(error => {
      console.error("❌ Error verifying CNIC:", error);

      // ✅ Display actual backend error message if available
      if (error.response) {
        const msg = typeof error.response.data === 'string'
          ? error.response.data
          : error.response.data.message || 'Verification failed';
        self.cnicError(msg);
      } else if (error.request) {
        self.cnicError('No response from server. Please try again.');
      } else {
        self.cnicError('Unexpected error occurred.');
      }
    });
};

      // ✅ Validate on Next button click + backend verification
// self.validateAndNext = function () {
//   const cleanCNIC = self.cnicNumber().replace(/-/g, '');

//   // Step 1: Frontend Validation
//   if (cleanCNIC.length !== 13 || !/^[0-9]{13}$/.test(cleanCNIC)) {
//     self.cnicError('Please enter a valid 13-digit CNIC number.');
//     return;
//   }

//   self.cnicError(''); // clear frontend error

//   // Step 2: Backend API Call
//   axios.post(`http://localhost:8080/api/onboarding/verify-cnic`, { cnic: cleanCNIC })

//     .then(response => {
//       console.log("CNIC Verification Response:", response.data);

//       // Assuming your API returns user object if valid or null if invalid
//       if (response.data && response.data.cnic) {
//         // Save CNIC globally for future screens
//         OnboardingStore.cnic = self.cnicNumber();

//         // Proceed to next screen
//         self.goToDetails();
//       } else {
//         self.cnicError('CNIC not found in records.');
//       }
//     })
//     .catch(error => {
//       console.error("Error verifying CNIC:", error);
//       self.cnicError('Server error. Please try again.');
//     });
// };


      // Once all startup and async activities have finished
      self.busyResolve();
    }


    return AccountCompViewModel;
  }
);
