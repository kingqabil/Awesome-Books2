const list = document.getElementById('add-book');
const form = document.getElementById('book-entry');

const addBooks = 'addBooks';
const removeBooks = 'removeBooks';
const loadData = 'loadData ';

function createId() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}

function createStore(books = []) {
  let state = books;
  const contentUpdate = [];

  const update = (action) => {
    if (action.type === addBooks) {
      state = state.concat([action.book]);
    } else if (action.type === removeBooks) {
      state = state.filter((book) => book.id !== action.id);
    } else if (action.type === loadData) {
      state = action.books;
    }
    contentUpdate.forEach((fn) => fn());
  };

  const getState = () => state;

  const onUpdate = (fn) => contentUpdate.push(fn);

  return {
    update,
    getState,
    onUpdate,
  };
}

class BookStore {
  constructor() {
    const store = createStore();
    store.onUpdate(() => {
      localStorage.setItem('saved-data', JSON.stringify(store.getState()));
    });
    this.store = store;
  }

  get books() {
    return this.store.getState();
  }

  addBook(book) {
    this.store.update({
      type: addBooks,
      book,
    });
  }

  removeBook(id) {
    this.store.update({
      type: removeBooks,
      id,
    });
  }

  onUpdate(func) {
    this.store.onUpdate(func);
  }

  loadBooks() {
    const saved = localStorage.getItem('saved-data');
    if (saved) {
      this.store.update({
        type: loadData,
        books: JSON.parse(saved),
      });
    }
  }
}

const bookStore = new BookStore();

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const title = form.elements[0].value;
  const author = form.elements[1].value;
  const id = createId();
  form.reset();
  bookStore.addBook({ title, author, id });
});

function addBookToDOM(book) {
  const node = document.createElement('li');
  const bookDetails = document.createElement('div');
  const title = document.createElement('h2');
  title.innerText = book.title;

  const subtitle = document.createElement('p');
  subtitle.innerText = `by  ${book.author}`;

  const button = document.createElement('button');
  button.innerText = 'Remove';

  button.addEventListener('click', () => bookStore.removeBook(book.id));

  bookDetails.appendChild(title);
  bookDetails.appendChild(subtitle);
  node.appendChild(bookDetails);
  node.appendChild(button);

  list.appendChild(node);
}

bookStore.onUpdate(() => {
  list.innerHTML = '';
  bookStore.books.forEach(addBookToDOM);
});

window.addEventListener('load', () => {
  // eslint-disable-next-line no-undef
  const { DateTime } = luxon;
  const now = DateTime.now();
  document.getElementById('currentDateTime').innerText = now.toLocaleString(DateTime.DATETIME_MED);
  bookStore.loadBooks();
});

const links = document.querySelectorAll('.link');

links.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    document.querySelector('.active').classList.remove('active');
    link.classList.add('active');
    const id = link.getAttribute('href').slice('1');

    const currentSection = document.querySelector('.active-page');
    if (currentSection) {
      currentSection.classList.remove('active-page');
    }
    const section = document.getElementById(id);
    if (section) {
      section.classList.add('active-page');
    }
  });
});