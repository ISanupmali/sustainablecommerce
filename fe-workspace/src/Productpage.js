import React from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Navbar from "./components/navbar";
import Footer from "./components/Footer";
import { Helmet } from "react-helmet";
import Loading from "./components/Loading";
import Productcarousel from "./components/Productcarousel";
import Pdpinfo from "./components/Pdpinfo";
import Youtubevideo from "./components/Youtubevideo";

class Productpage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      product: [],
      productThumbnails: [],
      productImages: [],
      headers: "",
      inThirtyMinutes: new Date(new Date().getTime() + 30 * 60 * 1000),
      isLoading: true,
      showPopup: false,
    };
  }

  async fetchProductInfo(headers) {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/` + this.props.match.params.id, { headers: headers });
      return res.data;
    } catch (error) {
      console.error("Error fetching cart info", error);
      window.location.href = `${process.env.REACT_APP_STOREFRONT_URL}/errorpage`;
    }
  }

  async componentDidMount() {
    const bearerToken = Cookies.get("bearerToken");
    const inThirtyMinutes = 1 / 48;

    if (!bearerToken) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/shopper/auth/guest`)
        .then(async (res) => {
          const bearerToken = res.data;
          Cookies.set("bearerToken", bearerToken, {
            expires: inThirtyMinutes,
          });
          const headers = {
            "Content-Type": "application/json",
            Authorization: "Bearer " + bearerToken,
          };
          this.setState({ headers });
          const productInfo = await this.fetchProductInfo(headers);
          if (productInfo) {
            const product = productInfo;
            const productThumbnails = product.imageGroups[2].images;
            const productImages = product.imageGroups[0].images;
            this.setState({ product, productThumbnails, productImages });
            this.setState({ isLoading: false });
          }
        })
        .catch((error) => {
          console.error("Error fetching guest auth token:", error);
          this.setState({ isLoading: false });
          window.location.href = `${process.env.REACT_APP_STOREFRONT_URL}/errorpage`;
        });
    } else {
      try {
        const headers = {
          "Content-Type": "application/json",
          Authorization: "Bearer " + bearerToken,
        };
        this.setState({ headers });
        const productInfo = await this.fetchProductInfo(headers);
        if (productInfo) {
          const product = productInfo;
          const productThumbnails = product.imageGroups[2].images;
          const productImages = product.imageGroups[0].images;
          this.setState({ product, productThumbnails, productImages });
          this.setState({ isLoading: false });
        }
      } catch (error) {
        console.error("Error fetching product info", error);
        this.setState({ isLoading: false });
        window.location.href = `${process.env.REACT_APP_STOREFRONT_URL}/errorpage`;
      }
    }
  }

  handleAddToBasket = (event) => {
    this.setState({ showPopup: true });
    setTimeout(() => {
      this.setState({ showPopup: false });
    }, 3000);

    var basketData = sessionStorage.getItem("basketData")
      ? JSON.parse(sessionStorage.getItem("basketData"))
      : "";
    const variantId = this.state.product.variants[0].productId;
    const productImgUrl = this.state.productThumbnails[0].disBaseLink;
    if (basketData) {
      var storedProductIndex = basketData.products.findIndex(
        (item) => item.productId == variantId
      );
      if (storedProductIndex > -1) {
        const qty = basketData.products[storedProductIndex].qty + 1;
        axios
          .get(
            `${process.env.REACT_APP_API_URL}/updateItem/` +
              basketData["basketId"] +
              `/` +
              basketData.products[storedProductIndex].itemId +
              `/` +
              qty,
            { headers: this.state.headers }
          )
          .then((res) => {
            var cartItemIndex = res.data.productItems.findIndex(
              (item) => item.productId == variantId
            );
            basketData.products[storedProductIndex].qty =
              res.data.productItems[cartItemIndex].quantity;
            basketData.products[storedProductIndex].itemId =
              res.data.productItems[cartItemIndex].itemId;
            basketData["basketCount"] = res.data.productItems.length;
            sessionStorage.setItem("basketData", JSON.stringify(basketData));
            this.setState({ basket: res.data });
          });
      } else {
        axios
          .get(
            `${process.env.REACT_APP_API_URL}/addItem/` +
              basketData["basketId"] +
              `/` +
              variantId +
              `/1`,
            { headers: this.state.headers }
          )
          .then((res) => {
            const cartItem = res.data.productItems.find(
              (item) => item.productId == variantId
            );
            basketData.products.push({
              productId: cartItem.productId,
              qty: cartItem.quantity,
              itemId: cartItem.itemId,
              imgUrl: productImgUrl,
            });
            basketData["basketCount"] = res.data.productItems.length;
            sessionStorage.setItem("basketData", JSON.stringify(basketData));
            this.setState({ basket: res.data });
            console.log(basketData);
          });
      }
    } else {
      axios
        .get(`${process.env.REACT_APP_API_URL}/baskets/` + variantId + `/1`, {
          headers: this.state.headers,
        })
        .then((res) => {
          const products = [];
          res.data.productItems.map((item) => {
            products.push({
              productId: item.productId,
              qty: item.quantity,
              itemId: item.itemId,
              imgUrl: productImgUrl,
            });
          });
          const basketObj = {
            basketId: res.data.basketId,
            basketCount: res.data.productItems.length,
            products: products,
          };
          sessionStorage.setItem("basketData", JSON.stringify(basketObj));
          this.setState({ basket: res.data });
          console.log(basketObj);
        });
    }
  };

  render() {
    const productObj = this.state.product;
    const thumbnailsObj = this.state.productThumbnails;
    const productImagesObj = this.state.productImages;
    let countT = 0;
    let countI = 0;

    return (
      <div>
        <Helmet>
          <title>{productObj.name + " " + productObj.primaryCategoryId}</title>
          <meta name="description" content="{productObj.pageDescription}" />
          <meta name="theme-color" content="#ccc" />
        </Helmet>
        <Navbar />

        <section className="py-5" style={{ minHeight: "500px" }}>
          {this.state.isLoading ? (
            <Loading />
          ) : (
            <div className="container px-4 px-lg-5 my-5">
              <div className="row gx-4 gx-lg-5 align-items-center">
                <div className="col-md-6">
                  <Productcarousel images={productImagesObj} />
                </div>
                <div className="col-md-6">
                  <div className="small mb-1">SKU: {productObj.id}</div>
                  <h1 className="display-5 fw-bolder">{productObj.name}</h1>
                  <div className="fs-5 mb-5">
                    <span>${productObj.price}</span>
                  </div>
                  <p className="lead">{this.state.product.longDescription}</p>
                  <div className="d-flex">
                    <input
                      className="form-control text-center me-3"
                      id="inputQuantity"
                      type="num"
                      value="1"
                    />
                    <button
                      className="btn btn-outline-dark flex-shrink-0"
                      type="button"
                      onClick={this.handleAddToBasket}
                    >
                      <i className="bi-cart-fill me-1"></i>
                      Add to cart
                    </button>
                  </div>

                  <br />
                  <Pdpinfo />
                </div>
              </div>

              <Youtubevideo />
            </div>
          )}
        </section>
        {this.state.showPopup && (
          <div className="popup">
            Item added to the cart!
          </div>
        )}
        <Footer />
      </div>
    );
  }
}

export default Productpage;