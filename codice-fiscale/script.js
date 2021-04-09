let COMUNI = new Object();

window.addEventListener("DOMContentLoaded", () => {
	const href = location.protocol + "//" + location.host + "/codice-fiscale/" + "elenco-comuni.csv";

	fetch(href)
		.then(response => response.text())
		.then(data => {
			let elenco = data.split("\r\n");
			for (let i = 0; i < elenco.length; i++) {
				elenco[i] = elenco[i].split(",");
				elenco[i][0] = elenco[i][0].toUpperCase();
			}
			elenco.forEach(c => {
				COMUNI[c[0]] = c[1];
			});
		});
});

function copy(id) {
	const node = document.getElementById(id);

	if (node.value == "") return;

	node.select()
	document.execCommand("copy");
	alert("Codice fiscale copiato.")
}

function noAccents(s) {
	var map = {
		'-': ' ',
		'-': '_',
		'a': 'á|à|ã|â|À|Á|Ã|Â',
		'e': 'é|è|ê|É|È|Ê',
		'i': 'í|ì|î|Í|Ì|Î',
		'o': 'ó|ò|ô|õ|Ó|Ò|Ô|Õ',
		'u': 'ú|ù|û|ü|Ú|Ù|Û|Ü',
		'c': 'ç|Ç',
		'n': 'ñ|Ñ'
	};

	for (var pattern in map) {
		s = s.replace(new RegExp(map[pattern], 'g'), pattern);
	};

	return s;
};

function controllaInput() {
	let corretto = true;

	const cognome = document.getElementById("cognome");
	if (cognome.value.trim().length == 0) { bordoRosso(cognome); corretto = false; }

	const nome = document.getElementById("nome");
	if (nome.value.trim().length == 0) { bordoRosso(nome); corretto = false; }

	const sesso = document.getElementById("sesso");
	if (sesso.value == "0") { bordoRosso(sesso); corretto = false; }

	const giorno = document.getElementById("giorno");
	if (giorno.value == "0") { bordoRosso(giorno); corretto = false; }

	const mese = document.getElementById("mese");
	if (mese.value == "0") { bordoRosso(mese); corretto = false; }

	const anno = document.getElementById("anno");
	if (anno.value == "0") { bordoRosso(anno); corretto = false; }

	const luogo = document.getElementById("luogo");
	if (luogo.value.trim().length == 0 || COMUNI[luogo.value.trim().toUpperCase()] == undefined) { bordoRosso(luogo); corretto = false; }

	if (corretto)
		calcola(new Persona(
			noAccents(cognome.value.trim()).toUpperCase(),
			noAccents(nome.value.trim()).toUpperCase(),
			sesso.value,
			giorno.value,
			parseInt(mese.value),
			anno.value,
			luogo.value.trim().toUpperCase(),
		));
}

/**
 * @param {HTMLElement} e 
 */
function bordoRosso(e) {
	e.style.borderColor = "red";
}

/**
 * @param {HTMLElement} e 
 */
function bordoNormale(e) {
	e.style.borderColor = "";
}

/**
 * @param {HTMLElement} e 
 */
function bordoLuogo(e) {
	if (COMUNI[e.value.trim().toUpperCase()] == undefined) e.style.borderColor = "red";
	else e.style.borderColor = "";
}

/**
 * @param {string} c Cognome
 * @returns {string}
 */
function calcolaCognome(c) {
	const VOCALI = "AEIOU";
	const CONSONANTI = "BCDFGHJKLMNPQRSTVWXYZ";

	let cognome = "";
	let consonantiCognome = "";
	let vocaliCognome = "";

	for (let i = 0; i < c.length; i++) {
		const char = c.charAt(i);

		if (CONSONANTI.includes(char)) consonantiCognome += char;
		else if (VOCALI.includes(char)) vocaliCognome += char;
	}

	for (let i = 0; i < consonantiCognome.length && cognome.length < 3; i++)
		cognome += consonantiCognome[i];
	for (let i = 0; i < vocaliCognome.length && cognome.length < 3; i++)
		cognome += vocaliCognome[i];
	while (cognome.length < 3) cognome += "X";

	return cognome;
}

/**
 * @param {string} n Nome
 * @returns {string}
 */
function calcolaNome(n) {
	const VOCALI = "AEIOU";
	const CONSONANTI = "BCDFGHJKLMNPQRSTVWXYZ";

	let nome = "";
	let consonantiNome = "";
	let vocaliNome = "";

	for (let i = 0; i < n.length; i++) {
		const char = n.charAt(i);

		if (CONSONANTI.includes(char)) consonantiNome += char;
		else if (VOCALI.includes(char)) vocaliNome += char;
	}

	for (let i = 0; i < consonantiNome.length && nome.length < 3; i++) {
		if (consonantiNome.length >= 4 && i == 1) continue;
		nome += consonantiNome[i];
	}
	for (let i = 0; i < vocaliNome.length && nome.length < 3; i++) nome += vocaliNome[i];
	while (nome.length < 3) nome += "X";

	return nome;
}

/**
 * @param {string} a Anno
 * @param {number} m Mese
 * @returns {string}
 */
function calcolaData(a, m) {
	let data = a.substring(2);
	const MESI = " ABCDEHLMPRST";
	data += MESI[m];

	return data;
}

/**
 * @param {string} g Giorno
 * @param {string} s Sesso
 * @returns {string}
 */
function calcolaGiorno(g, s) {
	if (s == "F") g = parseInt(g) + 40;
	return g;
}

/**
 * @param {string} c Codice
 * @returns {string} 
 */
function calcolaControllo(c) {
	const CHARDISPARI = {
		"0": 1, "1": 0, "2": 5, "3": 7, "4": 9, "5": 13, "6": 15, "7": 17, "8": 19,
		"9": 21, "A": 1, "B": 0, "C": 5, "D": 7, "E": 9, "F": 13, "G": 15, "H": 17,
		"I": 19, "J": 21, "K": 2, "L": 4, "M": 18, "N": 20, "O": 11, "P": 3, "Q": 6,
		"R": 8, "S": 12, "T": 14, "U": 16, "V": 10, "W": 22, "X": 25, "Y": 24, "Z": 23
	};
	const CHARPARI = {
		"0": 0, "1": 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8,
		"9": 9, "A": 0, "B": 1, "C": 2, "D": 3, "E": 4, "F": 5, "G": 6, "H": 7,
		"I": 8, "J": 9, "K": 10, "L": 11, "M": 12, "N": 13, "O": 14, "P": 15, "Q": 16,
		"R": 17, "S": 18, "T": 19, "U": 20, "V": 21, "W": 22, "X": 23, "Y": 24, "Z": 25
	};
	const CHARRESTI = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

	let sommaPari = 0;
	for (let i = 1; i < c.length; i += 2) {
		const char = c.charAt(i);
		sommaPari += CHARPARI[char];
	}

	let sommaDispari = 0;
	for (let i = 0; i < c.length; i += 2) {
		const char = c.charAt(i);
		sommaDispari += CHARDISPARI[char];
	}

	const somma = sommaPari + sommaDispari;
	const resto = somma % 26;

	return CHARRESTI[resto];
}

/**
 * @param {Persona} p 
 */
function calcola(p) {
	console.table(p);

	let codice = "";

	let cognome = calcolaCognome(p.cognome);
	codice += cognome;
	console.log(cognome);

	let nome = calcolaNome(p.nome);
	codice += nome;
	console.log(nome);

	let data = calcolaData(p.anno, p.mese);
	codice += data;
	console.log(data);

	let giorno = calcolaGiorno(p.giorno, p.sesso);
	codice += giorno;
	console.log(giorno);

	let luogo = COMUNI[p.luogo];
	codice += luogo;
	console.log(luogo);

	let controllo = calcolaControllo(codice);
	codice += controllo;
	console.log(controllo);

	document.getElementById("codice").value = codice;
	console.log(codice);
}

class Persona {
	/**
	 * @param {string} c Cognome
	 * @param {string} n Nome
	 * @param {string} s Sesso
	 * @param {string} g Giorno
	 * @param {number} m Mese
	 * @param {string} a Anno
	 * @param {string} l Luogo
	 */
	constructor(c, n, s, g, m, a, l) {
		this.cognome = c;
		this.nome = n;
		this.sesso = s;
		this.giorno = g;
		this.mese = m;
		this.anno = a;
		this.luogo = l;
	}
}