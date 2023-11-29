sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/v2/ODataModel",
    "com/lab2dev/browseorders/model/models",
    "com/lab2dev/browseorders/model/formatter",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, ODataModel, models, formatter, MessageBox) {
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


        });
    });