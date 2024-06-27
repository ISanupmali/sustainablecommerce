import React, { Component } from 'react';
import { createClient } from 'contentful';
import "bootstrap/dist/css/bootstrap.min.css";

class Categorybanner extends Component {
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
        content_type: 'spartansCategoryBanner', // Later we can move to .env file it required
      });
      //console.log(response);
      this.setState({ banners: response.items.map((item) => item.fields) });
    };

    fetchBanners();
  }

  render() {
    const { banners } = this.state;  
    const banner = banners.length ? banners[0] : null; console.log('Here', banner);
    if (!banner) {
        return null;
    }
    return (
        <div className="mb-5">
            <div className="category-banner">
                <img src={banner.categoryBannerImage.fields.file.url} alt="Category Image" class="category-image" />
                <div className="category-content">
                    <h1 className="category-title">{banner.categoryBannerHeading}</h1>
                    <p className="category-description">{banner.categoryBannerCaption}</p>
                </div>
            </div>
        </div>
    );
  }
}

export default Categorybanner;
