define(['knockout'], function (ko) {
  function ProgressBarViewModel(context) {
    const self = this;

    // 1. Get current step from parent component or route param
    const current = context.properties.currentStep || 1;

    self.currentStep = ko.observable(parseInt(current));

    // 2. Define all labels for your 4 screens (you can customize names)
    const stepLabels = [
      'Account Type',
      'Account Details',
      'Verification',
      'Login Details',
      
    ];

    // 3. Create array of step objects with observables
    self.steps = ko.observableArray(
      stepLabels.map((label, index) => {
        const stepNumber = index + 1;

        // Determine status based on current step
        let status = 'inactive';
        if (self.currentStep() > stepLabels.length) status = 'completed';
else if (stepNumber < self.currentStep()) status = 'completed';
else if (stepNumber === self.currentStep()) status = 'active';


        return {
          stepNumber: stepNumber,
          label: label,
          status: ko.observable(status)
        };
      })
    );

    // 4. Whenever currentStep changes (e.g., route change), update all statuses
    self.currentStep.subscribe(function (newStep) {
      console.log("🔄 Updating step statuses to step:", newStep);

      self.steps().forEach((step) => {
        if (step.stepNumber < newStep) step.status('completed');
        else if (step.stepNumber === newStep) step.status('active');
        else step.status('inactive');
      });
    });

    // 5. Debug
    console.log("🧾 Steps initialized:", self.steps());
  }

  return ProgressBarViewModel;
});


// define(['knockout'], function (ko) {
//   function ProgressBarViewModel(context) {
//     const self = this;

//     const step = context.properties.current-step || 1; // Default to 1 if undefined
//     console.log("ProgressBar initialized with step:", step);
//     console.log("Received params:", context.properties.current-step);

//     self.currentStep = ko.observable(step);

//     self.isStepActive = function (index) {
//       return index <= self.currentStep();
//     };

//     // 🔹 Total steps
//     self.totalSteps = 4;

//     console.log("🧭 Current Step:", self.currentStep());

//     // 🔹 Helper: create array [1, 2, 3, 4]
//     self.steps = Array.from({ length: self.totalSteps }, (_, i) => i + 1);

//     // 🔹 CSS class for each circle
//     self.getCircleClass = function (step) {
//       if (step < self.currentStep()) return 'completed';
//       if (step === self.currentStep()) return 'active';
//       return 'inactive';
//     };

//     // 🔹 Percentage progress (optional, if you want bar animation)
//     self.progressPercent = ko.computed(() => (self.currentStep() / self.totalSteps) * 100);
//   }

//   return ProgressBarViewModel;
// });


// define([
//   'knockout',
//   'ojL10n!./resources/nls/progress-bar-strings',
//   'ojs/ojcontext',
//   'ojs/ojrouter',
//   'ojs/ojknockout'
// ], function (ko, componentStrings, Context, Router) {
//   function ProgressBarModel(context) {
//     var self = this;

//     // Get root router instance
//     var router = Router.rootInstance;
//     console.log(router);

//     // Localization (if needed)
//     self.translations = componentStrings['progress-bar'];

//     // Define the step list (map to your routes)
//     self.steps = ko.observableArray([
//       { id: 'account', stepNumber: 1, label: 'Account Type', status: ko.observable('pending') },
//       { id: 'accountdetails', stepNumber: 2, label: 'Account Details', status: ko.observable('pending') },
//       { id: 'logindetails', stepNumber: 3, label: 'Login Details', status: ko.observable('pending') },
//       { id: 'logindetails2', stepNumber: 4, label: 'Login Details 2', status: ko.observable('pending') },
      
//     ]);

//     // Observable to store current route
//     self.currentRoute = ko.observable(router.stateId());

//     /**
//      * Update step statuses whenever route changes
//      * @param {string} activeRouteId
//      */
//     self.updateStepStatusesByRoute = function (activeRouteId) {
//       var stepsArray = self.steps();
//       var routeIds = stepsArray.map(function (s) { return s.id; });
//       var activeIndex = routeIds.indexOf(activeRouteId);

//       for (var i = 0; i < stepsArray.length; i++) {
//         if (i < activeIndex) {
//           stepsArray[i].status('completed'); // All previous steps completed
//         } else if (i === activeIndex) {
//           stepsArray[i].status('active'); // Current active step
//         } else {
//           stepsArray[i].status('pending'); // Future steps pending
//         }
//       }
//     };

//     // Subscribe to router changes
//     router.currentState.subscribe(function (newState) {
//       if (newState && newState.id) {
//         self.currentRoute(newState.id);
//         self.updateStepStatusesByRoute(newState.id);
//       }
//     });

//     // Initial setup based on first route
//     self.updateStepStatusesByRoute(self.currentRoute());

//     // Utility for progress bar line color between steps
//     self.getProgressLineClass = function (index) {
//       var stepsArray = self.steps();
//       var currentStep = stepsArray[index];
//       var nextStep = stepsArray[index + 1];

//       if (currentStep.status() === 'completed' && nextStep && nextStep.status() !== 'pending') {
//         return 'completed-line';
//       } else if (nextStep && nextStep.status() === 'active') {
//         return 'active-line';
//       } else {
//         return '';
//       }
//     };

//     // Lifecycle hook (optional, can be kept)
//     if (context) {
//       self.connected = function () {
//         Context.getPageContext().getBusyContext().applicationBootstrapComplete();
//       };
//     }
//   }

//   return ProgressBarModel;
// });


// 'use strict';
// define(
//     ['knockout', 'ojL10n!./resources/nls/progress-bar-strings', 'ojs/ojcontext', 'ojs/ojknockout'], 
//     function (ko, componentStrings, Context, Router) {
    
//     function ExampleComponentModel(context) {
//         var self = this;
//         var router = Router.rootInstance;

//         //At the start of your viewModel constructor
//         var busyContext = Context.getContext(context.element).getBusyContext();
//         var options = {"description": "Web Component Startup - Waiting for data"};
//         self.busyResolve = busyContext.addBusyState(options);

//         self.composite = context.element;
//         self.properties = context.properties;
//         self.res = componentStrings['progress-bar'];

//         // Progress Bar Configuration
//         // self.steps = ko.observableArray([
//         //     {
//         //         stepNumber: 1,
//         //         label: 'Account Type',
//         //         status: ko.observable('completed'),
//         //         title: 'Select Account Type',
//         //         content: 'Choose the type of account you want to create. This will determine the features and services available to you.'
//         //     },
//         //     {
//         //         stepNumber: 2,
//         //         label: 'Account Details',
//         //         status: ko.observable('active'),
//         //         title: 'Enter Account Details',
//         //         content: 'Please provide your personal information including name, email, phone number, and other required details.'
//         //     },
//         //     {
//         //         stepNumber: 3,
//         //         label: 'Verification',
//         //         status: ko.observable('pending'),
//         //         title: 'Account Verification',
//         //         content: 'Verify your identity by providing the required documents and completing the verification process.'
//         //     },
//         //     {
//         //         stepNumber: 4,
//         //         label: 'Login Details',
//         //         status: ko.observable('pending'),
//         //         title: 'Set Login Credentials',
//         //         content: 'Create your username and password, and set up security questions for account protection.'
//         //     }
//         // ]);

//         self.steps = ko.observableArray([
//   { id: 'account', stepNumber: 1, label: 'Account Type', status: ko.observable('pending') },
//   { id: 'accountdetails', stepNumber: 2, label: 'Account Details', status: ko.observable('pending') },
//   { id: 'logindetails', stepNumber: 3, label: 'Login Details', status: ko.observable('pending') },
//   { id: 'logindetails2', stepNumber: 4, label: 'Login Details 2', status: ko.observable('pending') },
//   { id: 'termsconditions', stepNumber: 5, label: 'Terms & Conditions', status: ko.observable('pending') }
// ]);

        
//         // Current step index (0-based)
//         self.currentStepIndex = ko.observable(1); // Starting at step 2 (index 1)
        
//         // Get step configuration from context properties if available
//         if (context.properties.initialStep) {
//             self.currentStepIndex(parseInt(context.properties.initialStep) - 1);
//         }
        
//         if (context.properties.stepsConfig) {
//             // Allow custom step configuration via properties
//             var customSteps = context.properties.stepsConfig;
//             if (Array.isArray(customSteps)) {
//                 var mappedSteps = customSteps.map(function(step, index) {
//                     return {
//                         stepNumber: index + 1,
//                         label: step.label || 'Step ' + (index + 1),
//                         status: ko.observable(step.status || 'pending'),
//                         title: step.title || step.label || 'Step ' + (index + 1),
//                         content: step.content || 'Content for ' + step.label
//                     };
//                 });
//                 self.steps(mappedSteps);
//             }
//         }
        
//         // Computed observables
//         self.currentStep = ko.computed(function() {
//             var steps = self.steps();
//             var index = self.currentStepIndex();
//             return steps[index] || steps[0];
//         });
        
//         self.canGoPrevious = ko.computed(function() {
//             return self.currentStepIndex() > 0;
//         });
        
//         self.canGoNext = ko.computed(function() {
//             return self.currentStepIndex() < self.steps().length - 1;
//         });
        
//         self.nextButtonText = ko.computed(function() {
//             var isLastStep = self.currentStepIndex() === self.steps().length - 1;
//             return isLastStep ? (self.res.completeButton || 'Complete') : (self.res.nextButton || 'Next');
//         });
        
//         self.previousButtonText = ko.computed(function() {
//             return self.res.previousButton || 'Previous';
//         });
        
//         // Progress percentage for additional UI elements if needed
//         self.progressPercentage = ko.computed(function() {
//             var totalSteps = self.steps().length;
//             var currentIndex = self.currentStepIndex();
//             return Math.round(((currentIndex + 1) / totalSteps) * 100);
//         });
        
//         // Navigation functions
//         self.nextStep = function() {
//             if (self.canGoNext()) {
//                 var currentIndex = self.currentStepIndex();
//                 var newIndex = currentIndex + 1;
                
//                 // Fire event before step change
//                 self.fireStepChangeEvent('beforeNext', currentIndex, newIndex);
                
//                 // Update step statuses
//                 self.updateStepStatuses(newIndex);
                
//                 // Move to next step
//                 self.currentStepIndex(newIndex);
                
//                 // Fire event after step change
//                 self.fireStepChangeEvent('afterNext', currentIndex, newIndex);
//             } else if (self.currentStepIndex() === self.steps().length - 1) {
//                 // Handle completion
//                 self.completeProcess();
//             }
//         };
        
//         self.previousStep = function() {
//             if (self.canGoPrevious()) {
//                 var currentIndex = self.currentStepIndex();
//                 var newIndex = currentIndex - 1;
                
//                 // Fire event before step change
//                 self.fireStepChangeEvent('beforePrevious', currentIndex, newIndex);
                
//                 // Update step statuses
//                 self.updateStepStatuses(newIndex);
                
//                 // Move to previous step
//                 self.currentStepIndex(newIndex);
                
//                 // Fire event after step change
//                 self.fireStepChangeEvent('afterPrevious', currentIndex, newIndex);
//             }
//         };
        
//         // Direct step navigation (for clicking on steps)
//         self.goToStep = function(stepIndex) {
//             if (typeof stepIndex === 'object') {
//                 // Handle click event - get step data
//                 var stepData = stepIndex;
//                 stepIndex = self.steps().indexOf(stepData);
//             }
            
//             if (stepIndex >= 0 && stepIndex < self.steps().length && stepIndex !== self.currentStepIndex()) {
//                 var currentIndex = self.currentStepIndex();
                
//                 // Fire event before step change
//                 self.fireStepChangeEvent('beforeGoto', currentIndex, stepIndex);
                
//                 // Update step statuses
//                 self.updateStepStatuses(stepIndex);
                
//                 // Move to target step
//                 self.currentStepIndex(stepIndex);
                
//                 // Fire event after step change
//                 self.fireStepChangeEvent('afterGoto', currentIndex, stepIndex);
//             }
//         };
        
//         // Update step statuses based on current position
//         self.updateStepStatuses = function(activeIndex) {
//             var stepsArray = self.steps();
            
//             for (var i = 0; i < stepsArray.length; i++) {
//                 if (i < activeIndex) {
//                     stepsArray[i].status('completed');
//                 } else if (i === activeIndex) {
//                     stepsArray[i].status('active');
//                 } else {
//                     stepsArray[i].status('pending');
//                 }
//             }
//         };
        
//         // Complete process handler
//         self.completeProcess = function() {
//             // Mark all steps as completed
//             self.steps().forEach(function(step) {
//                 step.status('completed');
//             });
            
//             // Fire completion event
//             self.fireStepChangeEvent('completed', self.currentStepIndex(), -1);
            
//             // Handle completion logic here
//             console.log('Process completed!');
            
//             // You can add custom completion logic here
//             // For example: redirect, show success message, etc.
//         };
        
//         // Event firing utility
//         self.fireStepChangeEvent = function(eventType, fromIndex, toIndex) {
//             if (self.composite) {
//                 var eventData = {
//                     detail: {
//                         eventType: eventType,
//                         fromStep: fromIndex,
//                         toStep: toIndex,
//                         currentStep: self.currentStep(),
//                         progress: self.progressPercentage()
//                     }
//                 };
                
//                 // Fire custom event for parent components to listen to
//                 self.composite.dispatchEvent(new CustomEvent('stepChanged', eventData));
//             }
//         };
        
//         // Public methods for external control
//         self.setStep = function(stepIndex) {
//             self.goToStep(stepIndex);
//         };
        
//         self.reset = function() {
//             self.currentStepIndex(0);
//             self.updateStepStatuses(0);
//         };
        
//         self.getStepData = function(stepIndex) {
//             return self.steps()[stepIndex];
//         };
        
//         self.getCurrentStepData = function() {
//             return self.currentStep();
//         };
        
//         // Validation function (can be overridden)
//         self.validateCurrentStep = function() {
//             // Default validation - always returns true
//             // Override this method for custom validation logic
//             return true;
//         };
        
//         // Enhanced navigation with validation
//         self.nextStepWithValidation = function() {
//             if (self.validateCurrentStep()) {
//                 self.nextStep();
//             } else {
//                 console.log('Current step validation failed');
//                 // Handle validation failure
//                 self.fireStepChangeEvent('validationFailed', self.currentStepIndex(), -1);
//             }
//         };
        
//         // Initialize with correct statuses
//         self.updateStepStatuses(self.currentStepIndex());

//         // Example for parsing additional context properties
//         if (context.properties.allowDirectNavigation !== undefined) {
//             self.allowDirectNavigation = ko.observable(context.properties.allowDirectNavigation);
//         } else {
//             self.allowDirectNavigation = ko.observable(true);
//         }
        
//         if (context.properties.showProgressPercentage !== undefined) {
//             self.showProgressPercentage = ko.observable(context.properties.showProgressPercentage);
//         } else {
//             self.showProgressPercentage = ko.observable(false);
//         }

//         //Once all startup and async activities have finished
//         self.busyResolve();
//     }
    
//     //Lifecycle methods
//     ExampleComponentModel.prototype.activated = function(context) {
//         // Component activated - can be used for initialization that depends on DOM
//     };

//     ExampleComponentModel.prototype.connected = function(context) {
//         // Component connected to DOM - good place for DOM manipulations
//     };

//     ExampleComponentModel.prototype.bindingsApplied = function(context) {
//         // All bindings have been applied - component fully ready
//         var self = this;
        
//         // Any post-binding initialization can go here
//         console.log('Progress bar component bindings applied');
//     };

//     ExampleComponentModel.prototype.disconnected = function(context) {
//         // Component disconnected from DOM - cleanup if needed
//     };

//     ExampleComponentModel.prototype.propertyChanged = function(context) {
//         // Handle property changes from parent component
//         var self = this;
        
//         if (context.property === 'initialStep' && context.value) {
//             self.setStep(parseInt(context.value) - 1);
//         }
        
//         if (context.property === 'stepsConfig' && context.value) {
//             // Update steps configuration
//             var customSteps = context.value;
//             if (Array.isArray(customSteps)) {
//                 var mappedSteps = customSteps.map(function(step, index) {
//                     return {
//                         stepNumber: index + 1,
//                         label: step.label || 'Step ' + (index + 1),
//                         status: ko.observable(step.status || 'pending'),
//                         title: step.title || step.label || 'Step ' + (index + 1),
//                         content: step.content || 'Content for ' + step.label
//                     };
//                 });
//                 self.steps(mappedSteps);
//                 self.updateStepStatuses(self.currentStepIndex());
//             }
//         }
//     };

//     return ExampleComponentModel;
// });