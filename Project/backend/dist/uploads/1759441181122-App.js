// Oarabile Matlala u21740012
const initialBooks = [
  {
    id: 1,
    title: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    genre: "Fantasy",
    status: "Busy Reading",
  },
  {
    id: 2,
    title: "1984",
    author: "George Orwell",
    genre: "Dystopian",
    status: "Read",
  },
  {
    id: 3,
    title: "Dune",
    author: "Frank Herbert",
    genre: "Science Fiction",
    status: "Want to Read",
  },
];

const statusOptions = ["Want to Read", "Busy Reading", "Read"];

const App = () => {
  const [books, setBooks] = React.useState(initialBooks);
  const [search, setSearch] = React.useState("");
  const [nextId, setNextId] = React.useState(4);

  const addBook = () => {
    const newBook = { id: nextId, title: "New Book", author: "Unknown", genre: "Unknown", status: "Want to Read" };
    setBooks([...books, newBook]);
    setNextId(nextId + 1);
  };

  const deleteBook = (id) => setBooks(books.filter((b) => b.id !== id));

  const editBook = (id, field, value) =>
    setBooks(books.map((b) => (b.id === id ? { ...b, [field]: value } : b)));

  const changeStatus = (id) =>
    setBooks(
      books.map((b) => {
        if (b.id === id) {
          const nextIndex = (statusOptions.indexOf(b.status) + 1) % statusOptions.length;
          return { ...b, status: statusOptions[nextIndex] };
        }
        return b;
      })
    );

  const filteredBooks = books
    .filter((b) => b.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div className="container my-4">
      <h1 className="text-center mb-4">Personal Library</h1>
      <SearchBar search={search} setSearch={setSearch} />
      <div className="d-flex justify-content-center mb-3">
        <button className="btn btn-primary" onClick={addBook}>Add Book</button>
      </div>
      <BookList books={filteredBooks} deleteBook={deleteBook} editBook={editBook} changeStatus={changeStatus} />
    </div>
  );
};

const SearchBar = ({ search, setSearch }) => (
  <div className="d-flex justify-content-center mb-3">
    <input
      type="text"
      className="form-control w-50"
      placeholder="Search by title..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  </div>
);

const BookList = ({ books, deleteBook, editBook, changeStatus }) => {
  if (books.length === 0) return <p className="text-center">No books found.</p>;

  return (
    <div className="row">
      {books.map((book) => (
        <div key={book.id} className="col-md-4 mb-3">
          <BookItem book={book} deleteBook={deleteBook} editBook={editBook} changeStatus={changeStatus} />
        </div>
      ))}
    </div>
  );
};

const BookItem = ({ book, deleteBook, editBook, changeStatus }) => {
  const [isEditing, setIsEditing] = React.useState(false);

  return (
    <div className="card h-100 shadow-sm">
      <div className="card-body">
        {isEditing ? (
          <>
            <input className="form-control mb-2" value={book.title} onChange={(e) => editBook(book.id, "title", e.target.value)} />
            <input className="form-control mb-2" value={book.author} onChange={(e) => editBook(book.id, "author", e.target.value)} />
            <input className="form-control mb-2" value={book.genre} onChange={(e) => editBook(book.id, "genre", e.target.value)} />
          </>
        ) : (
          <>
            <h5 className="card-title">{book.title}</h5>
            <h6 className="card-subtitle mb-2 text-muted">{book.author} ({book.genre})</h6>
            <p className="card-text"><span className="fw-bold">Status:</span> {book.status}</p>
          </>
        )}
      </div>
      <div className="card-footer d-flex justify-content-between">
        <button className={`btn ${isEditing ? "btn-success" : "btn-warning"}`} onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? "Save" : "Edit"}
        </button>
        <button className="btn btn-danger" onClick={() => deleteBook(book.id)}>Delete</button>
        <button className="btn btn-info" onClick={() => changeStatus(book.id)}>Change Status</button>
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
