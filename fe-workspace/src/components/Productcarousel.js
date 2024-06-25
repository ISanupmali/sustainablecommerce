import React from "react";
import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const Productcarousel = (props) => {
  const productImages = props.images;
  console.log(productImages);
  return (
    <Carousel>
      {productImages.map((image) => (
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={image.disBaseLink}
            alt={image.alt}
          />
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default Productcarousel;
