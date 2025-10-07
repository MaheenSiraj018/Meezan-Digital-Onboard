

define(['knockout', 'ojs/ojmodule-element-utils','progress-bar/loader','account-comp/loader','login-link/loader'], function(ko, moduleUtils) {
  function AccountViewModel(params) {
    const {router} = params;
    
    this.goBack=() =>{
      router.go({path:"accountdetails"});
    }
    this.goToAccountDetails = () => {
      router.go({ path: "accountdetails" }); 
      self.currentStep(2);
    }

    const self = this;
    self.currentStep = ko.observable(1);

  }

  return AccountViewModel;
});


