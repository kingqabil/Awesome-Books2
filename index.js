const divbooks = document.querySelector('.books');
const inputTitle = document.querySelector('#title');
const inputAuthor = document.querySelector('#author');
const addBtn = document.querySelector('#add');

const savedData = localStorage.getItem('savedInput');

let collection = [];

if (savedData && savedData !== null) {
  collection = JSON.parse(savedData);
}

const displayData = () => {
  divbooks.innerHTML = '';
  collection.forEach((value, index) => {
    divbooks.innerHTML += `
            <div class="books">
            <ul>
                <li class="title">${value.name}</li>
                <li class="author">${value.author}</li>
            </ul>
             <button id="remove" onclick="removeBook(${index});">remove</button>
             <hr>
           </div>`;
  });
};