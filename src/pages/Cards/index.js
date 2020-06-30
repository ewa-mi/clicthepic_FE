import React from "react";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { Col } from "react-bootstrap";
import "./index.css";

export default function Cards() {
  return (
    <div>
      <h2 className="head">flipping cards</h2>
      <div className="all">
        <Container className="container">
          <Form as={Col} xs={6} sm={6} md={5} lg={4} xl={4}>
            <Form.Group controlId="formBasicName">
              <Form.Label>Choose category</Form.Label>
              <div className="categoryButtons">
                <Form.Group className="mt-5">
                  <Button className="oneButton" variant="primary" type="submit">
                    Clothes{" "}
                  </Button>
                </Form.Group>
                <Form.Group className="mt-5">
                  <Button className="oneButton" variant="info" type="submit">
                    Transport{" "}
                  </Button>
                </Form.Group>
                <Form.Group className="mt-5">
                  <Button className="oneButton" variant="warning" type="submit">
                    Items{" "}
                  </Button>
                </Form.Group>
                <Form.Group className="mt-5">
                  <Button className="oneButton" variant="success" type="submit">
                    Sport{" "}
                  </Button>
                </Form.Group>
              </div>
            </Form.Group>
          </Form>
        </Container>
      </div>

      <h4>Test card</h4>

      <div class="flip-card">
        <div class="flip-card-inner">
          <div class="flip-card-front">
            <img
              className="picture"
              src="https://images.pexels.com/photos/540518/pexels-photo-540518.jpeg?w=1260&h=750&dpr=2&auto=compress&cs=tinysrgb"
              alt="Avatar"
            />
          </div>
          <div class="flip-card-back">
            <h1>TEXT</h1>
          </div>
        </div>
      </div>
    </div>
  );
}