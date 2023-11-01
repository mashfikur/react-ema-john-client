import React, { useEffect, useState } from "react";
import {
  addToDb,
  deleteShoppingCart,
  getShoppingCart,
} from "../../utilities/fakedb";
import Cart from "../Cart/Cart";
import Product from "../Product/Product";
import "./Shop.css";
import { Link, useLoaderData } from "react-router-dom";
import CardSkeleton from "../Skeleton/CardSkeleton";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { totalItem } = useLoaderData();
  //   console.log(totalItem);
  const [items, setItems] = useState(10);

  const numberOfPages = Math.ceil(totalItem / items);

  const pages = [...Array(numberOfPages).keys()];

  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const storedCart = getShoppingCart();
    const savedCart = [];
    // step 1: get id of the addedProduct
    for (const id in storedCart) {
      // step 2: get product from products state by using id
      const addedProduct = products.find((product) => product._id === id);
      if (addedProduct) {
        // step 3: add quantity
        const quantity = storedCart[id];
        addedProduct.quantity = quantity;
        // step 4: add the added product to the saved cart
        savedCart.push(addedProduct);
      }
      // console.log('added Product', addedProduct)
    }
    // step 5: set the cart
    setCart(savedCart);
  }, [products]);

  const handleAddToCart = (product) => {
    // cart.push(product); '
    let newCart = [];
    // const newCart = [...cart, product];
    // if product doesn't exist in the cart, then set quantity = 1
    // if exist update quantity by 1
    const exists = cart.find((pd) => pd._id === product._id);
    if (!exists) {
      product.quantity = 1;
      newCart = [...cart, product];
    } else {
      exists.quantity = exists.quantity + 1;
      const remaining = cart.filter((pd) => pd._id !== product._id);
      newCart = [...remaining, exists];
    }

    setCart(newCart);
    addToDb(product._id);
  };

  const handleClearCart = () => {
    setCart([]);
    deleteShoppingCart();
  };

  const handlePageChange = (e) => {
    const value = e.target.value;
    setItems(parseInt(value));
    setCurrentPage(1);
  };

  return (
    <div>
      <div className="shop-container">
        {loading && <CardSkeleton cards={items}></CardSkeleton>}

        {loading || (
          <div className="products-container">
            {products.map((product) => (
              <Product
                key={product._id}
                product={product}
                handleAddToCart={handleAddToCart}
              ></Product>
            ))}
          </div>
        )}
        <div className="cart-container">
          <Cart cart={cart} handleClearCart={handleClearCart}>
            <Link className="proceed-link" to="/orders">
              <button className="btn-proceed">Review Order</button>
            </Link>
          </Cart>
        </div>
      </div>
      <p className="text-center">Current Page : {currentPage} </p>
      <div className="pagination">
        <button
          onClick={(currentPage > 1) ? () => setCurrentPage(currentPage - 1) : undefined}
        >
          Prev
        </button>
        {pages.map((page, idx) => (
          <button
            key={idx}
            className={`${page + 1 === currentPage && "selected"}`}
            onClick={() => setCurrentPage(page + 1)}
          >
            {page + 1}
          </button>
        ))}
        <button onClick={currentPage < numberOfPages ? () => setCurrentPage(currentPage + 1) : undefined} >Next</button>
        <select
          defaultValue={items}
          onChange={handlePageChange}
          name="pageVlaue"
          id=""
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>
    </div>
  );
};

export default Shop;
