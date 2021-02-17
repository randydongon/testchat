import React, { useState, useEffect, forwardRef } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { TextField } from "@material-ui/core";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import SignupData from "./SignupData";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
// import Tippy from "@tippy.js/react";
// import "tippy.js/dist/tippy.css";
import "react-tippy/dist/tippy.css";
import { Tooltip } from "react-tippy";
import { v4 as uuidv4 } from "uuid";

const API = process.env.REACT_APP_API;

const useStyle = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "columnn",
    marginLeft: "auto",
    marginRight: "auto",
    justifyContent: "center",
    // textAlign: "center",

    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(1),

      width: "100%",
    },
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
    },
  },
  radio__group: {
    display: "flex",
    flexDirection: "row",
    paddingLeft: theme.spacing(1),
  },
  div__select: {
    width: "300px",
    textAlign: "left",
    justifyContent: "left",
    paddingLeft: theme.spacing(1),
    marginBottom: "1rem",
  },
  muted: {
    color: "#aaa",
    textAlign: "left",
    marginTop: "1rem",
    fontSize: "1rem",
    margin: theme.spacing(0),
  },
  selection: {
    border: "1px solid #bbb",
    padding: "4px 5px",
  },
  text__field: {},
}));

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const Signup = forwardRef(({ open, setOpen }, ref) => {
  const classes = useStyle();
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bdate, setBDate] = useState("");
  const [bmonth, setBMonth] = useState("");
  const [byear, setBYear] = useState("");
  const [gender, setGender] = useState("");
  const [photo, setPhoto] = useState("");

  const handleClose = () => {
    setOpen(false);
    // setUserName("");
    // setEmail("");
    // setPassword("");
    // setBDate("");
    // setBMonth("");
    // setBYear("");
    // setGender("");
    // setPhoto("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dob = bmonth + " " + bdate + " " + byear;

    if (username == "") {
      alert("Name must not be empty");
      return;
    }
    if (email == "") {
      alert("Email address must not be empty");
      return;
    }

    if (password == "") {
      alert("Password must not be empty");
      return;
    }

    const resp = await fetch(`${API}/adduser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: uuidv4(),
        user_name: username,
        email: email,
        password: password,
        dob: dob,
        gender: gender,
        photo_url: photo,
        isLogin: false,
        friends_list: [],
      }),
    });

    const data = await resp.json();

    if (data.status_code === 400) {
      console.log(data.message);
      alert(data.message);
    }
    if (data.status_code === 200) {
      alert(data.message);
      setOpen(false);
      setUserName("");
      setEmail("");
      setPassword("");
      setBDate("");
      setBMonth("");
      setBYear("");
      setGender("");
      setPhoto("");
    }
  };

  return (
    <div ref={ref}>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              margin: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                margin: "auto",
              }}
            >
              <span style={{ margin: 0, padding: 0 }}>Sign Up</span>
              <span
                style={{
                  fontSize: "12px",
                  padding: 0,
                  margin: 0,
                  fontWeight: 300,
                  color: "#aaa",
                }}
              >
                It's easy
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",

                width: "fit-content",
              }}
            >
              <label name="labelname" htmlFor="profile_photo">
                <Tooltip content="Add profile picture">
                  <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="span"
                  >
                    <PhotoCamera size="large" />
                  </IconButton>
                </Tooltip>
              </label>
              <input
                id="profile_photo"
                style={{ display: "none" }}
                type="file"
                onChange={(e) => setPhoto(e.target.files[0])}
              />
            </div>
            <div style={{ flex: 1, margin: "auto" }}></div>
          </div>
        </DialogTitle>
        <DialogContent dividers>
          <form onSubmit={handleSubmit} className={classes.root}>
            <FormControl component="fieldset">
              <TextField
                type="text"
                label="Name"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                name="user_name"
                variant="outlined"
                size="small"
              />

              <TextField
                type="email"
                label="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                name="email"
                variant="outlined"
                size="small"
              />
              <TextField
                type="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                name="password"
                variant="outlined"
                size="small"
              />
              <div className={classes.div__select}>
                <FormLabel component="legend" className={classes.muted}>
                  Birthday
                </FormLabel>
                <select
                  id="dob-month"
                  className={classes.selection}
                  onClick={(e) => setBMonth(e.target.value)}
                  name="month"
                >
                  {SignupData[0].map((item, i) => (
                    <option key={i} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <select
                  id="dob-date"
                  className={classes.selection}
                  onClick={(e) => setBDate(e.target.value)}
                  name="date"
                >
                  {SignupData[1].map((item, i) => (
                    <option key={i} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <select
                  id="dob-year"
                  className={classes.selection}
                  onClick={(e) => setBYear(e.target.value)}
                  name="year"
                >
                  {SignupData[2].map((item, i) => (
                    <option key={i} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div className={classes.radio__group}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Gender</FormLabel>
                  <RadioGroup
                    row
                    aria-label="gender"
                    name="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <FormControlLabel
                      value="female"
                      control={<Radio />}
                      label="Female"
                    />
                    <FormControlLabel
                      value="male"
                      control={<Radio />}
                      label="Male"
                    />
                    <FormControlLabel
                      value="other"
                      control={<Radio />}
                      label="Other"
                    />
                  </RadioGroup>
                </FormControl>
              </div>

              <Button
                style={{ marginTop: "1rem" }}
                variant="contained"
                color="primary"
                type="submit"
              >
                Save
              </Button>
            </FormControl>
          </form>
        </DialogContent>
        {/* <DialogActions>
    <Button autoFocus onClick={handleClose} color="primary">
    Save changes
    </Button>
    </DialogActions> */}
      </Dialog>
    </div>
  );
});

export default Signup;
