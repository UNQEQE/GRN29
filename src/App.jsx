import React, { useState, useEffect } from 'react';
import './App.css';

// Import generated images
import logoDarkImg from './assets/GRN29.png';
import logoLightImg from './assets/GRNBLANCO.png';
import conjunto1 from './assets/Conjunto 1.png';
import conjunto2 from './assets/Conjunto 2.png';
import conjunto3 from './assets/Conjunto 3.png';
import conjunto4 from './assets/Conjunto 4.png';
import conjunto5 from './assets/Conjunto 5.png';
import conjunto6 from './assets/Conjunto 6.png';
import conjunto7 from './assets/Conjunto 7.png';
import fondoImg from './assets/FondoGRN.png';

const initialProducts = [
  {
    id: 5,
    name: 'Conjunto GRN 1',
    category: 'Conjuntos',
    price: '$110.00',
    image: conjunto1,
    description: 'Conjunto No-Gi de compresión premium con diseño ergonómico. Fabricado con tejido ultrarresistente que repele la humedad y costuras planas reforzadas para evitar rozaduras durante el sparring.',
    inStock: true
  },
  {
    id: 6,
    name: 'Conjunto GRN 2',
    category: 'Conjuntos',
    price: '$115.00',
    image: conjunto2,
    description: 'Equipamiento de combate diseñado para alto rendimiento. Los shorts cuentan con banda elástica de silicona antideslizante en la cintura y el rashguard ofrece una compresión graduada excelente.',
    inStock: true
  },
  {
    id: 7,
    name: 'Conjunto GRN 3',
    category: 'Conjuntos',
    price: '$120.00',
    image: conjunto3,
    description: 'Kit de Jiujitsu No-Gi edición especial. Fabricado con licra de grosor medio de alta densidad para mayor durabilidad y shorts con apertura lateral para máxima elasticidad en las guardas.',
    inStock: true
  },
  {
    id: 8,
    name: 'Conjunto GRN 4',
    category: 'Conjuntos',
    price: '$110.00',
    image: conjunto4,
    description: 'Diseño minimalista y funcional. Ideal para entrenamientos diarios intensos. Tejido con tratamiento antibacteriano y secado ultra rápido para mantenerte cómodo en cada rolada.',
    inStock: true
  },
  {
    id: 9,
    name: 'Conjunto GRN 5',
    category: 'Conjuntos',
    price: '$125.00',
    image: conjunto5,
    description: 'Conjunto premium con gráficos sublimados de larga duración que no se agrietan ni se desgastan. Ajuste de compresión de segunda piel para evitar agarres innecesarios del oponente.',
    inStock: true
  },
  {
    id: 10,
    name: 'Conjunto GRN 6',
    category: 'Conjuntos',
    price: '$118.00',
    image: conjunto6,
    description: 'Conjunto No-Gi de competición oficial. Cumple con los estándares de elasticidad y resistencia requeridos para torneos. Costuras triples para garantizar una durabilidad extrema.',
    inStock: true
  },
  {
    id: 11,
    name: 'Conjunto GRN 7',
    category: 'Conjuntos',
    price: '$130.00',
    image: conjunto7,
    description: 'Nuestra armadura de tatami más avanzada. Combina paneles transpirables zonificados con tejido de compresión de alta tensión. Los shorts cuentan con cordón interno ajustable.',
    inStock: true
  }
];

function App() {
  // Persistence States
  const [productList, setProductList] = useState(() => {
    const saved = localStorage.getItem('grn29_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('grn29_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('grn29_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [promoCodes, setPromoCodes] = useState(() => {
    const saved = localStorage.getItem('grn29_promocodes');
    return saved ? JSON.parse(saved) : [];
  });

  // UI States
  const [currentView, _setCurrentView] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash.startsWith('detail-')) return 'detail';
    return hash || 'home';
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [selectedProduct, _setSelectedProduct] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash.startsWith('detail-')) {
      const id = parseInt(hash.replace('detail-', ''));
      const saved = localStorage.getItem('grn29_products');
      const products = saved ? JSON.parse(saved) : initialProducts;
      return products.find(p => p.id === id) || null;
    }
    return null;
  });
  
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('Todos');
  
  // Custom setter that updates URL hash instead of state directly
  const setCurrentView = (view) => {
    window.location.hash = view;
    setIsMobileMenuOpen(false);
  };
  
  const setSelectedProduct = (product) => {
    _setSelectedProduct(product);
  };

  // Registered Users Database State
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = localStorage.getItem('grn29_users');
    return saved ? JSON.parse(saved) : [];
  });

  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState({ text: '', type: '' });

  // Login Form States
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // UI States
  const [toastMessage, setToastMessage] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Admin Dashboard CRUD States
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductDiscountPrice, setNewProductDiscountPrice] = useState('');
  const [newProductDesc, setNewProductDesc] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('Conjuntos');
  const [newProductImage, setNewProductImage] = useState('');
  const [newProductSizes, setNewProductSizes] = useState('');

  // Admin Promo Codes States
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoPercent, setNewPromoPercent] = useState('');
  const [newPromoStart, setNewPromoStart] = useState('');
  const [newPromoEnd, setNewPromoEnd] = useState('');

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('grn29_products', JSON.stringify(productList));
  }, [productList]);

  useEffect(() => {
    localStorage.setItem('grn29_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('grn29_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('grn29_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('grn29_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    localStorage.setItem('grn29_promocodes', JSON.stringify(promoCodes));
  }, [promoCodes]);

  // Hash Routing Listener
  useEffect(() => {
    const handleHashChange = () => {
      window.scrollTo(0, 0);
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('detail-')) {
        const id = parseInt(hash.replace('detail-', ''));
        const product = productList.find(p => p.id === id);
        if (product) {
          _setSelectedProduct(product);
          _setCurrentView('detail');
        } else {
          _setCurrentView('home');
        }
      } else {
        _setCurrentView(hash || 'home');
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    // Execute once to handle direct loads
    handleHashChange();
    
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [productList]);

  // Derived Values
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => {
      const priceStr = item.product.discountPrice || item.product.price;
      const cleanPrice = priceStr.replace('$', '').replace(/\./g, '').replace(/,/g, '');
      const priceNum = parseFloat(cleanPrice) || 0;
      return sum + (priceNum * item.quantity);
    }, 0);
  };

  const calculateDiscount = (subtotal) => {
    if (!appliedPromo) return 0;
    return subtotal * (appliedPromo.discountPercent / 100);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount(subtotal);
    return Math.round(subtotal - discount);
  };

  const formatCLP = (num) => {
    return '$' + Math.round(num).toLocaleString('es-CL');
  };

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoMessage({ text: '', type: '' });
    
    if (!promoInput.trim()) {
      setAppliedPromo(null);
      return;
    }

    const code = promoInput.trim().toUpperCase();
    const promo = promoCodes.find(p => p.code === code);
    
    if (!promo) {
      setPromoMessage({ text: 'Código no válido.', type: 'error' });
      setAppliedPromo(null);
      return;
    }

    if (!promo.isActive) {
      setPromoMessage({ text: 'Este código no está activo.', type: 'error' });
      setAppliedPromo(null);
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    if (today < promo.startDate || today > promo.endDate) {
      setPromoMessage({ text: 'El código ha expirado o no es válido aún.', type: 'error' });
      setAppliedPromo(null);
      return;
    }

    setAppliedPromo(promo);
    setPromoMessage({ text: `¡Código aplicado! (-${promo.discountPercent}%)`, type: 'success' });
  };

  // Actions
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setSelectedSize('M');
    window.location.hash = `detail-${product.id}`;
  };

  const handleAddToCart = (product, size) => {
    if (!product.inStock) return;
    
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(
        item => item.product.id === product.id && item.size === size
      );

      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += 1;
        return newCart;
      } else {
        return [...prevCart, { product, size, quantity: 1 }];
      }
    });

    showToast(`¡Añadido al carrito: ${product.name} (Talla ${size})!`);
  };

  const updateCartQuantity = (productId, size, change) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.product.id === productId && item.size === size) {
          const newQty = item.quantity + change;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const removeFromCart = (productId, size) => {
    setCart(prevCart => prevCart.filter(item => !(item.product.id === productId && item.size === size)));
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    showToast('¡Compra realizada con éxito! Recibirás los detalles en tu correo registrado.');
    setCart([]);
    setCurrentView('home');
  };

  // Login/Register handler
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');

    const email = emailInput.trim();
    const password = passwordInput;

    if (!email || !password) {
      setLoginError('Por favor, completa todos los campos.');
      return;
    }

    if (authMode === 'login') {
      // 1. Check if Admin credentials
      if ((email.toLowerCase() === 'admingrn29' || email.toLowerCase() === 'admingrn29@grn29.com') && password === 'admingrn29#') {
        setCurrentUser({ email: 'admin@grn29.com', role: 'admin' });
        setEmailInput('');
        setPasswordInput('');
        setCurrentView('admin');
        return;
      }

      // 2. Check registered users
      const foundUser = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (foundUser && foundUser.password === password) {
        setCurrentUser({ email: foundUser.email, role: 'customer' });
        setEmailInput('');
        setPasswordInput('');
        setCurrentView('home');
      } else {
        setLoginError('Correo o contraseña incorrectos.');
      }
    } else {
      // Register Mode
      if (!email.includes('@')) {
        setLoginError('Por favor, introduce un correo electrónico válido.');
        return;
      }
      if (password.length < 6) {
        setLoginError('La contraseña debe tener al menos 6 caracteres.');
        return;
      }

      // Check if trying to register admin username
      if (email.toLowerCase() === 'admingrn29' || email.toLowerCase() === 'admingrn29@grn29.com') {
        setLoginError('Este correo no está disponible.');
        return;
      }

      const userExists = registeredUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
      if (userExists) {
        setLoginError('Este correo ya está registrado.');
        return;
      }

      // Register user
      const newUser = { email, password };
      setRegisteredUsers(prev => [...prev, newUser]);
      setCurrentUser({ email, role: 'customer' });
      setEmailInput('');
      setPasswordInput('');
      showToast('¡Registro exitoso! Has iniciado sesión automáticamente.');
      setCurrentView('home');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('home');
  };

  // Image reader for base64 loader
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProductImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Admin Actions
  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!newProductName || !newProductPrice || !newProductDesc || !newProductImage) {
      showToast('Por favor, completa todos los campos (incluyendo la imagen).');
      return;
    }

    const cleanPriceStr = newProductPrice.toString().replace('$', '').replace(/\./g, '').replace(/,/g, '');
    const cleanDiscountStr = newProductDiscountPrice ? newProductDiscountPrice.toString().replace('$', '').replace(/\./g, '').replace(/,/g, '') : '';

    const formattedPrice = `$${parseFloat(cleanPriceStr).toLocaleString('es-CL')}`;
    const formattedDiscount = cleanDiscountStr ? `$${parseFloat(cleanDiscountStr).toLocaleString('es-CL')}` : null;

    if (editingProduct) {
      // Modify
      setProductList(prev => prev.map(p => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            name: newProductName,
            price: formattedPrice,
            discountPrice: formattedDiscount,
            description: newProductDesc,
            category: newProductCategory,
            image: newProductImage,
            sizes: newProductSizes.split(',').map(s => s.trim()).filter(s => s !== '')
          };
        }
        return p;
      }));
      setEditingProduct(null);
    } else {
      // Create new
      const newProduct = {
        id: Date.now(),
        name: newProductName,
        price: formattedPrice,
        discountPrice: formattedDiscount,
        description: newProductDesc,
        category: newProductCategory,
        image: newProductImage,
        sizes: newProductSizes.split(',').map(s => s.trim()).filter(s => s !== ''),
        inStock: true
      };
      setProductList(prev => [...prev, newProduct]);
    }

    // Reset inputs
    setNewProductName('');
    setNewProductPrice('');
    setNewProductDiscountPrice('');
    setNewProductDesc('');
    setNewProductCategory('Conjuntos');
    setNewProductImage('');
    setNewProductSizes('');
    showToast('Producto guardado correctamente.');
  };

  const startEditProduct = (product) => {
    setEditingProduct(product);
    setNewProductName(product.name);
    setNewProductPrice(product.price.replace('$', '').replace(/\./g, ''));
    setNewProductDiscountPrice(product.discountPrice ? product.discountPrice.replace('$', '').replace(/\./g, '') : '');
    setNewProductDesc(product.description);
    setNewProductCategory(product.category);
    setNewProductImage(product.image);
    setNewProductSizes(product.sizes ? product.sizes.join(', ') : '');
  };

  const handleDeleteProduct = (productId) => {
    setConfirmModal({
      message: '¿Seguro que deseas eliminar este producto permanentemente?',
      onConfirm: () => {
        setProductList(prev => prev.filter(p => p.id !== productId));
        setCart(prev => prev.filter(item => item.product.id !== productId));
        if (selectedProduct && selectedProduct.id === productId) {
          setSelectedProduct(null);
          setCurrentView('conjuntos');
        }
        setConfirmModal(null);
      }
    });
  };

  const toggleProductStock = (productId) => {
    setProductList(prev => prev.map(p => {
      if (p.id === productId) {
        return { ...p, inStock: !p.inStock };
      }
      return p;
    }));
  };

  // Admin Promo Codes Actions
  const handleSavePromoCode = (e) => {
    e.preventDefault();
    if (!newPromoCode || !newPromoPercent || !newPromoStart || !newPromoEnd) {
      showToast('Por favor, completa todos los campos del código promocional.');
      return;
    }
    const newPromo = {
      id: Date.now(),
      code: newPromoCode.toUpperCase(),
      discountPercent: parseFloat(newPromoPercent),
      startDate: newPromoStart,
      endDate: newPromoEnd,
      isActive: true
    };
    setPromoCodes(prev => [...prev, newPromo]);
    setNewPromoCode('');
    setNewPromoPercent('');
    setNewPromoStart('');
    setNewPromoEnd('');
    showToast('Código guardado correctamente.');
  };

  const handleDeletePromoCode = (id) => {
    setConfirmModal({
      message: '¿Eliminar este código de descuento?',
      onConfirm: () => {
        setPromoCodes(prev => prev.filter(p => p.id !== id));
        setConfirmModal(null);
      }
    });
  };

  const togglePromoCode = (id) => {
    setPromoCodes(prev => prev.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p));
  };

  return (
    <>
      <nav className="navbar">
        <a onClick={() => setCurrentView('home')} className="logo" style={{ cursor: 'pointer' }}>
          <img src={logoDarkImg} alt="GRN 29 Logo" className="logo-img" />
        </a>

        <div className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <a 
            onClick={() => setCurrentView('home')} 
            className={`nav-link ${currentView === 'home' ? 'active' : ''}`}
          >
            Inicio
          </a>
          <a 
            onClick={() => { setCurrentView('conjuntos'); setSelectedCategoryFilter('Todos'); }} 
            className={`nav-link ${currentView === 'conjuntos' && selectedCategoryFilter === 'Todos' ? 'active' : ''}`}
          >
            Productos
          </a>
          <a 
            onClick={() => { setCurrentView('conjuntos'); setSelectedCategoryFilter('Conjuntos'); }} 
            className={`nav-link ${currentView === 'conjuntos' && selectedCategoryFilter === 'Conjuntos' ? 'active' : ''}`}
          >
            Conjuntos
          </a>
          <a 
            onClick={() => setCurrentView('about')} 
            className={`nav-link ${currentView === 'about' ? 'active' : ''}`}
          >
            Quiénes Somos
          </a>
          {currentUser?.role === 'admin' && (
            <a 
              onClick={() => setCurrentView('admin')} 
              className={`nav-link ${currentView === 'admin' ? 'active' : ''}`}
              style={{ color: 'var(--accent)' }}
            >
              Admin Panel
            </a>
          )}
        </div>
        
        <div className="nav-icons">
          {currentUser ? (
            <div className="user-nav-info">
              <span className="user-email">{currentUser.email}</span>
              <button onClick={handleLogout} className="logout-btn">Salir</button>
            </div>
          ) : (
            <button 
              onClick={() => setCurrentView('login')} 
              className={`login-nav-btn ${currentView === 'login' ? 'active' : ''}`}
            >
              Ingresar
            </button>
          )}

          <button onClick={() => setCurrentView('cart')} className="icon-btn" aria-label="Carrito">
            🛒 {cartCount > 0 && <span className="cart-badge">({cartCount})</span>}
          </button>

          <div className="hamburger-menu" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <span className={`bar ${isMobileMenuOpen ? 'open' : ''}`}></span>
            <span className={`bar ${isMobileMenuOpen ? 'open' : ''}`}></span>
            <span className={`bar ${isMobileMenuOpen ? 'open' : ''}`}></span>
          </div>
        </div>
      </nav>

      <main>
        {/* VIEW: HOME */}
        {currentView === 'home' && (
          <>
            <section className="hero-section">
              <div className="hero-background" style={{ backgroundImage: `url(${fondoImg})` }}></div>
              <div className="hero-content">
                <img src={logoLightImg} alt="GRN 29 Logo" className="hero-logo" />
                <span className="hero-subtitle">Nueva Colección 2026</span>
                <h1 className="hero-title">Domina el Tatami</h1>
                <p className="hero-desc">
                  Descubre nuestra última línea de equipamiento de Jiujitsu Brasileño. Diseñada para resistir, creada para vencer.
                </p>
                <button onClick={() => setCurrentView('conjuntos')} className="primary-btn">Equípate Ahora</button>
              </div>
            </section>

            <section className="products-section">
              <div className="section-header">
                <h2 className="section-title">Destacados</h2>
                <a onClick={() => setCurrentView('conjuntos')} style={{ cursor: 'pointer' }} className="view-all">Ver Todo</a>
              </div>

              <div className="product-grid">
                {productList.slice(0, 6).map((product) => (
                  <div key={product.id} className="product-card" onClick={() => handleProductClick(product)}>
                    <div className="product-image-container">
                      <img src={product.image} alt={product.name} className="product-image" />
                      {!product.inStock && <div className="out-of-stock-overlay">Agotado</div>}
                      {product.discountPrice && <div className="sale-badge">¡OFERTA!</div>}
                      {product.inStock ? (
                        <button className="add-to-cart" onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product, 'M');
                        }}>Añadir al Carrito</button>
                      ) : (
                        <button className="add-to-cart out-of-stock-btn" disabled onClick={(e) => e.stopPropagation()}>
                          Sin Stock
                        </button>
                      )}
                    </div>
                    <div className="product-info">
                      <div className="product-category">{product.category}</div>
                      <h3 className="product-name">{product.name}</h3>
                      <div className="product-price">
                        {product.discountPrice ? (
                          <>
                            <span className="original-price-crossed" style={{ marginRight: '8px' }}>{product.price}</span>
                            <span className="sale-price">{product.discountPrice}</span>
                          </>
                        ) : (
                          product.price
                        )}
                        {!product.inStock && <span className="price-stock-tag" style={{ marginLeft: '8px' }}>(Agotado)</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* VIEW: ABOUT (QUIÉNES SOMOS) */}
        {currentView === 'about' && (
          <section className="about-section">
            <div className="about-container">
              <h1 className="about-title">¿Quiénes Somos? — GRN29 Jiu Jitsu</h1>
              <div className="about-content">
                <p>
                  En <strong>GRN29 Jiu Jitsu</strong> no solo diseñamos indumentaria; vivimos y respiramos cada segundo sobre el tatami. Nacimos en 2025 con una identidad clara y sin concesiones: somos una marca creada por atletas, para atletas.
                </p>
                <p>
                  Entendemos las exigencias del Jiu-Jitsu Brasileño y del NOGI porque compartimos la misma pasión, el desgaste diario, las caídas y la búsqueda constante de la evolución técnica. Por eso, cada una de nuestras prendas (desde nuestros conjuntos y rashguards hasta los shorts de alto rendimiento) está diseñada para resistir el combate más duro, ofrecer máxima movilidad y entregarte la confianza necesaria para dominar el tatami.
                </p>
                <p>
                  Nuestra comunidad se construye desde adentro, respaldada por atletas que llevan nuestra armadura al límite en cada competencia y entrenamiento.
                </p>
                <div className="about-highlight" style={{ marginTop: '3rem', fontSize: '1.2rem' }}>
                  <span>No es solo equipamiento, es la armadura de una nueva generación enfocada en vencer.</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* VIEW: CONJUNTOS */}
        {currentView === 'conjuntos' && (
          <>
            <header className="catalog-header">
              <h1 className="catalog-title">{selectedCategoryFilter === 'Todos' ? 'Nuestros Productos' : `Colección ${selectedCategoryFilter}`}</h1>
              <p className="catalog-subtitle">Explora nuestra colección de indumentaria deportiva</p>
            </header>

            <div className="category-filters" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', margin: '2rem 0', flexWrap: 'wrap' }}>
               {['Todos', 'Conjuntos', 'No-Gi', 'Accesorios', 'Poleras'].map(cat => (
                 <button 
                   key={cat} 
                   onClick={() => setSelectedCategoryFilter(cat)}
                   className={`category-filter-btn ${selectedCategoryFilter === cat ? 'active' : ''}`}
                   style={{ 
                     padding: '0.6rem 1.2rem', 
                     borderRadius: '20px', 
                     border: '1px solid var(--border-color)', 
                     background: selectedCategoryFilter === cat ? 'var(--text-primary)' : 'transparent', 
                     color: selectedCategoryFilter === cat ? 'var(--bg-primary)' : 'var(--text-primary)', 
                     cursor: 'pointer',
                     fontWeight: 'bold',
                     transition: 'all 0.3s ease'
                   }}
                 >
                   {cat}
                 </button>
               ))}
            </div>

            <section className="products-section">
              <div className="product-grid">
                {productList.filter(p => selectedCategoryFilter === 'Todos' || p.category === selectedCategoryFilter).map((product) => (
                  <div key={product.id} className="product-card" onClick={() => handleProductClick(product)}>
                    <div className="product-image-container">
                      <img src={product.image} alt={product.name} className="product-image" />
                      {!product.inStock && <div className="out-of-stock-overlay">Agotado</div>}
                      {product.discountPrice && <div className="sale-badge">¡OFERTA!</div>}
                      {product.inStock ? (
                        <button className="add-to-cart" onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product, 'M');
                        }}>Añadir al Carrito</button>
                      ) : (
                        <button className="add-to-cart out-of-stock-btn" disabled onClick={(e) => e.stopPropagation()}>
                          Sin Stock
                        </button>
                      )}
                    </div>
                    <div className="product-info">
                      <div className="product-category">{product.category}</div>
                      <h3 className="product-name">{product.name}</h3>
                      <div className="product-price">
                        {product.discountPrice ? (
                          <>
                            <span className="original-price-crossed" style={{ marginRight: '8px' }}>{product.price}</span>
                            <span className="sale-price">{product.discountPrice}</span>
                          </>
                        ) : (
                          product.price
                        )}
                        {!product.inStock && <span className="price-stock-tag" style={{ marginLeft: '8px' }}>(Agotado)</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* VIEW: DETAIL */}
        {currentView === 'detail' && selectedProduct && (
          <section className="product-detail-container">
            <button onClick={() => setCurrentView('conjuntos')} className="back-btn">
              ← Volver a Conjuntos
            </button>
            <div className="detail-image-container">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="detail-image" />
              {!selectedProduct.inStock && <div className="out-of-stock-overlay detail-overlay">Agotado</div>}
              {selectedProduct.discountPrice && <div className="sale-badge" style={{ fontSize: '1.2rem', padding: '0.6rem 1.2rem' }}>¡OFERTA!</div>}
            </div>
            <div className="detail-info">
              <span className="detail-category">
                {selectedProduct.category} {!selectedProduct.inStock && <span className="status-badge status-out">Agotado</span>}
              </span>
              <h1 className="detail-name">{selectedProduct.name}</h1>
              <div className="detail-price">
                {selectedProduct.discountPrice ? (
                  <>
                    <span className="original-price-crossed" style={{ marginRight: '15px' }}>{selectedProduct.price}</span>
                    <span className="sale-price">{selectedProduct.discountPrice}</span>
                  </>
                ) : (
                  selectedProduct.price
                )}
              </div>
              <p className="detail-desc">{selectedProduct.description}</p>
              
              <div className="size-selector">
                <span className="size-label">Seleccionar Talla</span>
                <div className="size-options">
                  {(selectedProduct.sizes && selectedProduct.sizes.length > 0 ? selectedProduct.sizes : ['S', 'M', 'L', 'XL']).map(size => (
                    <button 
                      key={size} 
                      onClick={() => selectedProduct.inStock && setSelectedSize(size)}
                      className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                      disabled={!selectedProduct.inStock}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              
              {selectedProduct.inStock ? (
                <button onClick={() => handleAddToCart(selectedProduct, selectedSize)} className="add-to-cart-btn">
                  Añadir al Carrito
                </button>
              ) : (
                <button className="add-to-cart-btn out-of-stock-btn" disabled>
                  Producto Agotado
                </button>
              )}
            </div>
          </section>
        )}

        {/* VIEW: CART */}
        {currentView === 'cart' && (
          <section className="cart-container">
            <h1 className="cart-title">Tu Carrito</h1>
            
            {cart.length === 0 ? (
              <div className="empty-cart-message">
                <p>Tu carrito está vacío.</p>
                <button onClick={() => setCurrentView('conjuntos')} className="primary-btn" style={{ marginTop: '1.5rem' }}>
                  Ir a la tienda
                </button>
              </div>
            ) : (
              <div className="cart-content">
                <div className="cart-items-list">
                  {cart.map((item, idx) => (
                    <div key={`${item.product.id}-${item.size}-${idx}`} className="cart-item-row">
                      <img src={item.product.image} alt={item.product.name} className="cart-item-img" />
                      <div className="cart-item-details">
                        <span className="cart-item-category">{item.product.category}</span>
                        <h3 className="cart-item-name">{item.product.name}</h3>
                        <span className="cart-item-size">Talla: <strong>{item.size}</strong></span>
                      </div>
                      
                      <div className="cart-item-quantity">
                        <button onClick={() => updateCartQuantity(item.product.id, item.size, -1)} className="qty-btn">-</button>
                        <span className="qty-val">{item.quantity}</span>
                        <button onClick={() => updateCartQuantity(item.product.id, item.size, 1)} className="qty-btn">+</button>
                      </div>

                      <div className="cart-item-price">
                        {item.product.discountPrice ? (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                            <span style={{ textDecoration: 'line-through', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{item.product.price}</span>
                            <span style={{ color: 'var(--accent)' }}>{item.product.discountPrice}</span>
                          </div>
                        ) : (
                          item.product.price
                        )}
                      </div>

                      <button onClick={() => removeFromCart(item.product.id, item.size)} className="cart-remove-btn" title="Eliminar del carrito">
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <div className="cart-summary-box">
                  <h3 className="summary-title">Resumen de Compra</h3>
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>{formatCLP(calculateSubtotal())}</span>
                  </div>
                  {appliedPromo && (
                    <div className="summary-row" style={{ color: 'var(--accent)' }}>
                      <span>Descuento ({appliedPromo.code} -{appliedPromo.discountPercent}%)</span>
                      <span>-{formatCLP(calculateDiscount(calculateSubtotal()))}</span>
                    </div>
                  )}
                  <div className="summary-row">
                    <span>Envío</span>
                    <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>Gratis</span>
                  </div>
                  <hr className="summary-divider" />
                  <div className="summary-row total-row">
                    <span>Total</span>
                    <span>{formatCLP(calculateTotal())}</span>
                  </div>

                  <div className="promo-container" style={{ marginTop: '1.5rem' }}>
                    <form onSubmit={handleApplyPromo} style={{ display: 'flex', gap: '0.5rem' }}>
                      <input 
                        type="text" 
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                        placeholder="Código de Descuento"
                        style={{ flex: 1, padding: '0.8rem', border: '1px solid var(--border-color)', borderRadius: '4px' }}
                      />
                      <button type="submit" style={{ padding: '0.8rem 1rem', background: 'var(--text-primary)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Aplicar
                      </button>
                    </form>
                    {promoMessage.text && (
                      <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', fontWeight: 'bold', color: promoMessage.type === 'error' ? 'var(--accent)' : '#2f855a' }}>
                        {promoMessage.text}
                      </p>
                    )}
                  </div>

                  {!currentUser && (
                    <p className="cart-login-warning">
                      * Debes <span onClick={() => setCurrentView('login')} className="warning-link">iniciar sesión</span> para completar tu pedido.
                    </p>
                  )}

                  <button 
                    onClick={handleCheckout} 
                    className="checkout-btn"
                    disabled={cart.length === 0 || !currentUser}
                  >
                    Proceder al Pago
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {/* VIEW: LOGIN */}
        {currentView === 'login' && (
          <section className="login-container">
            <div className="login-box">
              <h2 className="login-title">
                {authMode === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
              </h2>
              
              <form onSubmit={handleLoginSubmit} className="login-form">
                <div className="form-group">
                  <label htmlFor="userEmail">Correo Electrónico / Usuario</label>
                  <input 
                    type="text" 
                    id="userEmail" 
                    placeholder="ejemplo@correo.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="userPassword">Contraseña</label>
                  <input 
                    type="password" 
                    id="userPassword" 
                    placeholder="••••••••"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    required
                  />
                </div>

                {loginError && <p className="login-error-msg">{loginError}</p>}

                <button type="submit" className="login-submit-btn">
                  {authMode === 'login' ? 'Entrar' : 'Registrarse'}
                </button>
              </form>

              <div className="login-toggle">
                {authMode === 'login' ? (
                  <span onClick={() => { setAuthMode('register'); setLoginError(''); setPasswordInput(''); }} className="toggle-link">
                    ¿No tienes cuenta? Regístrate aquí
                  </span>
                ) : (
                  <span onClick={() => { setAuthMode('login'); setLoginError(''); setPasswordInput(''); }} className="toggle-link">
                    ¿Ya tienes cuenta? Inicia sesión aquí
                  </span>
                )}
              </div>
            </div>
          </section>
        )}

        {/* VIEW: ADMIN PANEL */}
        {currentView === 'admin' && currentUser?.role === 'admin' && (
          <section className="admin-container">
            <h1 className="admin-title">Panel de Administración</h1>

            <div className="admin-layout">
              {/* Left Side: Save Form */}
              <div className="admin-card admin-form-card">
                <h2>{editingProduct ? 'Modificar Producto' : 'Agregar Nuevo Producto'}</h2>
                
                <form onSubmit={handleSaveProduct} className="admin-form">
                  <div className="form-group">
                    <label>Nombre del Producto</label>
                    <input 
                      type="text" 
                      value={newProductName}
                      onChange={(e) => setNewProductName(e.target.value)}
                      placeholder="Ej. Conjunto GRN 8"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Precio (CLP)</label>
                      <input 
                        type="number" 
                        step="1"
                        value={newProductPrice}
                        onChange={(e) => setNewProductPrice(e.target.value)}
                        placeholder="Ej. 45000"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Precio Oferta (CLP)</label>
                      <input 
                        type="number" 
                        step="1"
                        value={newProductDiscountPrice}
                        onChange={(e) => setNewProductDiscountPrice(e.target.value)}
                        placeholder="Opcional. Ej. 35000"
                      />
                    </div>

                    <div className="form-group">
                      <label>Categoría</label>
                      <select 
                        value={newProductCategory}
                        onChange={(e) => setNewProductCategory(e.target.value)}
                      >
                        <option value="Conjuntos">Conjuntos</option>
                        <option value="No-Gi">No-Gi</option>
                        <option value="Accesorios">Accesorios</option>
                        <option value="Poleras">Poleras</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Descripción</label>
                    <textarea 
                      value={newProductDesc}
                      onChange={(e) => setNewProductDesc(e.target.value)}
                      placeholder="Detalles sobre costuras, compresión, materiales, etc."
                      rows="4"
                      required
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label>Tallas (separadas por coma)</label>
                    <input 
                      type="text" 
                      value={newProductSizes}
                      onChange={(e) => setNewProductSizes(e.target.value)}
                      placeholder="Ej. S, M, L, XL"
                    />
                  </div>

                  <div className="form-group">
                    <label>Imagen del Producto</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    {newProductImage && (
                      <div className="image-preview-box">
                        <span>Previsualización:</span>
                        <img src={newProductImage} alt="Preview" className="uploaded-preview" />
                      </div>
                    )}
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="save-product-btn">
                      {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
                    </button>
                    {editingProduct && (
                      <button 
                        type="button" 
                        onClick={() => {
                          setEditingProduct(null);
                          setNewProductName('');
                          setNewProductPrice('');
                          setNewProductDiscountPrice('');
                          setNewProductDesc('');
                          setNewProductCategory('Conjuntos');
                          setNewProductImage('');
                          setNewProductSizes('');
                        }} 
                        className="cancel-edit-btn"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Right Side: Product Inventory */}
              <div className="admin-card admin-inventory-card">
                <h2>Inventario General ({productList.length} Productos)</h2>

                <div className="inventory-list">
                  {productList.map(product => (
                    <div key={product.id} className="inventory-row">
                      <img src={product.image} alt={product.name} className="inventory-img" />
                      
                      <div className="inventory-info">
                        <h3>{product.name}</h3>
                        <span className="inventory-meta">
                          {product.category} | {product.price}
                          {product.sizes && product.sizes.length > 0 ? ` | Tallas: ${product.sizes.join(', ')}` : ''}
                        </span>
                        <div className="stock-toggle-box">
                          <span className={`stock-status-text ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                            {product.inStock ? '✓ Disponible' : '✕ Agotado'}
                          </span>
                          <button 
                            type="button" 
                            onClick={() => toggleProductStock(product.id)}
                            className={`toggle-stock-btn ${product.inStock ? 'btn-out' : 'btn-in'}`}
                          >
                            {product.inStock ? 'Marcar Agotado' : 'Habilitar Stock'}
                          </button>
                        </div>
                      </div>

                      <div className="inventory-actions">
                        <button onClick={() => startEditProduct(product)} className="inv-btn edit-btn" title="Editar">✏️</button>
                        <button onClick={() => handleDeleteProduct(product.id)} className="inv-btn delete-btn" title="Eliminar">🗑️</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Promo Codes Management */}
            <h2 className="admin-title" style={{ marginTop: '4rem', fontSize: '2rem' }}>Códigos de Descuento</h2>
            <div className="admin-layout">
              {/* Promo Form */}
              <div className="admin-card admin-form-card">
                <h2>Crear Código</h2>
                <form onSubmit={handleSavePromoCode} className="admin-form">
                  <div className="form-group">
                    <label>Código (ej. VERANO26)</label>
                    <input 
                      type="text" 
                      value={newPromoCode}
                      onChange={(e) => setNewPromoCode(e.target.value.toUpperCase())}
                      placeholder="VERANO26"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Descuento (%)</label>
                    <input 
                      type="number" 
                      min="1"
                      max="100"
                      value={newPromoPercent}
                      onChange={(e) => setNewPromoPercent(e.target.value)}
                      placeholder="20"
                      required
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Fecha de Inicio</label>
                      <input 
                        type="date" 
                        value={newPromoStart}
                        onChange={(e) => setNewPromoStart(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Fecha de Fin</label>
                      <input 
                        type="date" 
                        value={newPromoEnd}
                        onChange={(e) => setNewPromoEnd(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="save-product-btn">
                      Crear Código
                    </button>
                  </div>
                </form>
              </div>

              {/* Promo List */}
              <div className="admin-card admin-inventory-card">
                <h2>Códigos Activos ({promoCodes.length})</h2>
                <div className="inventory-list">
                  {promoCodes.map(promo => (
                    <div key={promo.id} className="inventory-row" style={{ gridTemplateColumns: '1fr 100px' }}>
                      <div className="inventory-info">
                        <h3>{promo.code} <span style={{ color: 'var(--accent)', fontSize: '0.9rem' }}>(-{promo.discountPercent}%)</span></h3>
                        <span className="inventory-meta">Válido: {promo.startDate} al {promo.endDate}</span>
                        <div className="stock-toggle-box">
                          <span className={`stock-status-text ${promo.isActive ? 'in-stock' : 'out-of-stock'}`}>
                            {promo.isActive ? '✓ Activo' : '✕ Inactivo'}
                          </span>
                          <button 
                            type="button" 
                            onClick={() => togglePromoCode(promo.id)}
                            className={`toggle-stock-btn ${promo.isActive ? 'btn-out' : 'btn-in'}`}
                          >
                            {promo.isActive ? 'Desactivar' : 'Activar'}
                          </button>
                        </div>
                      </div>
                      <div className="inventory-actions">
                        <button onClick={() => handleDeletePromoCode(promo.id)} className="inv-btn delete-btn" title="Eliminar">🗑️</button>
                      </div>
                    </div>
                  ))}
                  {promoCodes.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>No hay códigos de descuento.</p>}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        <a onClick={() => setCurrentView('home')} className="logo" style={{ cursor: 'pointer' }}>
          <img src={logoDarkImg} alt="GRN 29 Logo" className="logo-img" />
        </a>
        <div className="footer-text">© 2026 GRN·29 Jiujitsu. Todos los derechos reservados.</div>
        <div className="nav-links">
          <a onClick={() => setCurrentView('about')} className="nav-link" style={{ cursor: 'pointer' }}>Quiénes Somos</a>
          <a className="nav-link" href="https://www.instagram.com/grn29_jiujitsu/" target="_blank" rel="noreferrer">Instagram</a>
        </div>
      </footer>


      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="toast-notification">
          {toastMessage}
        </div>
      )}

      {/* CONFIRM MODAL */}
      {confirmModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirmación</h3>
            <p>{confirmModal.message}</p>
            <div className="modal-actions">
              <button onClick={() => setConfirmModal(null)} className="btn-cancel">Cancelar</button>
              <button onClick={confirmModal.onConfirm} className="btn-confirm">Aceptar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
