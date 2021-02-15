import React, { forwardRef } from "react";
import { withStyles } from "@material-ui/core/styles";
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

const AddFriend = forwardRef(({ anchorEl, setAnchorEl, userItem }, ref) => {
  const [{ peerid, peername, user_name, user_id }, dispatch] = useStateValue();

  // const handleClick = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRequest = async () => {
    console.log(userItem.id, userItem.name, "peerid, peername");
    const resp = await fetch(`${API}/friend/request`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        peerid: userItem.id,
        peername: userItem.name,
        user_name: user_name,
        user_id: user_id,
        status: false,
      }),
    });

    const data = await resp;
    console.log(data);

    setAnchorEl(null);
  };

  return (
    <div ref={ref}>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <StyledMenuItem onClick={handleRequest}>
          <ListItemIcon>
            <SendIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Send request" />
        </StyledMenuItem>
        <StyledMenuItem>
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
        </StyledMenuItem>
      </StyledMenu>
    </div>
  );
});
export default AddFriend;
