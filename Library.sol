pragma solidity ^0.4.11;

contract Library {
    mapping (bytes32 => address) public owner;
    bytes32[] books;
    address libaddress;
    enum State {Stable, TBR, TBC, TBT} //default state is the first one.
    // TBC - To be collected, TBT - To be transferred, TBR - To be returned
    
    mapping (bytes32 => State) public status;
    uint value;
    mapping (address => string) message;
    mapping (bytes32 => address) public preowner;
    // mapping (address => bytes32) phone; - Later
    
    modifier checkValue(uint newValue) { require(newValue == 2*value); _; }
    modifier checkNotOwner(bytes32 book) {require(msg.sender != owner[book]); _;}
    modifier checkOwner(bytes32 book) {require(msg.sender == owner[book]); _;}
    modifier checkLibrary() {require(msg.sender == libaddress); _;}
    modifier checkStatus(bytes32 book) {require(status[book] != State.Stable); _;}
    modifier checkNonZeroValue(uint v) { require(v > 0); _; }
    
    event NotAvailable();
    event AllOccupied();
    event CollectBookFromLibrary();
    event YouDontHaveThisBook();
    event ReturnBookToLibrary();
    event CollectBookFromUser();
    event RecieveConfirmedByUser();
    event RecieveConfirmedByLibrary();
    event ContractDeployed();
    event ReturnConfirmed();
    
    function Library(bytes32[] book_names) 
        checkNonZeroValue(msg.value)
        public
        payable
    {
        value = msg.value;
        books = book_names;
        libaddress = msg.sender;
        for (uint i = 0; i < books.length; i++) {
            owner[books[i]] = libaddress;
        }
        
        ContractDeployed();
    }
    
    function request_book(bytes32 book_name) 
        public
        checkValue(msg.value)
        checkNotOwner(book_name)
        payable
    {
        if (check_book(book_name) == false) {
            NotAvailable();
            msg.sender.transfer(2*value);
            message[msg.sender] = "Book not available."; // Book name
            return;
        }
        
        if (owner[book_name] != libaddress) {
            if (status[book_name] == State.TBR) {
                address add = owner[book_name];
                preowner[book_name] = add;
                owner[book_name] = msg.sender;
                status[book_name] = State.TBT;
                message[add] = "Coordinate with new owner with phone number : 999";
                message[msg.sender] = "Book available with person with phone number: 988";
                CollectBookFromUser();
                return;
            }
            else {
                AllOccupied();
                msg.sender.transfer(2*value);
                message[msg.sender] = "Book occupied."; // Book name
                return;
            }
        }
        else {
            owner[book_name] = msg.sender;
            status[book_name] = State.TBC;
            CollectBookFromLibrary();
            preowner[book_name] = libaddress;
            message[msg.sender] = "Collect from library!";
        }
    }
    
    function recieved_by_user(bytes32 book_name) 
        checkOwner(book_name)
        checkStatus(book_name)
        public
    {
        if(status[book_name] == State.TBC) {
            msg.sender.transfer(value);
            message[msg.sender] = "Ethers have been transferred to your account."; // Mention value
        }
        if(status[book_name] == State.TBT) {
            msg.sender.transfer(value);
            preowner[book_name].transfer(value);
            message[msg.sender] = "Recieve Confirmed! Ethers have been transferred to your account.";
            message[preowner[book_name]] = "Recieve confirmed by the user. Ethers have been transferred to your account."; // Mention address of the user
        }
        status[book_name] = State.Stable;
        message[msg.sender] = "Recieve Confirmed! Your ethers have been transferred to your account.";
        RecieveConfirmedByUser();
    }
    
    function return_book(bytes32 book_name) 
        checkOwner(book_name)
        public 
    {
        if (status[book_name] == State.TBC) {
            status[book_name] = State.Stable;
            owner[book_name] = libaddress;
            msg.sender.transfer(2*value);
            message[msg.sender] = "Return Confirmed!";
            ReturnConfirmed();
        }
        else if (status[book_name] == State.TBT) {
            status[book_name] = State.TBR;
            address add = owner[book_name];
            owner[book_name] = preowner[book_name];
            msg.sender.transfer(2*value);
            message[owner[book_name]] = "Owner doesn't want the book anymore. Return to Library";
            message[msg.sender] = "Return Confirmed! Your ethers have been transferred to your account.";
            ReturnConfirmed();
            return;
        }
        else {
            ReturnBookToLibrary();
            status[book_name] = State.TBR;
            preowner[book_name] = msg.sender;
            message[msg.sender] = "Return book to library";
            return;
        }
    }
    
    function recieved_by_library(bytes32 book_name) 
        checkLibrary()
        checkStatus(book_name)
        public 
    {
        if (status[book_name] != State.TBR) {
            throw;
        }
        status[book_name] = State.Stable;
        address add = owner[book_name];
        owner[book_name].transfer(value);
        owner[book_name] = libaddress;
        RecieveConfirmedByLibrary();
        message[add] = "Library has recieved the book. Thanks!";
        return;
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
    
    function balance() 
        public 
        returns(uint)
    {
        return msg.sender.balance; 
    }
}