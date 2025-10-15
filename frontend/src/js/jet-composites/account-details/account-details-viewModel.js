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

      self.showAccNo = function () {
        self.selectedView('accno');
        console.log("Account no tab:", context.properties.selectedView);

      };

      self.showIBAN = function () {
        self.selectedView('iban');
        console.log("IBAN tab:", context.properties.selectedView);

      };

      var busyContext = Context.getContext(context.element).getBusyContext();
      var options = { "description": "Web Component Startup - Waiting for data" };
      self.busyResolve = busyContext.addBusyState(options);

      self.composite = context.element;

      self.messageText = ko.observable('Hello from account-details');
      self.properties = context.properties;

      self.goToLoginDetails = function () {
        console.log(context.element);


        context.element.dispatchEvent(
          new CustomEvent('onNext', { bubbles: true })
        )
      }
      self.goBacktoAccount = function () {
        console.log(context.element);


        context.element.dispatchEvent(
          new CustomEvent('onBack', { bubbles: true })
        )
      }
      self.accountNumber = ko.observable('');
      self.accError = ko.observable('');
      if (OnboardingStore.accountNumber) {
        console.log("Reloading Account Number from OnboardingStore:", OnboardingStore.accountNumber);
        self.accountNumber(OnboardingStore.accountNumber);
      }

      self.accountNumber.subscribe(function (newVal) {
        OnboardingStore.accountNumber = newVal;
        console.log("Account Number persisted:", newVal);
      });

      self.isAccValid = ko.computed(() => {
        const cleanAcc = self.accountNumber().replace(/-/g, '');
        return cleanAcc.length === 14 && /^[0-9]{14}$/.test(cleanAcc);
      });

      self.formatAccountNo = function (_, event) {
        let value = event.target.value.replace(/[^0-9]/g, '');
        if (value.length > 14) value = value.slice(0, 14);

        let formatted = '';
        for (let i = 0; i < value.length; i++) {
          formatted += value[i];
          if (i === 4) formatted += '-';
        }

        self.accountNumber(formatted);

        if (value.length < 14) {
          self.accError('Account number must be 14 digits long.');
        } else {
          self.accError('');
        }
      };


      
      self.validateAndNextAcc = function () {
        const cleanAcc = self.accountNumber().replace(/-/g, '');
        const cnic = OnboardingStore.cnic;

        if (cleanAcc.length !== 14 || !/^[0-9]{14}$/.test(cleanAcc)) {
          self.accError('Please enter a valid 14-digit Account Number.');
          return;
        }

        if (!cnic) {
          self.accError('CNIC not found. Please go back and verify CNIC first.');
          return;
        }

        self.accError('');

        axios.post('http://localhost:8080/api/onboarding/verify-account', { accountNumber: cleanAcc })
          .then(accountRes => {
            console.log("Account Verification Response:", accountRes.data);

            if (accountRes.status === 200 && accountRes.data.exists === true) {
              
              return axios.post('http://localhost:8080/api/onboarding/verify-user', {
                cnic: cnic,
                accountNumber: cleanAcc
              });
            } else {
              
              const msg = accountRes.data.message || 'Account not found.';
              self.accError(msg);
              return Promise.reject(new Error(msg));
            }
          })
          .then(userRes => {
            console.log("Verify User Response:", userRes.data);
            const user = userRes.data;

            if (user.verified === false) {
              
              self.accError(user.message || 'CNIC and Account Number do not match.');
              return;
            }

            if (user.userAlreadyExists) {
              
              self.accError("This user is already registered. Please log in instead.");
              return;
            }

           
            OnboardingStore.accountNumber = self.accountNumber();
            OnboardingStore.user = user;
            OnboardingStore.userId = userRes.data.userId || OnboardingStore.userId;

            self.goToLoginDetails();
          })
          .catch(error => {
            console.error("Error verifying account/user:", error);

            if (error.response) {
              const msg = typeof error.response.data === 'string'
                ? error.response.data
                : error.response.data.message || 'Verification failed';
              self.accError(msg);
            } else if (error.request) {
              self.accError('No response from server. Please try again.');
            } else if (error.message) {
              self.accError(error.message); 
            } else {
              self.accError('Unexpected error occurred.');
            }
          });
      };



      self.res = componentStrings['account-details'];
      self.busyResolve();
    };



    return AccountDetailsComponentModel;
  });
