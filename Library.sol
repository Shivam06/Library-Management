pragma solidity ^0.4.11;

contract Library {
    mapping (bytes32 => address) public owner;
    bytes32[] books;
    address libaddress;
    mapping (bytes32 => bool) public status;
    uint value;
    
    modifier checkValue(uint newValue) { require(newValue == 2*value); _; }
    
    event NotAvailable();
    event AllOccupied();
    event CollectBookFromLibrary();
    event YouDontHaveThisBook();
    event ReturnBookToLibrary();
    
    function Library(bytes32[] book_names) public
        payable
    {
        value = msg.value;
        books = book_names;
        libaddress = msg.sender;
        for (uint i = 0; i < books.length; i++) {
            owner[books[i]] = libaddress;
        }
    }
    
    function request_book(bytes32 book_name) public
        checkValue(msg.value)
        payable
    {
        if (check_book(book_name) == false) {
            NotAvailable();
            throw;
        }
        
        if (owner[book_name] != libaddress) {
            AllOccupied();
            throw;
        }
    
        owner[book_name] = msg.sender;
        status[book_name] = true;
        CollectBookFromLibrary();
    }
    
    function recieved_by_user(bytes32 book_name) public {
        if(owner[book_name] != msg.sender || status[book_name] == false){
            throw;
        }
        status[book_name] = false;
        msg.sender.transfer(value);
    }
    
    function return_book(bytes32 book_name) public {
        if (owner[book_name] != msg.sender) {
            YouDontHaveThisBook();
            return;
        }
        ReturnBookToLibrary();
        status[book_name] = true;
    }
    
    function recieved_by_library(bytes32 book_name) public {
        if(msg.sender != libaddress || status[book_name] == false){
            throw;
        }
        status[book_name] = false;
        owner[book_name].transfer(value);
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

