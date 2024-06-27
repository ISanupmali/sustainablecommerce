import React, { Component } from 'react';
import { createClient } from 'contentful';
import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

class Herobanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      banners: [],
    };
  }

  componentDidMount() {
    const client = createClient({
        space: `${process.env.REACT_APP_CONTENTFUL_SPACEID}`,
        accessToken: `${process.env.REACT_APP_CONTENTFUL_API_ACCESS_TOKEN}`,
      });

    const fetchBanners = async () => {
      const response = await client.getEntries({
        content_type: 'spartansHomePage', // Later we can move to .env file it required
      });
      this.setState({ banners: response.items.map((item) => item.fields) });
    };

    fetchBanners();
  }

  render() {
    const { banners } = this.state;
    return (
        <Carousel interval={2000}>
        {banners.map((banner) => (
            <Carousel.Item key={banner.heroBanner.sys.id}>
                <img src={banner.heroBanner.fields.file.url} alt={banner.heroTitle} width="100%" height="540" />
                <Carousel.Caption>
                    <h3>{banner.heroTitle}</h3>
                    <p>{banner.bannerCaption}</p>
                </Carousel.Caption>
            </Carousel.Item>
        ))}
      </Carousel>
    );
  }
}

export default Herobanner;
