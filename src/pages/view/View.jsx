import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Select from "react-select";
import Login from "../login/Login";
import CreatableSelect from "react-select/creatable";
import { BsGithub, BsLinkedin, BsShareFill } from "react-icons/bs";
import { GoLocation } from "react-icons/go";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function View(props) {
  const { id } = useParams();
  const url = `${process.env.REACT_APP_PUBLIC_URL}view/`;
  const burl = process.env.REACT_APP_API_URL;
  // const github = <BsGithub /> && "Git";
  const fullName = props.profile.fname + " " + props.profile.sname;

  props.users.map((current) => {
    if (current._id == id) {
      return props.cProfile(current);
    }
  });

  const checkFile = (file, label, fullurl) => {
    if (file !== "") {
      const GHret =
        label == "Github" ? (
          <BsGithub />
        ) : label == "Linkedin" ? (
          <BsLinkedin />
        ) : null;

      return (
        <Col name="formBasicSocial">
          <Button
            size="sm"
            title={file}
            variant="default"
            className="button-orange-outline w-100"
            onClick={() => window.open(fullurl, "_blank").focus()}
          >
            {label}
          </Button>
        </Col>
      );
    }
  };

  const checkCoursesRole = () => {
    if (props.profile?.role === "employer") {
      return;
    } else {
      return (
        <Row>
          <Form.Label>Courses</Form.Label>
          <Select
            value={props.profile?.course}
            isMulti
            placeholder="No courses."
            isDisabled={true}
            components={{
              DropdownIndicator: () => null,
              IndicatorSeparator: () => null,
              Menu: () => null,
              MultiValueRemove: () => null,
            }}
          />{" "}
        </Row>
      );
    }
  };

  const contactPerm = () => {
    if (props.user.role == "employer" || props.user.role == "tda") {
      return (
        <Form.Group className="mb-3" controlId="contactPerm">
          <hr />
          <Button
            variant="primary"
            className="button-orange"
            as={Link}
            to="/contact"
          >
            Contact
          </Button>
        </Form.Group>
      );
    }
  };

  const findWebsite = () => {
    if (props.profile?.portfolio !== "") {
      return (
        <div>
          <h5>
            Website:{" "}
            <a href={props.profile?.portfolio}>{props.profile?.portfolio}</a>
          </h5>
        </div>
      );
    }
  };

  useEffect(() => {
    props.cNaviShow("hidden");
  }, []);

  return (
    <>
      {props.token ? (
        <>
          <Card id="profileCards" className="p-3 mt-3">
            <figure className="center">
              <img
                className="img-fluid object-fit-cover rounded avatar-img"
                src={burl + `user/pic/` + props.profile?.picture}
              />
            </figure>
            <Row>
              <Card.Header className="center pb-3">
                <h1>
                  {props.profile.role === "employer"
                    ? props.profile.company
                    : fullName}
                </h1>
                <Card.Subtitle className="-mt-1 mb-3 text-secondary">
                  <GoLocation /> {props.profile?.location}
                </Card.Subtitle>
                <Row>
                  {/* {props.profile?.role == "employer" ? findWebsite(props) : null} */}
                  <Form.Group className="share-icons d-flex">
                    <Button
                      className="btn-sm button-orange"
                      onClick={() => {
                        navigator.clipboard.writeText(url + id).then(() => {
                          const toastId = toast("URL copied to clipboard.", {
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                          });
                        });
                      }}
                    >
                      <BsShareFill />
                    </Button>
                    &nbsp;&nbsp;&nbsp;
                    <Form.Control
                      readOnly
                      name="url"
                      type="text"
                      placeholder="Empty."
                      value={url + id}
                      rows={1}
                    />
                  </Form.Group>
                </Row>
              </Card.Header>
            </Row>
            {/* HEADER FINISHES */}

            <Form className="mt-3">
              <Form.Group className="mb-3" controlId="formBasicBio">
                <Form.Label>About</Form.Label>
                <Form.Control
                  readOnly
                  name="bio"
                  type="text"
                  as="textarea"
                  placeholder="Empty."
                  rows={5}
                  value={props.profile?.bio}
                />
              </Form.Group>

              <Form.Group controlId="multis">
                <Row>
                  {props.profile.role == "employer" ? (
                    <Form.Label>Desired Skills</Form.Label>
                  ) : (
                    <Form.Label>Skills</Form.Label>
                  )}

                  <Select
                    value={props.profile?.skills}
                    isMulti
                    isDisabled={true}
                    components={{
                      DropdownIndicator: () => null,
                      IndicatorSeparator: () => null,
                      Menu: () => null,
                      MultiValueRemove: () => null,
                    }}
                  />
                </Row>
                <Row className="mt-3">{checkCoursesRole(props)}</Row>
              </Form.Group>
              <hr />
              <Row>
                {checkFile(
                  props.profile?.cv,
                  "CV",
                  burl + `user/cv/` + props.profile?.cv
                )}
                {checkFile(
                  props.profile?.portfolio,
                  "Portfolio",
                  props.profile?.portfolio
                )}
                {checkFile(
                  props.profile?.github,
                  "Github",
                  props.profile?.github
                )}
                {checkFile(
                  props.profile?.linkedin,
                  "Linkedin",
                  props.profile?.linkedin
                )}
              </Row>
              {contactPerm(props)}
            </Form>
          </Card>
        </>
      ) : (
        <Login client={props.client} loggedIn={props.loggedIn} />
      )}
      <ToastContainer theme="dark" position="bottom-center" />
    </>
  );
}

export default View;
