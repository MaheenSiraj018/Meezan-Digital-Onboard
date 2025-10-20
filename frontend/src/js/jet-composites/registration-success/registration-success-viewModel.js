'use strict';
define([
  'knockout',
  'ojs/ojcore',
  'ojs/ojknockout',
  'ojs/ojrouter' 
], function (ko, oj, Router) {

  function RegistrationSuccessViewModel(context) {
    var self = this;


    
    self.registrationData = ko.observable({
      success: {
        title: 'Registration Successful!',
        subtitle: 'Your account has been created successfully.',
        username: { label: 'Username', value: '' },
        accountTitle: { label: 'Account Title', value: '' },
        accountNumber: { label: 'Account Number', value: '' },
        buttonText: 'Continue to Login'
      }
    });
    self.goAccountScreen = function () {

       if (window.OnboardingStore && typeof window.OnboardingStore.clear === 'function') {
    window.OnboardingStore.clear();
  } else {
    console.warn("OnboardingStore not found or clear() not defined");
  }
    // Dispatch a custom event that bubbles to the parent
    context.element.dispatchEvent(new CustomEvent('onNext', { bubbles: true }));
};

    self.isError = ko.observable(false);
    self.errorMessage = ko.observable('');

    self.loadUserData = function () {
      const global_cnic = window.OnboardingStore?.cnic;
      console.log("Global cnic for review:", global_cnic);

      if (!global_cnic) {
        console.error("Missing CNIC in global store");
        self.showError("Digital Onboarding failed. Proceed to register again.");
        return;
      }

      const url = `http://localhost:8080/api/onboarding/review/${global_cnic}`;
      console.log("📡 Fetching user details from:", url);

      axios.get(url)
        .then(function (response) {
          console.log("Review Data:", response.data);

          const account = response.data;

          if (!account || !account.accountNumber || !account.accountTitle) {
            self.showError("Digital Onboarding failed. Proceed to register again.");
            return;
          }

          const updated = self.registrationData();
          updated.success.username.value = account.username || 'N/A';
          updated.success.accountTitle.value = account.accountTitle || 'N/A';
          updated.success.accountNumber.value = account.accountNumber || 'N/A';
          self.registrationData(updated);

          self.isError(false); 
        })
        .catch(function (error) {
          console.error("Error loading user review data:", error);
          self.showError("Digital Onboarding failed. Proceed to register again.");
        });
    };

    self.showError = function (message) {
      self.errorMessage(message);
      self.isError(true);
    };

    

    self.loadUserData();
  }

  return RegistrationSuccessViewModel;
});
