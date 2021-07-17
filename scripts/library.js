let myLibrary = [];

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


//Some hardcoded books to default into the library
let theMartian = Book("The Martian", "Andy Weir", 480, false, "Description", "Fiction", "media/9780804139021.jpeg");
console.log(theMartian.info());