import React, { useEffect, useState, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { Link } from "react-router-dom";
import NotificationsIcon from "@material-ui/icons/Notifications";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import { useStateValue } from "../../StateProvider";
import FriendRequest from "./FriendRequest";
import Badge from "@material-ui/core/Badge";
import io from "socket.io-client";

const API = process.env.REACT_APP_API;
const socket = io("http://localhost:9000");

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function Navbar({ history }) {
  const classes = useStyles();
  const [{ isLogin, peerid, user_id, user_name }, dispatch] = useStateValue();
  const [anchorEl, setAnchorEl] = useState(null);
  const [friendrequest, setFriendRequest] = useState([]);
  // const [requestCount, setRequestCount] = useState(0)

  useEffect(() => {
    console.log("login from navbar");
  }, [isLogin]);

  const handeleLogOut = (e) => {
    e.preventDefault();
    console.log(user_id, " logout");
    userLogOut();
    dispatch({
      type: "CURRENT_USER",
      isLogin: false,
    });
    localStorage.clear();
  };

  const handleFriendRequest = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const fetchFriendRequest = useCallback(async () => {
    const resp = await fetch(`${API}/friend/request/${user_id}`);
    const data = await resp.json();

    try {
      setFriendRequest(
        data[0].friend_request.filter((doc) => doc.status !== true)
      );
    } catch (e) {
      console.log(e);
    }
    dispatch({ type: "FRIEND_REQUEST", request_status: false });
    // const data = await resp.json();
  }, [user_id, dispatch]);

  useEffect(() => {
    fetchFriendRequest();
  }, [fetchFriendRequest, peerid]);

  const userLogOut = async () => {
    await fetch(`${API}/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        isLogin: true,
        user_id: user_id,
      }),
    })
      .then((res) => {
        console.log(res);
      })
      .catch(console.error)
      .finally(() => {
        // socket.emit("messsage", { text: { user_name: user_name } });
      });
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" className={classes.title}>
            News
          </Typography>
          <div>
            <IconButton onClick={handleFriendRequest}>
              <Badge
                badgeContent={friendrequest ? friendrequest.length : 0}
                color="secondary"
              >
                <PersonAddIcon />
              </Badge>
            </IconButton>
          </div>

          {isLogin ? (
            <Link to="/home" onClick={handeleLogOut}>
              Log Out
            </Link>
          ) : (
            <Link to="/login">
              <Button color="inherit">Log In</Button>
            </Link>
          )}
        </Toolbar>
      </AppBar>
      <FriendRequest
        friendrequest={friendrequest}
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
      />
    </div>
  );
}
