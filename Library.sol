pragma solidity ^0.4.11;

contract Library {
    mapping (bytes32 => address) public owner;
    bytes32[] books;
    address libaddress;
    
    event NotAvailable();
    event AllOccupied();
    event CollectBookFromLibrary();
    event YouDontHaveThisBook();
    event ReturnBookToLibrary();
    
    function Library(bytes32[] book_names) public {
        books = book_names;
        libaddress = msg.sender;
        for (uint i = 0; i < books.length; i++) {
            owner[books[i]] = libaddress;
        }
    } 
    
    function request_book(bytes32 book_name) public{
        if (check_book(book_name) == false) {
            NotAvailable();
            throw;
        }
        
        if (owner[book_name] != libaddress) {
            AllOccupied();
            throw;
        }
    
        owner[book_name] = msg.sender;
        CollectBookFromLibrary();
    }
    
    function return_book(bytes32 book_name) public {
        if (owner[book_name] != msg.sender) {
            YouDontHaveThisBook();
            return;
        }
        ReturnBookToLibrary();
        owner[book_name] = libaddress;
    }
    
    function check_book(bytes32 book_name) private returns(bool) {
        for (uint i = 0; i < books.length; i++) {
            if (books[i] == book_name)
                return true;
        }
        return false;
    }
    
    function get_owner(bytes32 book_name) public returns(address) {
        if (check_book(book_name) == false)
            throw;
            
        return owner[book_name];
    }
}

