import React, { useState } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import DraftsIcon from "@material-ui/icons/Drafts";
import SendIcon from "@material-ui/icons/Send";
import { useStateValue } from "../../StateProvider";

const API = process.env.REACT_APP_API;

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
  },
  add__btn: {
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    border: "1px solid #eee",
    borderRadius: "5px",
    outlineColor: "#a2d5f2",
    color: "#a2d5f2",
  },
  reject__btn: {
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    border: "1px solid #eee",
    borderRadius: "5px",
    outlineColor: "#ec4646",
    color: "#ec4646",
  },
}));

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    "&:focus": {
      backgroundColor: theme.palette.primary.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

export default function FriendRequest({
  anchorEl,
  setAnchorEl,
  friendrequest,
}) {
  const [{ user_id }, dispatch] = useStateValue();
  const [reset, setReset] = useState(false);
  const classes = useStyles();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAddRequest = async (e, doc) => {
    e.preventDefault();
    await fetch(`${API}/requestaddfriend`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: user_id,
        id: doc.id,
        name: doc.name,
      }),
    })
      .then(console.log)
      .catch(console.error)
      .finally(() =>
        dispatch({ type: "FRIEND_REQUEST", request_status: true })
      );

    // console.log(doc.name, doc.id);
    // console.log(`${API}`, user_id);
  };

  return (
    <div>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {friendrequest.map((doc, index) => (
          <StyledMenuItem key={index}>
            {/* <ListItemIcon>
              <SendIcon fontSize="small" />
            </ListItemIcon> */}
            <ListItemText primary={doc.name} />
            <ListItemIcon>
              <button
                className={classes.add__btn}
                onClick={(e) => handleAddRequest(e, doc)}
              >
                Add
              </button>
              <button className={classes.reject__btn}>Reject</button>
            </ListItemIcon>
          </StyledMenuItem>
        ))}

        {/* <StyledMenuItem>
          <ListItemIcon>
            <DraftsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Drafts" />
        </StyledMenuItem>
        <StyledMenuItem>
          <ListItemIcon>
            <InboxIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Inbox" />
        </StyledMenuItem> */}
      </StyledMenu>
    </div>
  );
}
