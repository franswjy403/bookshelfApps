const INCOMPLETE_BOOK_LIST_ID = "incompleteBookshelfList";
const COMPLETE_BOOK_LIST_ID = "completeBookshelfList";
const BOOK_ITEMID = "itemId";

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
    
    buttonContainer.append(buttonGreen, buttonRed);
    
    textContainer.append(bookTitle, bookAuthor, bookYear, buttonContainer);

    return textContainer;
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

function addBookToCompleted(book){
    const bookTitle = book.querySelector("h3").innerText;
    const bookData = book.querySelectorAll("p");
    const bookAuthor = bookData[0].innerText;
    const bookYear = bookData[1].innerText;

    const newBook = makeBook(bookTitle, bookAuthor, bookYear, true);
    const listCompleted = document.getElementById(COMPLETE_BOOK_LIST_ID);

    const bookObj = findBook(book[BOOK_ITEMID]);
    bookObj.isComplete = true;
    newBook[BOOK_ITEMID] = bookObj.id;

    listCompleted.append(newBook);

    book.remove();
    updateDataToStorage();
}

function addBookToUncompleted(book){
    const bookTitle = book.querySelector("h3").innerText;
    const bookData = book.querySelectorAll("p");
    const bookAuthor = bookData[0].innerText;
    const bookYear = bookData[1].innerText;

    const newBook = makeBook(bookTitle, bookAuthor, bookYear, false);
    const listUncompleted = document.getElementById(INCOMPLETE_BOOK_LIST_ID);

    const bookObj = findBook(book[BOOK_ITEMID]);
    bookObj.isComplete = false;
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
