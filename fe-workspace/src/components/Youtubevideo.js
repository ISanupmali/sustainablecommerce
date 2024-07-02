import React, { Component } from "react";
import { createClient } from "contentful";
import "bootstrap/dist/css/bootstrap.min.css";
import Alert from "react-bootstrap/Alert";

class Pdpinfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pdpInfo: "",
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
          content_type: "spartansPdpInfo",
        });
        this.setState({ pdpInfo: response.items[0] });
      } catch (error) {
        console.log("Error fetching info:", error);
        this.setState({ error: "Failed to fetch youtube data" });
      }
    };

    fetchBanners();
  }

  render() {
    const { pdpInfo } = this.state;
    console.log(pdpInfo);
    if (pdpInfo.length === 0) {
      return null;
    }
    return (
      <div className="mt-5 text-center">
        <h3 className="p-5">How BOPIS Works</h3>
        <iframe
          id="player"
          type="text/html"
          width="900"
          height="700"
          src={pdpInfo.fields.youtubeLink}
          frameborder="0"
          title={pdpInfo.fields.pdpInfoTitle}
        ></iframe>
      </div>
    );
  }
}

export default Pdpinfo;
