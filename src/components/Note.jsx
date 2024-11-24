import React from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  noteCard: {
    width: "100%",
    maxWidth: 400,
    margin: "16px auto",
    padding: "12px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    position: "relative",
    backgroundColor: "#ffffff",
    transition: "transform 0.1s ease-out, box-shadow 0.2s ease-in-out",
    transformStyle: "preserve-3d",
    perspective: 1000,
  },
  title: {
    fontSize: "1.25rem",
    fontWeight: 500,
    marginBottom: "8px",
  },
  content: {
    fontSize: "1rem",
    color: "#555",
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
  },
  deleteButton: {
    position: "absolute",
    top: "8px",
    right: "8px",
    color: "#f50057",
    "&:hover": {
      color: "#d50042",
    },
  },
}));

function Note({ id, title, content, onDelete }) {
  const classes = useStyles();
  const [style, setStyle] = React.useState({});

  const handleMouseMove = React.useCallback((event) => {
    const card = event.currentTarget;
    const { left, top, width, height } = card.getBoundingClientRect();
    const x = event.clientX - left - width / 2;
    const y = event.clientY - top - height / 2;
    const maxTilt = 15;

    const tiltX = (y / height) * maxTilt * -1;
    const tiltY = (x / width) * maxTilt;

    setStyle({
      transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
      boxShadow: `0 8px 15px rgba(0, 0, 0, 0.2)`,
    });
  }, []);

  const handleMouseLeave = React.useCallback(() => {
    setStyle({
      transform: "rotateX(0deg) rotateY(0deg)",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    });
  }, []);

  const handleClick = React.useCallback(() => {
    onDelete(id);
  }, [id, onDelete]);

  return (
    <Card
      className={classes.noteCard}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <CardContent>
        <Typography className={classes.title} variant="h5">
          {title}
        </Typography>
        <Typography className={classes.content} variant="body2">
          {content}
        </Typography>
      </CardContent>
      <IconButton
        className={classes.deleteButton}
        onClick={handleClick}
        aria-label="delete"
      >
        <DeleteIcon />
      </IconButton>
    </Card>
  );
}

export default React.memo(Note);
