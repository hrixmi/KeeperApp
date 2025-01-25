import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import Button from "@material-ui/core/Button";
import Progress from './Progress';
import { useEffect, useRef, useState } from 'react'

function App() {
   // Model loading
  const [ready, setReady] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [progressItems, setProgressItems] = useState([]);

  const [input, setInput] = useState('I love walking my dog.');
  const [output, setOutput] = useState('');
  
  const worker = useRef(null);

  useEffect(() => {
    if (!worker.current) {
      worker.current = new Worker(new URL('./worker.js', import.meta.url), {
        type: 'module'
      });
    }

    const onMessageReceived = (e) => {
      switch (e.data.status) {
        case 'initiate':
          setReady(false);
          console.log('Model loading initiated...');
          break;

        case 'progress':
          console.log('Loading progress:', e.data.progress);
          break;

        case 'ready':
          setReady(true);
          console.log('Model loaded and ready!');
          break;

        case 'update':
          console.log('Partial output:', e.data.output);
          setOutput(prev => prev + e.data.output);
          break;

        case 'complete':
          console.log('Final summary:', e.data.output);
          setOutput(e.data.output);
          break;

        case 'error':
          console.error('Error:', e.data.error);
          break;
      }
    };

    worker.current.addEventListener('message', onMessageReceived);
    return () => worker.current.removeEventListener('message', onMessageReceived);
  }, []);

  const [notes, setNotes] = React.useState([]);
  const [completedNotes, setCompletedNotes] = React.useState([]);

  const addNote = React.useCallback((newNote) => {
    if (newNote.title.trim() || newNote.content.trim()) {
      setNotes(prevNotes => [...prevNotes, newNote]);
      
      // Combine title and content for summarization
      const textToSummarize = `${newNote.title} ${newNote.content}`.trim();
      console.log('Sending text for summarization:', textToSummarize);
      
      if (textToSummarize) {
        worker.current.postMessage({
          text: textToSummarize
        });
      }
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
        <Progress />
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
      <Progress />
      <Footer />
    </div>
  );
}

export default App;
