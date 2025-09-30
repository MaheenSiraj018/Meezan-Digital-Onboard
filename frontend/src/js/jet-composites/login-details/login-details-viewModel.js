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

      //At the start of your viewModel constructor
      var busyContext = Context.getContext(context.element).getBusyContext();
      var options = { "description": "Web Component Startup - Waiting for data" };
      self.busyResolve = busyContext.addBusyState(options);

      self.composite = context.element;
      self.goToLoginDetails2 = function () {
        console.log(context.element);


        context.element.dispatchEvent(
          new CustomEvent('onNext', { bubbles: true })
        )
      }
      self.goBacktoAccountDetails = function () {
        console.log(context.element);


        context.element.dispatchEvent(
          new CustomEvent('onBack', { bubbles: true })
        )
      }
      // ✅ Username Validation Logic
      self.username = ko.observable('');
      self.isUsernameValid = ko.observable(false);
      self.isUsernameInvalid = ko.observable(false);

      self.validateUsername = function (_, event) {
        let value = event.target.value.trim();

        // Prevent typing/pasting more than 16 characters
        if (value.length > 16) {
          value = value.substring(0, 16);
          event.target.value = value; // also update the textbox
        }

        self.username(value);

        // Conditions → 8–16 chars
        const isValid = value.length >= 8 && value.length <= 16;

        self.isUsernameValid(isValid && value !== '');
        self.isUsernameInvalid(!isValid && value !== '');
      };



      //Example observable
      self.messageText = ko.observable('Hello from login-details');
      self.properties = context.properties;
      self.res = componentStrings['login-details'];
      // ✅ Username availability message
      self.usernameMessage = ko.observable('');
      self.usernameStatusClass = ko.observable('');

      // Update message based on validity
      self.username.subscribe((newVal) => {
        if (newVal === '') {
          self.usernameMessage('');
          self.usernameStatusClass('');
          return;
        }

        const isValid = newVal.length >= 8 && newVal.length <= 16;

        if (isValid) {
          self.usernameMessage('Username Available!');
          self.usernameStatusClass('username-available');
        } else {
          self.usernameMessage('Username Unavailable!');
          self.usernameStatusClass('username-unavailable');
        }
      });

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
