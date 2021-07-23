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


//This is a hack to pass the thumbnail to savebook
let globalThumbnail = "";
let globalBookIndex = 0;
let globalBooksData = {};

function SaveBook(evt)
{
    console.dir(evt);

    //check the element for all the info the user inputed
    let usrTitle = "";
    let usrAuthor = "";
    let usrPages = 0;
    let usrRead = false;
    let usrDesc = "";
    let usrCategory = "";


    let elmt = evt.target;
    while(elmt.className != "card")
    {
        elmt = elmt.parentElement;
        //console.log(elmt.className);
    }
    

    usrTitle = elmt.getElementsByClassName("book-title-input")[0].value;
    usrAuthor = elmt.getElementsByClassName("author-input")[0].value;
    usrDesc = elmt.getElementsByClassName("desc-input")[0].value;
    usrPages = elmt.getElementsByClassName("pages-input")[0].value;
    usrCategory = elmt.getElementsByClassName("genre-input")[0].value;

    //console.dir(elmt.getElementsByClassName("read")[0]);
    if(elmt.getElementsByClassName("read")[0] != undefined)
    {
        usrRead = true;
    }

    let b = new Book(usrTitle, usrAuthor, usrPages, usrRead, usrDesc, usrCategory, globalThumbnail);


    //Remove the form element from the library
    libraryFlex.removeChild(elmt);

    //And add an actual book
    AddToLibrary(b);

    addInProgress = false;
    globalBookIndex = 0;
    globalBooksData = {};
    globalThumbnail = "";
}

function AddToLibrary(b){
    myLibrary.push(b);
    libraryFlex.appendChild(GenerateCard(b, false));
    libraryFlex.lastChild.scrollIntoView();
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

            //console.dir(btns);

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

    //console.dir(myLibrary);
}

function AddBookInput(evt)
{
    if(!addInProgress)
    {
        addInProgress = true;
        globalThumbnail = "";
        let b = new Book("", "", 0, false, "", "", "");
        libraryFlex.appendChild(GenerateCard(b, true));
        libraryFlex.lastChild.scrollIntoView();
    }
}

function GetCard(evt)
{
    let elmt = evt.target;
    while(elmt.className != "card")
    {
        elmt = elmt.parentElement;
    }

    return elmt;
}

function DoSearch(evt)
{

    console.log("Search");
    let elmt = evt.target;
    while(elmt.className != "card")
    {
        elmt = elmt.parentElement;
        //console.log(elmt.className);
    }
    
    let usrTitle = elmt.getElementsByClassName("book-title-input")[0].value;
    let usrAuthor = elmt.getElementsByClassName("author-input")[0].value;

    if(usrTitle == "" && usrAuthor == "") {
        return;
    }

    let searchInfo = usrTitle + "+" + usrAuthor;

    searchInfo = searchInfo.replace(/\s+/g, '+').toLowerCase();
    let URL = 'https://www.googleapis.com/books/v1/volumes?q=';
    URL += searchInfo;

    console.log(URL);

    $.ajax({
        url: URL.toString(),
        dataType: 'json',
        success: function(data) {

            console.dir(data);
            console.log(elmt);

            globalBooksData = data;
            FillForm(data.items[0], elmt);
        }
    })
}

function NextBook(evt)
{
    if(globalBooksData != undefined)
    {
        if(globalBookIndex < (globalBooksData.items.length - 1))
        {
            globalBookIndex++;
            FillForm(globalBooksData.items[globalBookIndex],GetCard(evt));
        }
    }
}

function PrevBook(evt)
{
    if(globalBooksData != undefined)
    {
        if(globalBookIndex > 0)
        {
            globalBookIndex--;
            FillForm(globalBooksData.items[globalBookIndex],GetCard(evt));
        }
    }
}

function FillForm(data, elmt)
{
    //let inputs = //elmt.getElementsByTagName("input");
    //console.dir(inputs);

    //inputs[0].hasClas
    let title = elmt.getElementsByClassName("book-title-input")[0];
    let author = elmt.getElementsByClassName("author-input")[0];
    let desc = elmt.getElementsByClassName("desc-input")[0];
    let category = elmt.getElementsByClassName("genre-input")[0];
    let pages = elmt.getElementsByClassName("pages-input")[0];

    if(data.volumeInfo.title != undefined)
    {
        title.value = data.volumeInfo.title;
    }
    else{
        title.value = "";
    }
    
    if(data.volumeInfo.authors != undefined)
    {
        author.value = data.volumeInfo.authors[0];
    }
    else{
        author.value = "";
    }
    

    if(data.searchInfo != undefined)
    {
        if(data.searchInfo.textSnippet != undefined)
        {
            desc.value = data.searchInfo.textSnippet;
        }
    }
    else if(data.volumeInfo.description != undefined)
    {
        desc.value = data.volumeInfo.description;
    }
    else{
        desc.value = "";
    }
    
    if(data.volumeInfo.categories != undefined)
    {
        category.value = data.volumeInfo.categories[0];
    }
    else{
        category.value = "";
    }

    if(data.volumeInfo.pageCount != undefined)
    {
        pages.value = data.volumeInfo.pageCount;
    }
    else{
        pages.value = "";
    }
    
    

    if(data.volumeInfo.imageLinks != undefined)
    {
        if(data.volumeInfo.imageLinks.thumbnail != undefined)
        {
            globalThumbnail = data.volumeInfo.imageLinks.thumbnail;
        }
        else if(data.volumeInfo.imageLinks.smallThumbnail != undefined)
        {
            globalThumbnail = data.volumeInfo.imageLinks.thumbnail;
        }
    }
    else{
        globalThumbnail = "";
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

function CreateInput(labelText, className, isNumber){

    let label = document.createElement("label");
    label.className = "label-class";
    label.innerText = labelText;
    label.for = labelText;
    let d = document.createElement("input");
    d.id = labelText;

    if(!isNumber)
    {
        d.type = "text";
    }
    else{
        d.type = "number";
    }
    
    d.className = className;

    label.appendChild(d);
    return label;
}

//This function takes a Book object and generates a html card to be added to the dom
function GenerateCard(b, isForm){

    let newCard = CreateDiv("card");
    newCard.dataset.id = b.id;

    let hero = {};
    if(!isForm)
    {
        

        /* if(b.thumbnail != undefined && b.thumbnail != "")
        { */
            hero = CreateDiv("hero");

            if(b.thumbnail != undefined && b.thumbnail != "")
            {
                hero.style.backgroundImage = `url("${b.thumbnail}")`;
            }
            else
            {
                let placeholder = document.createElement("img");
                placeholder.src = "media/book_black_24dp.svg";
                placeholder.className = "placeholder";
                hero.appendChild(placeholder);

                hero.className = "hero hero-placeholder";
            }
            
            newCard.appendChild(hero);
/*         }
        else
        {
            hero = CreateDiv("not-hero");
            newCard.appendChild(hero);
        } */
    }
    else
    {
        hero = CreateDiv("not-hero");
        newCard.appendChild(hero);
    }

    let bottom = CreateDiv("bottom");

    let title = {};
    let author = {};
    let description = {};
    if(!isForm)
    {
        title = CreateDiv("book-title book-info");
        title.innerText = b.title;

        author = CreateDiv("author book-info");
        author.innerText = b.author;

        description = CreateDiv("desc")
        description.innerText = b.desc;

    }
    else
    {
        title = CreateInput("Title", "input book-title-input", false);
        //title.value = "Title...";
        //title.addEventListener("click", DeleteText);


        author = CreateInput("Author", "input author-input", false);
        //author.value = "Author...";
        //author.addEventListener("click", DeleteText);

        description = CreateInput("Description", "input desc-input", false);
        //description.value = "Description...";
        //description.addEventListener("click", DeleteText);
        
    }
    
    bottom.appendChild(title);
    bottom.appendChild(author);
    bottom.appendChild(description);



    let category = CreateDiv("category book-info")

    let genre = {};
    let pages = {};

    if(!isForm)
    {
        genre = CreateDiv("genre");
        genre.innerText = b.category;
    }
    else
    {
        genre = CreateInput("Genre", "input genre-input", false);
        //genre.value = "Genre...";
        //genre.addEventListener("click", DeleteText);
    }


    if(!isForm)
    {
        pages = CreateDiv("pages");
        pages.innerText = b.pages + " pages";
    }
    else
    {
        pages = CreateInput("Num Pages", "input pages-input", true);
        //pages.value = "Number of Pages";
        //pages.addEventListener("click", DeleteText);
    }
    
    
    if(!isForm)
    {
        category.appendChild(genre);
        category.appendChild(pages);
        bottom.appendChild(category);
    }
    else{
        bottom.appendChild(genre);
        bottom.appendChild(pages);
    }


    //Add A Search Button for books api
    if(isForm)
    {
        let d = CreateDiv("search-buttons");
        d.appendChild(AddButton("SEARCH", b.id));
        d.appendChild(AddButton("PREV", b.id));
        d.appendChild(AddButton("NEXT", b.id));
        bottom.appendChild(d);
    }

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
        case "SEARCH":
        {
            btn.className = "search btn";
            btn.value  = "search";
            img.src = "media/search_black_24dp.svg";
            btnText.innerText = "Search";
            btn.addEventListener("click", DoSearch);
            break;
        }
        case "NEXT":
        {
            btn.className = "next nav-btn";
            btn.value = "next";
            img.src = "media/arrow_right_black_24dp.svg";
            btn.addEventListener("click", NextBook);
            break;
        }
        case "PREV":
        {
            btn.className = "prev nav-btn";
            btn.value = "prev";
            img.src = "media/arrow_left_black_24dp.svg";
            btn.addEventListener("click", PrevBook);
            break;
        }
    }

    btn.appendChild(img);

    if(buttonType != "NEXT" && buttonType != "PREV")
    {
        btn.appendChild(btnText);
    }
    

    btn.dataset.id = newId;
    returnButton.appendChild(btn);

    return returnButton;

}

header.appendChild(AddButton("ADD"));


//Some hardcoded books to default into the library
let theMartian = new Book("The Martian", "Andy Weir", 480, true, "Six days ago, astronaut Mark Watney became one of the first people to walk on Mars.", "Fiction", "media/9780804139021.jpeg");
let anathem = new Book("Anathem", "Neal Stephenson", 1008, false, "Fraa Erasmas is a young avout living in the Concent of Saunt Edhar, a sanctuary for mathematicians, scientists, and philosophers", "Fiction", "media/anathem.jpg");

AddToLibrary(theMartian);
AddToLibrary(anathem);
