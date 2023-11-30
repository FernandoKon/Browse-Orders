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
             pattern: "MMM dd',' yyyy"
          });
 
          return oDateFormat.format(oDate);
       },

       formatDate2: function (oDate) {
            if (!oDate) {
            return "";
            }

            var oDateFormat = DateFormat.getDateInstance({
            style: "medium",
            pattern: "MM'/'dd'/'yyyy"
            });

            return oDateFormat.format(oDate);
        },

        getStatusText: function (sShippedDate, sRequiredDate) {
            const oShippedDate = new Date(sShippedDate);
            const oRequiredDate = new Date(sRequiredDate);
        
            const timeDifference = oShippedDate.getTime() - oRequiredDate.getTime();
            const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
        
            if (daysDifference >= 5) {
                return "In Time";
            } else if (daysDifference < 5 && daysDifference >= 0) {
                return "Urgent";
            } else if (daysDifference < 0) {
                return "Too Late";
            } else {
                return "Undefined Date";
            }
        },        

        status :  function (sShippedDate, sRequiredDate) {
            const oShippedDate = new Date(sShippedDate);
            const oRequiredDate = new Date(sRequiredDate);
        
            const timeDifference = oShippedDate.getTime() - oRequiredDate.getTime();
            const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
            
            if (daysDifference >= 5) {
                return "Success";
            } else if (daysDifference < 5 && daysDifference >= 0) {
                return "Warning";
            } else if (daysDifference < 0) {
                return "Error";
            } else {
                return "None";
            }
        },
        
        setTotal: function (sPrice, nQuantity){
            const nPrice = parseInt(sPrice)
            
            const total = nPrice*nQuantity
            
            return total
        },

        setOrderTotal: function () {
            
        },
    };
 });
 