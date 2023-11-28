sap.ui.define([
    "sap/ui/core/format/DateFormat"
 ], function (DateFormat) {
    "use strict";
 
    return {
       formatDate: function (oDate) {
          if (!oDate) {
             return "";
          }
 
          var oDateFormat = DateFormat.getDateInstance({
             style: "medium",
             pattern: "dd 'de' MMM. 'de' yyyy"
          });
 
          return oDateFormat.format(oDate);
       },

       formatDate2: function (oDate) {
            if (!oDate) {
            return "";
            }

            var oDateFormat = DateFormat.getDateInstance({
            style: "medium",
            pattern: "dd'/'MM'/'yyyy"
            });

            return oDateFormat.format(oDate);
        },

        getStatusText: function (sShippedDate, sOrderDate) {
            const shippedDate = new Date(sShippedDate);
            const orderDate = new Date(sOrderDate)
        
            if (shippedDate === orderDate) {
                return "In Time";
            } else if (shippedDate < orderDate ) {
                return "Urgent";
            } else if (shippedDate > orderDate) {
                return "Too Late";
            } else {
                return "Invalid Date";
            }
        },

       status :  function (sStatus) {
        if (sStatus === "In Time") {
            return "Success";
        } else if (sStatus === "Urgent") {
            return "Warning";
        } else if (sStatus === "Too late"){
            return "Error";
        } else {
            return "None";
        }
        },
    };
 });
 