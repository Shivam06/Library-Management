window.onload = function() {
	$("#notify-box").hide();
};

json_data = JSON.parse(data);
var url = json_data["url"];
var abi = json_data["abi"];
var gas_val = json_data["gas"];
var address = json_data["address"];
var val = json_data["value"];

if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
}
var accounts = web3.eth.accounts;
web3.eth.defaultAccount = web3.eth.accounts[0];


var LibraryContract = web3.eth.contract(abi);
Library = LibraryContract.at(address);

var event_recieve_confirmed = Library.RecieveConfirmedByLibrary();

$("#recieved-button").click(function() {
    Library.recieved_by_library($("#recieved-book").val(), {gas: gas_val});

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