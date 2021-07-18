let myLibrary = [];

const libraryFlex = document.getElementById("library-flex");
console.log(libraryFlex);

let Book = function(title, author, pages, read, desc, category, thumbnail) {

    //console.log("in book constructor")

    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.desc = desc;
    this.thumbnail = thumbnail;
    this.category = category;
}

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
    return `${this.title} by ${this.author}, ${this.pages} pages, ${this.readOrNotStr()}, ${this.desc}, ${this.category}, ${this.thumbnail}`;
}

//This function takes a Book object and generates a html card to be added to the dom
{/* <div class='card'>
        <div class='hero'></div>
        <div class="bottom">
         <div class ='book-title book-info'>
           The Martian
         </div>
     
         <div class="author book-info">Andy Weir</div>
         
         <div class="desc">
     After a dust storm nearly kills him and forces his crew to evacuate while thinking him dead, Mark finds himself stranded and completely alone with no way to even signal Earth that he’s alive</div>
         
         <div class='category book-info'>
           <div class="info-left">
             <div class='fic'>Fiction</div>
             <div class="genre">Sci-fi</div>
           </div>
           <div class="pages">400 pages</div>
         </div>
         <div class="card-footer">
           <div>
             <button class="read btn" value="read">
                <img src="media/book_black_24dp.svg">
                <div>Read</div>
             </button>
             </div>
           <div>
             <button class="delete btn" value = "save">
               <img src="media/delete_outline_black_24dp.svg">
               Delete
             </button>
           </div>
         </div>
        </div>
       </div> */}
function GenerateCard(b){

    let newCard = document.createElement("div");
    newCard.className = 'card';

    let hero = document.createElement("div");
    hero.className = 'hero';
    hero.style.backgroundImage = `url("${b.thumbnail}")`;
    newCard.appendChild(hero);


    let bottom = document.createElement("div");
    bottom.className = "bottom";


    let title = document.createElement("div");
    title.className = "book-title book-info";
    title.innerText = b.title;

    let author = document.createElement("div");
    author.className = "author book-info";
    author.innerText = b.author;

    let description = document.createElement("div");
    description.className = "desc";
    description.innerText = b.desc;

    bottom.appendChild(title);
    bottom.appendChild(author);
    bottom.appendChild(description);

    let category = document.createElement("div");
    category.className = "category book-info";

    let infoLeft = document.createElement("div");
    infoLeft.className = "info-left";

    let genre = document.createElement("div");
    genre.className = "genre";
    genre.innerText = b.category;

    infoLeft.appendChild(genre);

    let pages = document.createElement("div");
    pages.className = "pages";
    pages.innerText = b.pages + " pages";
    
    category.appendChild(infoLeft);
    category.appendChild(pages);

    bottom.appendChild(category);

/*     <div class="card-footer">
           <div>
             <button class="read btn" value="read">
                <img src="media/book_black_24dp.svg">
                <div>Read</div>
             </button>
             </div>
           <div>
             <button class="delete btn" value = "save">
               <img src="media/delete_outline_black_24dp.svg">
               Delete
             </button>
           </div>
         </div> */

    let footer = document.createElement("div");
    footer.className = "card-footer";

    footer.appendChild(AddButton("READ"));
    footer.appendChild(AddButton("DELETE"));


    bottom.appendChild(footer);
    newCard.appendChild(bottom);

    return newCard;
}



//CREATE BUTTONS, type can be READ, DELETE, SAVE
function AddButton(buttonType)
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
    returnButton.appendChild(btn);

    return returnButton;

}


//Some hardcoded books to default into the library
let theMartian = new Book("The Martian", "Andy Weir", 480, false, "Description", "Fiction", "media/9780804139021.jpeg");
console.log(theMartian.info());

libraryFlex.appendChild(GenerateCard(theMartian));
libraryFlex.appendChild(GenerateCard(theMartian));
libraryFlex.appendChild(GenerateCard(theMartian));