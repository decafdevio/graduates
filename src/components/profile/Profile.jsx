import React, { useState, useEffect, useCallback } from "react";
import CreatableSelect from "react-select/creatable";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Login from "../login/Login";
import { Link, useParams } from "react-router-dom";
import { BsGithub, BsLinkedin, BsSlack, BsCloudUpload } from "react-icons/bs";
import { MdCheckCircle } from "react-icons/md";
import DatePicker from "react-datepicker";
import Select from "react-select";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer, toast, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Collapse } from "bootstrap";
const url = process.env.REACT_APP_PUBLIC_URL;
const urlb = process.env.REACT_APP_API_URL;

function Profile(props) {
  const [availableDate, cAvailableDate] = useState(props.profile.availabledate),
    [skills, setSkills] = useState(),
    [selectedPhoto, cSelectedPhoto] = useState(),
    [newPhoto, cNewPhoto] = useState(props.profile.picture),
    [selectedCv, cSelectedCv] = useState(props.profile.cv),
    [courseDate, setCourseDate] = useState(new Date()),
    [courseName, setCourseName] = useState(),
    [courseSelect, setCourseSelect] = useState([
      { value: "web", label: "web" },
    ]),
    handleSkillChange = useCallback((inputValue) => setSkills(inputValue), []),
    handleCourseChange = useCallback(
      (inputValue) => setCourseSelect(inputValue),
      []
    );
  const [skilloptions, setSkillOptions] = useState([
    { value: "html", label: "HTML" },
    {
      value: "cascading style sheets (css)",
      label: "Cascading Style Sheets (CSS)",
    },
    { value: "bootstrap", label: "Bootstrap" },
    { value: "javascript", label: "Javascript" },
    { value: "visual studio code", label: "Visual Studio Code" },
    { value: "debugging", label: "Debugging" },
    { value: "problem solving", label: "Problem Solving" },
    { value: "react.js", label: "React.js" },
    { value: "sass", label: "SASS" },
    { value: "api development", label: "API Development" },
    { value: "agile methodologies", label: "Agile Methodologies" },
    { value: "linux", label: "Linux" },
    { value: "github", label: "GitHub" },
    { value: "bash shell", label: "Bash Shell" },
    { value: "css flexbox", label: "CSS Flexbox" },
    { value: "regular expressions", label: "Regular Expressions" },
    {
      value: "object-oriented programming (oop)",
      label: "Object-Oriented Programming (OOP)",
    },
    { value: "test driven development", label: "Test Driven Development" },
    { value: "pair programming", label: "Pair Programming" },
    { value: "redux.js", label: "Redux.js" },
    { value: "express.js", label: "Express.js" },
    { value: "mongodb", label: "MongoDB" },
  ]);

  const handleCourseCreate = () => {
    const newwValue = {
      key: Date.now(),
      value:
        courseName.label.toLowerCase() +
        " " +
        moment(courseDate).format("MMMM YYYY"),
      label: courseName.label + " " + moment(courseDate).format("MMMM YYYY"),
    };
    setCourseSelect([...courseSelect, newwValue]);
  };

  const handleSkillCreate = useCallback(
    (inputValue) => {
      const newValue = { value: inputValue.toLowerCase(), label: inputValue };
      setSkillOptions([...skilloptions, newValue]);
      setSkills([...skills, newValue]);
    },
    [skilloptions]
  );

  // const [courseVal, setCourseValue] = useState({
  //   label: "June 2021",
  //   value: 0,
  // });
  // const handleCourseChange = (e) => {
  //   // console.log(`e = `, e)
  //   setCourseValue(e);
  // };

  const { id } = useParams();
  props.users.map((current) => {
    if (current._id == id) {
      return props.cProfile(current);
    }
  });

  const changePhotoHandler = async (event) => {
    cSelectedPhoto(event.target.files[0]);
  };

  const submitPhoto = () => {
    const getFormat = "." + selectedPhoto.name.split(".").pop(),
      newFileName = props.profile._id + getFormat;

    props.client.postImage(props.profile._id, selectedPhoto).then(() => {
      cNewPhoto(newFileName);
      const toastId = toast(
        "Thanks, your photo has been uploaded, remember to update!",
        {
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        }
      );
    });
  };

  const changeCvHandler = async (event) => {
    cSelectedCv(event.target.files[0]);
  };

  const submitCv = () => {
    const getFormat = "." + selectedCv.name.split(".").pop(),
      newFileName = props.profile._id + getFormat;

    props.client.postCv(props.profile._id, selectedCv).then(() => {
      cSelectedCv(newFileName);
      const toastId = toast(
        "Thanks, your CV has been uploaded, remember to update!",
        {
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        }
      );
    });
  };

  const courseNameOptions = [
    {
      label: "Software Developer",
      value: "web",
    },
    {
      label: "Data Science",
      value: "data",
    },
  ];

  // const setSelectVal = () => {
  //   const tstVal = props.profile?.course;
  //   const typeOf = typeof tstVal;
  //   // console.log(`tstVal `, tstVal)
  //   // console.log(typeOf)

  //   return tstVal;
  // };

  const submitHandler = (e) => {
    e.preventDefault();
    props.client
      .updateUsers(
        props.profile._id,
        e.target.fname.value,
        e.target.sname.value,
        e.target.bio.value,
        selectedCv,
        e.target.github.value,
        e.target.linkedin.value,
        e.target.portfolio.value,
        e.target.available.checked,
        availableDate,
        e.target.email.value,
        e.target.location.value,
        newPhoto,
        courseSelect,
        skills
      )
      .then(() => {
        const toastId = toast("Thanks, your profile has been updated.", {
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  };

  useEffect(() => {
    setSkills(props.profile.skills);
    setCourseSelect(props.profile.course);
    props.cNaviShow("hidden");
  }, [props]);

  return (
    <div className="profile-container mt-4">
      {/* <br /> */}

      {props.token ? (
        <div className="card profile-padding">
          <Form onSubmit={(e) => submitHandler(e)} className="p-3">
            <section>
              <Card.Header className="center">
                <figure>
                  <img
                    src={urlb + `user/pic/` + props.user.picture}
                    className="img-fluid w-25 rounded"
                  />
                  <br />
                  <label
                    for="photo-fex"
                    className="active-button px-2 choose-file"
                  >
                    Change
                  </label>
                  &nbsp;
                  <Button size="sm" variant="warning" onClick={submitPhoto}>
                    <BsCloudUpload />
                  </Button>
                </figure>
              </Card.Header>
              <Row className="mt-3">
                <Col>
                  <Form.Group className="mb-3" controlId="formBasicfName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      name="fname"
                      type="name"
                      placeholder="Your first name"
                      defaultValue={props.profile?.fname}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3" controlId="formBasicfName">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      name="sname"
                      type="name"
                      placeholder="Your surname"
                      defaultValue={props.profile?.sname}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      name="email"
                      type="email"
                      placeholder="Enter email"
                      defaultValue={props.profile?.email}
                    />
                    <Form.Text className="text-muted">
                      We'll never share your email.
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3" controlId="formBasicLocation">
                    <Form.Label>Location</Form.Label>
                    <Form.Control
                      name="location"
                      type="name"
                      placeholder="Enter Location"
                      defaultValue={props.profile?.location}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </section>

            <Form.Group className="mb-3" controlId="formBasicBio">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                name="bio"
                type="text"
                as="textarea"
                placeholder="Tell us about yourself."
                rows={5}
                defaultValue={props.profile?.bio}
              />
            </Form.Group>

            <Row>
              <Form.Group className="mb-3" controlId="formBasicSkills">
                <Form.Label>Skills</Form.Label>
                <CreatableSelect
                  isClearable
                  value={skills}
                  options={skilloptions}
                  onChange={handleSkillChange}
                  onCreateOption={handleSkillCreate}
                  isMulti
                />
              </Form.Group>
            </Row>
            <div className="bootcamp-profile">
              <Row xs={12}>
                <Col>
                  <Form.Group className="mb-3" controlId="formBasicCourse">
                    <Form.Label>Bootcamp Name</Form.Label>
                    <Select
                      isClearable
                      // value={skills}
                      options={courseNameOptions}
                      onChange={(course) => setCourseName(course)}
                      style={{ width: "100%" }}
                      // onCreateOption={handleSkillCreate}
                      // isMulti
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3" controlId="formBasicCourse">
                <Row>
                  <Col>
                    <Form.Label>Bootcamp Start Date</Form.Label>
                    <DatePicker
                      className="datepicker-select"
                      selected={courseDate}
                      defaultValue={"Choose date"}
                      placeholderText={"Choose date"}
                      dateFormat="MMMM yyyy"
                      onChange={(date) => setCourseDate(date)}
                    />
                    <Button
                      className="active-button mt-2"
                      variant="primary"
                      onClick={handleCourseCreate}
                    >
                      Add Course
                    </Button>
                  </Col>
                </Row>
              </Form.Group>
              <Row>
                <Form.Group className="mb-3" controlId="formCourses">
                  <Form.Label>Attended Courses</Form.Label>
                  <CreatableSelect
                    isClearable={false}
                    placeholder="Courses will display here"
                    value={courseSelect}
                    // options={skilloptions}
                    onChange={handleCourseChange}
                    isMulti
                    components={{
                      DropdownIndicator: () => null,
                      IndicatorSeparator: () => null,
                      Menu: () => null,
                    }}
                  />
                </Form.Group>
              </Row>
            </div>
            <br />

            {/* <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" />
              </Form.Group> */}
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="formBasicPortfolio">
                  <Form.Label>Portfolio</Form.Label>
                  <Form.Control
                    name="portfolio"
                    type="link"
                    placeholder="Enter Website"
                    defaultValue={props.profile?.portfolio}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="formBasicGithub">
                  <Form.Label>
                    <BsGithub /> Github
                  </Form.Label>
                  <Form.Control
                    name="github"
                    type="link"
                    placeholder="Enter Github"
                    defaultValue={props.profile?.github}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="formBasicLinkedin">
                  <Form.Label>
                    <BsLinkedin /> Linkedin
                  </Form.Label>
                  <Form.Control
                    name="linkedin"
                    type="link"
                    placeholder="Enter Linkedin"
                    defaultValue={props.profile?.linkedin}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3" controlId="forumUploadDoc">
              <Row style={{ display: "none" }}>
                <Col>
                  <Form.Label>Upload Your Profile Photo</Form.Label>
                  <br />
                  <input
                    id="photo-fex"
                    type="file"
                    accept=".png, .jpg, .jpeg"
                    onChange={changePhotoHandler}
                  />{" "}
                </Col>
                <Col>
                  <Form.Label>
                    You must submit changes before you update.
                  </Form.Label>
                  <br />
                  <Button
                    variant="default"
                    className="active-button"
                    onClick={submitPhoto}
                  >
                    Submit
                  </Button>{" "}
                </Col>
              </Row>
            </Form.Group>
            <Form.Group className="mb-3" controlId="forumUploadDoc">
              <Row>
                <Col>
                  <Form.Label>Upload Your CV</Form.Label>
                  <Form.Control
                    type="file"
                    accept=".doc, .docx, .pdf"
                    onChange={changeCvHandler}
                  />
                  <Button
                    variant="default"
                    className="active-button mt-2"
                    onClick={submitCv}
                  >
                    Submit
                  </Button>
                </Col>
              </Row>
            </Form.Group>
            <hr />
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Row>
                <Col xs={10}>
                  <Form.Label>Are you available for hire?</Form.Label>
                </Col>
                <Col>
                  <Form.Check
                    name="available"
                    type="checkbox"
                    label="Yes"
                    defaultChecked={props.profile?.available}
                    onClick={() => cAvailableDate(Date.now())}
                  />
                </Col>
                <small style={{ color: "var(--titles-color)" }}>
                  <strong>Warning:</strong> Changing this setting will re-order
                  your position in the dashboard.
                </small>
              </Row>
            </Form.Group>
            <hr />
            <center>
              <Button className="active-button" type="submit">
                {" "}
                Update Profile{" "}
              </Button>
            </center>
          </Form>
        </div>
      ) : (
        <Login client={props.client} loggedIn={props.loggedIn} />
      )}
      <br />
      <ToastContainer theme="dark" position="bottom-center" transition={Zoom} />
    </div>
  );
}

export default Profile;
