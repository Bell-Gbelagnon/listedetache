document.addEventListener('DOMContentLoaded', function() {
    chargerTaches();
});

function ajouterTache() {
    const champTache = document.getElementById('champTache');
    const texteTache = champTache.value.trim();
    const dateEcheance = document.querySelector('.dateEcheance').value; // Obtenez la date de l'élément dateEcheance

    if (texteTache !== '') {
        const listeTaches = document.getElementById('listeTaches');
        const li = document.createElement('li');
        li.innerHTML = `
        <span class="nom-tache">${texteTache}</span>
        <span class="date-tache"><input type="datetime-local" class="dateEcheance" value="${dateEcheance}"></span>
        <div class="boutons-tache">
            <button class="bouton-terminer" onclick="completerTache(this)">Terminée</button>
            <button onclick="supprimerTache(this)">Supprimer</button>
        </div>
    `;
        li.classList.add('nouvelle-tache');
        listeTaches.appendChild(li);

        trierTaches();
        sauvegarderTaches();
        champTache.value = '';

        // Récupérez l'heure spécifiée dans la dateEcheance
        const heureEcheance = new Date(dateEcheance).getTime();
        const maintenant = new Date().getTime();

        // Si l'heure spécifiée est dans le futur, configurez une notification
        if (heureEcheance > maintenant) {
            const differenceTemps = heureEcheance - maintenant;
            
            setTimeout(() => {
                afficherNotification(texteTache);
            }, differenceTemps);
        }

        setTimeout(() => {
            li.classList.remove('nouvelle-tache');
        }, 1000);
    }
}

// Fonction pour afficher une notification
function afficherNotification(message) {
    if ('Notification' in window) {
        Notification.requestPermission().then(function (permission) {
            if (permission === 'granted') {
                new Notification('Tâche terminée', { body: message });
            }
        });
    }
}

function completerTache(bouton) {
    const elementTache = bouton.parentElement.parentElement;
    const boutonTerminer = elementTache.querySelector('.bouton-terminer');
    
    elementTache.classList.toggle('terminee');
    
    if (elementTache.classList.contains('terminee')) {
        elementTache.style.backgroundColor = 'rgb(64, 3, 94)';  
        elementTache.style.color = '#fff';  
        boutonTerminer.style.display = 'none'; 
    } else {
        elementTache.style.backgroundColor = '';  
        elementTache.style.color = ''; 
        boutonTerminer.style.display = 'inline-block';  
    }

    trierTaches();
    sauvegarderTaches();
}

function supprimerTache(bouton) {
    const elementTache = bouton.parentElement.parentElement;
    elementTache.remove();
    sauvegarderTaches();
}

function trierTaches() {
    const listeTaches = document.getElementById('listeTaches');
    const taches = Array.from(listeTaches.children);

    taches.sort((a, b) => {
        const dateA = new Date(a.querySelector('.dateEcheance').value);
        const dateB = new Date(b.querySelector('.dateEcheance').value);

        if (dateA && dateB) {
            if (dateA < dateB) return -1;
            if (dateA > dateB) return 1;
        } else if (!dateA && dateB) {
            return 1;
        } else if (dateA && !dateB) {
            return -1;
        }

        return 0;
    });

    listeTaches.innerHTML = '';
    taches.forEach(tache => listeTaches.appendChild(tache));
}

function sauvegarderTaches() {
    const listeTaches = document.getElementById('listeTaches');
    const taches = [];

    for (const elementTache of listeTaches.children) {
        const texteTache = elementTache.querySelector('.nom-tache').innerText;
        const estTerminee = elementTache.classList.contains('terminee');
        const dateEcheance = elementTache.querySelector('.dateEcheance').value;
        taches.push({ texte: texteTache, terminee: estTerminee, dateEcheance: dateEcheance });
    }

    localStorage.setItem('taches', JSON.stringify(taches));
}

function chargerTaches() {
    const listeTaches = document.getElementById('listeTaches');
    const taches = JSON.parse(localStorage.getItem('taches')) || [];

    taches.forEach(tache => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="nom-tache">${tache.texte}</span>
            <span class="date-tache"><input type="date" class="dateEcheance" value="${tache.dateEcheance}"></span>
            <div class="boutons-tache">
                <button onclick="completerTache(this)" ${tache.terminee ? 'disabled' : ''}>Terminée</button>
                <button onclick="supprimerTache(this)">Supprimer</button>
            </div>
        `;

        if (tache.terminee) {
            li.classList.add('terminee');
        }

        listeTaches.appendChild(li);
    });

    trierTaches();
}
