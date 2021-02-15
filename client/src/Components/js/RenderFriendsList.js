// import React, { useState, useEffect } from "react";

// import "../css/RenderUser.css";

// import { blue } from "@material-ui/core/colors";
// import { makeStyles } from "@material-ui/core/styles";
// import Avatar from "@material-ui/core/Avatar";
// import ListItemAvatar from "@material-ui/core/ListItemAvatar";
// import {
//   ListItem,
//   ListItemText,
//   List,
//   Typography,
//   Badge,
//   IconButton,
//   FormControl,
// } from "@material-ui/core";
// import AddIcon from "@material-ui/icons/Add";

// import { useStateValue } from "../../StateProvider";
// import AddFriend from "./AddFriend";
// import { MoreVertOutlined } from "@material-ui/icons";
// import { IoMdCodeWorking } from "react-icons/io";
// import SearchIcon from "@material-ui/icons/Search";

// const useStyles = makeStyles((theme) => ({
//   avatar: {
//     backgroundColor: blue[100],
//     color: blue[600],
//   },
//   root: {
//     display: "flex",
//     top: "12vh !important",
//     paddingRight: "1ch",
//     paddingLeft: "1ch",
//   },
//   renderuserdiv: {
//     borderBottom: "1px solid #eee",
//     padding: "0ch 2ch",
//     textAlign: "center",
//   },
//   moreIcon: {
//     display: "none",
//     width: "fit-content",
//     height: "auto",
//     alignItems: "center",
//     justifyContent: "center",
//     border: "1px solid #bbb",
//   },
//   render__form: {
//     display: "felx",
//     flexDirection: "row",
//   },
//   render__formcontrol: {
//     display: "flex",
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   render__input: {
//     outline: "none",
//     border: "1px solid #eee",
//     borderRadius: "5px",
//     Height: "10px !important",
//   },
//   render__button: {
//     flex: 0,
//   },
// }));

// export default function RenderUser({ profile }) {
//   const classes = useStyles();

//   const [open, setOpen] = useState(false);
//   const isMenuOpen = Boolean(true);

//   const [{ isLogin }, dispatch] = useStateValue();
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [userId, setUserId] = useState("");
//   const [request, setRequest] = useState("");

//   const handleClose = () => {
//     setOpen(false);
//   };
//   const handleMenuClose = () => {
//     // props.setAnchorE(null);
//   };

//   const handleListItemClick = (item) => {
//     // props.setAnchorE(null);

//     if (!isLogin) {
//       alert("Please login to chat with friends");
//       return;
//     }

//     if (isMenuOpen) {
//       dispatch({
//         type: "CHATROOM_IS_OPEN",
//         isChat: isMenuOpen,
//         name: item.name,
//         url: item.url,
//         id: item.id,
//       });
//     }
//   };

//   const handleAnchorEl = (e, id) => {
//     setAnchorEl(e.currentTarget);
//     setUserId(id);
//   };

//   const handleMouseEnter = (id) => {
//     document.getElementById(id).style.display = "block";
//   };
//   const handleMouseLeave = (id) => {
//     document.getElementById(id).style.display = "none";
//   };
//   useEffect(() => {
//     // profile.map((item) => console.log(item.name, item.id, item.email));
//   }, []);

//   const handleSendRequest = (e) => {
//     e.preventDefault();
//   };

//   return (
//     <div>
//       <List className="list__renderuser">
//         {profile?.length > 0
//           ? profile.map((item, index) => (
//               <div
//                 onMouseLeave={() => handleMouseLeave(item.id)}
//                 style={{ display: "flex" }}
//                 key={index}
//               >
//                 <ListItem
//                   data-item="chat"
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "space-between",
//                     borderRadius: "0.5rem",
//                     marginLeft: "0.5rem",
//                   }}
//                   button
//                   onMouseEnter={() => handleMouseEnter(item.id)}
//                 >
//                   <div
//                     style={{ display: "flex", alignItems: "center" }}
//                     onClick={(e) => handleListItemClick(item)}
//                   >
//                     <ListItemAvatar>
//                       <Badge badgeContent={item.notification} color="secondary">
//                         <Avatar className={classes.avatar}>
//                           <img
//                             src=""
//                             alt=""
//                             className="person_img"
//                             style={{
//                               width: "2rem",
//                               height: "2rem",
//                               borderRadius: "50%",
//                             }}
//                           />
//                         </Avatar>
//                       </Badge>
//                     </ListItemAvatar>
//                     <ListItemText primary={item.name} />
//                   </div>
//                   <div
//                     style={{
//                       width: "3rem",
//                       height: "3rem",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       margin: 0,
//                       padding: 0,
//                     }}
//                   >
//                     <IconButton
//                       id={item.id}
//                       onClick={(e) => handleAnchorEl(e, item.id)}
//                       className={classes.moreIcon}
//                     >
//                       <MoreVertOutlined
//                         style={{ width: "1.3rem", height: "1.3rem" }}
//                       />
//                     </IconButton>
//                   </div>
//                 </ListItem>
//               </div>
//             ))
//           : null}

//         <ListItem autoFocus button onClick={() => setOpen(true)} id="addFriend">
//           <ListItemAvatar>
//             <Avatar>
//               <AddIcon />
//             </Avatar>
//           </ListItemAvatar>
//           <ListItemText primary="Add Friend " />
//         </ListItem>
//       </List>
//     </div>
//   );
// }
