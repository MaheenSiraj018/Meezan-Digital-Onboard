
define(['knockout', 'ojs/ojmodule-element-utils','terms-conditions/loader','progress-bar/loader'], function(ko, moduleUtils) {
  function Terms_ConditionsViewModel(params) {
    const {router} = params;

    this.goBacktoLoginDetails2=() =>{
      router.go({path:"logindetails2"});
    }
    this.goToRegistration = () => {
      router.go({ path: "registrationsuccess" }); 
    };
  }
  return Terms_ConditionsViewModel;
});