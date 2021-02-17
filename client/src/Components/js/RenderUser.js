import React, { useState, useEffect } from "react";
import "../css/RenderUser.css";
import { blue } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import {
  ListItem,
  ListItemText,
  List,
  Badge,
  IconButton,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { useStateValue } from "../../StateProvider";
import { MoreVertOutlined } from "@material-ui/icons";
import { IoMdCodeWorking } from "react-icons/io";
import SearchIcon from "@material-ui/icons/Search";
import SearchUser from "./SearchUser";

const API = process.env.REACT_APP_API;

const useStyles = makeStyles((theme) => ({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
  root: {
    display: "flex",
    top: "12vh !important",
    paddingRight: "1ch",
    paddingLeft: "1ch",
  },
  renderuserdiv: {
    borderBottom: "1px solid #eee",
    padding: "0ch 2ch",
    textAlign: "center",
  },
  moreIcon: {
    display: "none",
    width: "fit-content",
    height: "auto",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #bbb",
  },
  render__form: {
    display: "felx",
    flexDirection: "row",
  },
  render__formcontrol: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  render__input: {
    outline: "none",
    border: "1px solid #eee",
    borderRadius: "5px",
    Height: "10px !important",
  },
  render__button: {
    flex: 0,
  },
}));

export default function RenderUser({ profile }) {
  const classes = useStyles();

  const [{ isLogin }, dispatch] = useStateValue();

  const [request, setRequest] = useState(false);
  const [chat, setChat] = useState(false);

  const handleListItemClick = (e, item) => {
    e.preventDefault();
    handleChat();
    if (!isLogin) {
      alert("Please login to chat with friends");
      return;
    }

    localStorage.removeItem("peeruser");

    const peeruser = {
      peerid: item.id,
      peername: item.name,
    };
    localStorage.setItem("peeruser", JSON.stringify(peeruser));
    // console.log(item, " item ");

    dispatch({
      type: "CHATROOM_OPEN",
      isChatOpen: chat,
      peerid: item.id,
      peername: item.name,
      notify: true,
    });
  };

  const handleAnchorEl = (e) => {
    // setAnchorEl(e.currentTarget);
  };

  const handleMouseEnter = (id) => {
    try {
      document.getElementById(id).style.display = "block";
    } catch (e) {
      console.log(e);
    }
  };
  const handleMouseLeave = (id) => {
    try {
      document.getElementById(id).style.display = "none";
    } catch (e) {}
  };
  //   useEffect(() => {
  //     // profile.map((item) => console.log(item.name, item.id, item.email));
  //   }, []);

  const handleSendRequest = (e) => {
    e.preventDefault();
  };

  const handleChat = () => {
    setChat(!chat);
  };

  return (
    <div>
      {request ? (
        <SearchUser setRequest={setRequest} />
      ) : (
        <div>
          <div className={classes.renderuserdiv}>
            <div>
              <div
                onClick={() => setRequest(true)}
                className={classes.render__form}
              >
                <div className={classes.render__formcontrol}>
                  <div className="render__input">
                    <SearchIcon />
                  </div>
                  <IconButton
                    type="submit"
                    onClick={handleSendRequest}
                    className={classes.render__button}
                  >
                    <IoMdCodeWorking />
                  </IconButton>
                </div>
              </div>
            </div>
          </div>

          <List className="list__renderuser">
            {profile?.length
              ? profile.map((item, index) => (
                  <div
                    onMouseLeave={() => handleMouseLeave(item.id)}
                    style={{ display: "flex" }}
                    key={index}
                  >
                    <ListItem
                      data-item="chat"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderRadius: "0.5rem",
                        marginLeft: "0.5rem",
                      }}
                      button
                      onMouseEnter={() => handleMouseEnter(item.id)}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <ListItemAvatar>
                          <Badge
                            badgeContent={item.notification}
                            color="secondary"
                          >
                            <Avatar className={classes.avatar}>
                              <img
                                src=""
                                alt=""
                                className="person_img"
                                style={{
                                  width: "2rem",
                                  height: "2rem",
                                  borderRadius: "50%",
                                }}
                              />
                            </Avatar>
                          </Badge>
                        </ListItemAvatar>
                        <ListItemText primary={item.name} />
                      </div>
                      <button onClick={(e) => handleListItemClick(e, item)}>
                        Chat
                      </button>
                      <div
                        style={{
                          width: "3rem",
                          height: "3rem",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: 0,
                          padding: 0,
                        }}
                      >
                        <IconButton
                          id={item.id}
                          onClick={handleAnchorEl}
                          className={classes.moreIcon}
                        >
                          <MoreVertOutlined
                            style={{ width: "1.3rem", height: "1.3rem" }}
                          />
                        </IconButton>
                      </div>
                    </ListItem>
                  </div>
                ))
              : null}
            {/* <ListItem
              autoFocus
              button
              onClick={() => setOpen(true)}
              id="addFriend"
            >
              <ListItemAvatar>
                <Avatar>
                  <AddIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Add Friend " />
            </ListItem> */}
          </List>
        </div>
      )}
    </div>
  );
}
