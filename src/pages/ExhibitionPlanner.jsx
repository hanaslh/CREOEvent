import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaChair, FaTable, FaIdCard, FaQrcode, FaPrint, FaShoppingCart } from 'react-icons/fa';
import './ExhibitionPlanner.css';

const ExhibitionPlanner = () => {
  const navigate = useNavigate();
  const [selectedStand, setSelectedStand] = useState(null);
  const [cart, setCart] = useState([]);

  const standSizes = [
    { id: 1, name: 'Small Stand', size: '3x3m', price: 500, capacity: 2 },
    { id: 2, name: 'Medium Stand', size: '6x3m', price: 900, capacity: 4 },
    { id: 3, name: 'Large Stand', size: '9x3m', price: 1300, capacity: 6 },
    { id: 4, name: 'Premium Stand', size: '12x6m', price: 2500, capacity: 10 }
  ];

  const equipmentItems = [
    { id: 1, name: 'Folding Chair', price: 15, icon: FaChair },
    { id: 2, name: 'Display Table', price: 45, icon: FaTable },
    { id: 3, name: 'Staff Badges', price: 5, icon: FaIdCard },
    { id: 4, name: 'QR Code Scanner', price: 25, icon: FaQrcode },
    { id: 5, name: 'Banner Stand', price: 75, icon: FaPrint },
    { id: 6, name: 'Brochure Rack', price: 35, icon: FaChair }
  ];

  const addToCart = (item) => {
    setCart(prev => [...prev, { ...item, cartId: Date.now() }]);
  };

  const removeFromCart = (cartId) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  return (
    <div className="exhibition-planner-page">
      <header className="planner-header">
        <div className="container">
          <div className="header-content">
            <button onClick={() => navigate('/event-planner')} className="back-btn">
              <FaArrowLeft /> Back to Planner
            </button>
            <h1>Exhibition Stand Planner</h1>
            <div className="cart-info">
              <FaShoppingCart />
              <span>${getTotalPrice()}</span>
              <span className="cart-count">{cart.length}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="planner-workspace">
        <div className="stands-selection">
          <h3>Select Stand Size</h3>
          <div className="stands-grid">
            {standSizes.map(stand => (
              <div
                key={stand.id}
                className={`stand-option ${selectedStand?.id === stand.id ? 'selected' : ''}`}
                onClick={() => setSelectedStand(stand)}
              >
                <div className="stand-size">{stand.size}</div>
                <h4>{stand.name}</h4>
                <p>Capacity: {stand.capacity} people</p>
                <div className="stand-price">${stand.price}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="equipment-selection">
          <h3>Equipment & Services</h3>
          <div className="equipment-grid">
            {equipmentItems.map(item => (
              <div key={item.id} className="equipment-item">
                <div className="equipment-icon">
                  <item.icon />
                </div>
                <div className="equipment-info">
                  <h4>{item.name}</h4>
                  <p>${item.price}</p>
                </div>
                <button onClick={() => addToCart(item)} className="add-btn">
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="cart-section">
          <h3>Your Order</h3>
          <div className="cart-items">
            {selectedStand && (
              <div className="cart-item">
                <div>
                  <h4>{selectedStand.name}</h4>
                  <p>{selectedStand.size}</p>
                </div>
                <div className="item-price">${selectedStand.price}</div>
              </div>
            )}
            
            {cart.map(item => (
              <div key={item.cartId} className="cart-item">
                <div>
                  <h4>{item.name}</h4>
                </div>
                <div className="item-actions">
                  <span className="item-price">${item.price}</span>
                  <button onClick={() => removeFromCart(item.cartId)} className="remove-btn">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="cart-total">
            <strong>Total: ${getTotalPrice() + (selectedStand?.price || 0)}</strong>
          </div>
          
          <button className="checkout-btn" disabled={!selectedStand}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};
export default ExhibitionPlanner;