import React, { useState, useEffect, useCallback, forwardRef } from "react";
import { blue } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import {
  ListItem,
  ListItemText,
  List,
  Typography,
  Badge,
  IconButton,
  FormControl,
  Button,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { useStateValue } from "../../StateProvider";
import AddFriend from "./AddFriend";
import { MoreVertOutlined } from "@material-ui/icons";
import { IoMdCodeWorking } from "react-icons/io";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import "../css/SearchUser.css";

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

  render__button: {
    flex: 0,
  },
  searchuser_header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const SearchUser = forwardRef(({ setRequest }, ref) => {
  const classes = useStyles();
  const [input, setInput] = useState("");
  const isMenuOpen = Boolean(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [idname, setIdName] = useState({});
  const [profile, setProfile] = useState([]);
  const [open, setOpen] = useState(false);

  const [{ user_id, user_name }, dispatch] = useStateValue();
  const [userItem, setUserItem] = useState({});

  const handleListItemClick = (e, item) => {
    setAnchorEl(e.currentTarget);
    // if (false) {
    //   alert("Please login to chat with friends");
    //   return;
    // }
    // if (isMenuOpen) {
    //   // dispatch({
    //   //   type: "FRIEND_REQUEST",
    //   //   peerid: id,
    //   //   peername: name,
    //   // });
    // }
  };

  const handleAnchorEl = (e) => {
    e.preventDefault();
    setAnchorEl(e.currentTarget);
    console.log(userItem);
    // dispatch({
    //   type: "FRIEND_REQUEST",
    //   peerid: userItem.id,
    //   peername: userItem.name,
    // });
    // setOpen(!open);
  };

  const handleMouseEnter = (id) => {
    document.getElementById(id).style.display = "block";
  };
  const handleMouseLeave = (id) => {
    document.getElementById(id).style.display = "none";
  };
  useEffect(() => {
    // profile.map((item) => console.log(item.name, item.id, item.email));
  }, []);

  const handleClose = (e) => {
    e.preventDefault();
    setRequest(false);
  };

  const searchProfile = useCallback(async () => {
    const resp = await fetch(`${API}/searchfriend/${input}`);
    const data = await resp.json();

    const newData = data.filter((doc) => doc._id !== user_id);

    setProfile(
      newData.map((doc) => ({
        name: doc.user_name,
        id: doc._id,
        email: doc.email,
      }))
    );
  }, [input, user_id]);

  useEffect(() => {
    searchProfile();
  }, [input, searchProfile]);

  const handleChageInput = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div ref={ref}>
      <div className={classes.searchuser_header}>
        <form onSubmit={handleSubmit}>
          <FormControl className={classes.searchuser_header}>
            <input
              type="text"
              name="input"
              value={input}
              onChange={handleChageInput}
              className="searchuser__input"
              placeholder="Search a friend"
              autoFocus
            />
            <IconButton
              variant="outlined"
              color="primary"
              onClick={handleClose}
              type="submit"
            >
              <CloseIcon />
            </IconButton>
          </FormControl>
        </form>
      </div>
      <List className="list__renderuser">
        {profile?.length > 0
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
                  <div
                    style={{ display: "flex", alignItems: "center" }}
                    onClick={(e) => handleListItemClick(e, item)}
                  >
                    <ListItemAvatar>
                      <Badge badgeContent={item.notification} color="secondary">
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
                      onMouseEnter={() => setUserItem(item)}
                      onClick={(e) => handleAnchorEl(e)}
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

        {/* <ListItem autoFocus button onClick={() => setOpen(true)} id="addFriend">
          <ListItemAvatar>
            <Avatar>
              <AddIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Add Friend " />
        </ListItem> */}
      </List>

      {/* {open ? ( */}
      <AddFriend
        setAnchorEl={setAnchorEl}
        anchorEl={anchorEl}
        userItem={userItem}
      />
      {/* ) : null} */}
    </div>
  );
});

export default SearchUser;
