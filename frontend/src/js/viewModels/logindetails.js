

define(['knockout', 'ojs/ojmodule-element-utils','login-details/loader','login-link/loader','progress-bar/loader'], function(ko, moduleUtils) {
  function LoginDetailsViewModel(params) {
    
   const {router} = params;

    this.goBacktoAccountDetails=() =>{
      router.go({path:"accountdetails"});
    }
    this.goToLoginDetails2 = () => {
      router.go({ path: "logindetails2" }); 
    };
  }
  return LoginDetailsViewModel;
});
