/**
  Copyright (c) 2015, 2025, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/
'use strict';
define(
  ['knockout', 'ojL10n!./resources/nls/login-details-strings', 'ojs/ojcontext', 'ojs/ojknockout'], function (ko, componentStrings, Context) {


    function ExampleComponentModel(context) {
      var self = this;

      function debounce(fn, delay) {
        let timer;
        return function (...args) {
          clearTimeout(timer);
          timer = setTimeout(() => fn.apply(this, args), delay);
        };
      }

      var busyContext = Context.getContext(context.element).getBusyContext();
      var options = { "description": "Web Component Startup - Waiting for data" };
      self.busyResolve = busyContext.addBusyState(options);

      self.composite = context.element;

      self.goToLoginDetails2 = function () {
        context.element.dispatchEvent(new CustomEvent('onNext', { bubbles: true }));
      };
      self.goBacktoAccountDetails = function () {
        context.element.dispatchEvent(new CustomEvent('onBack', { bubbles: true }));
      };

      self.username = ko.observable('');
      self.usernameMessage = ko.observable('');
      self.isUsernameValid = ko.observable(false);
      self.isUsernameInvalid = ko.observable(false);

      if (OnboardingStore.username) {
        console.log("Reloading username from global store:", OnboardingStore.username);
        self.username(OnboardingStore.username);
      }

      self.username.subscribe(function (newVal) {
        OnboardingStore.username = newVal;
        console.log("Username persisted:", newVal);
      });

      const userId = window.OnboardingStore?.userId;
      if (!OnboardingStore.username && userId) {
        console.log("📡 Fetching contact number as default username for:", userId);
        axios.get(`http://localhost:8080/api/onboarding/user-info/${userId}`)
          .then(response => {
            const contactNo = response.data.contactNumber;
            if (contactNo) {
              self.username(contactNo);          
              OnboardingStore.username = contactNo; 
              console.log("Default username (contact number):", contactNo);
              self.checkUsernameAvailability(contactNo);
            }
          })
          .catch(error => console.error("Error fetching contact number:", error));
      }

      self.checkUsernameAvailability = debounce(function (value) {
        if (!value || value.length < 8 || value.length > 16) {
          self.usernameMessage('Username must be 8–16 characters.');
          self.isUsernameValid(false);
          self.isUsernameInvalid(true);
          return;
        }

        axios.get(`http://localhost:8080/api/onboarding/check-username`, {
          params: { username: value }
        })
          .then(response => {
            const available = response.data.available;
            if (available) {
              self.usernameMessage('Username available!');
              self.isUsernameValid(true);
              self.isUsernameInvalid(false);

              OnboardingStore.username = value;
              console.log("Stored username:", OnboardingStore.username);
            } else {
              self.usernameMessage('Username already taken.');
              self.isUsernameValid(false);
              self.isUsernameInvalid(true);
            }
          })
          .catch(error => {
            console.error("Error checking username:", error);
            self.usernameMessage('Server error. Try again.');
            self.isUsernameValid(false);
            self.isUsernameInvalid(true);
          });
      }, 800);

      self.validateUsername = function (_, event) {
        let value = event.target.value.trim();

        if (value.length > 16) {
          value = value.substring(0, 16);
          event.target.value = value;
        }

        self.username(value);
        self.checkUsernameAvailability(value);
      };

      self.res = componentStrings['login-details'];

      self.busyResolve();
    }


    return ExampleComponentModel;
  });
