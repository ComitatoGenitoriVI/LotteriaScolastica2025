const firebaseConfig = {
  apiKey: "AIzaSyBDxDST8SV4jal2Njck2AE3smr5iZKrmT8",
  authDomain: "lotteriascolastica2025.firebaseapp.com",
  databaseURL: "https://lotteriascolastica2025-default-rtdb.firebaseio.com",
  projectId: "lotteriascolastica2025",
  storageBucket: "lotteriascolastica2025.firebasestorage.app",
  messagingSenderId: "802109925270",
  appId: "1:802109925270:web:3e2e5b0389c67466405fb7"
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const numeriDiv = document.getElementById('numeri');
for (let i = 1; i <= 90; i++) {
    const numeroBtn = document.createElement('button');
    numeroBtn.textContent = i;
    numeroBtn.addEventListener('click', () => {
        numeroBtn.classList.toggle('numero-selezionato');
    });
    numeriDiv.appendChild(numeroBtn);
}

document.getElementById('confermaGiocata').addEventListener('click', () => {
    const nome = document.getElementById('nome').value;
    const ruota = document.getElementById('ruota').value;
    const numeriSelezionati = Array.from(document.querySelectorAll('.numero-selezionato')).map(btn => parseInt(btn.textContent));

    // Validazione dei dati
    if (!nome || numeriSelezionati.length === 0) {
        alert("Inserisci dati validi.");
        return;
    }

    // Aggiunta giocata al database
    const nuovaGiocata = {
        nome: nome,
        ruota: ruota,
        numeri: numeriSelezionati
    };
    database.ref('giocate').push(nuovaGiocata);

    // Resetta i campi del form
    document.getElementById('nome').value = '';
    document.querySelectorAll('.numero-selezionato').forEach(btn => btn.classList.remove('numero-selezionato'));
});

// Funzione per aggiornare i numeri liberi
function aggiornaNumeriLiberi() {
    const ruotaSelezionata = document.getElementById('ruota').value;
    const numeriLiberiDiv = document.getElementById('numeriLiberi');
    numeriLiberiDiv.innerHTML = ''; // Pulisce la sezione

    database.ref('giocate').on('value', (snapshot) => {
        const numeriGiocati = [];
        snapshot.forEach((childSnapshot) => {
            const giocata = childSnapshot.val();
            if (giocata.ruota === ruotaSelezionata) {
                numeriGiocati.push(...giocata.numeri);
            }
        });
        const numeriLiberi = Array.from({ length: 90 }, (_, i) => i + 1).filter(numero => !numeriGiocati.includes(numero));
        numeriLiberiDiv.innerHTML = `<p>${numeriLiberi.join(', ')}</p>`;

        // Aggiorna i pulsanti dei numeri
        const numeriBtns = document.querySelectorAll('#numeri button');
        numeriBtns.forEach(btn => {
            const numero = parseInt(btn.textContent);
            if (numeriGiocati.includes(numero)) {
                btn.classList.add('numero-giocato');
            } else {
                btn.classList.remove('numero-giocato');
            }
        });
    });
}

aggiornaNumeriLiberi(); // Aggiorna i numeri liberi all'avvio

document.getElementById('ruota').addEventListener('change', aggiornaNumeriLiberi); // Aggiorna i numeri liberi quando si cambia la ruota