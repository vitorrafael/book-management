"use strict";

sap.ui.define({
    isValidTitle: function (sTitle) {
        return sTitle !== "";
    },

    isValidNumberOfPages: function (iNumberOfPages) {
        return iNumberOfPages !== "" && Number.isInteger(parseFloat(iNumberOfPages));
    },

    isValidLanguage: function (sLanguage) {
        return sLanguage !== "";
    },

    isValidPublisher: function (sPublisher) {
        return sPublisher !== "";
    },

    isValidAuthor: function (iAuthorID) {
        return iAuthorID !== "" && Number.isInteger(parseFloat(iAuthorID));
    },

    isValidDates: function (sStartDate, sEndDate) {
        var oStartDate = new Date(sStartDate),
            oEndDate = new Date(sEndDate);

        if (sStartDate === "" && sEndDate === "") {
            return true;
        } else if (oStartDate > oEndDate) {
            return false;
        } else {
            return true;
        }
    },

    isValidDateFormat: function (sDate) {
        var bValidDate = false;
        var aValidDatesRegex = [/[A-Z]{1}[a-z]{2} \d{1,2}, \d{4}/, /^\d{4}[-]\d{1,2}[-]\d{1,2}$/];

        for (var rRegex of aValidDatesRegex) {
            if (rRegex.test(sDate) === true) {
                bValidDate = true;
            }
        }

        return bValidDate;
    }
});