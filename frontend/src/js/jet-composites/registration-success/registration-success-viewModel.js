define(['knockout', 'ojs/ojcore', 'ojs/ojknockout'],
  function(ko, oj) {
    
    function RegistrationSuccessViewModel() {
      var self = this;
      
      // Initialize with default structure
      self.registrationData = ko.observable({
        success: {
          title: '',
          subtitle: '',
          username: { label: '', value: '' },
          accountTitle: { label: '', value: '' },
          accountNumber: { label: '', value: '' },
          buttonText: ''
        }
      });
      
      // Load JSON data
      self.loadData = function() {
        fetch('js/jet-composites/registration-success/registration-data.json')
          .then(function(response) {
            return response.json();
          })
          .then(function(data) {
            self.registrationData(data);
          })
          .catch(function(error) {
            console.error('Error loading registration data:', error);
          });
      };
      
      // Load data on initialization
      self.loadData();
      
      // Handle continue button click
      self.handleContinue = function() {
        console.log('Continue to Log In clicked');
        // Add your navigation logic here
        // For example: 
        // oj.Router.rootInstance.go('login');
        // or window.location.href = 'login.html';
      };
      
      // Optional: Method to update data dynamically
      self.updateAccountDetails = function(username, accountTitle, accountNumber) {
        var currentData = self.registrationData();
        currentData.success.username.value = username;
        currentData.success.accountTitle.value = accountTitle;
        currentData.success.accountNumber.value = accountNumber;
        self.registrationData(currentData);
      };
    }
    
    return RegistrationSuccessViewModel;
  }
);