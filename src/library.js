window.onload = function() {
	$("#notify-box").hide();
};

json_data = data;
var url = json_data["url"];
var abi = json_data["abi"];
var gas_val = json_data["gas"];
var address = json_data["address"];
var val = json_data["value"];
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
console.log(LibraryContract);

console.log(bytecode);

var contractAddress;
var deployedContract;

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

LibInstance = LibraryContract.at(contractAddress);

var event_recieve_confirmed = LibInstance.RecieveConfirmedByLibrary();

var event_book_added = LibInstance.NewBookAdded();

var event_book_already_presesnt = LibInstance.BookAlreadyPresent();

$("#add-book-button").click(function() {
    LibInstance.add_book($("add_book_book_name").val(), {gas: gas_val});

    event_book_added.watch(function() {
        $("#notify").html("Book added");
        $("#notify-box").show();
    });

    event_book_already_presesnt.watch(function() {
        $("#notify").html("Book already present");
        $("#notify-box").show();
    });
});

$("#recieved-button").click(function() {
    LibInstance.recieved_by_library($("#recieved-book").val(), {gas: gas_val});

    event_recieve_confirmed.watch(function(){
    	$("#notify").html("Recieve confirmed");
    	$("#notify-box").show();
    });
});

$("#get_owner_button").click(function() {
    LibInstance.get_owner.call($("#get_owner_book_name").val(), function(error, address){
        if(!error) {
            $("#owner_address").html(address);
        } else {
            console.log(error);
            $("#owner_address").html("");
        }
    });
});

$("#get_status_button").click(function() {
	LibInstance.status.call($("#get_status_book_name").val(), function(error, result){
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