// Book Store Web App
function addInitialBooks() {
    let initialBooks = [
        { title: "Born A Crime", author: "Trevor Noah", isbn: "9780399588174", availability: true, coverUrl: "assets/images/BornACrime.jpg" },
        { title: "Famished Road", author: "Ben Okri", isbn: "9780385425131", availability: true, coverUrl: "assets/images/famishedRoad.jpg" },
        { title: "Ghana Must Go", author: "Taiye Selasi", isbn: "9780143124979", availability: true, coverUrl: "assets/images/ghanaMustGo.jpg" },
        { title: "Half Of A Yellow Sun", author: "Chimamanda Ngozi Adichie", isbn: "9781400095209", availability: true, coverUrl: "assets/images/halfOfAYellowSun.jpg" },
        { title: "So Long A Letter", author: "Mariama Bâ", isbn: "9780435905552", availability: true, coverUrl: "assets/images/soLongALetter.jpg" },
        { title: "The Concubine", author: "Elechi Amadi", isbn: "9780435905552", availability: true, coverUrl: "assets/images/theConcubine.jpg" },
        { title: "There Was A Country", author: "Chinua Achebe", isbn: "9781594204821", availability: true, coverUrl: "assets/images/thereWasACountry.jpg" },
        { title: "Who Fears Death", author: "Nnedi Okorafor", isbn: "9780756406691", availability: true, coverUrl: "assets/images/whoFearsDeath.jpg" }
    ];

    initialBooks.forEach(book => addBook(book.title, book.author, book.availability, book.coverUrl));
}

// Array to store books
let books = [];

// Function to generate a random ISBN
function generateISBN() {
    return Math.floor(Math.random() * 9000000000000) + 1000000000000;
}

// Function to add a book
function addBook(title, author, availability, coverUrl) {
    // Check if the book already exists
    let bookExists = books.some(book => 
        book.title.toLowerCase() === title.toLowerCase() && 
        book.author.toLowerCase() === author.toLowerCase()
    );

    if (bookExists) {
        alert('This book already exists in the library!');
        return;
    }

    let book = {
        title,
        author,
        isbn: generateISBN().toString(),
        availability: availability,
        coverUrl: coverUrl || 'assets/images/default-book-cover.jpg',
        isNew: true // Mark as a new book
    };
    books.push(book);
    displayBooks();
    displayAvailableBooks();
    saveBooks();
}

// Function to display all books
function displayBooks() {
    let bookList = document.getElementById('book-list');
    bookList.innerHTML = '';
    
    books.forEach(book => {
        let li = document.createElement('li');
        li.innerHTML = `
            <img src="${book.coverUrl}" alt="${book.title} cover">
            <div class="book-info">
                <span>${book.title} by ${book.author}</span>
                <br>
                <span>(ISBN: ${book.isbn}) - ${book.availability ? 'Available' : 'Not Available'}</span>
            </div>
            ${book.isNew ? `<button class="remove-book" data-isbn="${book.isbn}">X</button>` : ''}
        `;
        bookList.appendChild(li);
    });
}

// Function to search for books
function searchBooks(query) {
    if (query.trim() === '') {
        clearSearchResults();
        return;
    }
    let results = books.filter(book => 
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase()) ||
        book.isbn.includes(query)
    );
    displaySearchResults(results);
}

// New function to clear search results
function clearSearchResults() {
    let searchResults = document.getElementById('search-results');
    searchResults.innerHTML = '';
}

// Function to display search results
function displaySearchResults(results) {
    let searchResults = document.getElementById('search-results');
    searchResults.innerHTML = '';
    
    if (results.length === 0) {
        searchResults.innerHTML = '<li>No results found</li>';
    } else {
        results.forEach(book => {
            let li = document.createElement('li');
            li.innerHTML = `
                <img src="${book.coverUrl}" alt="${book.title} cover" style="width: 50px; height: 75px; object-fit: cover; margin-right: 10px;">
                <span>${book.title} by ${book.author} (ISBN: ${book.isbn}) - ${book.availability ? 'Available' : 'Not Available'}</span>
            `;
            searchResults.appendChild(li);
        });
    }
}

// Function to save books to localStorage
function saveBooks() {
    localStorage.setItem('books', JSON.stringify(books));
}

// Function to load books from localStorage
function loadBooks() {
    let storedBooks = localStorage.getItem('books');
    if (storedBooks) {
        books = JSON.parse(storedBooks);
    } else {
        // If no books are stored, add the initial books
        addInitialBooks();
    }
    displayBooks();
    displayAvailableBooks();
}

// New function to display available books
function displayAvailableBooks() {
    let availableBooksGrid = document.getElementById('available-books-grid');
    availableBooksGrid.innerHTML = '';
    
    books.filter(book => book.availability).forEach(book => {
        let bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        bookCard.innerHTML = `
            <img src="${book.coverUrl}" alt="${book.title} cover">
            <div class="book-info">
                <div class="book-details">
                    <h3>${book.title}</h3>
                    <p>${book.author}</p>
                </div>
                <button class="btn-action read-book" data-isbn="${book.isbn}">Read</button>
            </div>
        `;
        availableBooksGrid.appendChild(bookCard);
    });
}

// Add a new function to handle reading a book
function readBook(isbn) {
    let book = books.find(book => book.isbn === isbn);
    if (book) {
        let modal = new bootstrap.Modal(document.getElementById('readBookModal'));
        let modalTitle = document.getElementById('readBookModalLabel');
        let bookContent = document.getElementById('bookContent');

        modalTitle.textContent = `${book.title} by ${book.author}`;
        // For this example, we'll just display some placeholder text
        bookContent.innerHTML = `
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        `;

        modal.show();
    }
}

// Update the event listeners
document.addEventListener('DOMContentLoaded', () => {
    let addBookForm = document.getElementById('add-book-form');
    let searchInput = document.getElementById('search-input');
    let bookList = document.getElementById('book-list');

    addBookForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let title = document.getElementById('title').value;
        let author = document.getElementById('author').value;
        let coverUrl = document.getElementById('cover-url').value || 'assets/images/default-book-cover.jpg';
        addBook(title, author, true, coverUrl);
        addBookForm.reset();
    });

    searchInput.addEventListener('input', (e) => {
        let query = e.target.value;
        searchBooks(query);
    });

    // Add event listener for read buttons and remove buttons
    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('read-book')) {
            let isbn = e.target.getAttribute('data-isbn');
            readBook(isbn);
        } else if (e.target.classList.contains('remove-book')) {
            let isbn = e.target.getAttribute('data-isbn');
            removeBook(isbn);
        }
    });

    // Load books from localStorage when the page loads
    loadBooks();
    displayAvailableBooks();
});

// New function to remove a book
function removeBook(isbn) {
    let index = books.findIndex(book => book.isbn === isbn);
    if (index !== -1) {
        books.splice(index, 1);
        displayBooks();
        displayAvailableBooks();
        saveBooks();
    }
}