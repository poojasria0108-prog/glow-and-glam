import React, { useState } from "react";
import "./App.css";

const fallbackImage =
  "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=85";

const products = [
  { id: 1, name: "Velvet Matte Lipstick", category: "Makeup", price: 499, image: "https://images.pexels.com/photos/36701005/pexels-photo-36701005.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { id: 2, name: "Liquid Foundation", category: "Makeup", price: 799, image: "https://images.pexels.com/photos/7664090/pexels-photo-7664090.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { id: 3, name: "Rose Blush", category: "Makeup", price: 399, image: "https://images.pexels.com/photos/4938508/pexels-photo-4938508.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { id: 4, name: "Glow Highlighter", category: "Makeup", price: 549, image: "https://images.pexels.com/photos/6527703/pexels-photo-6527703.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { id: 5, name: "Volume Mascara", category: "Makeup", price: 349, image: "https://images.pexels.com/photos/2535913/pexels-photo-2535913.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { id: 6, name: "Hydrating Face Cream", category: "Skincare", price: 599, image: "https://images.pexels.com/photos/6738803/pexels-photo-6738803.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { id: 7, name: "Vitamin C Serum", category: "Skincare", price: 699, image: "https://images.pexels.com/photos/13573726/pexels-photo-13573726.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { id: 8, name: "Daily Moisturizer", category: "Skincare", price: 449, image: "https://images.pexels.com/photos/7795763/pexels-photo-7795763.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { id: 9, name: "Gentle Face Cleanser", category: "Skincare", price: 299, image: "https://images.pexels.com/photos/8533212/pexels-photo-8533212.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { id: 10, name: "SPF 50 Sunscreen", category: "Skincare", price: 399, image: "https://images.pexels.com/photos/7795661/pexels-photo-7795661.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { id: 11, name: "Floral Perfume", category: "Fragrance", price: 999, image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=85" },
  { id: 12, name: "Elegant Perfume", category: "Fragrance", price: 1199, image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=85" },
  { id: 13, name: "Makeup Brush Set", category: "Accessories", price: 649, image: "https://images.pexels.com/photos/28216101/pexels-photo-28216101.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { id: 14, name: "Beauty Essentials Kit", category: "Accessories", price: 899, image: "https://images.pexels.com/photos/8558516/pexels-photo-8558516.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { id: 15, name: "Luxury Body Lotion", category: "Body Care", price: 499, image: "https://images.pexels.com/photos/4736027/pexels-photo-4736027.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { id: 16, name: "Body Care Collection", category: "Body Care", price: 799, image: "https://images.pexels.com/photos/13720324/pexels-photo-13720324.jpeg?auto=compress&cs=tinysrgb&w=800" }
];

const categories = [
  "All", "Makeup", "Skincare", "Fragrance", "Accessories", "Body Care"
];

function App() {
  const [page, setPage] = useState("Home");
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");

  const authPages = ["Login", "Sign Up", "Forgot Password"];
  const hideNavigation = authPages.includes(page);

  const go = (nextPage) => {
    setPage(nextPage);
    setAuthError("");
    setAuthSuccess("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // USER REGISTRATION
  const handleRegister = async (event) => {
    event.preventDefault();

    setAuthError("");
    setAuthSuccess("");
    setAuthLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (password !== confirmPassword) {
      setAuthError("Passwords do not match.");
      setAuthLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "https://glow-and-glam-backend.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name,
            email,
            password,
            confirmPassword
          })
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      setAuthSuccess("Account created successfully! Please log in.");
      form.reset();

      setTimeout(() => {
        setAuthSuccess("");
        go("Login");
      }, 1200);

    } catch (error) {
      setAuthError(
        error.message || "Unable to connect to the server. Please try again."
      );
    } finally {
      setAuthLoading(false);
    }
  };

  // USER LOGIN
  const handleLogin = async (event) => {
    event.preventDefault();

    setAuthError("");
    setAuthSuccess("");
    setAuthLoading(true);

    const formData = new FormData(event.currentTarget);

    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const response = await fetch(
        "https://glow-and-glam-backend.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      if (!data.token) {
        throw new Error("Login response did not contain an authentication token.");
      }

      localStorage.setItem("glowGlamToken", data.token);

      if (data.user) {
        localStorage.setItem("glowGlamUser", JSON.stringify(data.user));
      }

      setAuthSuccess("Login successful! Welcome to Glow & Glam.");

      setTimeout(() => {
        setAuthSuccess("");
        go("Home");
      }, 1000);

    } catch (error) {
      setAuthError(
        error.message || "Unable to connect to the server. Please try again."
      );
    } finally {
      setAuthLoading(false);
    }
  };

  const addToCart = (product) => {
    setCart((current) => {
      const found = current.find((item) => item.id === product.id);

      if (found) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...current, { ...product, quantity: 1 }];
    });
  };

  const changeQuantity = (id, amount) => {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((current) => current.filter((item) => item.id !== id));
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || product.category === category;
    return matchesSearch && matchesCategory;
  });

  function ProductCard({ product }) {
    return (
      <article className="product-card">
        <div className="product-image-wrap">
          <img src={product.image} alt={product.name} loading="lazy" />
        </div>
        <div className="product-info">
          <span className="product-category">{product.category}</span>
          <h3>{product.name}</h3>
          <div className="product-card-bottom">
            <strong>₹{product.price}</strong>
            <button className="small-add-button" onClick={() => addToCart(product)}>
              + Add
            </button>
          </div>
          <button
            className="view-product-button"
            onClick={() => {
              setSelectedProduct(product);
              go("Product Details");
            }}
          >
            View Details
          </button>
        </div>
      </article>
    );
  }

  return (
    <div className="app">

      {!hideNavigation && (
        <>
          <div className="announcement">
            BEAUTY, CARE & CONFIDENCE — ALL IN ONE PLACE
          </div>

          <header className="navbar">
            <button className="logo" onClick={() => go("Home")}>
              Glow <span>&</span> Glam
            </button>
            <nav className="nav-links">
              <button onClick={() => go("Home")}>Home</button>
              <button onClick={() => go("Products")}>Shop</button>
              <button onClick={() => go("About")}>About</button>
              <button onClick={() => go("Contact")}>Contact</button>
              <button onClick={() => go("Cart")}>Cart ({cartCount})</button>
              <button className="login-nav" onClick={() => go("Login")}>Login</button>
            </nav>
          </header>
        </>
      )}

      {page === "Home" && (
        <main>
          <section className="hero">
            <div className="hero-content">
              <span className="eyebrow">THE BEAUTY EDIT</span>
              <h1>Find Your Glow.<br />Love Your Beauty.</h1>
              <p>Discover makeup, skincare and everyday beauty essentials selected to make every day feel special.</p>
              <button className="primary-button" onClick={() => go("Products")}>
                Explore Collection <span>→</span>
              </button>
              <div className="hero-note">
                <span>✦</span> A little beauty. A lot of confidence.
              </div>
            </div>
            <div className="hero-image">
              <img
                src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1400&q=90"
                alt="Beauty and makeup collection"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = fallbackImage;
                }}
              />
              <div className="hero-image-label">
                <span>GLOW EVERY DAY</span>
                <strong>Your beauty, your way.</strong>
              </div>
            </div>
          </section>

          <section className="benefits">
            <div><span>✦</span><strong>Beauty Essentials</strong><small>Everyday favourites</small></div>
            <div><span>♡</span><strong>Curated Collection</strong><small>Made for your routine</small></div>
            <div><span>❀</span><strong>Self-Care Moments</strong><small>Celebrate yourself</small></div>
          </section>

          <section className="section">
            <div className="section-heading">
              <span className="eyebrow">EXPLORE THE COLLECTION</span>
              <h2>Shop By Category</h2>
              <p>Find the beauty essentials that suit your style.</p>
            </div>
            <div className="category-grid">
              {categories.slice(1).map((item, index) => (
                <button
                  className={`category-card category-${index + 1}`}
                  key={item}
                  onClick={() => {
                    setCategory(item);
                    go("Products");
                  }}
                >
                  <span>{["✦", "♡", "❀", "✧", "◇"][index]}</span>
                  <strong>{item}</strong>
                  <small>Explore collection →</small>
                </button>
              ))}
            </div>
          </section>

          <section className="section featured-section">
            <div className="section-heading">
              <span className="eyebrow">CUSTOMER FAVOURITES</span>
              <h2>Our Best Sellers</h2>
              <p>Beauty picks you'll love adding to your routine.</p>
            </div>
            <div className="product-grid">
              {products.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <button className="outline-button" onClick={() => go("Products")}>
              View All Products
            </button>
          </section>

          <section className="home-promo">
            <div>
              <span className="eyebrow">A MOMENT FOR YOU</span>
              <h2>Beauty is your own kind of magic.</h2>
              <p>Take a little time for yourself and discover something lovely.</p>
              <button className="primary-button" onClick={() => go("Products")}>
                Shop the Collection →
              </button>
            </div>
            <img
              src="https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=1000&q=85"
              alt="Skincare beauty products"
              loading="lazy"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = fallbackImage;
              }}
            />
          </section>
        </main>
      )}

      {page === "Products" && (
        <section className="section page-section">
          <div className="section-heading">
            <span className="eyebrow">THE GLOW & GLAM STORE</span>
            <h1>Our Products</h1>
            <p>Explore your favourite makeup, skincare and beauty essentials.</p>
          </div>
          <input
            className="search-input"
            placeholder="Search for your favourite products..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <div className="category-filters">
            {categories.map((item) => (
              <button
                key={item}
                className={category === item ? "active" : ""}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <p className="empty-message">No products found. Try another search.</p>
          )}
        </section>
      )}

      {page === "Product Details" && selectedProduct && (
        <section className="section page-section">
          <div className="product-detail">
            <img src={selectedProduct.image} alt={selectedProduct.name} />
            <div className="product-detail-info">
              <span className="eyebrow">{selectedProduct.category}</span>
              <h1>{selectedProduct.name}</h1>
              <h2>₹{selectedProduct.price}</h2>
              <p>Discover a new favourite from Glow & Glam. Add this beauty essential to your collection and enjoy your everyday routine.</p>
              <button className="primary-button" onClick={() => addToCart(selectedProduct)}>Add to Cart</button>
              <button className="outline-button" onClick={() => go("Products")}>Continue Shopping</button>
            </div>
          </div>
        </section>
      )}

      {page === "Cart" && (
        <section className="section page-section">
          <div className="section-heading">
            <span className="eyebrow">YOUR PICKS</span>
            <h1>Shopping Cart</h1>
          </div>
          {cart.length === 0 ? (
            <div className="empty-cart">
              <span>♡</span>
              <h2>Your cart is waiting for something lovely.</h2>
              <p>Explore our collection and find your next favourite.</p>
              <button className="primary-button" onClick={() => go("Products")}>Start Shopping</button>
            </div>
          ) : (
            <div className="cart-layout">
              <div className="cart-list">
                {cart.map((item) => (
                  <div className="cart-item" key={item.id}>
                    <img src={item.image} alt={item.name} />
                    <div className="cart-item-info">
                      <span>{item.category}</span>
                      <h3>{item.name}</h3>
                      <strong>₹{item.price}</strong>
                      <div className="quantity-control">
                        <button onClick={() => changeQuantity(item.id, -1)}>−</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => changeQuantity(item.id, 1)}>+</button>
                        <button className="remove-button" onClick={() => removeFromCart(item.id)}>Remove</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <aside className="order-summary">
                <h2>Order Summary</h2>
                <div><span>Subtotal</span><strong>₹{total}</strong></div>
                <div><span>Delivery</span><strong>Free</strong></div>
                <hr />
                <div className="summary-total"><span>Total</span><strong>₹{total}</strong></div>
                <button className="primary-button full-button" onClick={() => go("Checkout")}>Proceed to Checkout</button>
              </aside>
            </div>
          )}
        </section>
      )}

      {page === "Checkout" && (
        <section className="section page-section">
          <div className="form-box">
            <span className="eyebrow">ALMOST YOURS</span>
            <h1>Checkout</h1>
            {orderPlaced ? (
              <div className="success-message">
                <span>✓</span>
                <h2>Thank you for your order!</h2>
                <p>Your demo order has been placed successfully.</p>
                <button className="primary-button" onClick={() => {
                  setOrderPlaced(false);
                  go("Home");
                }}>Back to Home</button>
              </div>
            ) : cart.length === 0 ? (
              <div className="empty-cart">
                <p>Your cart is empty.</p>
                <button className="primary-button" onClick={() => go("Products")}>Browse Products</button>
              </div>
            ) : (
              <>
                <p className="checkout-total">Your total: <strong>₹{total}</strong></p>
                <form onSubmit={(event) => {
                  event.preventDefault();
                  setOrderPlaced(true);
                  setCart([]);
                }}>
                  <input placeholder="Full Name" required />
                  <input type="email" placeholder="Email Address" required />
                  <input type="tel" placeholder="Phone Number" required />
                  <textarea placeholder="Full Delivery Address" required />
                  <select defaultValue="" required>
                    <option value="" disabled>Select Payment Method</option>
                    <option>Cash on Delivery</option>
                    <option>UPI (Demo)</option>
                    <option>Card (Demo)</option>
                  </select>
                  <button className="primary-button full-button" type="submit">Place Order</button>
                </form>
              </>
            )}
          </div>
        </section>
      )}

      {/* LOGIN PAGE */}
      {page === "Login" && (
        <section
          className="section page-section auth-page auth-login-page"
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
            backgroundImage: 'linear-gradient(110deg, rgba(43, 20, 34, 0.68), rgba(111, 57, 82, 0.30)), url("https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=2000&q=90")',
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          <div
            className="form-box"
            style={{
              position: "relative",
              zIndex: 1,
              width: "min(100%, 480px)",
              background: "rgba(255, 250, 252, 0.94)",
              backdropFilter: "blur(14px)",
              border: "1px solid rgba(255, 255, 255, 0.75)",
              borderRadius: "24px",
              boxShadow: "0 24px 70px rgba(35, 15, 25, 0.28)"
            }}
          >
            <span className="eyebrow">WELCOME BACK</span>
            <h1>Login</h1>
            <p>Sign in to continue exploring Glow & Glam.</p>

            <form onSubmit={handleLogin}>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
              />

              {authError && (
                <p style={{ color: "#c0395b", fontSize: "14px" }}>
                  {authError}
                </p>
              )}

              {authSuccess && (
                <p style={{ color: "green", fontSize: "14px" }}>
                  {authSuccess}
                </p>
              )}

              <button
                className="primary-button full-button"
                type="submit"
                disabled={authLoading}
              >
                {authLoading ? "Logging in..." : "Login"}
              </button>
            </form>

            <p>
              Don't have an account?{" "}
              <button className="text-button" onClick={() => go("Sign Up")}>Sign Up</button>
            </p>
            <button className="text-button" onClick={() => go("Forgot Password")}>Forgot Password?</button>
          </div>
        </section>
      )}

      {/* SIGN UP PAGE */}
      {page === "Sign Up" && (
        <section
          className="section page-section auth-page auth-signup-page"
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
            backgroundImage: 'linear-gradient(110deg, rgba(48, 23, 38, 0.68), rgba(126, 66, 94, 0.28)), url("https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=2000&q=90")',
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          <div
            className="form-box"
            style={{
              position: "relative",
              zIndex: 1,
              width: "min(100%, 480px)",
              background: "rgba(255, 250, 252, 0.94)",
              backdropFilter: "blur(14px)",
              border: "1px solid rgba(255, 255, 255, 0.75)",
              borderRadius: "24px",
              boxShadow: "0 24px 70px rgba(35, 15, 25, 0.28)"
            }}
          >
            <span className="eyebrow">JOIN OUR BEAUTY COMMUNITY</span>
            <h1>Create Account</h1>

            <form onSubmit={handleRegister}>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Create Password"
                minLength="8"
                required
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                minLength="8"
                required
              />

              {authError && (
                <p style={{ color: "#c0395b", fontSize: "14px" }}>
                  {authError}
                </p>
              )}

              {authSuccess && (
                <p style={{ color: "green", fontSize: "14px" }}>
                  {authSuccess}
                </p>
              )}

              <button
                className="primary-button full-button"
                type="submit"
                disabled={authLoading}
              >
                {authLoading ? "Creating Account..." : "Create Account"}
              </button>
            </form>
          </div>
        </section>
      )}

      {/* FORGOT PASSWORD PAGE */}
      {page === "Forgot Password" && (
        <section
          className="section page-section auth-page auth-forgot-page"
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
            backgroundImage: 'linear-gradient(110deg, rgba(42, 24, 39, 0.70), rgba(112, 72, 102, 0.30)), url("https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=2000&q=90")',
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          <div
            className="form-box"
            style={{
              position: "relative",
              zIndex: 1,
              width: "min(100%, 480px)",
              background: "rgba(255, 250, 252, 0.94)",
              backdropFilter: "blur(14px)",
              border: "1px solid rgba(255, 255, 255, 0.75)",
              borderRadius: "24px",
              boxShadow: "0 24px 70px rgba(35, 15, 25, 0.28)"
            }}
          >
            <span className="eyebrow">ACCOUNT SUPPORT</span>
            <h1>Forgot Password?</h1>
            <p>Enter your email address to request a password reset.</p>
            <form onSubmit={(event) => {
              event.preventDefault();
              alert("Demo password reset request submitted.");
            }}>
              <input type="email" placeholder="Email Address" required />
              <button className="primary-button full-button" type="submit">Submit</button>
            </form>
          </div>
        </section>
      )}

      {page === "About" && (
        <section className="section page-section text-page">
          <span className="eyebrow">OUR STORY</span>
          <h1>About Glow & Glam</h1>

          <p>
            Welcome to Glow & Glam, your little corner of beauty, confidence
            and self-care. We are a beauty destination for everyone who loves
            makeup, skincare, fragrances and everyday beauty essentials.
            Our collection brings together products that help you express
            your personal style and celebrate your individuality.
          </p>

          <p>
            We believe beauty is not about changing who you are. It is about
            discovering what makes you feel comfortable, confident and happy
            in your own skin. Whether you enjoy a simple everyday routine or
            love experimenting with new looks, Glow & Glam is here to make
            your beauty journey enjoyable.
          </p>

          <div className="faq-item">
            <h2>How It All Started</h2>
            <p>
              Glow & Glam was created with a simple idea: beauty shopping
              should feel easy, enjoyable and inspiring. We wanted to bring
              different beauty essentials together in one convenient place,
              so customers can explore products that suit their preferences
              and everyday routines.
            </p>
            <p>
              From the first step of skincare to the final touch of makeup,
              every beauty routine is personal. That is why our store brings
              together different categories and choices for different styles,
              needs and occasions.
            </p>
          </div>

          <div className="faq-item">
            <h2>Our Mission</h2>
            <p>
              Our mission is to make beauty and self-care accessible,
              enjoyable and inspiring. We aim to provide a convenient
              shopping experience where customers can discover makeup,
              skincare, fragrances and beauty accessories in one place.
            </p>
          </div>

          <div className="faq-item">
            <h2>Our Vision</h2>
            <p>
              Our vision is to create a welcoming beauty destination that
              celebrates individuality and encourages everyone to feel
              confident in their own style. We want Glow & Glam to be a
              place where beauty is experienced as self-expression,
              creativity and self-love.
            </p>
          </div>

          <div className="faq-item">
            <h2>Our Core Values</h2>
            <p><strong>Confidence:</strong> We believe every individual deserves to feel confident and comfortable.</p>
            <p><strong>Individuality:</strong> Everyone has a unique style, and we celebrate the beauty of being different.</p>
            <p><strong>Care:</strong> We encourage thoughtful beauty choices and everyday self-care.</p>
            <p><strong>Convenience:</strong> We aim to make exploring and shopping for beauty essentials simple and enjoyable.</p>
            <p><strong>Creativity:</strong> Beauty is a way to experiment, express yourself and discover new looks.</p>
          </div>

          <div className="faq-item">
            <h2>What You'll Find at Glow & Glam</h2>
            <p><strong>Makeup:</strong> Explore lipsticks, foundations, blushes, highlighters and mascaras to create looks for everyday wear and special occasions.</p>
            <p><strong>Skincare:</strong> Discover cleansers, moisturizers, serums and sunscreens to support your daily skincare routine.</p>
            <p><strong>Fragrance:</strong> Find lovely fragrance options that can add a special touch to your everyday style.</p>
            <p><strong>Beauty Accessories:</strong> Explore useful beauty tools and essentials that make your routine easier.</p>
            <p><strong>Body Care:</strong> Discover body care essentials that make your personal care routine feel refreshing.</p>
          </div>

          <div className="faq-item">
            <h2>Why Choose Glow & Glam?</h2>
            <p>
              We bring multiple beauty categories together so you can
              explore different products without visiting several stores.
              Our website is designed to help you browse collections,
              view product details, add your favourites to the cart and
              enjoy a simple shopping experience.
            </p>
            <p>
              We believe that even small moments of self-care can make
              a difference. Our goal is to make those moments feel
              special with beauty essentials that match your preferences.
            </p>
          </div>

          <div className="faq-item">
            <h2>Our Promise to You</h2>
            <p>
              At Glow & Glam, we want every visit to feel welcoming and
              enjoyable. We aim to keep the shopping experience simple,
              make product categories easy to explore and help you discover
              beauty essentials that fit your personal routine.
            </p>
          </div>

          <div className="faq-item">
            <h2>Beauty Is About Being Yourself</h2>
            <p>
              You do not need a special occasion to take care of yourself.
              You do not need to follow every trend to feel beautiful.
              Your style, your choices and your confidence make you unique.
            </p>
            <p>
              At Glow & Glam, we celebrate beauty in all its forms.
              Be yourself, enjoy your routine and let your confidence shine.
            </p>
          </div>

          <div className="faq-item">
            <h2>Find Your Glow. Love Your Beauty.</h2>
            <p>
              Thank you for being a part of the Glow & Glam journey.
              Explore our collections, discover your favourites and
              make every day a little more beautiful.
            </p>
            <button className="primary-button" onClick={() => go("Products")}>
              Explore Our Products →
            </button>
          </div>
        </section>
      )}

      {page === "Contact" && (
        <section className="section page-section">
          <div className="form-box">
            <span className="eyebrow">WE'RE HERE TO HELP</span>
            <h1>Contact Us</h1>
            <p>Have a question? Send us a message.</p>
            <form onSubmit={(event) => {
              event.preventDefault();
              alert("Thank you! Your demo message has been submitted.");
            }}>
              <input placeholder="Your Name" required />
              <input type="email" placeholder="Your Email" required />
              <input placeholder="Subject" required />
              <textarea placeholder="Your Message" required />
              <button className="primary-button full-button" type="submit">Send Message</button>
            </form>
          </div>
        </section>
      )}

      {page === "FAQ" && (
        <section className="section page-section text-page">
          <span className="eyebrow">NEED TO KNOW?</span>
          <h1>Frequently Asked Questions</h1>
          <p>
            Find answers to common questions about shopping with Glow & Glam.
            We are here to make your beauty shopping experience simple and enjoyable.
          </p>

          <div className="faq-item">
            <h3>1. What is Glow & Glam?</h3>
            <p>Glow & Glam is an online beauty shopping destination where you can explore makeup, skincare, fragrances, body care and beauty accessories.</p>
          </div>

          <div className="faq-item">
            <h3>2. How can I place an order?</h3>
            <p>Browse our products, select your favourite items, add them to your shopping cart and proceed to checkout. Enter the required details and select a payment method to complete the demo order.</p>
          </div>

          <div className="faq-item">
            <h3>3. Do I need an account to shop?</h3>
            <p>You can explore the products without an account. Creating an account can be useful for a more personalized shopping experience.</p>
          </div>

          <div className="faq-item">
            <h3>4. What types of products are available?</h3>
            <p>We offer makeup, skincare, fragrances, beauty accessories and body care products to suit different beauty routines and preferences.</p>
          </div>

          <div className="faq-item">
            <h3>5. How can I search for a particular product?</h3>
            <p>Visit the Products page and use the search bar to find a product by its name. You can also filter products by category.</p>
          </div>

          <div className="faq-item">
            <h3>6. What payment methods are available?</h3>
            <p>The demonstration checkout displays Cash on Delivery, UPI and Card as sample payment options. These options do not process real payments.</p>
          </div>

          <div className="faq-item">
            <h3>7. How can I check my total order amount?</h3>
            <p>Open your shopping cart to view the selected products, quantities, subtotal, delivery charge and total amount.</p>
          </div>

          <div className="faq-item">
            <h3>8. Can I change the quantity of a product?</h3>
            <p>Yes. Use the plus and minus buttons in your shopping cart to increase or decrease the quantity of an item.</p>
          </div>

          <div className="faq-item">
            <h3>9. Can I remove products from my cart?</h3>
            <p>Yes. Select the Remove option next to a product in your cart to delete it from your current selection.</p>
          </div>

          <div className="faq-item">
            <h3>10. How can I contact customer support?</h3>
            <p>Visit the Contact Us page, enter your name, email address, subject and message, and submit the contact form.</p>
          </div>

          <div className="faq-item">
            <h3>11. Can I cancel or modify an order?</h3>
            <p>For a real shopping service, customers should contact support to request changes or cancellations. This demonstration website does not process real orders.</p>
          </div>

          <div className="faq-item">
            <h3>12. Are the products available for actual purchase?</h3>
            <p>This website is currently a demonstration project. Product details and prices are displayed for demonstration purposes, and checkout does not create a real purchase.</p>
          </div>

          <div className="faq-item">
            <h3>13. What should I do if I forget my password?</h3>
            <p>Select Forgot Password on the Login page and enter your email address to submit a demonstration password reset request.</p>
          </div>

          <div className="faq-item">
            <h3>14. How can I explore different beauty collections?</h3>
            <p>Visit the Products page and select categories such as Makeup, Skincare, Fragrance, Accessories or Body Care.</p>
          </div>

          <div className="faq-item">
            <h3>15. How can I learn more about Glow & Glam?</h3>
            <p>Visit our About page to learn about our story, mission, vision and commitment to celebrating beauty and individuality.</p>
          </div>

          <div className="faq-item">
            <h3>Still have questions?</h3>
            <p>We would love to hear from you. Visit our Contact Us page and send us your questions.</p>
            <button className="primary-button" onClick={() => go("Contact")}>
              Contact Us →
            </button>
          </div>
        </section>
      )}

      {page === "Terms" && (
        <section className="section page-section text-page">
          <span className="eyebrow">PLEASE READ</span>
          <h1>Terms & Conditions</h1>
          <p>
            Welcome to Glow & Glam. By accessing and using this website,
            you agree to follow the terms and conditions described below.
            Please read them carefully before using our website.
          </p>

          <div className="faq-item">
            <h3>1. Acceptance of Terms</h3>
            <p>By visiting or using Glow & Glam, you acknowledge that you have read and understood these terms. If you do not agree with these conditions, please discontinue using the website.</p>
          </div>

          <div className="faq-item">
            <h3>2. Website Purpose</h3>
            <p>Glow & Glam is a demonstration e-commerce website created to showcase an online beauty shopping experience. Its features include product browsing, search, shopping cart and sample checkout.</p>
          </div>

          <div className="faq-item">
            <h3>3. Product Information</h3>
            <p>Product names, descriptions, images and prices are displayed for demonstration purposes. Actual product availability, specifications and prices may differ in a real shopping service.</p>
          </div>

          <div className="faq-item">
            <h3>4. Pricing and Payments</h3>
            <p>Prices displayed on the website are illustrative. Payment methods shown during checkout are sample options only. No real payment is collected through this demonstration website.</p>
          </div>

          <div className="faq-item">
            <h3>5. Orders and Checkout</h3>
            <p>Users can add products to their cart, change quantities and submit the checkout form. These actions demonstrate the ordering process and do not create confirmed real-world orders.</p>
          </div>

          <div className="faq-item">
            <h3>6. Order Cancellation and Changes</h3>
            <p>In an actual e-commerce service, cancellation and modification requests would be subject to the seller's order policies. This demo website does not process real orders or cancellations.</p>
          </div>

          <div className="faq-item">
            <h3>7. User Responsibilities</h3>
            <p>Users are expected to use the website responsibly, provide appropriate information when using forms and avoid activities that could affect the website's operation or other users.</p>
          </div>

          <div className="faq-item">
            <h3>8. Account Information</h3>
            <p>Users should avoid entering real passwords or sensitive personal information into this demonstration website. The login and registration features are provided for demonstration purposes.</p>
          </div>

          <div className="faq-item">
            <h3>9. Intellectual Property</h3>
            <p>Website content, branding, layout, text and design elements are presented as part of the Glow & Glam project. They should not be copied, reproduced or redistributed without appropriate permission from the relevant rights holder.</p>
          </div>

          <div className="faq-item">
            <h3>10. Third-Party Links and Content</h3>
            <p>Some images or other content may be provided by external services. Their availability and use may be governed by the respective providers' terms and policies.</p>
          </div>

          <div className="faq-item">
            <h3>11. Website Availability</h3>
            <p>We aim to provide a smooth browsing experience. However, uninterrupted availability is not guaranteed. Technical issues, maintenance or external service problems may affect website functionality.</p>
          </div>

          <div className="faq-item">
            <h3>12. Limitation of Liability</h3>
            <p>As this is a demonstration project, it does not guarantee actual product delivery, payment processing or customer service transactions. Users should not rely on it to make real purchases.</p>
          </div>

          <div className="faq-item">
            <h3>13. Changes to These Terms</h3>
            <p>These terms may be updated when website features or project requirements change. Users should review this page periodically for the latest version.</p>
          </div>

          <div className="faq-item">
            <h3>14. Contact Information</h3>
            <p>If you have questions about these terms, you can use the Contact Us page to submit your enquiry.</p>
            <button className="primary-button" onClick={() => go("Contact")}>
              Contact Us →
            </button>
          </div>
        </section>
      )}

      {page === "Privacy" && (
        <section className="section page-section text-page">
          <span className="eyebrow">YOUR PRIVACY MATTERS</span>
          <h1>Privacy Policy</h1>
          <p>
            At Glow & Glam, we understand that privacy is important.
            This Privacy Policy explains how information is handled when
            you visit and interact with our demonstration website.
          </p>

          <div className="faq-item">
            <h3>1. Introduction</h3>
            <p>This Privacy Policy describes the general information practices associated with Glow & Glam. Our website is currently a demonstration project and is not connected to a real customer database or payment gateway.</p>
          </div>

          <div className="faq-item">
            <h3>2. Information You Enter</h3>
            <p>The website contains forms that request information such as your name, email address, phone number and delivery address. These fields demonstrate how an online shopping website may collect information during account creation, checkout or contact.</p>
          </div>

          <div className="faq-item">
            <h3>3. How Information Is Used</h3>
            <p>Information entered into the website forms is used to demonstrate the intended website interactions, such as submitting a contact message, displaying a checkout confirmation or demonstrating account-related features.</p>
          </div>

          <div className="faq-item">
            <h3>4. Account Information</h3>
            <p>The Login, Sign Up and Forgot Password pages are demonstration features. They do not provide real account authentication, password storage or password recovery services.</p>
          </div>

          <div className="faq-item">
            <h3>5. Payment Information</h3>
            <p>Glow & Glam does not process real payments. Never enter actual card numbers, banking credentials, UPI PINs or other sensitive financial information into this demonstration website.</p>
          </div>

          <div className="faq-item">
            <h3>6. Shopping Cart Information</h3>
            <p>Products added to the cart and their quantities are managed within the website's current application session. The cart demonstrates how users can select products before checkout.</p>
          </div>

          <div className="faq-item">
            <h3>7. Cookies and Tracking</h3>
            <p>This project does not intentionally implement a customer tracking or advertising system. However, external services used to load website content may have their own privacy and cookie practices.</p>
          </div>

          <div className="faq-item">
            <h3>8. Third-Party Services</h3>
            <p>Some product and banner images are loaded from external image providers. When your browser requests these resources, those providers may receive technical information such as your IP address and browser details according to their own privacy policies.</p>
          </div>

          <div className="faq-item">
            <h3>9. Data Security</h3>
            <p>We encourage users to protect their personal information while browsing online. Since this is a demonstration project, it does not provide the security infrastructure of a production e-commerce platform.</p>
          </div>

          <div className="faq-item">
            <h3>10. Data Sharing</h3>
            <p>This demonstration website does not operate a real customer database or a real order management system. No real customer account or payment processing service is connected to it.</p>
          </div>

          <div className="faq-item">
            <h3>11. Children's Privacy</h3>
            <p>This website is not specifically designed to collect information from children. Users should avoid submitting personal or sensitive information through demonstration forms.</p>
          </div>

          <div className="faq-item">
            <h3>12. Your Privacy Choices</h3>
            <p>You can choose not to enter personal information into the website's forms. You may also stop using the website at any time.</p>
          </div>

          <div className="faq-item">
            <h3>13. Changes to This Privacy Policy</h3>
            <p>This Privacy Policy may be updated when the website's features or functionality change. Any updated version will be displayed on this page.</p>
          </div>

          <div className="faq-item">
            <h3>14. Contact Us About Privacy</h3>
            <p>If you have questions about this Privacy Policy or the website's information practices, please visit our Contact Us page.</p>
            <button className="primary-button" onClick={() => go("Contact")}>
              Contact Us →
            </button>
          </div>

          <p>
            <strong>Important:</strong> Glow & Glam is currently a
            demonstration website. Please do not submit real passwords,
            payment details, banking information or sensitive personal data.
          </p>
        </section>
      )}

      {!hideNavigation && (
        <footer className="footer">
          <div className="footer-main">
            <div className="footer-brand">
              <h2>Glow <span>&</span> Glam</h2>
              <p>Your beauty. Your confidence. Your glow.</p>
            </div>
            <div className="footer-column">
              <h3>Explore</h3>
              <button onClick={() => go("Home")}>Home</button>
              <button onClick={() => go("Products")}>Shop Products</button>
              <button onClick={() => go("About")}>About Us</button>
            </div>
            <div className="footer-column">
              <h3>Help</h3>
              <button onClick={() => go("Contact")}>Contact Us</button>
              <button onClick={() => go("FAQ")}>FAQs</button>
              <button onClick={() => go("Cart")}>Shopping Cart</button>
            </div>
            <div className="footer-column">
              <h3>Information</h3>
              <button onClick={() => go("Terms")}>Terms & Conditions</button>
              <button onClick={() => go("Privacy")}>Privacy Policy</button>
            </div>
          </div>
          <div className="footer-bottom">
            © 2026 Glow & Glam. All Rights Reserved.
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;