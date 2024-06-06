let lastGeneratedNumbers = [];

document.getElementById('generateButton').addEventListener('click', function() {
    let loteria = [];
    let lotoMas = Math.floor(Math.random() * 12) + 1;
    let superMas = Math.floor(Math.random() * 15) + 1;

    while (loteria.length < 6) {
        let num = Math.floor(Math.random() * 40) + 1;
        if (!loteria.includes(num)) {
            loteria.push(num);
        }
    }
    loteria.sort((a, b) => a - b);

    let generated = {
        loteria: loteria,
        lotoMas: lotoMas,
        superMas: superMas
    };

    lastGeneratedNumbers.push(generated);
    if (lastGeneratedNumbers.length > 5) {
        lastGeneratedNumbers.shift();
    }

    document.getElementById('result').innerHTML = 
        "<span class='black'>Lotería: " + loteria.join(', ') + "</span> - " +
        "<span class='blue'>Loto Más: " + lotoMas + "</span> - " +
        "<span class='red'>Super Más: " + superMas + "</span>";

    updateLastGenerated();
});

function updateLastGenerated() {
    let lastGeneratedDiv = document.getElementById('lastGenerated');
    lastGeneratedDiv.innerHTML = '';

    lastGeneratedNumbers.forEach((gen, index) => {
        let genHTML = 
            `<div><strong>Generación ${index + 1}:</strong> 
            <span class='black'>Lotería: ${gen.loteria.join(', ')}</span> - 
            <span class='blue'>Loto Más: ${gen.lotoMas}</span> - 
            <span class='red'>Super Más: ${gen.superMas}</span></div>`;
        lastGeneratedDiv.innerHTML += genHTML;
    });
}

document.getElementById('scrapeButton').addEventListener('click', function() {
    fetchLeidsaResults();
});

// Obtener los resultados de Leidsa desde la página web
function fetchLeidsaResults() {
    const apiUrl = 'http://localhost:3000/leidsa'; // URL del servidor proxy

    fetch(apiUrl)
        .then(response => response.text())
        .then(data => {
            let parser = new DOMParser();
            let doc = parser.parseFromString(data, 'text/html');
            let results = scrapeLeidsaResults(doc);
            displayLeidsaResults(results);
        })
        .catch(error => {
            console.error('Error fetching Leidsa results:', error);
        });
}

function scrapeLeidsaResults(doc) {
    let results = [];

    try {
        let numberElements = doc.querySelectorAll('.rrm-upcoming-result-content span[nm]');
        let special1Element = doc.querySelector('.rrm-upcoming-result-content span[ner]');
        let special2Element = doc.querySelector('.rrm-upcoming-result-content span[neb]');

        if (numberElements.length === 0 || !special1Element || !special2Element) {
            throw new Error("No se encontraron uno o más elementos requeridos");
        }

        let numbers = Array.from(numberElements).map(el => parseInt(el.textContent.trim()));
        let special1 = parseInt(special1Element.textContent.trim().split(' ')[0]); // Solo el número
        let special2 = parseInt(special2Element.textContent.trim().split(' ')[0]); // Solo el número

        results.push({
            date: new Date().toLocaleDateString(), // Puedes ajustar esto según sea necesario
            gameTitle: 'Leidsa',
            numbers: numbers,
            special1: special1,
            special2: special2
        });

    } catch (error) {
        console.error("Error en scrapeLeidsaResults:", error);
    }

    return results;
}

function displayLeidsaResults(data) {
    let leidsaResultsDiv = document.getElementById('leidsaResults');
    leidsaResultsDiv.innerHTML = '';

    if (data.length === 0) {
        leidsaResultsDiv.innerHTML = '<div>No se encontraron resultados.</div>';
        return;
    }

    data.forEach(draw => {
        let numbersToShow = draw.numbers.slice(0, 6); // Obtener solo los primeros 6 números
        let drawHTML =
            `<div><strong>Fecha:</strong> ${draw.date} - 
            <span class='black'>Juego: ${draw.gameTitle}</span> - 
            <span class='black'>Números: ${numbersToShow.map(num => lastGeneratedNumbers.includes(num) ? `<span class="highlight">${num}</span>` : num).join(', ')}</span> - 
            <span class='blue'>Loto Más: ${draw.special1}</span> - 
            <span class='red'>Super Más: ${draw.special2}</span></div>`;
        leidsaResultsDiv.innerHTML += drawHTML;
    });
}

// Llama a la función para obtener los resultados de Leidsa al cargar la página
fetchLeidsaResults();
