import { Facebook, Instagram, Pinterest, LocationOn, LocalPhone, Email } from "@mui/icons-material";
import "../styles/Footer.scss"

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer_left">
        <a href="/"><img src="/assets/logo.png" alt="logo"/></a>
        {/* <p>
          There are many collections of dress, top, bottoms, accessories
        </p>
        <div className="footer_left_socials">
          <div className="footer_left_socials_icon">
            <Facebook />
          </div>
          <div className="footer_left_socials_icon">
            <Instagram />
          </div>
          <div className="footer_left_socials_icon">
            <Pinterest />
          </div>
        </div> */}
      </div>

      <div className="footer_center">
        <h3>Useful Links</h3>
        <ul>
          {/* <li><a href="/">Home</a></li>
          <li><a href="/cart">Cart</a></li>
          <li><a href="/login">My Account</a></li>
          <li>Order Tracking</li> */}
          <li>WishList</li>
          <li>Terms & Conditions</li>
        </ul>
      </div>

      <div className="footer_right">
        <h3>Contact</h3>
        {/* <div className="footer_right_info">
          <LocationOn />
          <p>139 Victoria Park Ave</p>
        </div> */}
        <div className="footer_right_info">
          <LocalPhone />
          <p>+1 649-391-287</p>
        </div>
        <div className="footer_right_info">
          <Email />
          <p>support@artfulize.com</p>
        </div>
        <img src="/assets/payment.png" alt="payment"/>
      </div>
    </div>
  );
};

export default Footer;
