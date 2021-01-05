using book.management as bookmanagement from '../db/data-model';

service BookManagementService {

    entity Books @insert @read as projection on bookmanagement.Books;
    entity Authors @insert @read as projection on bookmanagement.Authors;
}