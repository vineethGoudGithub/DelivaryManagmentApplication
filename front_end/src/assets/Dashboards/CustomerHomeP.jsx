import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CustomerHome.css';
import NavigationBar from '../Config/NavigationBar';
import About from '../Components/About';
import Home from '../Components/Home';
import Explore from '../Components/Explore';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'http://localhost:8998';

const CustomerHomeP = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [customerEmail, setCustomerEmail] = useState(null);

  const saveCartToLocalStorage = (updatedCart) => {
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  const getEmailFromToken = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      
      const decoded = jwtDecode(token);
      return decoded.sub;
    } catch (error) {
      console.error('Token decode error:', error);
      return null;
    }
  };

  const fetchCart = async () => {
    const token = localStorage.getItem("token");
    const customerEmail = localStorage.getItem("email");

    setCartLoading(true);
    try {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        setCart(JSON.parse(storedCart));  
      } else {
        const response = await fetch(`${BASE_URL}/api/cart/${customerEmail}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const cartData = await response.json();
          console.log("Fetched Cart Data:", cartData);
          saveCartToLocalStorage(cartData);
        } else {
          console.log("Failed to fetch cart data:", response.status);
          setCart([]);
        }
      }
   
    } catch (err) {
      console.log("Error fetching cart:", err);
      setCart([]);
    } finally {
      setCartLoading(false);
    }
  };

  const fetchProducts = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${BASE_URL}/api/products`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched Products Data:", data); 
      setProducts(Array.isArray(data) ? data : data.products || data.data || []);
    } catch (err) {
      console.log("Error fetching products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product) => {
    const token = localStorage.getItem("token");
    const customerEmail = localStorage.getItem("email");
 
    if (addingToCart) return;
    setAddingToCart(true);

    try {
      const response = await fetch(`${BASE_URL}/api/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product.id,
          customerEmail: customerEmail,
          quantity: 1,
        }),
      });

      if (response.ok) {
        setCart(prevCart => {
          const existingProductIndex = prevCart.findIndex(item => item.productId === product.id);
          let updatedCart;

          if (existingProductIndex !== -1) {
            updatedCart = [...prevCart];
            updatedCart[existingProductIndex].quantity += 1;
          } else {
            updatedCart = [...prevCart, {
              productId: product.id,
              productName: product.name,
              quantity: 1,
            }];
          }

          saveCartToLocalStorage(updatedCart);
          return updatedCart;
        });
      } 
    } catch (err) {
      console.log("Error adding to cart:", err);
      toast.error("Failed to add item to cart. Please try again.");
    } finally {
      setAddingToCart(false);
    }
  };

  const removeFromCart = async (productId) => {
    const token = localStorage.getItem("token");
    const customerEmail = localStorage.getItem("email");

    try {
      const response = await fetch(`${BASE_URL}/api/cart/remove?email=${customerEmail}&productId=${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setCart(prevCart => {
          const updatedCart = prevCart.filter(item => item.productId !== productId);
          saveCartToLocalStorage(updatedCart);
          return updatedCart;
        });
      } 
    } catch (err) {
      console.log("Error removing from cart:", err);
    }
  };

  const increaseQuantity = (productId) => {
    setCart(prevCart => {
      const updatedCart = prevCart.map(item => {
        if (item.productId === productId) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });
      saveCartToLocalStorage(updatedCart);
      return updatedCart;
    });
  };

  const decreaseQuantity = (productId) => {
    setCart(prevCart => {
      const updatedCart = prevCart.map(item => {
        if (item.productId === productId) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      }).filter(item => item.quantity > 0); 
      saveCartToLocalStorage(updatedCart);
      return updatedCart;
    });
  };

  const placeOrder = async () => {
    if (cart.length === 0) {
      toast.warning("Cart is empty!");
      return;
    }

    if (!customerEmail) {
      toast.error("Please login first");
      navigate('/');
      return;
    }

    try {
      const responses = await Promise.all(
        cart.map(item =>
          fetch(`${BASE_URL}/orders`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
              productId: item.productId,
              customerEmail: customerEmail,
              quantity: item.quantity,
            }),
          })
        )
      );
     
   
      const orders = await Promise.all(responses.map(res => res.json()));
      const orderIds = orders.map(order => order.id);
      console.log("Created order IDs:", orderIds);

      toast.success("Order placed successfully!");
      setCart([]);
      saveCartToLocalStorage([]);
    } catch (err) {
      toast.error("Failed to place order. Please try again.");
      console.error("Error placing orders:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("cart"); 
    window.location.href = "/";
  };

  useEffect(() => {
    const email = getEmailFromToken();
    if (!email) {
      toast.error('Please login first');
      navigate('/');
      return;
    }
    setCustomerEmail(email);
    fetchProducts();
    fetchCart();
  }, [navigate]);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <NavigationBar />
      <div id="MainHome">
        <Home />
      </div>
      <div>
        <Explore />
      </div>
      <div id="products" className="outer-container1">
        <h2>Products</h2>
        {loading ? (
          <p>Loading products...</p>
        ) : (
          <div className="items">
            {products.length === 0 ? (
              <p>No products available.</p>
            ) : (
              products.map((product) => (
                <div key={product.id}>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <p><strong>Price:</strong> ₹{product.price.toFixed(2)}</p>
                  <button onClick={() => addToCart(product)} className="buttonsq" disabled={addingToCart}>
                    Add to Cart
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div id="cart">
        <h2>Shopping Cart</h2>
        {cartLoading ? (
          <p>Loading your cart...</p>
        ) : (
          <div className="shoppingcart">
            {cart.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              cart.map((item) => (
                <div key={item.productId}>
                  <strong>{item.productName}</strong>
                  <div>
                    <button onClick={() => decreaseQuantity(item.productId)}>-</button>
                    <span> Quantity: {item.quantity} </span>
                    <button onClick={() => increaseQuantity(item.productId)}>+</button>
                  </div>
                  <button onClick={() => removeFromCart(item.productId)}>Remove</button>
                </div>
              ))
            )}
            <button className="placeOrder" onClick={placeOrder} disabled={cart.length === 0 || addingToCart}>Place Order</button>
          </div>
        )}
      </div>

      <div id="about">
        <About />
      </div>
      
      <div id="contact" className="button22">
        <p>Contact Us</p>
        <button onClick={handleLogout}>Log out</button>
      </div>
    </>
  );
};

export default CustomerHomeP;
