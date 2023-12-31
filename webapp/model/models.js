sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device",
    "sap/ui/model/odata/v2/ODataModel"
], 
    /**
     * provide app-view type models (as in the first "V" in MVVC)
     * 
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.ui.Device} Device
     * 
     * @returns {Function} createDeviceModel() for providing runtime info for the device the UI5 app is running on
     */
    function (JSONModel, Device, ODataModel) {
        "use strict";

        return {
            createDeviceModel: function () {
                var oModel = new JSONModel(Device);
                oModel.setDefaultBindingMode("OneWay");
                return oModel;
        },

        getODataModel: function () {
            var oDataModel = new ODataModel("/northwind/northwind.svc/");

            return new Promise(function (resolve, reject) {
                oDataModel.attachMetadataLoaded(() => {
                    resolve(oDataModel);
                });
                oDataModel.attachMetadataFailed(() => {
                    reject("Serviço indisponível no momento.");
                });
            });
        },

        getOrders: function (oURLParam) {
            const oDataModel = this.getODataModel();

            return new Promise((resolve, reject) => {
                oDataModel
                    .then((oModel) => {
                        oModel.read("/Orders", {
                            ...oURLParam,
                            success: (oData) => {
                                const oDataOrders = oData.results
                                const numberOfOrders = oDataOrders.length
                                const oModel = new JSONModel(oDataOrders)
                                oModel.setProperty("/numberOfOrders", numberOfOrders)
                                resolve(oModel);
                            },
                            error: (oError) => {
                                reject(oError);
                            }
                        });
                    })
                    .catch((oError) => {
                        reject(oError);
                    });
            });

        },

        getOrderDetail: function (OrderID) {
            const oDataModel = this.getODataModel();

            return new Promise((resolve,reject) => {
                oDataModel
                    .then((oModel) => {
                        oModel.read(`/Orders(${OrderID})`, {
                            urlParameters: {
                                $expand: "Customer,Order_Details/Product,Employee",
                            },
                            success: (oData) => {
                                const sum = this.sumPrice(oData.Order_Details.results)
                                oData.sum = sum
                                resolve(new JSONModel(oData));
                            },
                            error: (oError) => {
                                reject(oError)
                            }
                        });
                    }).catch((oError) => {
                        reject(oError);
                    })
            })
        },

        sumPrice: function(aProducts){
            const totalAmount = aProducts.reduce((acc, actualValue) => {
                      const productTotal = actualValue.Quantity * + actualValue.UnitPrice
                      return acc + productTotal
                   }, 0)
                   return totalAmount.toFixed(2)
        
        }
        
    };
});