// get value from contract
window.onload = function() {
	update_balance();
	update_message();
	$("#notify-box").hide();
};

json_data = data;
var url = json_data["url"];
var abi = json_data["abi"];
var gas_val = json_data["gas"];
var address = json_data["address"];
var val = json_data["value"];


if (typeof web3 !== 'undefined') {
	web3 = new Web3(web3.currentProvider);
} 
else {
	web3 = new Web3(new Web3.providers.HttpProvider(url));
}

var num;
num = Number($("#user-number").text());
console.log(num);

web3.eth.defaultAccount = web3.eth.accounts[num];
var LibContract = web3.eth.contract(abi);
var LibInstance = LibContract.at(address);


//Event - Not Available
var event_not_available = LibInstance.NotAvailable();
// Event - All Occupied
var event_all_occupied = LibInstance.AllOccupied();
//Event - Recieve confirmed by user
var event_recieve_confirmed = LibInstance.RecieveConfirmedByUser();
//Event - Return confirmed
var event_return_confirmed = LibInstance.ReturnConfirmed();


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
	LibInstance.request_book(book, {value:val, gas:gas_val});

	event_not_available.watch(function() {
		$("#notify").html("Book Not Available.")
		$("#notify-box").show();
		console.log("Not Available");
	});

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
	var book = $("#return-recieved-book").val();
	LibInstance.recieved_by_user(book, {gas:gas_val});

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
	var book = $("#return-recieved-book").val();
	LibInstance.return_book(book, {gas: gas_val});

	event_return_confirmed.watch(function() {
		$("#notify").html("Return Confirmed by Library")
		$("#notify-box").show();
		console.log("Return confirmed");
	});

	update_message();
	update_balance();
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

function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}