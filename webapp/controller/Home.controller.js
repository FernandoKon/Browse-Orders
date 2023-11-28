sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
    "com/lab2dev/browseorders/model/formatter",
    "com/lab2dev/browseorders/model/models",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox, Filter, FilterOperator, formatter, models) {
        "use strict";

        return Controller.extend("com.lab2dev.browseorders.controller.Home", {
            formatter: formatter,

            onInit: function () {
                const params = {
                    urlParameters: {
                        $expand: "Customer"
                    }
                };

                const orders = models.getOrders(params);

                const list = this.byId("idList");

                list.setBusy(true);

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

            onSearch: function(oEvent) {
                const aFilters = [];
                const sQuery = oEvent.getSource().getValue();
                if (sQuery && sQuery.length > 0) {
                    const filter = new Filter("ShipName", FilterOperator.Contains, sQuery);
                    aFilters.push(filter);
                }

                // update list binding
                const oList = this.byId("idList");
                const oBinding = oList.getBinding("items");
                oBinding.filter(aFilters);
                
            },

            onNavTo: function (oEvent) {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                var oSelectedItem = oEvent.getSource();
                var sOrderID = oSelectedItem.getBindingContext("orders").getProperty("OrderID");
            
                oRouter.navTo("OrderDetails", {
                    OrderId: sOrderID
                });
            },

        });
    });
