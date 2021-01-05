const cds = require("@sap/cds");

class AuthorService {

    static async CreateAuthor(req) {
        
        req.data.ID = parseInt(Math.random() * 1000000000, 10);

        return await cds.tx(req);
    }
}

module.exports = AuthorService;