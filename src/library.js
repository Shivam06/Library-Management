if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    web3 = new Web3(new Web3.providers.HttpProvider('http://10.60.31.117:8545'));
}

var accounts = web3.eth.accounts;

web3.eth.defaultAccount = web3.eth.accounts[0];

var LibraryContract = web3.eth.contract([
	{
		"anonymous": false,
		"inputs": [],
		"name": "ReturnConfirmed",
		"type": "event"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "access_message",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "balance",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "book_name",
				"type": "bytes32"
			}
		],
		"name": "get_owner",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "book_name",
				"type": "bytes32"
			}
		],
		"name": "recieved_by_library",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "book_name",
				"type": "bytes32"
			}
		],
		"name": "recieved_by_user",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "book_name",
				"type": "bytes32"
			}
		],
		"name": "request_book",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "book_name",
				"type": "bytes32"
			}
		],
		"name": "return_book",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"name": "book_names",
				"type": "bytes32[]"
			}
		],
		"payable": true,
		"stateMutability": "payable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [],
		"name": "ContractDeployed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [],
		"name": "RecieveConfirmedByLibrary",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [],
		"name": "NotAvailable",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [],
		"name": "AllOccupied",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [],
		"name": "CollectBookFromLibrary",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [],
		"name": "YouDontHaveThisBook",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [],
		"name": "ReturnBookToLibrary",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [],
		"name": "CollectBookFromUser",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [],
		"name": "RecieveConfirmedByUser",
		"type": "event"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "owner",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "preowner",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "status",
		"outputs": [
			{
				"name": "",
				"type": "uint8"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]);
        
Library = LibraryContract.at('0xc9aaf1dd281bb8fb7236cc0e0a2c5f5d60b60724');

Library.RecieveConfirmedByLibrary().watch(function(error){
    if(!error) {
        alert("Recieve Confirmed!");
    } else {
        alert('Some error occured');
    }
});

Library.NotAvailable().watch(function(error){
    if(!error) {
        alert("Book not available!");
    } else {
        alert("Some error occured");
    }
});

$("#recieve_confirm_button").click(function() {
    Library.recieved_by_library($("#recieve_confirm_book_name").val());
});

$("#get_owner_button").click(function() {
    Library.get_owner.call($("#get_owner_book_name").val(), function(error, address){
        if(!error) {
            $("#owner_address").html(address);
        } else {
            console.log(error);
            $("#owner_address").html("");
        }
    });
});