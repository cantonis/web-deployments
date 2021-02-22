function passwdGen() {
	const passwdLength = document.getElementById("passwdLength").value;
	const dict = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

	let passwd = "";

	for (let i = 0; i <= passwdLength; i++) {
		let pos = Math.floor(Math.random() * dict.length);
		passwd += dict[pos];

		if (i % 5 == 0 && i != 0 && i != passwdLength) passwd += "-";
	}

	console.log(passwd)
	document.getElementById("passwd").value = passwd;
	document.getElementById("passwd_no_sep").value = passwd.replace(/-/g, "");
}

document.addEventListener("DOMContentLoaded", passwdGen());