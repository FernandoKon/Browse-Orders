sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
    "com/lab2dev/browseorders/model/formatter",
    "com/lab2dev/browseorders/model/models",
    'sap/m/library',
    'sap/ui/core/Fragment',
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox, Filter, FilterOperator, formatter, models, mLibrary, Fragment) {
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
                    const filterOrders = new Filter({
                        filters: [
                            new Filter("Customer/CompanyName", FilterOperator.Contains, sQuery), 
                            new Filter("OrderID", FilterOperator.EQ, sQuery)
                        ]
                    });
                    aFilters.push(filterOrders);
                }

                // update list binding
                const oList = this.byId("idList");
                const oBinding = oList.getBinding("items");
                oBinding.filter(aFilters);
                this.updateOrderCount();
                
            },  

            updateOrderCount: function () {                 
                const oList = this.getView().byId("idList");                
                const oBinding = oList.getBinding("items");  
                const iFilteredCount = oBinding.getLength();                
                const oViewModel = this.getView().getModel('orders');                
                oViewModel.setProperty("/numberOfOrders", iFilteredCount); 
            },

            onNavTo: function (oEvent) {
                const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                const oSelectedItem = oEvent.getSource();
                const sOrderID = oSelectedItem.getBindingContext("orders").getProperty("OrderID");
            
                oRouter.navTo("OrderDetails", {
                    OrderId: sOrderID
                });
            },

            _getDialog : function () {
                var oView = this.getView();
    
                if (!this._pDialog) {
                    this._pDialog = Fragment.load({
                        id: oView.getId(),
                        name: "com.lab2dev.browseorders.view.fragments.Dialog",
                        controller: this
                    }).then(function(oDialog){
                        oView.addDependent(oDialog);
                        return oDialog;
                    });
                }
                return this._pDialog;
            },

            handleOpenDialogSearchContains: function () {
                this._getDialog().then(function(oDialog) {
                oDialog
                    .setFilterSearchCallback(null)
                    .setFilterSearchOperator(mLibrary.StringFilterOperator.Contains)
                    .open();
                });
            },

            // handleOpenDialogSearchWordsStartWith: function() {
            //     this._getDialog().then(function(oDialog) {
            //         oDialog
            //             .setFilterSearchCallback(null)
            //             .setFilterSearchOperator(mLibrary.StringFilterOperator.AnyWordStartsWith)
            //             .open();
            //     });
            // },
    
            // caseSensitiveStringContains: function (sQuery, sItemText) {
            //     return sItemText.indexOf(sQuery) > -1;
            // },

        });
    });
