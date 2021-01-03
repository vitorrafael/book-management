sap.ui.define([
    "vitorrafael/ui/bookmanagement/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "vitorrafael/ui/bookmanagement/model/formatter"
], function(BaseController, JSONModel, formatter) {
    "use strict";

    return BaseController.extend("vitorrafael.ui.bookmanagement.controller.Book", {
        
        formatter: formatter,
        
        bookID: undefined,
        
        editMode: undefined,

        onInit: function() {

            this._aValidKeys = ["bookDetails", "authorDetails"];

            var oViewModel = new JSONModel({
                selectedTab: "",
                editMode: false,
            });

            this.getRouter().getRoute("book").attachPatternMatched(this._onObjectMatched, this);

            this.setModel(oViewModel, "bookView");
        },
        
        onTabSelect: function(oEvent) {
            var sSelectedTab = oEvent.getParameter("selectedKey");
            this.getRouter().navTo("book", {
                bookID: this._oBookID,
                query: {
                    tab: sSelectedTab,
                    editMode: this.getView().getModel("bookView").getProperty("/editMode")
                }
            }, true);
        },

        onDeleteButtonPressed: function(oEvent) {
            var oContext = this.getView().getBindingContext();

            var that = this;
            oContext.delete("$auto").then(function() {
                that.getRouter().navTo("booklist");
                that.getModel().refresh();
            })
        },

        onUpdateButtonPressed: function(oEvent) {
            this.getView().getModel("bookView").setProperty("/editMode", true);
            var sSelectedTab = this.getView().getModel("bookView").getProperty("/selectedTab");
            
            if(sSelectedTab === "bookDetails") {
                this._updateBookFormProperties();
            } else {
                this._updateAuthorFormProperties();
            }

            this.byId("saveChangesButton").setVisible(true);
            this.byId("editButton").setVisible(false);
        },

        onSaveChangesButtonPressed: function(oEvent) {

            var sSelectedTab = this.getView().getModel("bookView").getProperty("/selectedTab");
            
            if(sSelectedTab === "bookDetails") {
                this._updateBookFormProperties();
            } else {
                this._updateAuthorFormProperties();
            }
            
            var sGroupID = "BookUpdateGroup";
            this.getModel().submitBatch(sGroupID)

            this.byId("saveChangesButton").setVisible(false);
            this.byId("editButton").setVisible(true);
        },

        onAuthorIdChange: function(oEvent) {
            console.log(oEvent);
            console.log(this.getView().getModel("bookView").getProperty("/editMode"));
            this.getRouter().navTo("book", {
                bookID: that.getView().getModel("bookView").getProperty("/bookID"),
                query: {
                    tab: "authorDetails",
                    editMode: that.getView().getModel("bookView").getProperty("/editMode") === "true"
                }
            }, true);
        },

        _onObjectMatched: function(oEvent) {
            var oArguments = oEvent.getParameter("arguments");
            this._oBookID = oArguments.bookID;

            this.getView().bindElement({
                path: `/Books(ID=${oArguments.bookID})`,
            });
        
            var oQuery = oArguments["?query"];
            this.getView().getModel("bookView").setProperty("/bookID", oArguments.bookID);
            if(oQuery && this._aValidKeys.indexOf(oQuery.tab) >= 0) {
                this.getView().getModel("bookView").setProperty("/selectedTab", oQuery.tab);
                this.getRouter().getTargets().display(oQuery.tab);
            } else {
                this.getRouter().navTo("book", {
                    bookID: oArguments.bookID,
                    query: {
                        tab: "bookDetails",
                        editMode: false
                    }
                }, true);
            }
            
        },

        _updateBookFormProperties: function() {
            var oBookInfoView = this.getOwnerComponent().byId("bookInfoId");

            var aInputFields = [oBookInfoView.byId("bookFormTitle"),
                                oBookInfoView.byId("numberOfPages"),
                                oBookInfoView.byId("BookReadingStatus"),
                                oBookInfoView.byId("BookStartDate"),
                                oBookInfoView.byId("BookEndDate"),
                                oBookInfoView.byId("publisherName"),
                                oBookInfoView.byId("language")];

            for(var oInputField of aInputFields) {
                this._updateInputEditableProperty(oInputField);
            }

            var oStartDate = aInputFields[3],
                oEndDate = aInputFields[4];
            
            oStartDate.setVisible(!oStartDate.getVisible());
            oEndDate.setVisible(!oEndDate.getVisible());
        },

        _updateAuthorFormProperties: function() {
            var oAuthorInfoView = this.getOwnerComponent().byId("authorInfoId");
            
            var aInputFields = [oAuthorInfoView.byId("AuthorId"),
                                oAuthorInfoView.byId("AuthorName"),
                                oAuthorInfoView.byId("AuthorCountry")];

            for(var oInputField of aInputFields) {
                this._updateInputEditableProperty(oInputField);

            var oAuthorId = aInputFields[0];
            oAuthorId.setVisible(!oAuthorId.getVisible());
            }
        },

        _updateInputEditableProperty: function(oInput) {
            oInput.setEditable(!oInput.getEditable());
        }
    });
});