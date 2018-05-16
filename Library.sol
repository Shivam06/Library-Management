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
    //event CollectBookFromLibrary();
    //event YouDontHaveThisBook();
    //event ReturnBookToLibrary();
    //vent CollectBookFromUser();
    event RecieveConfirmedByUser();
    event RecieveConfirmedByLibrary();
    event ContractDeployed();
    event ReturnConfirmed();
    event BookAlreadyPresent();
    event NewBookAdded();
    
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
        if (check_book(book_name) == 0) {
            NotAvailable();
            msg.sender.transfer(2*value);
            // message[msg.sender] = "Book not available."; // Book name - One time
            return;
        }
        
        if (owner[book_name] != libaddress) {
            if (status[book_name] == State.TBR) {
                address add = owner[book_name];
                preowner[book_name] = add;
                owner[book_name] = msg.sender;
                status[book_name] = State.TBT;
                message[add] = "Coordinate with new owner with phone number : 999"; //  All time
                message[msg.sender] = "Collect book from member with phone number: 988";
                //CollectBookFromUser();
                return;
            }
            else {
                AllOccupied();
                msg.sender.transfer(2*value);
                //message[msg.sender] = "Book occupied."; // Book name - One time
                return;
            }
        }
        else {
            owner[book_name] = msg.sender;
            status[book_name] = State.TBC;
            //CollectBookFromLibrary();
            preowner[book_name] = libaddress;
            message[msg.sender] = "Collect book from library!"; // All time
        }
    }
    
    function recieved_by_user(bytes32 book_name) 
        checkOwner(book_name)
        checkStatus(book_name)
        public
    {
        if(status[book_name] == State.TBC) {
            msg.sender.transfer(value);
            // message[msg.sender] = "Ethers have been transferred to your account."; // Mention value - One 
            // time
        }
        if(status[book_name] == State.TBT) {
            msg.sender.transfer(value);
            preowner[book_name].transfer(value);
            //message[msg.sender] = "Recieve Confirmed! Ethers have been transferred to your account.";
            message[preowner[book_name]] = "Recieve confirmed by the user. Ethers have been transferred to your account."; // Mention address of the user
        }
        status[book_name] = State.Stable;
        RecieveConfirmedByUser();
        message[msg.sender] = "";
        //message[msg.sender] = "Recieve Confirmed! Your ethers have been transferred to your account.";
    }
    
    function return_book(bytes32 book_name) 
        checkOwner(book_name)
        public 
    {
        if (status[book_name] == State.TBC) {
            status[book_name] = State.Stable;
            owner[book_name] = libaddress;
            msg.sender.transfer(2*value);
            //message[msg.sender] = "Return Confirmed!"; // One time
            ReturnConfirmed();
            message[msg.sender] = "";
        }
        else if (status[book_name] == State.TBT) {
            status[book_name] = State.TBR;
            address add = owner[book_name];
            owner[book_name] = preowner[book_name];
            msg.sender.transfer(2*value); // All time
            message[owner[book_name]] = "Owner doesn't want the book anymore. Return to Library";
            //message[msg.sender] = "Return Confirmed! Your ethers have been transferred to your account.";
            ReturnConfirmed(); // Problem
            message[msg.sender] = "";
            return;
        }
        else {
            //ReturnBookToLibrary();
            status[book_name] = State.TBR;
            preowner[book_name] = msg.sender;
            message[msg.sender] = "Return book to library"; // All time
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
        message[add] = "Library has recieved the book. Your ethers have been transferred to your account"; // One time
        return; // Problem
    }
    
    function check_book(bytes32 book_name) 
        private 
        constant
        returns(uint256) 
    {
        uint256 i = 0;
        while (i < books.length) {
            if (books[i] == book_name)
                return i+1;
            i++;
        }
        return 0;
    }
    
    function get_owner(bytes32 book_name) 
        public 
        constant // changed
        returns(address) 
    {
        if (check_book(book_name) == 0)
            throw;
            
        return owner[book_name];
    }


    function access_message() 
        public 
        constant
        returns(string) 
    {
        return message[msg.sender];
    }
    
    function balance() 
        public 
        constant
        returns(uint)
    {
        return msg.sender.balance; 
    }
    
    function delete_message() 
        public 
    {
        message[msg.sender] = "";  
        return;
    }
    
    function get_books()
        checkLibrary()
        public
        constant
        returns(bytes32[])
    {
        return books;
    }
    
    function add_book(bytes32 book_name)
        public
        checkLibrary()
    {
        if(check_book(book_name) != 0){
            BookAlreadyPresent();
            return;
        }
        books.push(book_name);
        owner[book_name] = libaddress;
        NewBookAdded();
    }
    
    function get_value()
        public
        constant
        returns(uint)
    {
        return value;
    }   
    
    /*function remove_book(bytes32 book_name)
        public
        checkLibrary()
    {
        int256 index = check_book(book_name);
        if(index == -1){
            return;
        }
        if(status[book_name] != State.Stable)
        {
            BookNotStable();
            return;
        }
        if(owner[book_name] != libaddress)
        {
            BookOwnedBySomeUser();
            return;
        }
        books.remove(index);
        delete owner[book_name];
        delete status[book_name];
    }*/
}