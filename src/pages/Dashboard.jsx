import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Select from "react-select";
// import Permissions from "../components/FilePermissions";
// import ContactForm from "../components/ContactForm";

import { BsStarFill } from "react-icons/bs";
import { GoLocation } from "react-icons/go";
import { AiFillSafetyCertificate } from "react-icons/ai";
import Card from "react-bootstrap/Card";
//
const burl = process.env.REACT_APP_API_URL;

function Dashboard(props) {
  let navigate = useNavigate();

  useEffect(() => {
    props.refreshList();
    props.cNaviShow("visible");
  }, []);

  const multiSelectStyles = {
    control: (base) => ({
      ...base,
      border: "0",
    }),
    multiValueLabel: (base) => ({
      ...base,
      backgroundColor: "white",
      color: "chocolate",
      border: "1px solid chocolate",
      padding: ".2em .5em",
    }),
  };

  const isAvailable = (current) => {
    if (current.role == "employer") {
      return (
        <span className="status-shape-employer">
          <AiFillSafetyCertificate /> EMPLOYER
        </span>
      );
    } else {
      if (current.available == false) {
        return (
          <span className="status-shape">
            &nbsp;
            <BsStarFill /> HIRED
          </span>
        );
      }
    }
  };

  const industryOrNotLabel = (current) => {
    if (current.role == "employer") {
      return "Industry:";
    } else {
      return "Available:";
    }
  };

  const industryOrNot = (current) => {
    if (current.role == "employer") {
      return (
        <span style={{ float: "right", fontWeight: "bold" }}>
          <small>{current.industry}</small>
        </span>
      );
    } else {
      return (
        <span style={{ float: "right", fontWeight: "bold" }}>
          <small>{moment(current.availabledate).format("DD MMMM 'YY")}</small>
        </span>
      );
    }
  };

  const filterProfile = (data) => {
    let theProfile = props.users.filter((current) =>
      current.email.toLowerCase().includes(data)
    );
    props.cProfile(theProfile[0]);
    navigate(`/view/${theProfile[0]._id}`);
  };

  const cardContainer = () => {
    return props.users.map((data) => (
      <Card key={data._id} className="ad-container">
        <article className="d-md-flex">
          <figure className="center pt-3 px-3 dash-img">
            <Card.Img
              variant="left"
              src={burl + `user/pic/` + data.picture}
              className="img-fluid object-fit-cover rounded avatar-img min-vw-30"
            ></Card.Img>
          </figure>

          <Card className="card-inner">
            <Card.Title
              className="card-title center"
              onClick={() => filterProfile(data.email)}
            >
              {data.role == "employer"
                ? data.company
                : data.fname + " " + data.sname}
              <Card.Subtitle className="mt-1 text-secondary">
                <GoLocation /> {data.location}
              </Card.Subtitle>
            </Card.Title>
            <hr />
            <Card.Body>
              {/* truncate bio */}
              {data.bio.length >= 200 ? (
                <>
                  {data.bio.substring(0, 200)}...
                  <br />
                  <a
                    className="read-more-link"
                    onClick={() => filterProfile(data.email)}
                  >
                    read more
                  </a>
                </>
              ) : (
                <>{data.bio}</>
              )}
              {/* truncate bio */}
            </Card.Body>
          </Card>
        </article>

        <Card.Footer
          responsive="true"
          className="text-right overflow-x-scroll"
          // style={{ overflowX: "scroll" }}
        >
          <Select
            value={data?.skills}
            isMulti
            styles={multiSelectStyles}
            isDisabled={true}
            components={{
              DropdownIndicator: () => null,
              IndicatorSeparator: () => null,
              Menu: () => null,
              MultiValueRemove: () => null,
            }}
          />
          {/* Updated: {moment(data.availabledate).format("DD MMMM, YYYY")} */}
        </Card.Footer>
      </Card>
    ));
  };

  // const buildcards = () => {
  //   if (props.user.role == "employer") {
  //     return props.users
  //       .sort((a) =>
  //         a.location.toUpperCase() !== props.user.location.toUpperCase()
  //           ? 1
  //           : -1
  //       )
  //       .sort((b, c) =>
  //         new Date(b.availabledate) < new Date(c.availabledate) ? -1 : 1
  //       )
  //       .map((current) =>
  //         current.available == false ? null : (
  //           <Card key={current._id} id="profileCards" className="ad-container">
  //             <Card.Header>
  //               <Card.Text as="h1">
  //                 <div className="avatar-container">
  //                   <img src={burl + `user/pic/` + current.picture} />
  //                 </div>
  //               </Card.Text>
  //               <Card.Text className="available-indicator float-right">
  //                 {isAvailable(current)}
  //               </Card.Text>
  //             </Card.Header>
  //             <Card.Text
  //               className="dash-names"
  //               onClick={() => filterProfile(current.email)}
  //             >
  //               {current.role == "employer"
  //                 ? current.company
  //                 : current.fname + " " + current.sname}
  //             </Card.Text>
  //             <br />
  //             <Card.Text className="dash-location">
  //               <Form.Group className="mb-3">
  //                 Location:
  //                 <span style={{ float: "right", fontWeight: "bold" }}>
  //                   {current.location}
  //                 </span>
  //                 <hr />
  //               </Form.Group>
  //               <Form.Group className="mb-3">
  //                 {industryOrNotLabel(current)}
  //                 {industryOrNot(current)}
  //               </Form.Group>
  //             </Card.Text>
  //             <Select
  //               value={current?.skills}
  //               isMulti
  //               styles={multiSelectStyles}
  //               isDisabled={true}
  //               components={{
  //                 DropdownIndicator: () => null,
  //                 IndicatorSeparator: () => null,
  //                 Menu: () => null,
  //                 MultiValueRemove: () => null,
  //               }}
  //             />{" "}
  //             <div style={{ height: "10px" }}></div>
  //             <Permissions
  //               refreshList={props.refreshList}
  //               client={props.client}
  //               user={props.user}
  //               current={current}
  //               profile={props.profile}
  //               cProfile={props.cProfile}
  //               users={props.users}
  //             />
  //           </Card>
  //         )
  //       );
  //   } else {
  //     <b>"Loading......"</b>;
  //   }
  // };

  return (
    <main>
      <div className="body-container">{cardContainer()}</div>
    </main>
  );
}
export default Dashboard;
