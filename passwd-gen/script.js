function passwdGen() {
	let passwdLength = document.getElementById("passwdLength");

	if (passwdLength.value == "" || passwdLength.value <= 0) { passwdLength.style.borderColor = "red"; return; }
	else { passwdLength.style.borderColor = ""; passwdLength = passwdLength.value }

	const dict = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

	let passwd = "";

	for (let i = 0; i < passwdLength; i++) {
		let pos = Math.floor(Math.random() * dict.length);
		passwd += dict[pos];

		if (i % 5 == 0 && i != 0 && i != passwdLength) { passwd += "-"; passwdLength--; };
	}

	console.log(passwd)
	document.getElementById("passwd").value = passwd;
	document.getElementById("passwd_no_sep").value = passwd.replace(/-/g, "");
}

function copyPasswd(id) {
	const node = document.getElementById(id);
	node.select()
	navigator.clipboard.writeText(node.value);
	alert("Password copiata.")
}

document.addEventListener("DOMContentLoaded", passwdGen());