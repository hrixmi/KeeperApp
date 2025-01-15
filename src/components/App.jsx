import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import Button from "@material-ui/core/Button";

function App() {
  const [notes, setNotes] = React.useState([]);
  const [completedNotes, setCompletedNotes] = React.useState([]);

  const addNote = React.useCallback((newNote) => {
    if (newNote.title.trim() || newNote.content.trim()) {
      setNotes(prevNotes => [...prevNotes, newNote]);
    }
  }, []);

  const deleteNote = React.useCallback((id) => {
    setNotes(prevNotes => prevNotes.filter((_, index) => index !== id));
  }, []);

  const markAsDone = React.useCallback((id) => {
    setNotes(prevNotes => {
      const doneNote = prevNotes[id];
      setCompletedNotes(prev => [...prev, doneNote]);
      return prevNotes.filter((_, index) => index !== id);
    });
  }, []);

  return (
    <div className="app-container">
      <div className="header-container">
        <Header />
        <div className="summarize-section">
          <Button 
            variant="contained" 
            color="primary" 
            style={{ width: '100%' }}
          >
            Summarize
          </Button>
        </div>
      </div>
      <div style={{ position: 'relative' }}>
        <CreateArea onAdd={addNote} />
        <div className="summary-container" style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          width: '300px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          padding: '15px',
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
          minHeight: '200px'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#666' }}>Summary</h3>
          <p style={{ color: '#888', fontSize: '0.9em' }}>
            Your notes summary will appear here...
          </p>
        </div>
      </div>
      <div className="note-container">
        {notes.map((noteItem, index) => (
          <Note
            key={index}
            id={index}
            title={noteItem.title}
            content={noteItem.content}
            onDelete={deleteNote}
            onDone={markAsDone}
          />
        ))}
      </div>
      <Footer />
    </div>
  );
}

export default App;
