import React, { useState, useEffect, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import { red } from "@material-ui/core/colors";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SendIcon from "@material-ui/icons/Send";
import Message from "./Message";
import FlipMove from "react-flip-move";
import { css } from "@emotion/css";
import ScrollToBottom from "react-scroll-to-bottom";
import FormControl from "@material-ui/core/FormControl";
import "../css/ChatBox.css";
import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { useStateValue } from "../../StateProvider";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";

const API = process.env.REACT_APP_API;

const socket = io("http://localhost:9000");

const ROOT_CSS = css({
  height: 300,
  width: 400,
});

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "80%",
    height: theme.spacing(70),
  },
  //   media: {
  //     height: 0,
  //     paddingTop: "56.25%", // 16:9
  //   },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  card__header: {
    borderBottom: "1px solid #eee",
    boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.5)",
  },
  avatar: {
    backgroundColor: red[500],
  },
  card_scolltobottom: {},
  card__flipmove: {
    minHeight: "200px",
    maxHeight: "350px",
  },

  card__content: {
    height: theme.spacing(46),
  },
  card__cardactions: {
    margin: theme.spacing(1),
  },
  card__form: {
    display: "flex",
    width: "100%",
  },
  card__formcontrol: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
  },
  card__input: {
    display: "flex",
    flex: 1,
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    margin: theme.spacing(1),
    border: "1px solid #ccc",
    borderRadius: theme.spacing(2),

    outline: "none",
  },
  card__iconbutton: {
    flex: 0,
  },
}));

export default function ChatBox() {
  const classes = useStyles();

  const [input, setInput] = useState("");
  const [conversations, setConversations] = useState([]);
  const [{ user_name, user_id, peername, peerid }, dispatch] = useStateValue();

  console.log(
    peerid,
    peername,
    JSON.parse(localStorage.getItem("peeruser")),
    " peerid peername"
  );

  const addMessage = useCallback(
    (data) => {
      setConversations((prevConversations) => {
        let madeChange = false;
        const newMessage = data;
        const newConversations = prevConversations.map((conversation) => {
          if (arrayEquality(conversation.username, user_name)) {
            madeChange = true;
            return {
              ...conversation,
              ...newMessage,
            };
          }
          // console.log(conversation);

          return conversation;
        });

        if (madeChange) {
          return newConversations;
        } else {
          return [...prevConversations, { ...newMessage }];
        }
      });
    },
    [setConversations, user_name]
  );

  useEffect(() => {
    if (socket == null) return;
    socket.on("message", addMessage);

    return () => socket.close();
  }, [addMessage]);

  function arrayEquality(a, b) {
    if (a.length !== b.length) return false;

    a.sort();
    b.sort();

    return a.every((element, index) => {
      return element === b[index];
    });
  }

  const fetchData = useCallback(async () => {
    const resp = await fetch(`${API}/receivemessage`);
    const data = await resp.json();
    setConversations(
      data.map((doc) => ({
        username: doc.username,
        text: doc.text,
        datesend: doc.datesend,
      }))
    );
  }, [setConversations]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    console.log("send message");
    const peeruser = JSON.parse(localStorage.getItem("peeruser"));
    // setMessages([...messages, { username: username, text: input }]);
    await fetch(`${API}/sendmessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: user_name,
        text: input,
        id: user_id,
        toid: peeruser.peerid,
        toname: peeruser.peername,
      }),
    })
      .then((resp) => {
        // console.log(resp);
        socket.emit("message", {
          text: { input, user_id: user_id, peerid: peerid },
        });
      })
      .catch(console.error)
      .finally(() => {
        console.log("message send");
      });

    setInput("");
  };

  return (
    <Card className={classes.root}>
      <CardHeader
        className={classes.card__header}
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            R
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title="Peer user"
        subheader="September 14, 2016"
      />
      {/* <img
        className={classes.media}
        src="/static/images/cards/paella.jpg"
        alt="Paella dish"
      /> */}

      <CardContent className={classes.card__content}>
        <ScrollToBottom className="chatdialog__message">
          <FlipMove
            enterAnimation="elevator"
            leaveAnimation="elevator"
            className={classes.card__flipmove}
          >
            {conversations
              ? conversations.map((message, index) => (
                  <Message key={index} username={user_name} message={message} />
                ))
              : null}
          </FlipMove>
        </ScrollToBottom>
      </CardContent>
      <CardActions className={classes.card__cardactions} disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <form onSubmit={handleSendMessage} className={classes.card__form}>
          <FormControl className={classes.card__formcontrol}>
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              className={classes.card__input}
            />
            <IconButton
              type="submit"
              onClick={handleSendMessage}
              className={classes.card__iconbutton}
            >
              <SendIcon />
            </IconButton>
          </FormControl>
        </form>
      </CardActions>
    </Card>
  );
}
