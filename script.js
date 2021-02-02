const list = document.querySelector('.list');
const form = document.querySelector('form');
const button = document.querySelector('.button.large');


const addBook = (book, id) => {

    // grab the title of each book & date issued and add them to the list of books listed in the HTML
    // grab id of each document and append as data- value to the list
    let issuedDate = book.date_issued.toDate();
    let html = `
        <li class="item" data-id="${id}">
            <div>${book.title}</div>
            <div>${issuedDate}</div>
            <button class="button">Delete</button>
        </li>
    `;

    list.innerHTML += html;
};

const deleteBook = (id) => {
    // grab all  list items in the DOM
    const books = document.querySelectorAll('.item');

    books.forEach(book => {
        // remove list if both ids match up
        if(book.getAttribute('data-id') === id) {
            book.remove();
        }
    });
};

// grab a reference to the books collection in the database

// NB::: to unsubscribe from database changes, store the function below in a variable to be attached to a button that effects the changes when clicked
const unsubscribe = database.collection('books').onSnapshot(snapshot => {

    snapshot.docChanges().forEach(change => {
        const doc = change.doc;

        // check for change type, grab data and add book if 'added', else delete book with id value if 'removed'
        if(change.type === 'added') {
            addBook(doc.data(), doc.id);
        } else if (change.type === 'removed') {
            deleteBook(doc.id);
        }
    })
});

        // database.collection('books').get().then(snapshot => {

        //     snapshot.docs.forEach(doc => {
        //         addBook(doc.data(), doc.id);
        //     })

        // }).catch(error => {
        //     console.log(error);
        // });

// adding more books through the form

form.addEventListener('submit', e => {
    e.preventDefault();

    const currDate = new Date();

    const userData = {
        title: form.book.value,
        date_issued: firebase.firestore.Timestamp.fromDate(currDate)
    }  

    // grab the value of userdata and add to the database
    database.collection('books').add(userData).then(() => {
        console.log('data added successfully');
    }).catch(error => {
        console.log(error);
    });
});

// deleting data from the database

list.addEventListener('click', e => {
    // grab the id value of the parent list of each item clicked on
    const id = e.target.parentElement.getAttribute('data-id');

    if(e.target.tagName = 'BUTTON') {

        // delete list considering the id value of the list
        database.collection('books').doc(id).delete().then(() => {
            console.log('list deleted successfully');
        }).catch(error => {
            console.log(error);
        });
    }

});

// unsubscribing from changes
button.addEventListener('click', () => {
    unsubscribe();  
});