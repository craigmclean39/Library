let myLibrary = [];

const libraryFlex = document.getElementById("library-flex");

let Book = (function(){
    let nextId = 0;

    return function(title, author, pages, read, desc, category, thumbnail) {

    //console.log("in book constructor")
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.desc = desc;
    this.thumbnail = thumbnail;
    this.category = category;

    this.id = nextId++;
    };
})();

Book.prototype = {

    readOrNotStr() {
        if(this.read) {
            return "read";
        }
        else {
            return "not yet read";
        }
    },

};

Book.prototype.info = function(){

    //console.dir(this);
    return `${this.title} by ${this.author}, ${this.pages} pages, ${this.readOrNotStr()}, ${this.desc}, ${this.category}, ${this.thumbnail}, ${this.id}`;
}

function AddToLibrary(b){
    myLibrary.push(b);
    libraryFlex.appendChild(GenerateCard(b));
}

function DeleteFromLibraryEvent(evt) {

    //console.dir(evt.currentTarget);
    DeleteFromLibrary(evt.currentTarget.dataset.id);

}

function DeleteFromLibrary(id) {

    //Remove from Library
    for(let i = 0; i < myLibrary.length; i++)
    {
        if(myLibrary[i].id == id)
        {
            myLibrary.splice(i, 1);
            break;
        }
    }

    //Remove from Dom
    let children = libraryFlex.children;
    for(let i = 0; i < children.length; i++)
    {
        if(children[i].dataset.id == id)
        {
            libraryFlex.removeChild(children[i]);
        }
    }

}

function CreateDiv(className) {

    let d = document.createElement("div");
    d.className = className;
    return d;
}

//This function takes a Book object and generates a html card to be added to the dom
function GenerateCard(b){

    let newCard = CreateDiv("card");
    newCard.dataset.id = b.id;

    let hero = CreateDiv("hero");
    hero.style.backgroundImage = `url("${b.thumbnail}")`;
    newCard.appendChild(hero);


    let bottom = CreateDiv("bottom");

    let title = CreateDiv("book-title book-info");
    title.innerText = b.title;

    let author = CreateDiv("author book-info");
    author.innerText = b.author;

    let description = CreateDiv("desc")
    description.innerText = b.desc;

    bottom.appendChild(title);
    bottom.appendChild(author);
    bottom.appendChild(description);

    let category = CreateDiv("category book-info")
    let infoLeft = CreateDiv("info-left");

    let genre = CreateDiv("genre");
    genre.innerText = b.category;

    infoLeft.appendChild(genre);

    let pages = CreateDiv("pages");
    pages.innerText = b.pages + " pages";
    
    category.appendChild(infoLeft);
    category.appendChild(pages);

    bottom.appendChild(category);

    let footer = CreateDiv("card-footer");

    footer.appendChild(AddButton("READ", b.id));
    footer.appendChild(AddButton("DELETE", b.id));


    bottom.appendChild(footer);
    newCard.appendChild(bottom);

    return newCard;
}



//CREATE BUTTONS, type can be READ, DELETE, SAVE
function AddButton(buttonType, newId)
{
    returnButton = document.createElement("div");
    btn = document.createElement("button");
    img = document.createElement("img");
    btnText = document.createElement("div");

    switch(buttonType)
    {
        case "READ":
            {
                btn.className = "read btn";
                btn.value  = "read";
                img.src = "media/book_black_24dp.svg";
                btnText.innerText = "Read";
                break;
            }
        case "DELETE":
            {
                btn.className = "delete btn";
                btn.value  = "delete";
                img.src = "media/delete_outline_black_24dp.svg";
                btnText.innerText = "Delete";

                btn.addEventListener("click", DeleteFromLibraryEvent);
                break;
            }
        case "SAVE":
            {
                btn.className = "save btn";
                btn.value  = "save";
                img.src = "media/save_black_24dp.svg";
                btnText.innerText = "Save";
                break;
            }
}

    btn.appendChild(img);
    btn.appendChild(btnText);

    btn.dataset.id = newId;
    returnButton.appendChild(btn);

    return returnButton;

}


//Some hardcoded books to default into the library
let theMartian = new Book("The Martian", "Andy Weir", 480, false, "Description", "Fiction", "media/9780804139021.jpeg");
let anathem = new Book("Anathem", "Neal Stephenson", 1008, false, "Description", "Fiction", "media/anathem.jpg");

//console.log(theMartian.info());
//console.log(anathem.info());

AddToLibrary(theMartian);
AddToLibrary(anathem);

console.dir(myLibrary);

//DeleteFromLibrary(0);

console.dir(myLibrary);