let currentTimeout = null;
let currentlyLoadingProduct = null;

// Funkcja pobierająca dane z pliku JSON z GitHub
async function fetchProductData(productId) {
    try {
        const response = await fetch('https://raw.githubusercontent.com/Msciciel55/Katalogstolarz/main/productsb.json');
        const products = await response.json();
        return products.find(product => product.id === productId);
    } catch (error) {
        console.error('Error fetching product data:', error);
    }
}

// Funkcja pobierająca dane kafelków z pliku JSON
async function fetchTilesData() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/Msciciel55/Katalogstolarz/main/kafleb.json');
        const tiles = await response.json();
        return tiles;
    } catch (error) {
        console.error('Error fetching tiles data:', error);
    }
}

// Funkcja tworząca kafelki produktów
function populateCatalog(products) {
    const catalog = document.querySelector('.catalog');
    catalog.innerHTML = ''; // Wyczyść katalog przed dodaniem nowych kafelków

    products.forEach(product => {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.setAttribute('data-category', product.category);
        tile.setAttribute('onclick', `openSidebar('${product.id}')`);

        tile.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h2>${product.title}</h2>
            <h3>${product.subtitle}</h3>
            <p>${product.description}</p>
        `;

        catalog.appendChild(tile);
    });
}

// Funkcja otwierająca panel boczny z produktem
async function openSidebar(productId) {
    if (currentlyLoadingProduct === productId) return;

    document.body.classList.add('body-sidebar-open'); // Dodaj klasę do ciała, aby kafelki się przesunęły

    if (document.getElementById('sidebar').style.width !== '400px') {
        document.getElementById('sidebar').style.width = '400px';
    }

    let sidebarContent = document.getElementById('sidebar-content');

    if (currentTimeout) {
        clearTimeout(currentTimeout);
    }

    currentlyLoadingProduct = productId;

    sidebarContent.innerHTML = `
        <div class="loader"></div>
        <p>Ładuje zasoby...</p>
    `;

    try {
        const product = await fetchProductData(productId);

        if (product) {
            const img = new Image();
            img.src = product.image;
            img.alt = product.name;

            img.onload = () => {
                sidebarContent.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <h2>${product.name}</h2>
                    <ul>
                        ${product.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                    </ul>
                    <p2>${product.description}</p2>
                    <p3>${product.price}</p3>
                `;
            };

            img.onerror = () => {
                sidebarContent.innerHTML = `<p>Błąd ładowania obrazu budowli</p>`;
            };
        } else {
            sidebarContent.innerHTML = `<p>Budowla nie znaleziona</p>`;
        }
    } catch (error) {
        sidebarContent.innerHTML = `<p>Błąd ładowania danych budowli</p>`;
    }
}


// Funkcja zamykająca panel boczny
function closeSidebar() {
    currentlyLoadingProduct = null;
    document.getElementById('sidebar').style.width = '0';
    document.body.classList.remove('body-sidebar-open'); // Usuń klasę po zamknięciu panelu bocznego
}

// Nasłuchiwanie kliknięć poza panelem bocznym
document.addEventListener('click', (event) => {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar.contains(event.target) && !event.target.closest('.tile')) {
        closeSidebar();
    }
});

// Przypisanie nazw kategorii do nazw wyświetlanych
const categoryNames = {
    'all': 'Wszystkie',
    'uslugi': 'Usługi',
    'namioty': 'Namioty',
    'stragany': 'Stragany',
    'budynki': 'Budynki',
    'statki': 'Statki'
};

// Funkcja aktualizująca tekst przycisku rozwijanego menu
function updateDropdownButtonText(text) {
    document.querySelector('.dropbtn').innerText = text;
}

// Funkcja filtrowania produktów według kategorii
function filterCategory(category) {
    let tiles = document.querySelectorAll('.tile');

    tiles.forEach(tile => {
        let tileCategory = tile.getAttribute('data-category');

        // Sprawdzenie, która kategoria jest wybrana
        if (category === 'all') {
            tile.style.display = 'block'; // Pokaż wszystkie kafelki
        } else {
            tile.style.display = tileCategory === category ? 'block' : 'none'; // Pokaż tylko kafelki z wybraną kategorią
        }
    });
    
    updateDropdownButtonText(categoryNames[category] || 'Kategorie');
}



// Funkcja wyszukiwania produktów
function searchProducts() {
    let input = document.getElementById('search-input').value.toLowerCase();
    let tiles = document.querySelectorAll('.tile');

    tiles.forEach(tile => {
        let titleH2 = tile.querySelector('h2') ? tile.querySelector('h2').innerText.toLowerCase() : '';
        let titleH3 = tile.querySelector('h3') ? tile.querySelector('h3').innerText.toLowerCase() : '';

        if (titleH2.includes(input) || titleH3.includes(input)) {
            tile.style.display = 'block';
        } else {
            tile.style.display = 'none';
        }
    });
}
document.getElementById('search-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        searchProducts(); // Wywołanie funkcji wyszukiwania po naciśnięciu Enter
    }
});

// Inicjalizacja katalogu produktów
fetchTilesData().then(products => {
    if (products) {
        populateCatalog(products);
    }
});

function goTomeble() {
    window.location.href = 'index.html'; // Zaktualizuj ścieżkę, jeśli to konieczne
}