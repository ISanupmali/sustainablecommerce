import React, { Component } from 'react';
import { createClient } from 'contentful';
import "bootstrap/dist/css/bootstrap.min.css";
import Alert from 'react-bootstrap/Alert';

class Pdpinfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
        pdpInfo: '',
    };
  }

  componentDidMount() {
    const client = createClient({
        space: `${process.env.REACT_APP_CONTENTFUL_SPACEID}`,
        accessToken: `${process.env.REACT_APP_CONTENTFUL_API_ACCESS_TOKEN}`,
      });

    const fetchBanners = async () => {
      const response = await client.getEntries({
        content_type: 'spartansPdpInfo', // Later we can move to .env file it required
      });
       this.setState({ pdpInfo: response.items[0] });
    };

    fetchBanners();
  }

  render() {
    const { pdpInfo } = this.state; 
    if (pdpInfo.length === 0) {
        return null;
    }
    return (
        <div className="mt-5">
            <Alert variant="success">
                <Alert.Heading>{pdpInfo.fields.pdpInfoTitle}</Alert.Heading>
                <p>{pdpInfo.fields.pdpInfoDetails}</p>
            </Alert>
        </div>
    );
  }
}

export default Pdpinfo;
