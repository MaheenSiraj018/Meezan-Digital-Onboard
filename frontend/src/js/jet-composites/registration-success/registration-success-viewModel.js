'use strict';
define([
  'knockout',
  'ojs/ojcore',
  'ojs/ojknockout',
  'ojs/ojrouter' 
], function (ko, oj, Router) {

  function RegistrationSuccessViewModel() {
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

    self.isError = ko.observable(false);
    self.errorMessage = ko.observable('');

    self.loadUserData = function () {
      const userId = window.OnboardingStore?.userId;
      console.log("Global userId for review:", userId);

      if (!userId) {
        console.error("Missing userId in global store");
        self.showError("Digital Onboarding failed. Proceed to register again.");
        return;
      }

      const url = `http://localhost:8080/api/onboarding/review/${userId}`;
      console.log("📡 Fetching user details from:", url);

      axios.get(url)
        .then(function (response) {
          console.log("Review Data:", response.data);

          const user = response.data;

          if (!user || !user.accountNumber || !user.name) {
            self.showError("Digital Onboarding failed. Proceed to register again.");
            return;
          }

          const updated = self.registrationData();
          updated.success.username.value = user.username || 'N/A';
          updated.success.accountTitle.value = user.name || 'N/A';
          updated.success.accountNumber.value = user.accountNumber || 'N/A';
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
