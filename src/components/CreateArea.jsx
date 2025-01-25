import React from "react";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import Fab from "@material-ui/core/Fab";
import TextField from "@material-ui/core/TextField";
import Zoom from "@material-ui/core/Zoom";
import Collapse from "@material-ui/core/Collapse";
import clsx from "clsx";

function CreateArea({ onAdd }) {
  const [note, setNote] = React.useState({
    title: "",
    content: "",
  });
  const [isExpanded, setExpanded] = React.useState(false);
  const [shake, setShake] = React.useState(false);

  const handleChange = React.useCallback((event) => {
    const { name, value } = event.target;
    setNote(prevNote => ({
      ...prevNote,
      [name]: value,
    }));
  }, []);

  const submitNote = React.useCallback((event) => {
    event.preventDefault();
    
    if (note.title.trim() === "" && note.content.trim() === "") {
      setShake(true);
      const timer = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(timer);
    }

    onAdd(note);
    setNote({ title: "", content: "" });
    setExpanded(false);
  }, [note, onAdd]);

  const expand = React.useCallback(() => {
    setExpanded(true);
  }, []);

  return (
    <div>
      <form className="create-area-form" autoComplete="off" onClick={expand}>
        <TextField
          className="create-area-input"
          name="title"
          onChange={handleChange}
          value={note.title}
          label="Title"
          variant="outlined"
          fullWidth
          onFocus={expand}
        />
        <Collapse in={isExpanded}>
          <TextField
            className="create-area-input"
            name="content"
            onChange={handleChange}
            value={note.content}
            label="Take a note..."
            variant="outlined"
            multiline
            rows={3}
            fullWidth
          />
        </Collapse>
        <Zoom in={isExpanded}>
          <Fab
            className={clsx('create-area-fab', { shake: shake })}
            onClick={submitNote}
          >
            <AddCircleIcon />
          </Fab>
        </Zoom>
      </form>
    </div>
  );
}

export default React.memo(CreateArea);
