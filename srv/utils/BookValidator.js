const CustomError = require("./CustomError");
const cds = require("@sap/cds");

const ALLOWED_READING_STATUSES = new Set([
    "Read",
    "PartiallyRead",
    "Reading",
    "ReReading",
    "ToBeRead"
]);

BAD_REQUEST = 400;

class BookValidator {

    static async ValidateData(data) {
        BookValidator.ValidateTitle(data.Title) &&
        BookValidator.ValidateDates(data.StartDate, data.EndDate) &&
        BookValidator.ValidateReadingStatus(data.ReadingStatus) &&
        BookValidator.ValidateNumberOfPages(data.Pages) &&
        BookValidator.ValidatePublisher(data.Publisher) &&
        BookValidator.ValidateLanguage(data.Language);
        await BookValidator.ValidateAuthorExists(data.Author_ID);
    }

    static ValidateTitle(title) {
        if(title === undefined || title === null || title !== "") {
            throw new CustomError("Bad Request", "Invalid Title", BAD_REQUEST);
        }
    }

    static ValidateDates(startDate, endDate) {
        if (startDate === undefined && endDate !== undefined) {
            throw new CustomError("Bad Request", "Start date should not be empty with end date filled", BAD_REQUEST);
        } 
        
        if (startDate > endDate) {
            throw new CustomError("Bad Request", "Start date should not be after end date", BAD_REQUEST);    
        }
    }

    static ValidateReadingStatus(readingStatus) {
        if(!ALLOWED_READING_STATUSES.has(readingStatus)) {
            throw new CustomError("Bad Request", "Invalid Reading Status", BAD_REQUEST);
        }
    }

    static ValidateNumberOfPages(numberOfPages) {
        if(!Number.isInteger(parseFloat(numberOfPages)) || numberOfPages <= 0) {
            throw new CustomError("Bad Request", "Invalid Number of Pages", BAD_REQUEST);
        }
    }

    static ValidatePublisher(publisher) {
        if(publisher === undefined || publisher === null || publisher !== "") {
            throw new CustomError("Bad Request", "Invalid Publisher", BAD_REQUEST);
        }
    }

    static ValidateLanguage(language) {
        if(language === undefined || language === null || language === "") {
            throw new CustomError("Bad Request", "Invalid Language", BAD_REQUEST);
        }
    }

    static async ValidateAuthorExists(authorID) {
        const authorExists = await cds.read("book.management.Authors").where({ID: authorID});
        if(authorExists.length === 0) {
            throw new CustomError(500, "Author does not exist", "Invalid Author");
        }
    }
}

module.exports = BookValidator;