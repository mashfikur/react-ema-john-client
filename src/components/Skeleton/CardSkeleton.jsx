import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "../Product/Product.css";
import "./Skeleton.css";

const CardSkeleton = ({ cards }) => {
  const cardsArray = Array(cards).fill(0);

  return (
    <div className="main">
      {cardsArray.map((cards) => (
        <div>
          <div className="skeleton-body">
            <div className="dummy-img">
              <Skeleton height={"286px"}></Skeleton>
            </div>
            <div className="product-info">
              <h6 className="product-name"></h6>
              <p>
                <Skeleton></Skeleton>{" "}
              </p>
              <p>
                <Skeleton></Skeleton>{" "}
              </p>
              <p>
                <Skeleton></Skeleton>{" "}
              </p>
            </div>
            <div className="skeleton-btn">
              <Skeleton className=""></Skeleton>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardSkeleton;
