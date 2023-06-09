import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast, Zoom } from "react-toastify";

function Login(props) {
  const [disabled, cDisabled] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    cDisabled(true);
    props.client
      .login(e.target.email.value, e.target.password.value)
      .then((response) => {
        console.log("response", response);
        cDisabled(false);
        props.loggedIn(response.data.token);
        props.handleShow();
      })
      .catch((err) => {
        const toastId = toast(
          "Sorry, the username does not exist or password is incorrect :(",
          {
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
          }
        );

        console.log(err);
        cDisabled(false);
      });
  };

  const demoLogin = () => {
    let user = process.env.REACT_APP_USER1_LOGIN.split(":");
    document.getElementById("loginput").value = user[0];
    document.getElementById("logpassword").value = user[1];
    document.getElementById("login").style.display = "none";
    document.getElementById("login").click();
  };

  return (
    <>
      {props.handleClose()}
      <main>
        <Form
          className="login-frame"
          onSubmit={(e) => submitHandler(e)}
          onMouseOver={() =>
            (document.getElementById("demoframe").style.display = "flex")
          }
          onMouseOut={() =>
            (document.getElementById("demoframe").style.display = "none")
          }
        >
          <div id="demoframe">
            <div id="demo-inner">
              <Button className="active-button" onClick={() => demoLogin()}>
                Demo User Login
              </Button>
            </div>
          </div>

          <Form.Group className="mb-3">
            <header id="title-login">
              Graduat<span style={{ color: "var(--accent-color)" }}>ê</span>s
            </header>
          </Form.Group>
          <center>
            <Form.Group className="mb-4">
              <Form.Control
                style={{ width: "70%" }}
                width="70%"
                type="email"
                name="email"
                placeholder="email"
                id="loginput"
                disabled={disabled}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <br />
              <Form.Control
                style={{ width: "70%" }}
                type="password"
                name="password"
                placeholder="password"
                id="logpassword"
                disabled={disabled}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Button
                type="submit"
                id="login"
                className="active-button"
                disabled={disabled}
              >
                Login
              </Button>
              &nbsp;&nbsp;
              <Button variant="secondary" onClick={() => navigate("/register")}>
                Register
              </Button>
            </Form.Group>
          </center>
        </Form>
      </main>
      <ToastContainer theme="dark" position="top-center" transition={Zoom} />
    </>
  );
}

export default Login;
