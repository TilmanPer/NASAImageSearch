const API_KEY = 'PnhoUrbq0zl35z9KNqDNhI9fVU44YhWmlftM42EL';
const API_URL = `https://images-api.nasa.gov/search?q=`;

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const imageContainer = document.getElementById('image-container');
const pagination = document.getElementById('pagination');

let currentPage = 1;

// Function to fetch images from NASA API
async function fetchImages(keyword, page) {
    const response = await fetch(`${API_URL}${keyword}&page=${page}&media_type=image&page_size=40`);
    const data = await response.json();
    console.log(data);
    const items = data.collection.items;
    const totalItems = data.collection.metadata.total_hits;
    const totalPages = Math.ceil(totalItems / 40);
    displayImages(items);
    displayPagination(totalPages);
}

// Function to display images
function displayImages(items) {
    imageContainer.innerHTML = '';
    items.forEach(item => {
        const imageUrl = item.links[0].href;
        const title = item.data[0].title;

        const imageElement = document.createElement('div');
        imageElement.classList.add('image');

        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = title;
        img.addEventListener('click', () => {
            displayImageInfo(item);
        });
        imageElement.appendChild(img);

        imageContainer.appendChild(imageElement);
    });
}

function displayImageInfo(item) {
    const imageUrl = item.links[0].href;
    const title = item.data[0].title;
    const description = item.data[0].description;
    const dateCreated = item.data[0].date_created;
    const photographer = item.data[0].photographer;
    const keywords = item.data[0].keywords;

    const popupElement = document.createElement('div');
    popupElement.classList.add('popup');

    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = title;
    popupElement.appendChild(img);

    const titleElement = document.createElement('h3');
    titleElement.textContent = title;
    popupElement.appendChild(titleElement);

    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = description;
    popupElement.appendChild(descriptionElement);

    const dateElement = document.createElement('p');
    dateElement.textContent = `Date created: ${dateCreated}`;
    popupElement.appendChild(dateElement);

    const photographerElement = document.createElement('p');
    photographerElement.textContent = `Photographer: ${photographer}`;
    popupElement.appendChild(photographerElement);

    const keywordsElement = document.createElement('p');
    const keywordLinks = keywords.map(keyword => {
        const link = document.createElement('a');
        link.textContent = keyword;
        link.href = '#';
        link.addEventListener('click', event => {
            event.preventDefault();
            searchInput.value = keyword;
            fetchImages(keyword, 1);
        });
        return link;
    });
    keywordsElement.append(...keywordLinks);
    popupElement.appendChild(keywordsElement);

    const closeButton = document.createElement('button');
    closeButton.classList.add('close-button');
    closeButton.innerHTML = '&times;';
    popupElement.appendChild(closeButton);

    document.body.appendChild(popupElement);

    closeButton.addEventListener('click', () => {
        document.body.removeChild(popupElement);
        document.body.removeChild(popupOverlay);
        document.body.classList.remove('popup-open');
    });

    const popupOverlay = document.createElement('div');
    popupOverlay.classList.add('popup-overlay');

    if (document.body.classList.contains('dark-mode')) {
        popupOverlay.classList.add('dark-mode');
    }

    document.body.appendChild(popupOverlay);

    popupOverlay.addEventListener('click', () => {
        document.body.removeChild(popupElement);
        document.body.removeChild(popupOverlay);
        document.body.classList.remove('popup-open');
    });
}

// Function to display pagination
function displayPagination(totalPages) {
    pagination.innerHTML = '';

    const firstPage = Math.max(1, currentPage - 3);
    const lastPage = Math.min(totalPages, currentPage + 3);

    // Add left arrow
    const leftArrow = document.createElement('span');
    leftArrow.classList.add('pagination-arrow', 'left-arrow');
    leftArrow.textContent = '«';
    if (currentPage > 1) {
        leftArrow.addEventListener('click', () => {
            currentPage = 1;
            fetchImages(searchInput.value, currentPage);
        });
    }
    pagination.appendChild(leftArrow);

    // Add page links
    for (let i = firstPage; i <= lastPage; i++) {
        const pageLink = document.createElement('span');
        pageLink.classList.add('page-link');
        pageLink.textContent = i;
        if (i === currentPage) {
            pageLink.classList.add('active');
        }
        pageLink.addEventListener('click', () => {
            currentPage = i;
            fetchImages(searchInput.value, currentPage);
        });
        pagination.appendChild(pageLink);
    }

    // Add right arrow
    const rightArrow = document.createElement('span');
    rightArrow.classList.add('pagination-arrow', 'right-arrow');
    rightArrow.textContent = '»';
    if (currentPage < totalPages) {
        rightArrow.addEventListener('click', () => {
            currentPage = totalPages;
            fetchImages(searchInput.value, currentPage);
        });
    }
    pagination.appendChild(rightArrow);
}


// Event listener for search form submission
searchForm.addEventListener('submit', event => {
    event.preventDefault();
    currentPage = 1;
    fetchImages(searchInput.value, currentPage);
});

// Dark Mode toggle
const toggleSwitch = document.querySelector('.switch input[type="checkbox"]');
const currentTheme = localStorage.getItem('theme');

if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);

    if (currentTheme === 'dark') {
        toggleSwitch.checked = true;
        document.body.classList.add('dark-mode');
    }
}

toggleSwitch.addEventListener('change', function (event) {
    if (event.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
    }
});


