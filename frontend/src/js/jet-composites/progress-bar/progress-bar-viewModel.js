define(['knockout'], function (ko) {
  function ProgressBarViewModel(context) {
    const self = this;

    const current = context.properties.currentStep || 1;

    self.currentStep = ko.observable(parseInt(current));

    const stepLabels = [
      'Account Type',
      'Account Details',
      'Verification',
      'Login Details',
      
    ];

    self.steps = ko.observableArray(
      stepLabels.map((label, index) => {
        const stepNumber = index + 1;

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

    self.currentStep.subscribe(function (newStep) {
      console.log("Updating step statuses to step:", newStep);

      self.steps().forEach((step) => {
        if (step.stepNumber < newStep) step.status('completed');
        else if (step.stepNumber === newStep) step.status('active');
        else step.status('inactive');
      });
    });

    console.log("Steps initialized:", self.steps());
  }

  return ProgressBarViewModel;
});

