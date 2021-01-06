const cds = require("@sap/cds");
const AuthorValidator = require("../utils/AuthorValidator");


class AuthorService {

    static async CreateAuthor(req) {
        
        req.data.ID = parseInt(Math.random() * 1000000000, 10);

        AuthorValidator.ValidateData(req.data);

        return await cds.tx(req);
    }
}

module.exports = AuthorService;