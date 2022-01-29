const STORAGE_KEY = "bookshelf_app";
const EDIT_BOOK_KEY = "edit_book_id";

let books = [];

function isStorageExist(){
    if(typeof(Storage) === undefined){
        alert("Your browser doesn't support storage");
        return false
    }
    return true;
}

function resetEditBookId(){
    sessionStorage.removeItem(EDIT_BOOK_KEY);
}

function setEditBookId(bookId){
    sessionStorage.setItem(EDIT_BOOK_KEY, bookId);
}

function getEditBookId(){
    return sessionStorage.getItem(EDIT_BOOK_KEY);
}

function isEditingBook(){
    return getEditBookId() != null;
}

function saveData() {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event("ondatasaved"));
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    
    let data = JSON.parse(serializedData);
    
    if(data !== null)
        books = data;
  
    document.dispatchEvent(new Event("ondataloaded"));
}

function updateDataToStorage() {
    if(isStorageExist())
        saveData();
}

function composeBookObject(title, author, year, isComplete) {
    return {
        id: +new Date(),
        title,
        author,
        year,
        isComplete
    };
}

function findBook(bookId) {
    for(book of books){
        
        if(book.id === bookId){
            return book;
        }
            
    }
    return null;
}

function findBookIndex(bookId) {
    let index = 0
    for (book of books) {
        if(book.id === bookId)
            return index;
  
        index++;
    }
  
    return -1;
}

function refreshDataFromBooks() {
    const listUncompleted = document.getElementById(INCOMPLETE_BOOK_LIST_ID);
    let listCompleted = document.getElementById(COMPLETE_BOOK_LIST_ID);
  
    for(book of books){
        const newBook = makeBook(book.title, book.author, book.year, book.isComplete);
        newBook[BOOK_ITEMID] = book.id;
  
        if(book.isComplete){
            listCompleted.append(newBook);
        } else {
            listUncompleted.append(newBook);
        }
    }
}