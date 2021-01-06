const cds = require("@sap/cds");
const BookValidator = require("../utils/BookValidator");

class BookService {

    static async CreateBook(req) {
        
        req.data.ID = parseInt(Math.random() * 1000000000, 10);

        await BookValidator.ValidateData(req.data)

        return await cds.tx(req);
    }    
}

module.exports = BookService;