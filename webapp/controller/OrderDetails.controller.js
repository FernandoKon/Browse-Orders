sap.ui.define([
    "sap/ui/core/mvc/Controller",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("com.lab2dev.browseorders.controller.OrderDetails", {

            onInit: function () {
                const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("OrderDetails").attachMatched(this._onRouteMatched, this);
            },

            _onRouteMatched: function (oEvent) {
                const sOrderId = oEvent.getParameter("arguments").orderId;
                this.loadOrderDetails(sOrderId);
            },

            loadOrderDetails: function (sOrderId) {
                const oModel = this.getView().getModel("orders");
                
                oModel.read("/Orders('" + sOrderId + "')", {
                    success: function (oData) {
                        // Manipular os dados da Order carregados com sucesso
                        console.log(oData);
                    },
                    error: function (oError) {
                        // Lidar com erros durante a leitura dos detalhes da Order
                        console.error("Erro ao carregar detalhes da Order: " + oError);
                    }
                });
            },


        });
    });