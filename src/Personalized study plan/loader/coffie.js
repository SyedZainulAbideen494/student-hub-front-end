import React from "react";
import "./CoffeeLoader.css";

const CoffeeLoader = () => {
  return (
    <div className="loader__coffee_loader">
      <div className="container__coffee_loader">
        <div className="coffee-header__coffee_loader">
          <div className="coffee-header__buttons__coffee_loader"></div>
          <div className="coffee-header__display__coffee_loader"></div>
          <div className="coffee-header__details__coffee_loader"></div>
        </div>
        <div className="coffee-medium__coffee_loader">
          <div className="coffee-medium__exit__coffee_loader"></div>
          <div className="coffee-medium__arm__coffee_loader"></div>
          <div className="coffee-medium__liquid__coffee_loader"></div>
          <div className="smoke__coffee_loader one__coffee_loader"></div>
          <div className="smoke__coffee_loader two__coffee_loader"></div>
          <div className="smoke__coffee_loader three__coffee_loader"></div>
          <div className="smoke__coffee_loader four__coffee_loader"></div>
          <div className="coffee-medium__cup__coffee_loader"></div>
        </div>
      </div>
    </div>
  );
};

export default CoffeeLoader;
