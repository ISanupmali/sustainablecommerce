import React, { Component } from "react";
import { createClient } from "contentful";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import "bootstrap/dist/css/bootstrap.min.css";

class Testimonials extends Component {
  constructor(props) {
    super(props);
    this.state = {
      testimonials: [],
    };
  }

  componentDidMount() {
    const client = createClient({
      space: `${process.env.REACT_APP_CONTENTFUL_SPACEID}`,
      accessToken: `${process.env.REACT_APP_CONTENTFUL_API_ACCESS_TOKEN}`,
    });

    const fetchBanners = async () => {
      try {
        const response = await client.getEntries({
          content_type: "spartansTestimonials", // Later we can move to .env file it required
        });
        this.setState({
          testimonials: response.items.map((item) => item.fields),
        });
      } catch (error) {
        console.log("Error fetching banners:", error);
        this.setState({ error: "Failed to fetch testimonials data" });
      }
    };

    fetchBanners();
  }

  render() {
    const { testimonials } = this.state;
    return (
      <>
        <h2 className="text-center p-5">Shop Smart - Save the Planet</h2>
        <Row xs={1} md={3} className="g-4">
          {testimonials.map((testimonial) => (
            <Col key={testimonial.testimonialImage.sys.id}>
              <Card>
                <Card.Img
                  variant="top"
                  src={testimonial.testimonialImage.fields.file.url}
                />
                <Card.Body>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      minHeight: "150px",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Card.Text>
                      <p className="fst-italic text-center">
                        "{testimonial.testimonialText}"
                      </p>
                    </Card.Text>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </>
    );
  }
}

export default Testimonials;
