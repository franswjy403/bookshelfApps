document.addEventListener("DOMContentLoaded", function(){
    const submitForm = document.getElementById("inputBook");
    const searchForm = document.getElementById("searchBook");

    submitForm.addEventListener("submit", function(event){
        event.preventDefault();
        addBook();
    });

    searchForm.addEventListener("submit", function(event){
        event.preventDefault();
        searchBook();
    });

    if(isStorageExist()) loadDataFromStorage();
})

document.addEventListener("ondatasaved", () => {
    console.log("Data berhasil disimpan.");
})

document.addEventListener("ondataloaded", () => {
    refreshDataFromBooks();
})

const checkbox = document.getElementById("inputBookIsComplete");
checkbox.addEventListener("change", function(){
    if(this.checked){
        document.getElementById("isRead").innerText = "Selesai dibaca";
    }
    else{
        document.getElementById("isRead").innerText = "Belum selesai dibaca";
    }
})