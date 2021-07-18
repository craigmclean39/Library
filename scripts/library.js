let myLibrary = [];

const libraryFlex = document.getElementById("library-flex");
const header = document.getElementById("header");

let addInProgress = false;

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

function SaveBook(evt)
{
    console.dir(evt);

    let elmt = evt.target;
    while(elmt.className != "card")
    {
        elmt = elmt.parentElement;
        console.log(elmt.className);
    }

    libraryFlex.removeChild(elmt);

    let b = new Book("TEST", "", 0, false, "", "", "");
    AddToLibrary(b);

    addInProgress = false;
}

function AddToLibrary(b){
    myLibrary.push(b);
    libraryFlex.appendChild(GenerateCard(b, false));
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

function ToggleReadStatusEvent(evt) {
    ToogleReadStatus(evt.currentTarget.dataset.id);
}

function ToogleReadStatus(id) {
    //Toggle status in Library
    for(let i = 0; i < myLibrary.length; i++)
    {
        if(myLibrary[i].id == id)
        {
            myLibrary[i].read = !myLibrary[i].read;
            break;
        }
    }

    //Toggle button in DOM
    let children = libraryFlex.children;
    for(let i = 0; i < children.length; i++)
    {
        if(children[i].dataset.id == id)
        {
            let btns = children[i].getElementsByClassName("btn");

            console.dir(btns);

            for(let j = 0; j < btns.length; j++)
            {
                if(btns[j].classList.contains("read"))
                {
                    btns[j].classList.remove("read");
                    btns[j].classList.add("unread");
                    btns[j].getElementsByTagName("div")[0].innerText = "Unread";
                    break;
                }
                else if(btns[j].classList.contains("unread"))
                {
                    btns[j].classList.remove("unread");
                    btns[j].classList.add("read");

                    btns[j].getElementsByTagName("div")[0].innerText = "Read";
                    break;
                }
            }
        }
    }

    console.dir(myLibrary);
}

function AddBookInput(evt)
{
    console.log("ADD");

    if(!addInProgress)
    {
        addInProgress = true;
        let b = new Book("", "", 0, false, "", "", "");
        libraryFlex.appendChild(GenerateCard(b, true));

        libraryFlex.lastChild.scrollIntoView();
    }
}

function DeleteText(evt)
{
    evt.currentTarget.value = "";

}


function CreateDiv(className) {

    let d = document.createElement("div");
    d.className = className;
    return d;
}

function CreateInput(className){
    let d = document.createElement("input");
    d.type = "text";
    d.className = className;
    return d;
}

//This function takes a Book object and generates a html card to be added to the dom
function GenerateCard(b, isForm){

    let newCard = CreateDiv("card");
    newCard.dataset.id = b.id;

    let hero = CreateDiv("hero");
    hero.style.backgroundImage = `url("${b.thumbnail}")`;
    newCard.appendChild(hero);


    let bottom = CreateDiv("bottom");

    let title = {};
    if(!isForm)
    {
        title = CreateDiv("book-title book-info");
        title.innerText = b.title;

    }
    else
    {
        title = CreateInput("book-title-input book-title book-info");
        title.value = "Title..."
        title.addEventListener("click", DeleteText);
    }
    


    
    

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


    if(b.read)
    {
        footer.appendChild(AddButton("READ", b.id));

    }
    else 
    {
        footer.appendChild(AddButton("UNREAD", b.id));
    }

    if(!isForm)
    {
        footer.appendChild(AddButton("DELETE", b.id));
    }
    else
    {
        footer.appendChild(AddButton("SAVE", b.id));
    }
    


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
        case "UNREAD":
            {
                btn.className = "unread btn";
                btn.value  = "unread";
                img.src = "media/book_black_24dp.svg";
                btnText.innerText = "Unread";
                btn.addEventListener("click", ToggleReadStatusEvent);
                break;
            }
        case "READ":
            {
                btn.className = "read btn";
                btn.value  = "read";
                img.src = "media/book_black_24dp.svg";
                btnText.innerText = "Read";
                btn.addEventListener("click", ToggleReadStatusEvent);
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
                btn.addEventListener("click", SaveBook);
                break;
            }
            case "ADD":
            {
                btn.className = "add btn";
                btn.value  = "add";
                img.src = "media/library_add_black_24dp.svg";
                btnText.innerText = "Add";
                btn.addEventListener("click", AddBookInput);
                break;
            }
}

    btn.appendChild(img);
    btn.appendChild(btnText);

    btn.dataset.id = newId;
    returnButton.appendChild(btn);

    return returnButton;

}

header.appendChild(AddButton("ADD"));


//Some hardcoded books to default into the library
let theMartian = new Book("The Martian", "Andy Weir", 480, true, "Description", "Fiction", "media/9780804139021.jpeg");
let anathem = new Book("Anathem", "Neal Stephenson", 1008, false, "Description", "Fiction", "media/anathem.jpg");


//console.log(theMartian.info());
//console.log(anathem.info());

AddToLibrary(theMartian);
AddToLibrary(anathem);


console.dir(myLibrary);

//DeleteFromLibrary(0);

console.dir(myLibrary);