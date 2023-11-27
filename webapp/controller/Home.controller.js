sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
    "com/lab2dev/browseorders/model/formatter",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, ODataModel, MessageBox, Filter, FilterOperator, formatter) {
        "use strict";

        return Controller.extend("com.lab2dev.browseorders.controller.Home", {
            formatter: formatter,

            onInit: function () {
                const oDataModel = new ODataModel("/northwind/northwind.svc/");

                oDataModel.read("/Orders", {
                    success: (oOrders) => {
                        console.log(oOrders);
                        const orders = oOrders.results;

                        console.log(orders);

                        const oModel = new JSONModel(orders);
                        this.getView().setModel(oModel, 'orders');
                    },
                    error: (oError) => {
                        MessageBox.error("Erro ao carregar os dados.")
                    }
                })
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

        });
    });
