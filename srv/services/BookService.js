const cds = require("@sap/cds");

class BookService {

    static async CreateBook(req) {
        
        req.data.ID = parseInt(Math.random() * 1000000000, 10);

        return await cds.tx(req);
    }    
}

module.exports = BookService;