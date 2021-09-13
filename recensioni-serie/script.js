class Titolo {
	/**
	 * Costruttore del titolo
	 * @param {string} titolo Titolo del film/serie
	 * @param {number} valutazione Valutazione del titolo
	 */
	constructor(titolo, valutazione) {
		this.titolo = titolo;
		this.valutazione = valutazione;
	}
}

const localStorageKey = "cantooo.github.io/recensioni-serie_localStorageKey";
let titoli;
getStorage();

function getStorage() {
	titoli = JSON.parse(localStorage.getItem(localStorageKey));
	if (titoli == null) titoli = new Array();
	aggiorna();
}

function aggiungi() {
	const titolo = prompt("Titolo del film/della serie");
	if (titolo == null) return;
	titoli.push(new Titolo(titolo));
	aggiorna();
}

function valuta() {
	const pos = parseInt(document.getElementById("lista-titoli").value);
	if (pos == -1) return;

	const valutazione = parseInt(document.getElementById("lista-valutazioni").value);
	if (valutazione == 0) return;

	titoli[pos].valutazione = valutazione;
	aggiorna();
}

function elimina() {
	const pos = parseInt(document.getElementById("lista-titoli").value);
	if (pos == -1) return;

	const t = titoli[pos];
	if (confirm("Vuoi davvero rimuovere " + t.titolo + "?")) {
		titoli.splice(pos, 1);
		aggiorna();
	}
}

function mostraVoto() {
	const pos = parseInt(document.getElementById("lista-titoli").value);
	if (pos == -1) {
		document.getElementById("lista-valutazioni").value = 0;
		return;
	}
	const t = titoli[pos];

	if (t.valutazione == undefined) return;

	document.getElementById("lista-valutazioni").value = t.valutazione;
}

function aggiornaTabella() {
	let node = ""

	for (let i = 0; i < titoli.length; i++) {
		const t = titoli[i];

		node += "<tr>";
		node += "<th scope='row'>" + (i + 1) + "</th>";
		node += "<td>" + t.titolo + "</td>";
		node += "<td>";

		if (t.valutazione == undefined) {
			node += "Non valutato";
		} else {
			node += "⭐️".repeat(t.valutazione);
		}

		node += "</td>";
		node += "</tr>";
	}
	document.getElementById("table-list").innerHTML = node;
}

function aggiornaLista() {
	let node = "<option value='-1'>Titolo film/serie</option>";

	for (let i = 0; i < titoli.length; i++) {
		const t = titoli[i];
		node += "<option value='" + i + "'>" + t.titolo + "</option>";
	}

	document.getElementById("lista-titoli").innerHTML = node;
	document.getElementById("lista-valutazioni").value = 0;
}

function aggiornaStorage() {
	const json = JSON.stringify(titoli);
	localStorage.setItem(localStorageKey, json);
}

function aggiorna() {
	aggiornaLista();
	aggiornaTabella();
	aggiornaStorage();
}
