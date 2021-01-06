const AuthorService = require("./services/AuthorService");
const BookService = require("./services/BookService");

const log = require("cf-nodejs-logging-support");

module.exports = function(server) {

    server.before("CREATE", "Books", async req => { 
        try {
            await BookService.CreateBook(req);
        } catch(error) {
            log.error((error && error.stack) ? error.stack : error);
            req.reject(error.status || 500, error);
        }
    });

    server.before("CREATE", "Authors", async req => {
        try {
            await AuthorService.CreateAuthor(req);
        } catch(error) {
            log.error((error & error.stack) ? error.stack : error);
            req.reject(error.status || 500, error);
        }
    });
};