sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
    "com/lab2dev/browseorders/model/formatter",
    "com/lab2dev/browseorders/model/models",
    'sap/ui/model/Sorter'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, ODataModel, MessageBox, Filter, FilterOperator, formatter, models, Sorter) {
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
            
            
            // onListItemPress: function (oEvent) {
            //     console.log("OI")
            //     var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1),
            //         orderPath = oEvent.getSource().getSelectedItem().getBindingContext("Orders").getPath(),
            //         order = orderPath.split("/").slice(-1).pop();
    
            //     this.oRouter.navTo("OrderDetails", {layout: oNextUIState.layout, order: order});
            // },
        });
    });
