'use strict';
define(
  ['knockout', 'ojL10n!./resources/nls/login-details2-strings', 'ojs/ojcontext', 'ojs/ojknockout'],
  function (ko, componentStrings, Context) {

    function ExampleComponentModel(context) {
      var self = this;

      var busyContext = Context.getContext(context.element).getBusyContext();
      var options = { "description": "Web Component Startup - Waiting for data" };
      self.busyResolve = busyContext.addBusyState(options);

      self.composite = context.element;

      self.password = ko.observable('');
      self.rePassword = ko.observable('');
      self.passwordsMatch = ko.observable(false);
      self.matchMessage = ko.observable('');
      self.isFormValid = ko.observable(false);
      self.passwordStrength = ko.observable('');

      self.isPasswordValid = ko.computed(function () {
        const pass = self.password();
        const regex = /^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9!@#$%^&*()_+=-]{8,}$/;
        return regex.test(pass);
      });

      self.password.subscribe(checkPasswordMatch);
      self.rePassword.subscribe(checkPasswordMatch);

      function checkPasswordMatch() {
        if (self.password() && self.rePassword()) {
          if (self.password() === self.rePassword()) {
            self.passwordsMatch(true);
            self.matchMessage("Passwords Matched!");
          } else {
            self.passwordsMatch(true);
            self.matchMessage("Passwords do not match");
          }
        } else {
          self.passwordsMatch(false);
          self.matchMessage('');
        }
      }

      self.isFormValid = ko.computed(function () {
        return self.isPasswordValid() && self.password() === self.rePassword();
      });


      self.goToTerms = function () {
        if (!self.isFormValid()) {
          alert("Please make sure your password meets all requirements and both match.");
          return;
        }

        console.log("Global Store before Create Account:", OnboardingStore);
        const userId = OnboardingStore.userId;
        const username = OnboardingStore.username;
        const password = self.password();

        if (!userId || !username) {
          alert("Missing user information. Please go back and verify previous steps.");
          return;
        }

        const payload = {
          userId: userId,
          username: username,
          password: password
        };

        console.log("Sending Create Account Request:", payload);
        console.log("Global Store before Create Account:", OnboardingStore);

        axios.post('http://localhost:8080/api/onboarding/create-account', payload)
          .then(response => {
            console.log("Account Created Successfully:", response.data);

            OnboardingStore.user = response.data;

            context.element.dispatchEvent(new CustomEvent('onNext', { bubbles: true }));
          })
          .catch(error => {
            console.error("Error creating account:", error);

            if (error.response) {
              const msg = typeof error.response.data === 'string'
                ? error.response.data
                : error.response.data.message || 'Account creation failed';
              alert(`${msg}`);
            } else {
              alert("Server error. Please try again later.");
            }
          });
      };

      self.password.subscribe(function (newValue) {
        evaluatePasswordStrength(newValue);
        checkPasswordMatch();
      });

      function evaluatePasswordStrength(password) {
        if (!password) {
          self.passwordStrength('');
          updateProgressBar('');
          return;
        }

        let strength = 'Weak';
        let score = 0;

        if (password.length >= 8) score++; // meets length
        if (/[A-Z]/.test(password)) score++; // has uppercase
        if (/[0-9]/.test(password)) score++; // has number
        if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++; // has special char

        if (score <= 1) {
          strength = 'Weak';
        } else if (score === 2 || score === 3) {
          strength = 'Medium';
        } else if (score >= 4) {
          strength = 'Strong';
        }

        self.passwordStrength(strength);
        updateProgressBar(strength);
      }

      self.isPasswordValid = ko.computed(function () {
        const pass = self.password();
        const regex = /^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9!@#$%^&*()_+=-]{8,}$/;
        return regex.test(pass);
      });
      self.strengthColor = ko.computed(function () {
        switch (self.passwordStrength()) {
          case 'Weak': return 'red';
          case 'Medium': return 'orange';
          case 'Strong': return 'green';
          default: return 'black';
        }
      });

      function updateProgressBar(strength) {
        const segments = document.querySelectorAll('#progressBar .progress-segment-password');

        segments.forEach(seg => seg.classList.remove('filled'));

        if (!strength || strength.trim() === '') {
          return; 
        }

        let fillCount = 0;

        if (strength === 'Weak') fillCount = 2;       
        else if (strength === 'Medium') fillCount = 3; 
        else if (strength === 'Strong') fillCount = 5; 

        for (let i = 0; i < fillCount; i++) {
          segments[i].classList.add('filled');
        }
      }


      self.goBacktoLoginDetails = function () {
        context.element.dispatchEvent(new CustomEvent('onBack', { bubbles: true }));
      };
      self.togglePassword = function (inputId, btnId) {
        const input = document.getElementById(inputId);
        const btn = document.getElementById(btnId);
        if (!input || !btn) return; 

        if (input.type === "password") {
          input.type = "text";
          btn.textContent = "HIDE";
        } else {
          input.type = "password";
          btn.textContent = "SHOW";
        }
      };


      self.busyResolve();
    }

    return ExampleComponentModel;
  });
