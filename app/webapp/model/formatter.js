sap.ui.define([
    "vitorrafael/ui/bookmanagement/utils/ReadingStatus",
    "sap/ui/core/ValueState"
], function (ReadingStatus, ValueState) {
    "use strict";

    return {
        readingStatus: function (sReadingStatus) {
            switch (sReadingStatus) {
                case ReadingStatus.ToBeRead:
                    return "To be Read";
                case ReadingStatus.Reading:
                    return "Reading";
                case ReadingStatus.PartiallyRead:
                    return "Partially Read";
                case ReadingStatus.Read:
                    return "Read";
                case ReadingStatus.ReReading:
                    return "Re-Reading";
                default:
                    return "To be Read";
            }
        },

        readingStatusState: function (sReadingStatus) {
            switch (sReadingStatus) {
                case ReadingStatus.PartiallyRead:
                    return ValueState.Warning;
                case ReadingStatus.Read:
                    return ValueState.Success;
                case ReadingStatus.Reading:
                    return ValueState.Information;
                case ReadingStatus.ReReading:
                    return ValueState.Information;
                case ReadingStatus.ToBeRead:
                    return ValueState.Error;
                default:
                    return ValueState.Error;
            }
        }

    }
});