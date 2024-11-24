import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";

function App() {
  const [notes, setNotes] = React.useState([]);

  const addNote = React.useCallback((newNote) => {
    if (newNote.title.trim() || newNote.content.trim()) {
      setNotes(prevNotes => [...prevNotes, newNote]);
    }
  }, []);

  const deleteNote = React.useCallback((id) => {
    setNotes(prevNotes => prevNotes.filter((_, index) => index !== id));
  }, []);

  return (
    <div className="app-container">
      <Header />
      <CreateArea onAdd={addNote} />
      <div className="note-container">
        {notes.map((noteItem, index) => (
          <Note
            key={index}
            id={index}
            title={noteItem.title}
            content={noteItem.content}
            onDelete={deleteNote}
          />
        ))}
      </div>
      <Footer />
    </div>
  );
}

export default App;
