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
            var oDataModel = this.getODataModel();

            return new Promise((resolve, reject) => {
                oDataModel
                    .then((oModel) => {
                        oModel.read("/Orders", {
                            success: (oData) => {
                                resolve(new JSONModel(oData.results));
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

        }
    };
});