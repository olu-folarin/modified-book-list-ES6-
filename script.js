class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// class UI
class UI {
  addBookToList(book) {
  
      const list = document.getElementById('book-list');
      // create element
      const row = document.createElement('tr');
      // insert cols
      row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href="#" class="delete">X</a></td>
      `;
    
    // append to the list
      list.appendChild(row);
  } 

  showAlert(message, className) {
    // create div
  const div = document.createElement('div');
  // add className
  div.className = `alert ${className}`;
  // add text
  div.appendChild(document.createTextNode(message));
  // get parent
  const container = document.querySelector('.container');

  const form  = document.querySelector('#book-form');

  container.insertBefore(div, form);

  // timeout after 3sec
  setTimeout(function() {
    document.querySelector('.alert').remove();
  }, 3000);
  }

  deleteBook(target) {
    if(target.className === 'delete') {
      target.parentElement.parentElement.remove();
    }
  }

  clearFields() {
    document.getElementById('input').value = '';
  document.getElementById('author').value = '';
  document.getElementById('isbn').value = '';
  }
}


// LOCAL STORAGE
class Store {
  // fetches books from local storage
  static getBooks() {
    let books;
    if(localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
  }

// shows the books in the ui
  static displayBooks() {
    const books = Store.getBooks();

    books.forEach(function(book) {
      const ui = new UI;

      // add book to ui
      ui.addBookToList(book);
    });
  }

// adds books to the ui for storage
  static addBook(book) {
    const books = Store.getBooks();

    // push to books
    books.push(book);

    // create the book in LS
    localStorage.setItem('books', JSON.stringify(books));
  }

  // remove book
  static removeBook(isbn) {
    const books = Store.getBooks();

    // loop through
    books.forEach(function(book, index) {
      if(book.isbn = isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem('books', JSON.stringify(books));
  }
}


// DOM load event
document.addEventListener('DOMContentLoaded', Store.displayBooks);


// event listener for addbook
document.getElementById('book-form').addEventListener('submit', function(e) {
  // get form values
  const title = document.getElementById('input').value,
        author = document.getElementById('author').value,
        isbn = document.getElementById('isbn').value;

  // instantiating a book
  const book = new Book(title, author, isbn);
  // console.log(book);

  // instantiate UI obj
  const ui = new UI();

  // validation
    if(title === '' || author === '' || isbn === '') {
    // error alert
    ui.showAlert('Please fill in all fields', 'error');
  } else {
    // add book to list
    ui.addBookToList(book);

    // add to LS
    Store.addBook(book);

    // show success message
    ui.showAlert('Book  Added', 'success');

    // clear field
    ui.clearFields();
  }

  e.preventDefault();
})

// event listener to delete an item
document.getElementById('book-list').addEventListener('click', function(e) {
  // instantiate UI obj
  const ui = new UI();

  // delete book
  ui.deleteBook(e.target);

  // remove from LS
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  // show alert once you delete
  ui.showAlert('Book Removed', 'success');


  e.preventDefault();
});
