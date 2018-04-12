pragma solidity ^0.4.11;

contract Library {
    mapping (bytes32 => address) public owner;
    bytes32[] books;
    address libaddress;
    enum State {Stable, TBR, TBC, TBT} //default state is the first one.
    State state;
    mapping (bytes32 => State) status;
    uint value;
    mapping (address => string) message;
    mapping (bytes32 => address) public preowner;
    // mapping (address => bytes32) phone; - Later
    
    modifier checkValue(uint newValue) { require(newValue == 2*value); _; }
    
    event NotAvailable();
    event AllOccupied();
    event CollectBookFromLibrary();
    event YouDontHaveThisBook();
    event ReturnBookToLibrary();
    event CollectBookFromUser();
    event RecieveConfirmedByUser();
    event RecieveConfirmedByLibrary();
    
    function Library(bytes32[] book_names) 
        public
        payable
    {
        value = msg.value;
        books = book_names;
        libaddress = msg.sender;
        for (uint i = 0; i < books.length; i++) {
            owner[books[i]] = libaddress;
        }
    }
    
    function request_book(bytes32 book_name) 
        public
        checkValue(msg.value)
        payable
    {
        if (check_book(book_name) == false) {
            NotAvailable();
            throw;
        }
        
        if (owner[book_name] != libaddress && status[book_name] == State.TBR) {
            address add = owner[book_name];
            preowner[book_name] = add;
            owner[book_name] = msg.sender;
            status[book_name] = State.TBT;
            message[add] = "Coordinate with new owner with phone number : 999";
            message[msg.sender] = "Book available with person with phone number: 988";
            CollectBookFromUser();
            return;
        }
    
        owner[book_name] = msg.sender;
        status[book_name] = State.TBC;
        CollectBookFromLibrary();
    }
    
    function recieved_by_user(bytes32 book_name) 
        public
    {
        if(owner[book_name] != msg.sender || status[book_name] == State.Stable){
            throw;
        }
        if(status[book_name] == State.TBC) {
            msg.sender.transfer(value);
        }
        if(status[book_name] == State.TBT) {
            msg.sender.transfer(value);
            preowner[book_name].transfer(value);
        }
        status[book_name] = State.Stable;
        RecieveConfirmedByUser();
    }
    
    function return_book(bytes32 book_name) 
        public 
    {
        if (owner[book_name] != msg.sender) {
            YouDontHaveThisBook();
            return;
        }
        ReturnBookToLibrary();
        status[book_name] = State.TBR;
    }
    
    function recieved_by_library(bytes32 book_name) 
        public 
    {
        if(msg.sender != libaddress || status[book_name] == State.Stable){
            throw;
        }
        status[book_name] = State.Stable;
        owner[book_name].transfer(value);
        owner[book_name] = libaddress;
        RecieveConfirmedByLibrary();
    }
    
    function check_book(bytes32 book_name) 
        private 
        returns(bool) 
    {
        for (uint i = 0; i < books.length; i++) {
            if (books[i] == book_name)
                return true;
        }
        return false;
    }
    
    function get_owner(bytes32 book_name) 
        public 
        returns(address) 
    {
        if (check_book(book_name) == false)
            throw;
            
        return owner[book_name];
    }
    
    function access_message() 
        public 
        returns(string) 
    {
        return message[msg.sender];
    }
}

