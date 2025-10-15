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


      var busyContext = Context.getContext(context.element).getBusyContext();
      var options = { "description": "Web Component Startup - Waiting for data" };
      self.busyResolve = busyContext.addBusyState(options);

      self.composite = context.element;

      self.messageText = ko.observable('Hello from account-comp');

      self.res = componentStrings['account-comp'];

      self.properties = context.properties;


      self.goToDetails = function () {
        console.log(context.element);


        context.element.dispatchEvent(
          new CustomEvent('onNext', { bubbles: true })
        )
      }

      self.cnicNumber = ko.observable('');
      self.cnicError = ko.observable('');

      if (OnboardingStore.cnic) {
        console.log("Reloading CNIC from OnboardingStore:", OnboardingStore.cnic);
        self.cnicNumber(OnboardingStore.cnic);
      }

      self.cnicNumber.subscribe(function (newVal) {
        OnboardingStore.cnic = newVal;
        console.log("CNIC persisted:", newVal);
      });

      self.isCNICValid = ko.computed(() => {
        const value = self.cnicNumber ? self.cnicNumber() : ''; 
  const cleanCNIC = typeof value === 'string' ? value.replace(/-/g, '') : '';
  return cleanCNIC.length === 13 && /^[0-9]{13}$/.test(cleanCNIC);
      });

      self.formatCNIC = function (_, event) {
        let value = event.target.value.replace(/[^0-9]/g, ''); 
        if (value.length > 13) value = value.slice(0, 13);     

        let formatted = '';
        for (let i = 0; i < value.length; i++) {
          formatted += value[i];
          if (i === 4 || i === 11) formatted += '-';
        }

        self.cnicNumber(formatted);

        if (value.length < 13) {
          self.cnicError('CNIC must be 13 digits long.');
        } else {
          self.cnicError('');
        }
      };

      self.validateAndNext = function () {
  const cleanCNIC = self.cnicNumber().replace(/-/g, '');

  if (cleanCNIC.length !== 13 || !/^[0-9]{13}$/.test(cleanCNIC)) {
    self.cnicError('Please enter a valid 13-digit CNIC number.');
    return;
  }

  self.cnicError(''); 

  axios.post(`http://localhost:8080/api/onboarding/verify-cnic`, { cnic: cleanCNIC })
    .then(response => {
      console.log("CNIC Verification Response:", response.data);

      if (response.status === 200 && response.data.exists === true) {
         OnboardingStore.user = response.data;

      OnboardingStore.userId = response.data.id;

      OnboardingStore.cnic = self.cnicNumber();
      

      console.log("Stored userId:", OnboardingStore.userId);

        self.goToDetails();
      } else {
        self.cnicError('CNIC not found in records.');
      }
    })
    .catch(error => {
      console.error("Error verifying CNIC:", error);

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
};      self.busyResolve();
    }


    return AccountCompViewModel;
  }
);
