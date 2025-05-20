import React, { useState, useEffect } from 'react';
import './CustomerHome.css';
import NavigationBar from '../Config/NavigationBar';
import About from '../Components/About';

const BASE_URL = 'http://localhost:8998';

const CustomerHomeP = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false); 

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
          setCart(cartData);
          localStorage.setItem('cart', JSON.stringify(cartData)); 
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

      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return updatedCart;
    });

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

      if (!response.ok) {
        console.log("Failed to add to cart:", response.status);
        setCart(prevCart => prevCart.filter(item => item.productId !== product.id));  
        localStorage.setItem('cart', JSON.stringify(prevCart)); 
      }
    } catch (err) {
      console.log("Error adding to cart:", err);
      setCart(prevCart => prevCart.filter(item => item.productId !== product.id)); 
      localStorage.setItem('cart', JSON.stringify(prevCart)); 
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
          localStorage.setItem('cart', JSON.stringify(updatedCart));
          return updatedCart;
        });
      } else {
        console.log("Failed to remove from cart:", response.status); 
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
      localStorage.setItem('cart', JSON.stringify(updatedCart)); 
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
      localStorage.setItem('cart', JSON.stringify(updatedCart)); 
      return updatedCart;
    });
  };

  const placeOrder = async () => {
    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }

    const token = localStorage.getItem("token");
    const customerEmail = localStorage.getItem("email");

    try {
      await Promise.all(
        cart.map(item =>
          fetch(`${BASE_URL}/orders`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
              productId: item.productId,
              customerEmail: customerEmail,
              quantity: item.quantity,
            }),
          })
        )
      );

      alert("Order(s) placed successfully!");
      setCart([]); 
      localStorage.setItem('cart', JSON.stringify([])); 
    } catch (err) {
      alert("Failed to place orders.");
      console.log("Error placing orders:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("cart"); 
    window.location.href = "/";
  };

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

  return (
    <>
      <NavigationBar />
      <div className="outer-container1">
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

      <div>
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
            <button onClick={placeOrder} disabled={cart.length === 0 || addingToCart}>Place Order</button>
          </div>
        )}
      </div>

      <About />
      <div className="button22">
        <p>Contact Us</p>
        <button onClick={handleLogout}>Log out</button>
      </div>
    </>
  );
};

export default CustomerHomeP;
