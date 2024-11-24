import React from "react";

const Footer = React.memo(function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer>
      <p>
        Made with ❤ <br />
        Copyright ⓒ {year}
      </p>
    </footer>
  );
});

export default Footer;
