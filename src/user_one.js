if (typeof web3 !== 'undefined') {
           web3 = new Web3(web3.currentProvider);
       } else {
           web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
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

       var LibInstance = LibContract.at('0x6d17da2be40fff5d64e7224bee553180838f012c');

       //Event - Not Available
       var event_not_available = LibInstance.NotAvailable();
       event_not_available.watch(function() {
       		$("#request-output").html("Book Not Available.")
       		console.log("Not Available");
       })

       // Event - Collect from User
       var event_collect_from_user = LibInstance.CollectBookFromUser();
       event_collect_from_user.watch(function() {
       		$("#request-output").html("Collect book from user. See your message.")
       		console.log("Collect book from user");
       });

       //Event - Collect from Library
       var event_collect_from_library = LibInstance.CollectBookFromLibrary();
       event_collect_from_library.watch(function() {
       		$("#request-output").html("Collect book from library.")
       		console.log("Collect book from library");
       });

       // Event - All Occupied
       var event_all_occupied = LibInstance.AllOccupied();
       event_all_occupied.watch(function() {
       		$("#request-output").html("All Occupied!")
       		console.log("All Occupied.");
       });

       //Event - Recieve confirmed by user
       var event_recieve_confirmed = LibInstance.RecieveConfirmedByUser();
       event_recieve_confirmed.watch(function(){
       		$("#recieved-output").html("Recieve Confirmed. Thanks!")
       		console.log("Recieve confirmed");
       });

       //Event - Return confirmed
       var event_return_confirmed = LibInstance.ReturnConfirmed();
       event_return_confirmed.watch(function() {
       		$("#return-output").html("Return Confirmed by Library")
       		console.log("Return confirmed");
       });

       // Event - Return to library
       var event_return_book_to_library = LibInstance.ReturnBookToLibrary();
       event_return_book_to_library.watch(function() {
       		$("#return-output").html("Return book to library.")
       		console.log("Return book to library.");
       });

       // Get Balance JS
       $("#balance-button").click(function() {
       		LibInstance.balance.call(function(error, result) {
       			if (!error) {
       				var bal = Number(web3.fromWei(result, "ether"));
       				console.log(bal);
       				$("#balance-output").html("Balance: " + bal.valueOf() + " Ethers");
       			}
       			else {
       				console.log(errror);
       			}	
       		});
       });

       // Message JS
       $("#mesg-button").click(function() {
       		LibInstance.access_message.call(function(error, result) {
       			if (!error) {
       				console.log(result.toString());
       				$("#mesg-output").html(result.toString());
       			}
       			else {
       				console.log(error);
       			}
       		});
       });

       // Request JS
	   $("#request-button").click(function(){
	   		var book = $("#request-book").val();
	   		console.log(book);
	   		LibInstance.request_book(book, {value:20000000000000000000});
	   });

	   // Recieve JS
	   $("#recieved-button").click(function(){
	   		var book = $("#recieved-book").val();
	   		LibInstance.recieved_by_user(book);
	   }); // write its events

	   // Return JS
	   $("#return-button").click(function(){
	   		var book = $("#return-book").val();
	   		LibInstance.return_book(book);
	   }); // Write its events
