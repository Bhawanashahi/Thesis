import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

const InfoBox = () => {
  return (
    <>
      <Row className="p-3">
        <Col md={4} className="mb-3">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>
                <i
                  style={{ fontSize: "1.3rem", color: "red" }}
                  className="bi bi-geo-alt-fill"
                ></i>
                &nbsp; Address
              </Card.Title>
              <Card.Text>
                Unit 6, Regent Walk Shopping Centre, Redcar, TS10 3FB.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>
                <i
                  style={{ color: "green" }}
                  className="bi bi-telephone-fill"
                ></i>
                &nbsp; Phone
              </Card.Title>
              <Card.Text>01642 432 036</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>
                <i style={{ color: "blue" }} className="bi bi-send-fill"></i>
                &nbsp; Email
              </Card.Title>
              <Card.Text>
                <a
                  className="text-dark text-decoration-none"
                  href="mailto:info@techandtechnician.co.uk"
                >
                  info@techandtechnician.co.uk
                </a>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default InfoBox;
