import React, { useState, useEffect, useCallback, useRef } from "react";
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
import { Typography } from "@material-ui/core";
import lego6 from "../../images/lego6.png";
import Badge from "@material-ui/core/Badge";

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
  customBadge: {
    backgroundColor: "#81b622",
    color: "white",
  },
}));

export default function ChatBox() {
  const classes = useStyles();

  const [input, setInput] = useState("");
  const [conversations, setConversations] = useState([]);
  const [login, setLogin] = useState(false);
  const [stream, setStream] = useState(false);
  const [
    { user_name, user_id, peername, peerid, isChatOpen, isLogin },
    dispatch,
  ] = useStateValue();
  const [peern, setPeern] = useState("");

  // generate conversation id
  const conversationId = () => {
    const peeruser = JSON.parse(localStorage.getItem("peeruser"));
    let peerhexid = peeruser.peerid;
    peerhexid = peerhexid.split("-");

    let peerhexidstr = "";

    for (let i = 3; i < peerhexid.length; i++) {
      peerhexidstr = peerhexidstr.concat(peerhexid[i]);
    }

    const userhexid = user_id.split("-");
    let userhexidstr = "";

    for (let i = 3; i < userhexid.length; i++) {
      userhexidstr = userhexidstr.concat(userhexid[i]);
    }

    const converId = parseInt(userhexidstr, 16) + parseInt(peerhexidstr, 16);
    return converId;
  };

  const fetchData = async () => {
    const resp = await fetch(`${API}/receivemessage/${conversationId()}`);
    console.log(conversationId(), "coversation ID");
    const data = await resp.json();
    // console.log(data);
    setConversations(
      data.map((doc) => ({
        username: doc.fromname,
        id: doc.fromid,
        peerid: doc.toid,
        peername: doc.toname,
        text: doc.text,
        datesend: doc.datesend,
      }))
    );
    setStream(!stream);
  };
  useEffect(async () => {
    // const peeruser = JSON.parse(localStorage.getItem("peeruser"));
    // console.log(user_id, "user id", peeruser.peerid, " peer id");
    fetchData();
  }, [isChatOpen]);

  useEffect(() => {
    if (socket == null) return;
    socket.on("message", fetchData);

    // return () => socket.close();
  }, []);

  // console.log(user_id, peerid);

  useEffect(() => {
    fetchData();
  }, [isChatOpen]);

  // send message
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
        conversation_id: conversationId(),
      }),
    })
      .then((resp) => {
        // console.log(resp);
        socket.emit("message", {
          text: { conver_id: conversationId(), status: "request" },
        });
      })
      .catch(console.error)
      .finally(() => {
        console.log("message send");
      });

    setInput("");
  };

  //handle notification update when chatbox is open

  const notification = useCallback(async () => {
    const peeruser = JSON.parse(localStorage.getItem("peeruser"));

    const resp = await fetch(`${API}/sendmessage`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: user_id,
        peerid: peeruser.peerid,
      }),
    });
  }, [user_id]);

  useEffect(() => {
    notification();
  }, [notification]);

  useEffect(
    (socketdata) => {
      const peeruser = JSON.parse(localStorage.getItem("peeruser"));
      setPeern(peeruser.peername);

      setLogin(socketdata?.isLogin);

      // console.log(socketdata, " socket on");
    },
    [isChatOpen]
  );

  // check peer user is login
  useEffect(() => {
    async function fetchData() {
      const peeruser = JSON.parse(localStorage.getItem("peeruser"));

      const resp = await fetch(`${API}/profile/${peeruser.peerid}`);
      const data = await resp.json();

      setLogin(data.isLogin);
    }
    fetchData();
  }, [isLogin]);

  // useEffect(() => {
  //   socket.on("message", getProfile);
  // }, []);

  console.log(peern, "peern");
  return (
    <Card className={classes.root}>
      <CardHeader
        className={classes.card__header}
        avatar={
          <Badge
            classes={isChatOpen && { badge: classes.customBadge }}
            className=""
            overlap="circle"
            badgeContent=" "
            variant="dot"
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
          >
            <Avatar alt="pic" src={lego6} className={classes.avatar}>
              {peern[0]}
            </Avatar>
          </Badge>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={
          <Typography variant="h6" component="h6">
            {peern}
          </Typography>
        }
        subheader="September 14, 2016"
      />
      {/* <img
        className={classes.media}
        src="/static/images/cards/paella.jpg"
        alt="Paella dish" messages  chatdialog__message
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

const MyScrollToBottom = () => {
  const divRef = useRef(null);

  useEffect(() => {
    divRef.current.scrollIntoView({ behavior: "smooth" });
  });

  return <div ref={divRef} />;
};
// const addMessage = useCallback(
//   (data) => {
//     if (conversations.length <= 0) return;
//     setConversations((prevConversations) => {
//       let madeChange = false;
//       const newMessage = data;
//       const newConversations = prevConversations.map((conversation) => {
//         console.log(conversation, "conversation");
//         if (arrayEquality(conversation.peername, user_name)) {
//           madeChange = true;
//           return {
//             ...conversation,
//             ...newMessage,
//           };
//         }
//         console.log(conversation);

//         return conversation;
//       });

//       if (madeChange) {
//         return newConversations;
//       } else {
//         return [...prevConversations, { ...newMessage }];
//       }
//     });
//   },
//   [setConversations, user_name]
// );

// function arrayEquality(a, b) {
//   console.log(a, b, "equality");
//   if (a.length !== b.length) return false;

//   a.sort();
//   b.sort();

//   return a.every((element, index) => {
//     return element === b[index];
//   });
// }
