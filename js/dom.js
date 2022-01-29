const INCOMPLETE_BOOK_LIST_ID = "incompleteBookshelfList";
const COMPLETE_BOOK_LIST_ID = "completeBookshelfList";
const BOOK_ITEMID = "itemId";

let temporaryEditedBook = null;

function addBook(){
    const bookTitle = document.getElementById("inputBookTitle").value;
    const bookAuthor = document.getElementById("inputBookAuthor").value;
    const bookYear = document.getElementById("inputBookYear").value;
    const isCompleted = document.getElementById("inputBookIsComplete").checked;
    
    const book = makeBook(bookTitle, bookAuthor, bookYear, isCompleted);
    const bookObject = composeBookObject(bookTitle, bookAuthor, bookYear, isCompleted);
    book[BOOK_ITEMID] = bookObject.id;
    books.push(bookObject);

    let bookShelf = null;
    if(isCompleted){
        bookShelf = document.getElementById(COMPLETE_BOOK_LIST_ID);
    }
    else{
        bookShelf = document.getElementById(INCOMPLETE_BOOK_LIST_ID);
    }

    bookShelf.append(book);
    updateDataToStorage();

    resetSubmitForm();
}

function makeBook(title, author, year, isCompleted){
    const bookTitle = document.createElement("h3");
    bookTitle.innerText = title;

    const bookAuthor = document.createElement("p");
    bookAuthor.innerText = "Penulis: "+author;

    const bookYear = document.createElement("p");
    bookYear.innerText = "Tahun: "+year;

    const textContainer = document.createElement("article");
    textContainer.classList.add("book_item");
    

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("action");
    
    let buttonGreen = null;
    if(isCompleted) buttonGreen = createUncompleteButton();
    else buttonGreen = createCompleteButton();

    const buttonRed = createDeleteButton();

    const buttonYellow = createEditButton();
    
    buttonContainer.append(buttonGreen, buttonRed, buttonYellow);
    
    textContainer.append(bookTitle, bookAuthor, bookYear, buttonContainer);

    return textContainer;
}

function addBookToCompleted(book){
    const bookObj = findBook(book[BOOK_ITEMID]);
    bookObj.isComplete = true;
    

    const bookTitle = bookObj.title;
    const bookAuthor = bookObj.author;
    const bookYear = bookObj.year;

    const newBook = makeBook(bookTitle, bookAuthor, bookYear, true);
    const listCompleted = document.getElementById(COMPLETE_BOOK_LIST_ID);
    newBook[BOOK_ITEMID] = bookObj.id;
    
    listCompleted.append(newBook);

    book.remove();
    updateDataToStorage();
}

function addBookToUncompleted(book){
    const bookObj = findBook(book[BOOK_ITEMID]);
    bookObj.isComplete = false;
    

    const bookTitle = bookObj.title;
    const bookAuthor = bookObj.author;
    const bookYear = bookObj.year;

    const newBook = makeBook(bookTitle, bookAuthor, bookYear, false);
    const listUncompleted = document.getElementById(INCOMPLETE_BOOK_LIST_ID);
    newBook[BOOK_ITEMID] = bookObj.id;

    listUncompleted.append(newBook);

    book.remove();
    updateDataToStorage();
}

function deleteBook(book){
    const bookPosition = findBookIndex(book[BOOK_ITEMID]);
    books.splice(bookPosition, 1);

    book.remove();
    updateDataToStorage();
}

function searchBook(){
    const bookTitle = document.getElementById("searchBookTitle").value;
    const listCompleted = document.getElementById(COMPLETE_BOOK_LIST_ID).querySelectorAll('article');
    const listUncompleted = document.getElementById(INCOMPLETE_BOOK_LIST_ID).querySelectorAll('article');

    let i = 0;
    for(i = 0; i<listCompleted.length;i++){
        const title = listCompleted[i].querySelector("h3").innerText;
        if(title.includes(bookTitle)){
            listCompleted[i].removeAttribute("hidden");
        }
        else{
            listCompleted[i].setAttribute("hidden", "hidden");
        }
    }

    for(i = 0; i<listUncompleted.length;i++){
        const title = listUncompleted[i].querySelector("h3").innerText;
        if(title.includes(bookTitle)){
            listUncompleted[i].removeAttribute("hidden");
        }
        else{
            listUncompleted[i].setAttribute("hidden", "hidden");
        }
    }
}

function resetSubmitForm(){
    const submitForm = document.getElementById("inputBook");
    submitForm.querySelector("#bookSubmit").style.display = "block";
    submitForm.querySelector("#bookEditSubmit").style.display = "none";

    submitForm.querySelector("#inputBookTitle").value = "";
    submitForm.querySelector("#inputBookAuthor").value = "";
    submitForm.querySelector("#inputBookYear").value = "";
    submitForm.querySelector("#inputBookIsComplete").checked = false;
}

function editBook(book){
    const bookObj = findBook(book[BOOK_ITEMID]);
    const editForm = document.getElementById("inputBook");
    editForm.querySelector("#bookSubmit").style.display = "none";
    editForm.querySelector("#bookEditSubmit").style.display = "block";
    editForm.scrollIntoView();

    const editTitle = editForm.querySelector("#inputBookTitle");
    const editAuthor = editForm.querySelector("#inputBookAuthor");
    const editYear = editForm.querySelector("#inputBookYear");
    const editIsComplete = editForm.querySelector("#inputBookIsComplete");

    editTitle.value = bookObj.title;
    editAuthor.value = bookObj.author;
    editYear.value = bookObj.year;
    editIsComplete.checked = bookObj.isComplete;

    setEditBookId(book[BOOK_ITEMID]);
    temporaryEditedBook = book;
}

function saveEditBook(){
    const editForm = document.getElementById("inputBook");

    const title = editForm.querySelector("#inputBookTitle").value;
    const author = editForm.querySelector("#inputBookAuthor").value;
    const year = editForm.querySelector("#inputBookYear").value;
    const isComplete = editForm.querySelector("#inputBookIsComplete").checked;

    const bookId = Number(getEditBookId());
    const choosenBook = findBook(bookId);
    choosenBook.title = title;
    choosenBook.author = author;
    choosenBook.year = year;
    choosenBook.isComplete = isComplete;

    const editedBook = makeBook(title, author, year, isComplete);
    editedBook[BOOK_ITEMID] = choosenBook.id;

    let bookShelf = null;
    if(isComplete){
        bookShelf = document.getElementById(COMPLETE_BOOK_LIST_ID);
    }
    else{
        bookShelf = document.getElementById(INCOMPLETE_BOOK_LIST_ID);
    }

    bookShelf.append(editedBook);
    updateDataToStorage();

    resetEditBookId();
    temporaryEditedBook.remove();
    temporaryEditedBook = null;
    resetSubmitForm();
}

function createButton(buttonType, innerText, eventListener){
    const button = document.createElement("button");
    button.classList.add(buttonType);
    button.innerText = innerText;
    button.addEventListener("click", function(event){
        eventListener(event);
    });
    return button;
}

function createCompleteButton(){
    return createButton("green", "Selesai Dibaca", function(event){
        addBookToCompleted(event.target.parentElement.parentElement);
    });
}

function createUncompleteButton(){
    return createButton("green", "Belum Selesai Dibaca", function(event){
        addBookToUncompleted(event.target.parentElement.parentElement);
    });
}

function createDeleteButton(){
    return createButton("red", "Hapus Buku", function(event){
        deleteBook(event.target.parentElement.parentElement);
    }); 
}

function createEditButton(){
    return createButton("yellow", "Edit Buku", function(event){
        editBook(event.target.parentElement.parentElement);
    });
}
