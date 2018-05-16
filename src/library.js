window.onload = function() {
	$("#notify-box").hide();
};

json_data = data;
var url = json_data["url"];
var abi = json_data["abi"];
var gas_val = json_data["gas"];
var address = json_data["address"];
var bytecode = json_data["bytecode"];

if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
}

var accounts = web3.eth.accounts;
var account1 = accounts[0];

web3.eth.defaultAccount = account1;

var LibraryContract = web3.eth.contract(abi);
//console.log(LibraryContract);

//console.log(bytecode);

var contractAddress = address;
var deployedContract;
/*
function deploy() {
    LibraryContract.new(['B1','B2'], {data: bytecode, gas: 4700000, value: val}, function(deployedContract){
        while(deployedContract === undefined) {
            console.log(".");
        }
        console.log(deployedContract);
        contractAddress = deployedContract["address"];
        console.log(contractAddress);
        // LibInstance = LibraryContract.at(contractAddress);
    });
}

console.log(deployedContract);


console.log(contractAddress);
*/
LibInstance = LibraryContract.at(contractAddress);

var event_recieve_confirmed = LibInstance.RecieveConfirmedByLibrary();

var event_book_added = LibInstance.NewBookAdded();

var event_book_already_present = LibInstance.BookAlreadyPresent();

$("#recieved-button").click(function() {
    LibInstance.recieved_by_library($("#book-name").val(), {gas: gas_val});

    event_recieve_confirmed.watch(function(){
    	$("#notify").html("Recieve confirmed");
    	$("#notify-box").show();
    });
});

$("#get-owner-button").click(function() {
    LibInstance.get_owner.call($("#book-name").val(), function(error, address){
        if(!error) {
            $("#output").html("Owner: " + address);
        } else {
            console.log(error);
            $("#output").html("");
        }
    });
});

$("#get-status-button").click(function() {
	LibInstance.status.call($("#book-name").val(), function(error, result){
		if(!error) {
			var key = result["c"][0];
			var ans;
			if(key == 0) ans = "Stable";
			else if(key == 1) ans = "To Be Returned";
			else if(key == 2) ans = "To Be Collected";
			else ans = "To Be Transferred";
			$("#output").html("Book Status: " + ans);
		} else {
			console.log(error);
		}
	});
});

$("#add-book-button").click(function() {
    var book = $("#book-name").val();
    LibInstance.add_book(book, {gas: gas_val});

    event_book_added.watch(function() {
        $("#notify").html("Book added");
        $("#notify-box").show();
    });

    event_book_already_present.watch(function() {
        $("#notify").html("Book already present");
        $("#notify-box").show();
    });
});

$("#delete-notify").click(function() {
    $("#notify-box").hide();
});