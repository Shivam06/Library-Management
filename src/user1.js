
window.onload = function() {
	update_balance();
	update_message();
	$("#notify-box").hide();
};

if (typeof web3 !== 'undefined') {
	web3 = new Web3(web3.currentProvider);
} 
else {
	web3 = new Web3(new Web3.providers.HttpProvider("http://10.60.31.117:8545"));
}

web3.eth.defaultAccount = web3.eth.accounts[1];

var LibContract = web3.eth.contract([
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

var LibInstance = LibContract.at('0x0226dcf45eb20d6a5071e7a460a09322392bf762');


//Event - Not Available
var event_not_available = LibInstance.NotAvailable();
// Event - Collect from User
//var event_collect_from_user = LibInstance.CollectBookFromUser();
//Event - Collect from Library
//var event_collect_from_library = LibInstance.CollectBookFromLibrary();
// Event - All Occupied
var event_all_occupied = LibInstance.AllOccupied();
//Event - Recieve confirmed by user
var event_recieve_confirmed = LibInstance.RecieveConfirmedByUser();
//Event - Return confirmed
var event_return_confirmed = LibInstance.ReturnConfirmed();
// Event - Return to library
//var event_return_book_to_library = LibInstance.ReturnBookToLibrary();



// Get Balance JS - No button on load always call
function update_balance() {
	LibInstance.balance.call(function(error, result) {
		if (!error) {
			var bal = Number(web3.fromWei(result, "ether"));
			console.log(bal);
			$("#balance-output").html(bal.valueOf() + " Ethers");
		}
		else {
			console.log(error);
		}	
	});
}

// Get message
function update_message() {
	LibInstance.access_message.call(function(error, result) {
		if (!error) {
			if (result.toString() == "") {
				$("#delete-message").hide();
				$("#message").html(result.toString());
			}
			else {
				console.log(result.toString());
				$("#message").html(result.toString());
				$("#delete-message").show();
			}
		}
		else {
			console.log(error);
		}
	});
}


// Request JS
$("#request-button").click(function(){
	var book = $("#request-book").val();
	console.log(book);
	LibInstance.request_book(book, {value:20000000000000000000, gas:3000000, from: web3.eth.accounts[1]});

	event_not_available.watch(function() {
		$("#notify").html("Book Not Available.")
		$("#notify-box").show();
		console.log("Not Available");
	});

	/*event_collect_from_user.watch(function() {
		$("#notify").html("Collect book from user. See your message.")
		console.log("Collect book from user");
	 });*/

	/*event_collect_from_library.watch(function() {
		$("#notify").html("Collect book from library.")
		console.log("Collect book from library");
	});*/

	event_all_occupied.watch(function() {
		$("#notify").html("All Occupied!")
		$("#notify-box").show();
		console.log("All Occupied.");
	});

	update_balance();
	update_message();
});

// Recieve JS
$("#recieved-button").click(function(){
	var book = $("#recieved-book").val();
	LibInstance.recieved_by_user(book);

	event_recieve_confirmed.watch(function(){
		$("#notify").html("Recieve Confirmed! Your ethers have been transferred to your account.")
		$("#notify-box").show();
		console.log("Recieve confirmed");
	});

	update_balance();
	update_message();
}); // write its events

// Return JS
$("#return-button").click(function(){
	var book = $("#return-book").val();
	LibInstance.return_book(book);

	event_return_confirmed.watch(function() {
		$("#notify").html("Return Confirmed by Library")
		$("#notify-box").show();
		console.log("Return confirmed");
	});

	update_message();
	update_balance();
	/*event_return_book_to_library.watch(function() {
		$("#notify").html("Return book to library.")
		console.log("Return book to library.");
	});*/
}); // Write its events

// Delete Message button
$("#delete-message").click(function() {
	LibInstance.delete_message();
	update_message();
	$("#delete-message").hide();
});

$("#delete-notify").click(function() {
	$("#notify-box").hide();
});