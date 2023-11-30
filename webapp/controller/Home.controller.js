sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
    "com/lab2dev/browseorders/model/formatter",
    "com/lab2dev/browseorders/model/models",
    'sap/m/library',
    'sap/ui/core/Fragment',
    'sap/ui/model/Sorter',
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox, Filter, FilterOperator, formatter, models, mLibrary, Fragment, Sorter) {
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

                    this.mGroupFunctions = {
                        CompanyName: function(oContext) {
                            const name = oContext.getProperty("Customer/CompanyName");
                            return {
                                key: name,
                                text: name
                            };
                        },
                    };

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

            _getFilterDialog: function () {
                var oView = this.getView();
            
                if (!this._pFilterDialog) {
                    this._pFilterDialog = Fragment.load({
                        id: oView.getId(),
                        name: "com.lab2dev.browseorders.view.fragments.FilterDialog",
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        return oDialog;
                    });
                }
                return this._pFilterDialog;
            },
            
            _getGroupDialog: function () {
                var oView = this.getView();
            
                if (!this._pGroupDialog) {
                    this._pGroupDialog = Fragment.load({
                        id: oView.getId(),
                        name: "com.lab2dev.browseorders.view.fragments.GroupDialog",
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        return oDialog;
                    });
                }
                return this._pGroupDialog;
            },
            

            openFilterDialog: function () {
                this._getFilterDialog().then(function (oDialog) {
                    oDialog
                        .setFilterSearchCallback(null)
                        .setFilterSearchOperator(mLibrary.StringFilterOperator.Contains)
                        .open();
                });
            },
            
            openGroupDialog: function () {
                this._getGroupDialog().then(function (oDialog) {
                    oDialog
                        .setFilterSearchCallback(null)
                        .setFilterSearchOperator(mLibrary.StringFilterOperator.Contains)
                        .open();
                });
            },

            resetGroupDialog: function(oEvent) {
                this.groupReset =  true;
            },

            handleGroupDialogConfirm: function(oEvent) {
                var oList = this.byId("idList");
                var mParams = oEvent.getParameters();
                var oBinding = oList.getBinding("items");
                var sPath, bDescending=true, vGroup, aGroups = [];
            
                if (mParams.groupItem) {
                    
                    // User selected a group item
                    sPath = mParams.groupItem.getKey();
                    bDescending = mParams.groupDescending;
                    vGroup = this.mGroupFunctions[sPath];
                    aGroups.push(new Sorter(sPath, bDescending, vGroup));
            
                    // Apply the selected group settings
                    oBinding.sort(aGroups);
                } else if (this.groupReset) {
                    // User reset the grouping
                    oBinding.sort();
                    this.groupReset = false;
                }
            }
            
            

        });
    });
