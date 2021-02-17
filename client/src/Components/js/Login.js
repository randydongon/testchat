import React, { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { TextField, Button, Card, Input, Divider } from "@material-ui/core";
import { useStateValue } from "../../StateProvider";
import { Link } from "react-router-dom";
import Signup from "./Signup";
import io from "socket.io-client";

const API = process.env.REACT_APP_API;

const socket = io("http://localhost:9000");

const BootstrapButton = withStyles({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "none",
    textTransform: "none",
    fontSize: 16,
    margin: "1rem auto",
    padding: "6px 12px",
    border: "1px solid",
    lineHeight: 1.5,
    backgroundColor: "#0063cc",
    borderColor: "#0063cc",
    color: "white",
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:hover": {
      backgroundColor: "#0069d9",
      borderColor: "#0062cc",
      boxShadow: "none",
    },
    "&:active": {
      boxShadow: "none",
      backgroundColor: "#0062cc",
      borderColor: "#005cbf",
    },
    "&:focus": {
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.5)",
    },
  },
})(Button);
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "columnn",
    marginLeft: "auto",
    marginRight: "auto",
    justifyContent: "center",
    textAlign: "center",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(1),
      width: "100%",
    },
  },
  signinbtn: {
    width: "100%",
    marginTop: "1ch",
    color: "white",
    fontWeight: "600",
    backgroundColor: "#7bc043",
  },
  signindiv: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    marginLeft: "auto",
    marginRight: "auto",
    minWidth: "auto",
    maxWidth: "300px",
  },
  signincard: {
    width: "100%",
    paddingTop: "1",
    paddingBottom: "1ch",
    flexDirection: "column",
  },
  divbtn: {
    width: "100%",
    marginTop: "1ch",
    color: "white",
    fontWeight: "600",
    backgroundColor: "#0392cf",
    height: "2.1rem",
    borderRadius: "0.2rem",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: "0.7rem",
    "&:hover": {
      backgroundColor: "#7bc043",
    },
    "&:focus": {},
  },
  divider: {
    margin: theme.spacing(3),
  },
}));

const Login = ({ history, setLogin }) => {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = React.useState(false);
  const [userIn, setUserIn] = useState(false);
  const [{ id, name }, dispatch] = useStateValue();

  useEffect(() => {}, [userIn]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email === "") {
      console.log("Email address not be empty");
      return;
    }
    if (password === "") {
      console.log("Password must not be empty!");
      return;
    }
    const resp = await fetch(`${API}/profile/${email}`);

    const profile = await resp.json();

    if (profile.status === 400) {
      alert(profile.message);
      return;
    }
    if (profile.password === password) {
      console.log("Login successfully!");
      const email_add = profile.email;

      const currentuser = {
        id: profile._id,
        email: email_add,
        user_name: profile.user_name,
        photo_url: profile.photo_url,
        isLogin: true,
      };

      dispatch({
        type: "CURRENT_USER",
        user_id: profile._id,
        user_name: profile.user_name,
        photo_url: profile.photo_url,
        isLogin: true,
      });

      localStorage.setItem("currentuser", JSON.stringify(currentuser));

      const resp = await fetch(`${API}/update`, {
        method: "PUt",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isLogin: false,
          email: email,
        }),
      });
      // const data = await resp.json();
      socket.emit("message", { text: { isLogin: true } });

      // history.push("/chat");
      setPassword("");
      setEmail("");
    }
  };

  return (
    <div className={classes.signindiv}>
      <h1>Log In </h1>
      <Card className={classes.signincard}>
        <form
          onSubmit={handleSubmit}
          className={classes.root}
          noValidate
          autoComplete="off"
        >
          <TextField
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            variant="outlined"
            size="small"
            type="email"
          />

          <TextField
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            variant="outlined"
            size="small"
            type="password"
          />

          <Button
            type="submit"
            className={classes.signinbtn}
            color="primary"
            variant="contained"
            size="large"
          >
            Sign In
          </Button>
        </form>
        <Divider className={classes.divider} />
        <Link to="/chat">
          <BootstrapButton type="submit" onClick={() => setOpen(true)}>
            Create New Account
          </BootstrapButton>
        </Link>
      </Card>
      <Signup open={open} setOpen={setOpen} />
    </div>
  );
};

export default Login;
