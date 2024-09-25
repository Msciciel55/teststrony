let currentTimeout = null;
let currentlyLoadingProduct = null;
let cartSum = 0;
let itemCount = 0; 

// Funkcja pobierająca dane z pliku JSON z GitHub
async function fetchProductData(productId) {
    try {
        const response = await fetch('https://raw.githubusercontent.com/Msciciel55/Katalogstolarz/main/products.json');
        const products = await response.json();
        return products.find(product => product.id === productId);
    } catch (error) {
        console.error('Error fetching product data:', error);
    }
}

// Funkcja pobierająca dane kafelków z pliku JSON
async function fetchTilesData() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/Msciciel55/Katalogstolarz/main/kafle.json');
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

function addToCart(productPrice) {
    cartSum += productPrice; // Dodaj cenę produktu do sumy
    itemCount++; // Zwiększ licznik produktów
    updateCartDisplay(); // Aktualizuj wyświetlanie koszyka
}

// Funkcja aktualizująca wyświetlanie sumy i liczby produktów w koszyku
function updateCartDisplay() {
    const cartBadge = document.getElementById('cart-badge');
    cartBadge.innerText = itemCount; // Aktualizuj licznik produktów
    cartBadge.style.display = itemCount > 0 ? 'block' : 'none'; // Pokaż licznik, jeśli są produkty

    const cartSumDisplay = document.getElementById('cart-sum');
    cartSumDisplay.innerText = `Suma: ${cartSum} monet`; // Wyświetl sumę
}

// Funkcja kopiująca sumę do schowka
function copyToClipboard() {
    const sumInWords = numberToWords(cartSum); // Przekształć sumę na słowa
    const tempInput = document.createElement('input');
    tempInput.value = `${sumInWords}`; // Użyj przekształconych słów
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
}

// Funkcja resetująca licznik i sumę
function resetCart() {
    cartSum = 0; // Resetuj sumę
    itemCount = 0; // Resetuj licznik produktów
    updateCartDisplay(); // Zaktualizuj wyświetlanie po resecie
    document.getElementById("sum-value").textContent = "0"; // Resetuj wyświetlanie sumy
}

// Funkcja otwierająca panel boczny z produktem
async function openSidebar(productId) {
    if (currentlyLoadingProduct === productId) return;

    document.body.classList.add('body-sidebar-open');

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
                    <p3>Cena: ${product.price} monet</p3>
                    <button class="buy-btn" onclick="addToCart(${product.price})">Zapisz</button>
                `;
            };

            img.onerror = () => {
                sidebarContent.innerHTML = `<p>Błąd ładowania obrazu produktu</p>`;
            };
        } else {
            sidebarContent.innerHTML = `<p>Produkt nie znaleziony</p>`;
        }
    } catch (error) {
        sidebarContent.innerHTML = `<p>Błąd ładowania danych produktu</p>`;
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
    'beds': 'Łóżka',
    'tables': 'Stoły',
    'siedziska': 'Siedziska',
    'dekoracja': 'Dekoracja',
    'skrzynie': 'Skrzynie',
    'warsztaty': 'Warsztaty',
    'inne': 'Inne'
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

        // Jeżeli wybrana kategoria to 'warsztaty', pokazuje tylko kafelki warsztatów
        if (category === 'warsztaty') {
            if (tileCategory === 'warsztaty') {
                tile.style.display = 'block'; // Pokaż kafelki "warsztaty"
            } else {
                tile.style.display = 'none'; // Ukryj wszystkie inne kafelki
            }
        }
        // Przy wybraniu kategorii 'all' (Wszystkie), ukryj warsztaty i pokaż resztę
        else if (category === 'all') {
            if (tileCategory === 'warsztaty') {
                tile.style.display = 'none'; // Ukryj kafelki "warsztaty"
            } else {
                tile.style.display = 'block'; // Pokaż inne kafelki
            }
        }
        // Filtrowanie dla innych kategorii
        else {
            if (tileCategory === category) {
                tile.style.display = 'block'; // Pokaż tylko kafelki z wybraną kategorią
            } else {
                tile.style.display = 'none'; // Ukryj kafelki, które nie pasują do wybranej kategorii
            }
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

// Nasłuchiwanie klawisza Enter w polu wyszukiwania
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

// Ukrywanie powiadomienia po kliknięciu
document.querySelector('.notification').addEventListener('click', () => {
    document.querySelector('.notification').style.display = 'none';
});

// Funkcja do przekierowania na stronę budowli
function goToBuildings() {
    window.location.href = 'budowle.html'; // Zaktualizuj ścieżkę, jeśli to konieczne
}

// Upewnij się, że dodajesz nasłuchiwacze zdarzeń po załadowaniu DOM
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("reset-counter").addEventListener("click", resetCart);
});
