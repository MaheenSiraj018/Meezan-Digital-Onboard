define(['knockout', 'ojs/ojmodule-element-utils','login-details2/loader','login-link/loader','progress-bar/loader'], function(ko, moduleUtils) {
  function LoginDetails2ViewModel(params) {
    const {router} = params;

    this.goBacktoLoginDetails=() =>{
      router.go({path:"logindetails"});
    }
    this.goToTerms = () => {
      router.go({ path: "terms_conditions" }); 
    };
  }
  return LoginDetails2ViewModel;
});
