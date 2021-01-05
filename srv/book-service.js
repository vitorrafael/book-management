const AuthorService = require("./services/AuthorService");
const BookService = require("./services/BookService");

module.exports = function(server) {

    server.before("CREATE", "Books", async req => { 
        await BookService.CreateBook(req);
    });

    server.before("CREATE", "Authors", async req => {
        await AuthorService.CreateAuthor(req);
    });
};