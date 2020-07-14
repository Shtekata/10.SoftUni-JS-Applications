import el from './dom.js';
import * as api from './data.js';

window.addEventListener('load', () => {
  const table = document.querySelector('table tbody');
  document.querySelector('#loadBooks').addEventListener('click', displayBooks);
  //   const titleInputEl = document.querySelector('#title');
  //   const authorInputEl = document.querySelector('#author');
  //   const isbnInputEl = document.querySelector('#isbn');
  const input = {
    title: document.querySelector('#title'),
    author: document.querySelector('#author'),
    isbn: document.querySelector('#isbn'),
  };

  const createBtn = document.querySelector('form > button');
  createBtn.addEventListener('click', createBook);

  async function createBook(x) {
    x.preventDefault();

    if (validateInput(input) === false) {
      alert('All fields are required');
      return;
    }

    const book = {
      title: input.title.value,
      author: input.author.value,
      isbn: input.isbn.value,
    };

    // const book = {
    //   title: titleInputEl.value,
    //   author: authorInputEl.value,
    //   isbn: isbnInputEl.value,
    // };
    // Object.entries(book).find(([k, v]) => {
    //   if (v.length === 0) {
    //     alert(`Book ${k} cannot be empty!`);
    //     valid = false;
    //     return true;
    //   }
    // });

    try {
      //   Object.entries(input).forEach(([x, y]) => (y.disabled = true));
      //   createBtn.disabled = true;
      toggleInput(false, Object.values(input), createBtn);
      const created = await api.createBook(book);
      table.appendChild(renderBook(created));
      Object.entries(input).forEach(([x, y]) => (y.value = ''));
    } catch (err) {
      alert(err);
      console.log(err);
    } finally {
      //   Object.entries(input).forEach(([x, y]) => (y.disabled = false));
      //   createBtn.disabled = false;
      toggleInput(true, Object.values(input), createBtn);
    }
  }

  function toggleInput(active, ...list) {
    list.forEach((x) => (x.disabled = !active));
  }

  function validateInput(input) {
    let valid = true;
    Object.entries(input).forEach(([x, y]) => {
      if (y.value.length === 0) {
        y.className = 'inputError';
        valid = false;
      } else {
        y.removeAttribute('class');
      }
    });
    return valid;
  }

  async function displayBooks() {
    table.innerHTML = '<tr><td colspan=4>Loading...<td></tr>';
    const books = await api.getBooks();
    table.innerHTML = '';
    books
      .sort((x, y) => x.author.localeCompare(y.author))
      .forEach((x) => {
        table.appendChild(renderBook(x));
      });
  }

  function renderBook(book) {
    const editBtn = el('button', 'Edit');
    editBtn.addEventListener('click', toggleEditor);
    const deleteBtn = el('button', 'Delete');
    deleteBtn.addEventListener('click', () =>
      deleteBook(book.objectId, element)
    );
    const element = el('tr', [
      el('td', book.title),
      el('td', book.author),
      el('td', book.isbn || ''),
      el('td', [editBtn, deleteBtn]),
    ]);
    return element;

    function toggleEditor() {
      const edit = {
        title: el('input', null, { type: 'text', value: book.title }),
        author: el('input', null, { type: 'text', value: book.author }),
        isbn: el('input', null, { type: 'text', value: book.isbn }),
      };
      const confirmBtn = el('button', 'Save');
      const cancelBtn = el('button', 'Cancel');
      const editor = el('tr', [
        el('td', edit.title),
        el('td', edit.author),
        el('td', edit.isbn),
        el('td', [confirmBtn, cancelBtn]),
      ]);

      table.replaceChild(editor, element);

      cancelBtn.addEventListener('click', () => {
        table.replaceChild(element, editor);
      });

      confirmBtn.addEventListener('click', async () => {
        // element.children[0].textContent = edit.title.value;
        // element.children[1].textContent = edit.author.value;
        // element.children[2].textContent = edit.isbn.value;

        // table.replaceChild(element, editor);
        // book.title = edit.title.value;
        // book.author = edit.author.value;
        // book.isbn = edit.isbn.value;
        // try {
        //   await api.updateBook(book);
        // } catch (error) {
        //   alert(err);
        //   console.log(err);
        // }
        if (validateInput(edit) === false) {
          alert('All fields are required');
          return;
        }

        const edited = {
          objectId: book.objectId,
          title: edit.title.value,
          author: edit.author.value,
          isbn: edit.isbn.value,
        };

        try {
          toggleInput(false, Object.values(edit), confirmBtn, cancelBtn);
          const result = await api.updateBook(edited);
          table.replaceChild(renderBook(result), editor);
        } catch (err) {
          alert(err);
          console.log(err);
          toggleInput(true, Object.values(input), confirmBtn, cancelBtn);
        }
      });
    }
  }

  async function deleteBook(id, element) {
    const btn = element.children[3].children[1];
    try {
      btn.disabled = true;
      btn.textContent = 'Please wait...';
      await api.deleteBook(id);
      element.remove();
    } catch (err) {
      btn.disabled = false;
      btn.textContent = 'Delete';
      alert(err);
      console.log(err);
    }
  }
});
