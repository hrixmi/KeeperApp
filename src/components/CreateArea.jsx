import React from "react";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import Fab from "@material-ui/core/Fab";
import TextField from "@material-ui/core/TextField";
import Zoom from "@material-ui/core/Zoom";
import Collapse from "@material-ui/core/Collapse";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  form: {
    margin: "20px auto",
    padding: "15px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    width: "90%",
    maxWidth: "500px",
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
    transition: "all 0.3s ease-in-out",
  },
  input: {
    "& .MuiInputBase-root": {
      fontSize: "1.1em",
    },
  },
  fab: {
    alignSelf: "center",
    backgroundColor: "#007aff",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#005ecb",
    },
    transition: "transform 0.2s ease-in-out",
  },
  shake: {
    animation: `$shake 0.5s`,
  },
  "@keyframes shake": {
    "0%, 100%": { transform: "translateX(0)" },
    "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-5px)" },
    "20%, 40%, 60%, 80%": { transform: "translateX(5px)" },
  },
}));

function CreateArea({ onAdd }) {
  const classes = useStyles();
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
      <form className={classes.form} autoComplete="off" onClick={expand}>
        <TextField
          className={classes.input}
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
            className={classes.input}
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
            className={clsx(classes.fab, { [classes.shake]: shake })}
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
