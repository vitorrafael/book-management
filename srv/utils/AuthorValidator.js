const CustomError = require('./CustomError');

const BAD_REQUEST = 400;

class AuthorValidator {

    static ValidateData(data) {
        AuthorValidator.ValidateName(data.Name);
        AuthorValidator.ValidateCountry(data.Country);
    }

    static ValidateName(name) {
        if(name === undefined || name === null || name ==="") {
            throw new CustomError(BAD_REQUEST, "Author name is not valid", "Invalid Author Name");
        }
    }

    static ValidateCountry(country) {
        if(country === undefined || country === null || country === "") {
            throw new CustomError(BAD_REQUEST, "Author country is not valid", "Invalid Author Country");
        }
    }

}

module.exports = AuthorValidator;