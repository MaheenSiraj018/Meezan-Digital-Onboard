define([
  "knockout",
  "ojs/ojcontext",
  "ojs/ojmodule-element-utils",
  "ojs/ojknockouttemplateutils",
  "ojs/ojcorerouter",
  "ojs/ojmodulerouter-adapter",
  "ojs/ojknockoutrouteradapter",
  "ojs/ojurlparamadapter",
  "ojs/ojresponsiveutils",
  "ojs/ojresponsiveknockoututils",
  "ojs/ojarraydataprovider",
  "ojs/ojdrawerpopup",
  "ojs/ojmodule-element",
  "ojs/ojknockout",
], function (
  ko,
  Context,
  moduleUtils,
  KnockoutTemplateUtils,
  CoreRouter,
  ModuleRouterAdapter,
  KnockoutRouterAdapter,
  UrlParamAdapter,
  ResponsiveUtils,
  ResponsiveKnockoutUtils,
  ArrayDataProvider
) {
  function ControllerViewModel() {
    this.KnockoutTemplateUtils = KnockoutTemplateUtils;

    // Accessibility announcements
    this.manner = ko.observable("polite");
    this.message = ko.observable();
    document.getElementById("globalBody")
      .addEventListener("announce", (event) => {
        this.message(event.detail.message);
        this.manner(event.detail.manner);
      }, false);

    // Responsive breakpoints
    const smQuery = ResponsiveUtils.getFrameworkQuery(
      ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY
    );
    this.smScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);

    const mdQuery = ResponsiveUtils.getFrameworkQuery(
      ResponsiveUtils.FRAMEWORK_QUERY_KEY.MD_UP
    );
    this.mdScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(mdQuery);

    // 🔹 Define your app routes
    let navData = [
      { path: "", redirect: "account" },
      {
        path: "account",
        detail: { label: "My Account", iconClass: "oj-ux-ico-person" },
      },
      {
        path: "accountdetails",
        detail: { label: "Account Details", iconClass: "oj-ux-ico-contact" },
      },
      {
        path: "logindetails",
        detail: { label: "Login Details", iconClass: "oj-ux-ico-contact" },
      },
      {
        path: "logindetails2",
        detail: { label: "Login Details2", iconClass: "oj-ux-ico-contact" },
      },
      {
        path: "terms_conditions",
        detail: { label: "Terms & Conditions", iconClass: "oj-ux-ico-contact" },
      },
      {
        path: "registrationsuccess",
        detail: { label: "Registration Successful", iconClass: "oj-ux-ico-contact" },
      },
      
    ];

    // 🔹 Setup CoreRouter
    let router = new CoreRouter(navData, {
      urlAdapter: new UrlParamAdapter(),
    });
    router.sync();

    // 🔹 Router Adapters
    this.moduleAdapter = new ModuleRouterAdapter(router);
    this.selection = new KnockoutRouterAdapter(router);

    // 🔹 DataProvider for Navigation Drawer (optional)
    this.navDataProvider = new ArrayDataProvider(navData.slice(1), {
      keyAttributes: "path",
    });

    // 🔹 Drawer handling
    this.sideDrawerOn = ko.observable(false);
    this.mdScreen.subscribe(() => {
      this.sideDrawerOn(false);
    });
    this.toggleDrawer = () => {
      this.sideDrawerOn(!this.sideDrawerOn());
    };

    // Header info
    this.appName = ko.observable("My OJET App");
    this.userLogin = ko.observable("john.hancock@oracle.com");

    // Footer links
    this.footerLinks = [
      { name: "About Oracle", id: "aboutOracle", linkTarget: "http://www.oracle.com" },
      { name: "Contact Us", id: "contactUs", linkTarget: "http://www.oracle.com/contact" },
    ];
  }

  // release the application bootstrap busy state
  Context.getPageContext().getBusyContext().applicationBootstrapComplete();

  return new ControllerViewModel();
});

