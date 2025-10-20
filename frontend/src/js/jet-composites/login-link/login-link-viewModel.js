/**
  Copyright (c) 2015, 2025, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/
'use strict';
define(
    ['knockout', 'ojL10n!./resources/nls/login-link-strings', 'ojs/ojcontext', 'ojs/ojknockout'], function (ko, componentStrings, Context) {
    
    function LoginLinkModel(context) {
        var self = this;
        
        var busyContext = Context.getContext(context.element).getBusyContext();
        var options = {"description": "Web Component Startup - Waiting for data"};
        self.busyResolve = busyContext.addBusyState(options);

        self.composite = context.element;

        self.messageText = ko.observable('Hello from login-link');
        self.properties = context.properties;
        console.log(self.properties);
        self.res = componentStrings['login-link'];

        self.busyResolve();
    };
    

    return LoginLinkModel;
});
