sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "com/lab2dev/browseorders/model/models",
    "com/lab2dev/browseorders/model/formatter",
    "sap/m/MessageBox",
    "sap/ui/core/routing/History"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, models, formatter, MessageBox, History) {
        "use strict";

        return Controller.extend("com.lab2dev.browseorders.controller.OrderDetails", {
            formatter: formatter,

            onInit: function () {
                const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("OrderDetails").attachMatched(this._onRouteMatched, this);

                
            },

            _onRouteMatched: function (oEvent) {
                const sOrderId = oEvent.getParameter("arguments").OrderId;
                this.loadOrderDetails(sOrderId);
            },

            loadOrderDetails: function (sOrderId) {
                
                const orders = models.getOrderDetail(sOrderId)
                
                orders
                    .then((oOrdersModel) => {
                        this.getView().setModel(oOrdersModel, 'orders');

                    })
                    .catch((oError) => {
                        MessageBox.error(oError);

                    })
                    .finally(() => {
                        list.setBusy(false);
                    });
            },
            
            onNavBack: function () {
                const oHistory = History.getInstance();
                const sPreviousHash = oHistory.getPreviousHash();
                
                if (sPreviousHash !== undefined) {
                    window.history.go(-1);
                } else {
                    const oComponent = this.getOwnerComponent()
                    const oRouter = oComponent.getRouter();
                    oRouter.navTo("RouteHome", {}, true);
                }
            },


        });
    });