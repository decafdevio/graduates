import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import { ApiClient } from "./api/apiClient";
import { Dashboard, Employer, Profile, View } from "./pages";
import { Login, Register, Navibar, Footer } from "./components";
import ContactForm from "./components/ContactForm";
//
import Container from "react-bootstrap/Container";

const App = () => {
  const [token, changeToken] = useState(window.localStorage.getItem("token")),
    [user, cUser] = useState([]),
    [profile, cProfile] = useState([]),
    [users, cUsers] = useState([]),
    [skillUsers, cSkillUsers] = useState([]),
    [show, setShow] = useState(true),
    [naviShow, cNaviShow] = useState("hidden"),
    handleClose = () => setShow(false),
    handleShow = () => setShow(true);

  const loggedIn = (newToken) => {
    window.localStorage.setItem("token", newToken);
    changeToken(newToken);
  };

  const logOut = () => {
    window.localStorage.removeItem("token");
    changeToken("");
  };

  const client = new ApiClient(token);

  const buildsearch = (e) => {
    e.preventDefault();
    cSkillUsers([]);
    switch (e.target.search.id) {
      case "email":
        var filtered = users.filter((current) =>
          current.email
            .toLowerCase()
            .includes(e.target.search.value.toLowerCase())
        );
        cUsers(filtered);
        break;
      case "name":
        var filtered = users.filter((current) =>
          current.fname
            .toLowerCase()
            .includes(e.target.search.value.toLowerCase())
        );
        cUsers(filtered);
        break;
      case "location":
        var filtered = users.filter((current) =>
          current.location
            .toLowerCase()
            .includes(e.target.search.value.toLowerCase())
        );
        cUsers(filtered);
        break;
      // SKILLS SEARCH /! IN PROGRESS
      case "skill":
        users.map((current) => {
          current.skills.map((current1) => {
            if (current1.value.includes(e.target.search.value.toLowerCase())) {
              skillUsers.push(current);
            }
          });
        });
        console.log(`current search`, skillUsers);
        cUsers(skillUsers);
        break;
    }
  };

  const refreshList = () => {
    client.getUsers().then((response) => cUsers(response.data));
  };

  const refreshUser = () => {
    users.map((current) => {
      if (current.token == token) {
        return cUser(current);
      }
    });
  };

  useEffect(() => {
    refreshList();
  }, []);

  useEffect(() => {
    refreshUser();
  }, [users]);

  return (
    <>
      <BrowserRouter>
        <Navibar
          show={show}
          handleClose={handleClose}
          handleShow={handleShow}
          profile={profile}
          cProfile={cProfile}
          user={user}
          users={users}
          buildsearch={buildsearch}
          refreshList={refreshList}
          logOut={() => logOut()}
          naviShow={naviShow}
          cNaviShow={cNaviShow}
        />
        <Container className="app">
          <Routes>
            <Route path="/register" element={<Register client={client} />} />
            <Route
              path="/contact"
              element={<ContactForm client={client} profile={profile} />}
            />

            <Route
              path="/profile/:id"
              element={
                user.role == "employer" ? (
                  <Employer
                    token={token}
                    user={user}
                    profile={profile}
                    users={users}
                    cProfile={cProfile}
                    client={client}
                    loggedIn={loggedIn}
                    cNaviShow={cNaviShow}
                  />
                ) : user.role == "participant" || user.role == "tda" ? (
                  <Profile
                    profile={profile}
                    cProfile={cProfile}
                    token={token}
                    users={users}
                    user={user}
                    client={client}
                    loggedIn={loggedIn}
                    cNaviShow={cNaviShow}
                  />
                ) : (
                  "Loading...."
                )
              }
            />
            <Route
              path="/view/:id"
              element={
                user.role ? (
                  <View
                    profile={profile}
                    cProfile={cProfile}
                    token={token}
                    users={users}
                    user={user}
                    client={client}
                    loggedIn={loggedIn}
                    cNaviShow={cNaviShow}
                  />
                ) : (
                  "Loading...."
                )
              }
            />
            <Route
              path="/employer/:id"
              element={
                user.role == "employer" || user.role == "tda" ? (
                  <Employer
                    token={token}
                    profile={profile}
                    cProfile={cProfile}
                    user={user}
                    users={users}
                    client={client}
                    loggedIn={loggedIn}
                    cNaviShow={cNaviShow}
                  />
                ) : (
                  <Dashboard
                    profile={profile}
                    cProfile={cProfile}
                    client={client}
                    logOut={() => logOut()}
                    user={user}
                    users={users}
                    refreshList={refreshList}
                    buildsearch={buildsearch}
                    cNaviShow={cNaviShow}
                  />
                )
              }
            />
            <Route
              index
              element={
                token ? (
                  <Dashboard
                    profile={profile}
                    cProfile={cProfile}
                    client={client}
                    logOut={() => logOut()}
                    user={user}
                    users={users}
                    refreshList={refreshList}
                    buildsearch={buildsearch}
                    cNaviShow={cNaviShow}
                  />
                ) : (
                  <Login
                    handleShow={handleShow}
                    handleClose={handleClose}
                    client={client}
                    loggedIn={loggedIn}
                  />
                )
              }
            />
          </Routes>
        </Container>
      </BrowserRouter>
      <Footer />
    </>
  );
};

export default App;
