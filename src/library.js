window.onload = function() {
	$("#notify-box").hide();
};

if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
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
		"anonymous": false,
		"inputs": [],
		"name": "AllOccupied",
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
		"name": "RecieveConfirmedByUser",
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
		"name": "ContractDeployed",
		"type": "event"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "delete_message",
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
		"constant": true,
		"inputs": [],
		"name": "access_message",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "balance",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
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

Library = LibraryContract.at('0xb427c9883b5202f2438bc08e2f57c5f2a049c3e9');

var event_recieve_confirmed = Library.RecieveConfirmedByLibrary();

$("#recieved-button").click(function() {
    Library.recieved_by_library($("#recieved-book").val(), {gas: 3000000});

    event_recieve_confirmed.watch(function(){
    	$("#notify").html("Recieve confirmed");
    	$("#notify-box").show();
    });
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

$("#get_status_button").click(function() {
	Library.status.call($("#get_status_book_name").val(), function(error, result){
		if(!error) {
			var key = result["c"][0];
			var ans;
			if(key == 0) ans = "Stable";
			else if(key == 1) ans = "To Be Returned";
			else if(key == 2) ans = "To Be Collected";
			else ans = "To Be Transferred";
			$("#book_status").html(ans);
		} else {
			console.log(error);
		}
	});
});