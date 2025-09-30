// require([
//   "require",
//   "exports",
//   "knockout",
//   "ojs/ojbootstrap",
//   "ojs/ojknockout",
//   "ojs/ojinputtext",
//   "ojs/ojlabel",
//   "ojs/ojbutton",
//   "ojs/ojformlayout",
//   "ojs/ojcorerouter"
// ], function (require, exports, ko, Bootstrap, CoreRouter) {
//   "use strict";

//   class DemoModel {
//     constructor() {
//       this.error = [{ summary: "summary", detail: "detail", severity: "error" }];
//       this.warning = [{ summary: "summary", detail: "detail", severity: "warning" }];
//       this.info = [{ summary: "summary", detail: "detail", severity: "info" }];
//       this.confirmation = [{ summary: "summary", detail: "detail", severity: "confirmation" }];
//       this.value = ko.observable("");
//       this.rawValue = ko.observable("");

//       // 🔹 New navigation method
//       this.goToAccountDetails = () => {
//         CoreRouter.rootInstance.go({ path: "accountdetails" });
//       };
//     }
//   }

//   Bootstrap.whenDocumentReady().then(() => {
//     ko.applyBindings(new DemoModel(), document.getElementById("div1"));
//   });
// });

// define(['knockout', 'ojs/ojcorerouter'], function(ko, CoreRouter) {
//   function accountViewModel() {
//     this.goToAccountDetails = () => {
//       CoreRouter.rootInstance.go({ path: 'accountdetails' });
//     };
//   }
//   return accountViewModel;
// });

define(['knockout', 'ojs/ojmodule-element-utils','progress-bar/loader','account-comp/loader','ind-component/loader','login-link/loader'], function(ko, moduleUtils) {
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




    // 1. Observable to track which sub-component to render
    // Initialize with the default component name

    // self.currentRenderComponent = ko.observable('default-account');

    // 2. The callback function passed to the child component
    // self.handleTabClick = function(tabValue) {
    //   console.log('Tab clicked in parent:', tabValue);
      
      // Conditionally set the component name based on the received value
    //   if (tabValue === 'individual') {
    //     self.currentRenderComponent('individual-comp');
    //   } else {
    //     self.currentRenderComponent('default-account');
    //   }
    // };
    
    // 3. Computed observable to hold the component name for the 'component' binding
    // self.componentToRender = ko.pureComputed(function() {
    //     return self.currentRenderComponent();
    // });
    // 1. STATE: Observable to hold the currently selected tab value.
    // This value is updated by the child component.
    self.currentTabValue = ko.observable('soleProprietor'); 

    // 2. CALLBACK FUNCTION: This function is passed down to the child component.
    // It receives the value sent from the component (e.g., 'individual' or 'soleProprietor').
    self.handleTabClick = function(tabValue) {
      console.log('✅ Parent (account.js) received value:', tabValue);
      
      // Update the parent's state
      self.currentTabValue(tabValue);

      // You can also add routing or other logic here based on the new value
      // Example: router.go({ path: 'account/' + tabValue });
    };

  }

  return AccountViewModel;
});


