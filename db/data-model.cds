namespace book.management;

using {
    Country,
    Language,
    managed
} from '@sap/cds/common';

entity Books {
    key ID            : Integer;
        Title         : localized String not null;
        Author        : Association to one Authors not null;
        Pages         : Integer not null;
        Language      : localized String not null;
        StartDate     : Date null;
        EndDate       : Date null;
        ReadingStatus : String default 'ToBeRead';
        Publisher     : String not null;
}

entity Authors {
    key ID      : Integer;
        Name    : String;
        Country : localized String;
        Books   : Association to many Books
                      on Books.Author = $self;
}
