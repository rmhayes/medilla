function latchToDirectory(address) {
	window.directoryContractAddress = address;
    window.directoryContractInstance = window.directoryContract.at(address);
    console.log("latched onto directory at address", address)
}

function latchToWorld(name) {
	window.directoryContractInstance.getAddress.call(name, function(err, result) {
        console.log(result);
        console.log("latched onto world", name)
        window.worldContractAddress = result;
		window.worldContractInstance = window.worldContract.at(result);
		switchToWorldContext();
    });	
}

function switchToWorldContext() {
	document.getElementById("directory").style.display = "none";
	document.getElementById("world").style.display = "block";
	getContent();
}