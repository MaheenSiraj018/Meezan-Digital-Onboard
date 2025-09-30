/**
  Copyright (c) 2015, 2025, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/
*/

'use strict';
define(
  ['knockout', 'ojL10n!./resources/nls/account-comp-strings', 'ojs/ojcontext', 'ojs/ojknockout'],
  function (ko, componentStrings, Context) {

    function AccountCompViewModel(context) {
    //   var self = this;
    //   self.selectedTab = ko.observable('individual');
    //   self.selectTab = (tabName) => {
    //   self.selectedTab(tabName);
    // };
    
    // self.currentModule = ko.pureComputed( () => {
    //   switch (self.selectedTab()) {
    //     case 'individual':
    //       return 'individual-comp';
    //     case 'soleProprietor':
    //       return 'individual-comp';
    //     default:
    //       return null;
    //   }
    // })
var self = this;
self.selectedView = ko.observable('individual');
self.activeTabName = ko.observable('Individual');
    
    self.showIndividual = function() {
      self.selectedView('individual');
      self.activeTabName('Individual');

    };
    
    self.showSoleProp = function() {
      self.selectedView('sole');
      self.activeTabName('Sole Proprietor');
    };
    self.showDebitCard = function() {
      self.selectedView('debit');
      self.activeTabName('Debit Card');
    };

    self.showSmartWallet = function() {
      self.selectedView('wallet');
      self.activeTabName('Smart Wallet');
    };

    self.showForeignNational = function() {
      self.selectedView('foreign');
      self.activeTabName('Foreign National');
    };
    
    // self.selectedTab = ko.observable('individual');
    
    // self.selectTab = (tabName) => {
    //   self.selectedTab(tabName);
    // };
    
    // self.currentModule = ko.pureComputed(() => {
    //   switch (self.selectedTab()) {
    //     case 'individual':
    //       return 'individual-comp';
    //     case 'soleProprietor':
    //       return 'sole-proprietor-comp';
    //     default:
    //       return null;
    //   }
    // });
    // 1. Receive the callback function and the state from the parent
    self.parentCallback = context.properties.onTabSelect;
    self.activeTab = context.properties.activeTab; // Received observable from parent for styling

    // 2. Click handler function for all buttons/tabs
    self.selectTab = function(tabValue) {
      console.log('Child Component Clicked. Value to send:', tabValue);
      
      // 3. EXECUTE the parent's function, passing the button's value back up.
      if (typeof self.parentCallback === 'function') {
        self.parentCallback(tabValue);
      } else {
        console.error("The 'onTabSelect' callback function was not provided by the parent.");
      }
    };
    self.moduleConfig = ko.pureComputed(() => {
      const moduleName = self.currentModule();
      if (moduleName) {
        return {
          view: [],
          viewModel: null,
          name: moduleName
        };
      }
      return null;
    });

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


      self.goToDetails = function(){
        console.log(context.element);
        
        
        context.element.dispatchEvent(
          new CustomEvent('onNext', {bubbles: true})
        )
      }

self.cnicNumber = ko.observable('');
self.cnicError = ko.observable('');

// Automatically check CNIC validity
self.isCNICValid = ko.computed(() => {
  const cleanCNIC = self.cnicNumber().replace(/-/g, '');
  return cleanCNIC.length === 13 && /^[0-9]{13}$/.test(cleanCNIC);
});

// ✅ Format CNIC as user types and disallow alphabets or special chars
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

// ✅ Validate on Next button click
self.validateAndNext = function () {
  const cleanCNIC = self.cnicNumber().replace(/-/g, '');
  if (cleanCNIC.length !== 13) {
    self.cnicError('Please enter a valid 13-digit CNIC number.');
    return;
  }
  self.cnicError('');
  self.goToDetails(); // Proceed if valid
};

      // Once all startup and async activities have finished
      self.busyResolve();
    }


    return AccountCompViewModel;
  }
);
