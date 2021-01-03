sap.ui.define([
    "vitorrafael/ui/bookmanagement/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "vitorrafael/ui/bookmanagement/model/formatter",
    "sap/m/MessageBox",
    "sap/ui/model/Sorter",
    "sap/ui/core/ValueState",
    "vitorrafael/ui/bookmanagement/utils/Validator"
], function(BaseController, JSONModel, Filter, FilterOperator, formatter, MessageBox, Sorter, ValueState, Validator) {
    "use strict";

    return BaseController.extend("vitorrafael.ui.bookmanagement.controller.Booklist", {
        formatter: formatter,

        canCreateNewBook: false,
        // Lifecycle Methods

        onInit: function() {
            var oViewModel = new JSONModel();

            this.getView().setModel(oViewModel, "view");
        },

        // Event Handlers

        onFilterBooks: function(oEvent) {
            var aFilter = [];
            var sQuery = oEvent.getParameter("query");

            if(sQuery) {
                aFilter.push(new Filter("title", FilterOperator.Contains, sQuery));
            }

            var oTable = this.byId("bookTable");
            var oTableItems = oTable.getBinding("items");
            
            oTableItems.filter(aFilter);
        },

        onCreateBook: function(oEvent) {
            var oCreateBookDialog = this.byId("createBookDialog");
            var oAuthorsListBinding = this.byId("BookAuthor::new").getBinding("suggestionItems");
            
            if(this._oCurrentCreateBookContext === undefined) {
                var oContext = this.byId("bookTable").getBinding("items").create({
                    ID: parseInt(Math.random() * 1000000000, 10),
                });
            } else {
                var oContext = this._oCurrentCreateBookContext;
            }

            this.byId("bookTable").setSelectedItem(this.byId("bookTable").getItems()[oContext.getIndex()]);

            if(oAuthorsListBinding.isSuspended()) {
                oAuthorsListBinding.sort(new Sorter("Name"));
                oAuthorsListBinding.filter(new Filter("ID", FilterOperator.NE, 0));
                oAuthorsListBinding.resume();
            }

            this._oCurrentCreateBookContext = oContext;
            oCreateBookDialog.setBindingContext(oContext);
            oCreateBookDialog.open();

            oContext.created().then( function() {
                MessageBox.success(`Book created: ${oContext.getProperty("Title")}`)
            }, function(error) {
                console.log(error)
            });
 
        },

        onConfirmBookCreation: function(oEvent) {
            this._validateNewBook();
            if(this.canCreateNewBook === true) {
                var sGroupID = "BookUpdateGroup";

                this.getModel().submitBatch(sGroupID);
                this._oCurrentCreateBookContext = undefined;
                this.byId("createBookDialog").close();
            }
        },
        
        onCancelBookCreation: function(oEvent) {
            var oContext = this._oCurrentCreateBookContext;

            var that = this;

            var sConfirmText = this.getResourceBundle().getText("Dialog.Confirmation.CancellationText");
            var sTitle= this.getResourceBundle().getText("Dialog.Confirmation.CancellationTitle");

            var that = this;
            MessageBox.confirm(sConfirmText, {
				title: sTitle,
				onClose: function(sAction) {
					if(sAction === MessageBox.Action.OK) {
                        that._oCurrentCreateBookContext = undefined;
                        oContext.delete();
                        that._clearCreateBookDialogBox();
                        that.byId("createBookDialog").close();
					}
				}
			});
        },

        onAddAuthor: function() {
            var oCreateAuthorDialog = this.byId("createAuthorDialog");
            var oAuthorsListBinding = this.getModel().bindList("/Authors", undefined, undefined, undefined, {
                $$updateGroupId: "AuthorUpdateGroup"
            });

            var oContext = oAuthorsListBinding.create({
                ID: parseInt(Math.random() * 1000000000, 10)
            })
            
            var that = this;
            
            this.byId("createBookDialog").close()

            oCreateAuthorDialog.setBindingContext(oContext);
            oCreateAuthorDialog.open();
            
            this._oCurrentCreateAuthorContext = oContext;

            oContext.created().then( function() {
                MessageBox.success(`Author Created: ${oContext.getProperty("Name")}`)
            }, function(error) {
                console.log(error)
            });
        },

        onConfirmAuthorCreation: function(oEvent) {
            var sGroupID = "AuthorUpdateGroup";

            this.getModel().submitBatch(sGroupID);

            var oAuthorsListBinding = this.byId("BookAuthor::new").getBinding("suggestionItems");
            oAuthorsListBinding.refresh();

            this.byId("createAuthorDialog").close()
            this.byId("createBookDialog").open();
        },
        
        onCancelAuthorCreation: function(oEvent) {
            var oContext = this._oCurrentCreateAuthorContext;

            var sConfirmText= this.getResourceBundle().getText("Dialog.Confirmation.CancellationText");
            var sTitle= this.getResourceBundle().getText("Dialog.Confirmation.CancellationTitle");

            var that = this;
            MessageBox.confirm(sConfirmText, {
				title: sTitle,
				onClose: function(sAction) {
					if(sAction === MessageBox.Action.OK) {
                        oContext.delete();
                        that.byId("createAuthorDialog").close();
                        that.byId("createBookDialog").open()
					}
				}
			});
        },

        onStartDateChange: function(oEvent) {
            var oStartDate = oEvent.getSource();
            var oResourceBundle = this.getResourceBundle();
            var oEndDate = this.byId("BookEndDate::new");
            
            if(!Validator.isValidDateFormat(oStartDate.getValue())) {
                this._setValueState(oStartDate, ValueState.Error, oResourceBundle.getText("Validation.InvalidDateValue"));
            } else if(!Validator.isValidDates(oStartDate.getValue(), oEndDate.getValue())) {
                this._setValueState(oStartDate, ValueState.Error, oResourceBundle.getText("Validation.InvalidStartDate"));
                this._setValueState(oStartDate, ValueState.Error, oResourceBundle.getText("Validation.InvalidEndDate"));
            } else {
                this._clearState(oEndDate);
                this._clearState(oStartDate);
            }
        },

        onEndDateChange: function(oEvent) {

            var oEndDate = oEvent.getSource();
            var oResourceBundle =  this.getResourceBundle();
            var oStartDate = this.byId("BookStartDate::new");
 
            if(!Validator.isValidDateFormat(oEndDate.getValue())) {
                this._setValueState(oEndDate, ValueState.Error, oResourceBundle.getText("Validation.InvalidDateValue"));
            } else if(oEndDate.getValue() !== "" && oStartDate.getValue() === "") {
                this._setValueState(oEndDate, ValueState.Error, oResourceBundle.getText("Validation.StartDateEmpty"));
                oStartDate.setRequired(true);
            } else if(!Validator.isValidDates(oStartDate.getValue(), oEndDate.getValue())) {
                this._setValueState(oStartDate, ValueState.Error, oResourceBundle.getText("Validation.InvalidStartDate"));
                this._setValueState(oEndDate, ValueState.Error, oResourceBundle.getText("Validation.InvalidEndDate"));
            } else {
                this._clearState(oEndDate);
                this._clearState(oStartDate);
            }
        },

        onTitleChange: function(oEvent) {
            this._validateTitle();
        },

        onNumberOfPagesChange: function(oEvent) {
            this._validateNumberOfPages();
        },

        onLanguageChange: function(oEvent) {
            this._validateLanguage();
        },

        onPublisherChange: function(oEvent) {
            this._validatePublisher();
        },

        onPress: function(oEvent) {
            this._showObject(oEvent.getSource());
        },

        // Internal Methods
        _showObject: function(oItem) {
            this.getRouter().navTo("book", {
                bookID: oItem.getBindingContext().getProperty("ID")
            });
        },

        _validateNewBook: function() {
            this._validateTitle();
            this._validateNumberOfPages();
            this._validateLanguage();
            this._validatePublisher();
            this._validateAuthor();
        },

        _validateTitle: function() {
            var oTitle = this.byId("BookTitle::new"),
                oResourceBundle = this.getResourceBundle();

            if(!Validator.isValidTitle(oTitle.getValue())) {
                this._setValueState(oTitle, ValueState.Error, oResourceBundle.getText("Validation.InvalidBookTitle"));
                this.canCreateNewBook = false;
            } else {
                this._setValueState(oTitle, ValueState.None, null);
                this.canCreateNewBook = true;
            }
        },

        _validateNumberOfPages: function() {
            var oNumberOfPages = this.byId("BookPages::new"),
                oResourceBundle = this.getResourceBundle();
            if(!Validator.isValidNumberOfPages(oNumberOfPages.getValue())) {
                this._setValueState(oNumberOfPages, ValueState.Error, oResourceBundle.getText("Validation.InvalidBookNumberOfPages"));
                this.canCreateNewBook = false;
            } else {
                this._setValueState(oNumberOfPages, ValueState.None, null);
                this.canCreateNewBook = true;
            }
        },

        _validateLanguage: function() {
            var oLanguage = this.byId("BookLanguage::new"),
                oResourceBundle = this.getResourceBundle();
            if(!Validator.isValidLanguage(oLanguage.getValue())) {
                this._setValueState(oLanguage, ValueState.Error, oResourceBundle.getText("Validation.InvalidBookLanguage"));
                this.canCreateNewBook = false;
            } else {
                this._setValueState(oLanguage, ValueState.None, null);
                this.canCreateNewBook = true;
            }
        },

        _validatePublisher: function() {
            var oPublisher = this.byId("BookPublisher::new"),
                oResourceBundle = this.getResourceBundle();
            if(!Validator.isValidPublisher(oPublisher.getValue())) {
                this._setValueState(oPublisher, ValueState.Error, oResourceBundle.getText("Validation.InvalidBookPublisher"));
                this.canCreateNewBook = false;
            } else {
                this._setValueState(oPublisher, ValueState.None, null);
                this.canCreateNewBook = true;
            }
        },

        _validateAuthor: function() {
            var oAuthorId = this.byId("BookAuthor::new"),
                oResourceBundle = this.getResourceBundle();
            if(!Validator.isValidAuthor(oAuthorId.getValue())) {
                this._setValueState(oAuthorId, ValueState.Error, oResourceBundle.getText("Validation.InvalidBookAuthor"));
                this.canCreateNewBook = false;
            } else {
                this._setValueState(oAuthorId, ValueState.None, null);
                this.canCreateNewBook = true;
            }
        },

        _clearCreateBookDialogBox: function() {
            var oFields = [
                this.byId("BookTitle::new"),
                this.byId("BookPages::new"),
                this.byId("BookLanguage::new"),
                this.byId("BookStartDate::new"),
                this.byId("BookEndDate::new"),
                this.byId("BookPublisher::new"),
                this.byId("BookAuthor::new")
            ]         

            for(var oField of oFields) {
                this._clearState(oField);
            }
        },

        _clearState: function(oObject) {
            oObject.setValueState(ValueState.None);
            oObject.setValueStateText(null);
            oObject.setRequired(false);
        },

        _setValueState: function(oObject, sValueState, sValueStateText) {
            oObject.setValueState(sValueState);
            oObject.setValueStateText(sValueStateText);
        }
    });
});