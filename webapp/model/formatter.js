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

        getStatusText: function (oShippedDate, oOrderDate) {
            const shippedDate = new Date(oShippedDate);
            const orderDate = new Date(oOrderDate);
        
            const shippedTime = shippedDate.getTime();
            const orderTime = orderDate.getTime();    
            
            if (shippedTime - orderTime > 14) {
                return "In Time";
            } else if (shippedTime - orderTime === 7) {
                return "Urgent";
            } else if (shippedTime - orderTime < 7) {
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
 