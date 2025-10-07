/**
  Copyright (c) 2015, 2025, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/
'use strict';
define(
  ['knockout', 'ojL10n!./resources/nls/login-details-strings', 'ojs/ojcontext', 'ojs/ojknockout'], function (ko, componentStrings, Context) {

    // function ExampleComponentModel(context) {
    //   var self = this;
    //   function debounce(fn, delay) {
    //     let timer;
    //     return function (...args) {
    //       clearTimeout(timer);
    //       timer = setTimeout(() => fn.apply(this, args), delay);
    //     };
    //   }


    //   var busyContext = Context.getContext(context.element).getBusyContext();
    //   var options = { "description": "Web Component Startup - Waiting for data" };
    //   self.busyResolve = busyContext.addBusyState(options);

    //   self.composite = context.element;
    //   self.goToLoginDetails2 = function () {
    //     console.log(context.element);


    //     context.element.dispatchEvent(
    //       new CustomEvent('onNext', { bubbles: true })
    //     )
    //   }
    //   self.goBacktoAccountDetails = function () {
    //     console.log(context.element);


    //     context.element.dispatchEvent(
    //       new CustomEvent('onBack', { bubbles: true })
    //     )
    //   }
    //   self.username = ko.observable('');
    //   self.usernameMessage = ko.observable('');
    //   self.isUsernameValid = ko.observable(false);
    //   self.isUsernameInvalid = ko.observable(false);

    //   self.validateUsername = function (_, event) {
    //     let value = event.target.value.trim();

    //     if (value.length > 16) {
    //       value = value.substring(0, 16);
    //       event.target.value = value;
    //     }

    //     self.username(value);

    //     const isValid = value.length >= 8 && value.length <= 16;

    //     self.isUsernameValid(isValid && value !== '');
    //     self.isUsernameInvalid(!isValid && value !== '');
    //   };

    //   self.res = componentStrings['login-details'];

    //   self.usernameMessage = ko.observable('');
    //   self.usernameStatusClass = ko.observable('');

    //   self.username.subscribe((newVal) => {
    //     if (newVal === '') {
    //       self.usernameMessage('');
    //       self.usernameStatusClass('');
    //       return;
    //     }

    //     const isValid = newVal.length >= 8 && newVal.length <= 16;

    //     if (isValid) {
    //       self.usernameMessage('Username Available!');
    //       self.usernameStatusClass('username-available');
    //     } else {
    //       self.usernameMessage('Username Unavailable!');
    //       self.usernameStatusClass('username-unavailable');
    //     }
    //   });


    //   self.busyResolve();
    // };
    function ExampleComponentModel(context) {
  var self = this;

  // ✅ 1️⃣ Helper: Debounce function to limit API calls
  function debounce(fn, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  // ✅ 2️⃣ Busy Context (leave as-is)
  var busyContext = Context.getContext(context.element).getBusyContext();
  var options = { "description": "Web Component Startup - Waiting for data" };
  self.busyResolve = busyContext.addBusyState(options);

  self.composite = context.element;

  // ✅ 3️⃣ Navigation Events (keep same)
  self.goToLoginDetails2 = function () {
    context.element.dispatchEvent(new CustomEvent('onNext', { bubbles: true }));
  };
  self.goBacktoAccountDetails = function () {
    context.element.dispatchEvent(new CustomEvent('onBack', { bubbles: true }));
  };

  // ✅ 4️⃣ Observables for Username
  self.username = ko.observable('');
  self.usernameMessage = ko.observable('');
  self.isUsernameValid = ko.observable(false);
  self.isUsernameInvalid = ko.observable(false);

  // ✅ 5️⃣ Backend API (debounced)
  self.checkUsernameAvailability = debounce(function (value) {
    // Basic length validation before hitting API
    if (!value || value.length < 8 || value.length > 16) {
      self.usernameMessage('Username must be 8–16 characters.');
      self.isUsernameValid(false);
      self.isUsernameInvalid(true);
      return;
    }

    // ✅ Call backend API
    axios.get(`http://localhost:8080/api/onboarding/check-username`, {
      params: { username: value }
    })
      .then(response => {
        const available = response.data.available;
        if (available) {
          self.usernameMessage('Username available!');
          self.isUsernameValid(true);
          self.isUsernameInvalid(false);

          // Store globally for next screen
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
        self.usernameMessage('⚠️ Server error. Try again.');
        self.isUsernameValid(false);
        self.isUsernameInvalid(true);
      });
  }, 500); // wait 500ms after user stops typing

  // ✅ 6️⃣ Trigger on typing
  self.validateUsername = function (_, event) {
    let value = event.target.value.trim();

    // Restrict max length
    if (value.length > 16) {
      value = value.substring(0, 16);
      event.target.value = value;
    }

    self.username(value);
    // 🔁 Trigger API check
    self.checkUsernameAvailability(value);
  };

  // ✅ 7️⃣ Localization Resource
  self.res = componentStrings['login-details'];

  // ✅ 8️⃣ Resolve Busy Context
  self.busyResolve();
}


    return ExampleComponentModel;
  });
