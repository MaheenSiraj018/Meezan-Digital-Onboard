define(['knockout', 'ojs/ojmodule-element-utils','registration-success/loader'], function(ko, moduleUtils) {
  function RegistrationSuccessViewModel(params) {
    const {router} = params;
    this.goAccountScreen=() =>{
      router.go({path:"account"});
    }

  }

  
  return RegistrationSuccessViewModel;
});
