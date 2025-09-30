
define(['knockout', 'ojs/ojmodule-element-utils','account-details/loader','login-link/loader','progress-bar/loader'], function(ko, moduleUtils) {
  function AccountDetailsViewModel(params) {
        const {router} = params;

    this.goBacktoAccount=() =>{
      router.go({path:"account"});
    }
    this.goToLoginDetails = () => {
      router.go({ path: "logindetails" }); 
    };
  }
  return AccountDetailsViewModel;
});
