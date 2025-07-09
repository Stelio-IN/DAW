import React, { useState } from 'react';
import { ChevronRight, Info, Bold, Italic, Underline, Strikethrough, Link, Quote, Code, List, MoreHorizontal, Trash2, X } from 'lucide-react';

const ProductDetailPage = () => {
  const [availability, setAvailability] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('duplicate');

  const images = [
    '/api/placeholder/400/600',
    '/api/placeholder/400/600',
    '/api/placeholder/400/600',
    '/api/placeholder/400/600'
  ];

  const formatText = (type) => {
    // Text formatting functionality would go here
    console.log('Format:', type);
  };

  return (
    <div className="product-detail-container">
      {/* Header */}
      <div className="header">
        <div className="breadcrumb">
          <span className="breadcrumb-item">Products</span>
          <ChevronRight className="breadcrumb-arrow" />
          <span className="breadcrumb-item active">Product details</span>
        </div>
        <div className="product-title-section">
          <h1 className="product-title">Tiro track jacket</h1>
          <div className="header-tabs">
            <button 
              className={`tab-btn ${activeTab === 'duplicate' ? 'active' : ''}`}
              onClick={() => setActiveTab('duplicate')}
            >
              📋 Duplicate
            </button>
            <button 
              className={`tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
              onClick={() => setActiveTab('preview')}
            >
              👁 Preview
            </button>
          </div>
        </div>
      </div>

      <div className="content">
        {/* Left Section */}
        <div className="left-section">
          {/* Product Information */}
          <div className="section">
            <h2 className="section-title">Product Information</h2>
            
            <div className="form-group">
              <label className="label">
                Name <Info className="info-icon" />
              </label>
              <input 
                type="text" 
                className="input"
                value="Tiro track jacket"
                readOnly
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="label">SKU</label>
                <input 
                  type="text" 
                  className="input"
                  value="4891710"
                  readOnly
                />
              </div>
              <div className="form-group">
                <label className="label">Weight</label>
                <div className="input-with-unit">
                  <input 
                    type="text" 
                    className="input"
                    value="0.2"
                    readOnly
                  />
                  <select className="unit-select">
                    <option>kg</option>
                  </select>
                </div>
                <p className="help-text">Used to calculate shipping rates at checkout and label prices during fulfillment.</p>
              </div>
            </div>

            <div className="form-group">
              <label className="label">Description (Optional)</label>
              <div className="editor-toolbar">
                <button className="toolbar-btn" onClick={() => formatText('bold')}><Bold size={16} /></button>
                <button className="toolbar-btn" onClick={() => formatText('italic')}><Italic size={16} /></button>
                <button className="toolbar-btn" onClick={() => formatText('underline')}><Underline size={16} /></button>
                <button className="toolbar-btn" onClick={() => formatText('strikethrough')}><Strikethrough size={16} /></button>
                <button className="toolbar-btn" onClick={() => formatText('link')}><Link size={16} /></button>
                <button className="toolbar-btn" onClick={() => formatText('quote')}><Quote size={16} /></button>
                <button className="toolbar-btn" onClick={() => formatText('code')}><Code size={16} /></button>
                <button className="toolbar-btn" onClick={() => formatText('list')}><List size={16} /></button>
              </div>
              <div className="editor-content">
                <p>
                  <span className="highlight">Train hard. Stay dry.</span> This <span className="highlight">soccer jacket</span> is made of soft, 
                  <span className="highlight">sweat-wicking fabric</span> that keeps you moving on the <span className="highlight">practice field</span>. 
                  Stretch panels at the elbows and sides give you a <span className="highlight">full range of motion</span> as you work.
                </p>
                
                <div className="specifications">
                  <h4>Specifications</h4>
                  <ul>
                    <li>Regular fit strikes a balance with a straight silhouette</li>
                    <li>Full zip with stand-up collar</li>
                    <li>Long sleeves with ribbed cuffs</li>
                    <li>100% polyester doubleknit</li>
                    <li>Moisture-absorbing AEROREADY</li>
                    <li>Front zip pockets; Elastic waistband; <span className="highlight">Ribbed hem</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Media Section */}
          <div className="section">
            <div className="media-header">
              <h2 className="section-title">Media</h2>
              <button className="add-media-btn">Add media from URL</button>
            </div>
            
            <div className="media-grid">
              {images.map((img, index) => (
                <div 
                  key={index} 
                  className={`media-item ${selectedImage === index ? 'selected' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={img} alt={`Product image ${index + 1}`} />
                  <div className="media-overlay">
                    <button className="media-btn"><MoreHorizontal size={16} /></button>
                    <button className="media-btn delete"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal for selected image */}
            {selectedImage !== null && (
              <div className="modal-overlay" onClick={() => setSelectedImage(null)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <button className="modal-close" onClick={() => setSelectedImage(null)}>
                    <X size={20} />
                  </button>
                  <div className="modal-actions">
                    <button className="modal-btn delete">Delete</button>
                    <button className="modal-btn discard">Discard</button>
                    <button className="modal-btn save">Save</button>
                  </div>
                  <img src={images[selectedImage]} alt="Product preview" className="modal-image" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="right-section">
          {/* Pricing */}
          <div className="section">
            <h2 className="section-title">Pricing</h2>
            
            <div className="form-group">
              <label className="label">Price</label>
              <div className="price-input">
                <input 
                  type="text" 
                  className="input"
                  value="45.00"
                  readOnly
                />
                <span className="currency">USD</span>
              </div>
            </div>

            <div className="pricing-options">
              <div className="pricing-option">
                <span className="option-dot compare"></span>
                <span className="option-text">Set "Compare-to" price</span>
              </div>
              <div className="pricing-option">
                <span className="option-dot bulk"></span>
                <span className="option-text">Bulk discount pricing</span>
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="section">
            <div className="availability-header">
              <h2 className="section-title">Availability</h2>
              <Info className="info-icon" />
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={availability}
                  onChange={(e) => setAvailability(e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>

          {/* Organization */}
          <div className="section">
            <h2 className="section-title">Organization</h2>
            
            <div className="form-group">
              <label className="label">Vendor</label>
              <input 
                type="text" 
                className="input"
                value="Adidas"
                readOnly
              />
            </div>

            <div className="form-group">
              <label className="label">Category</label>
              <input 
                type="text" 
                className="input"
                value="Clothing"
                readOnly
              />
            </div>

            <div className="form-group">
              <label className="label">Collections</label>
              <div className="collection-tag">
                <span>Summer</span>
                <button className="tag-remove">×</button>
              </div>
              <p className="help-text">Add this product to a collection so it's easy to find in your store.</p>
            </div>

            <div className="form-group">
              <label className="label">Tags</label>
              <input 
                type="text" 
                className="input"
                placeholder="Enter tags here"
              />
            </div>
          </div>

          {/* Customize Button */}
          <button className="customize-btn">
            🎨 Customize
          </button>
        </div>
      </div>

      <style jsx>{`
        .product-detail-container {
          min-height: 100vh;
          background: #f8f9fa;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .header {
          background: white;
          padding: 16px 24px;
          border-bottom: 1px solid #e9ecef;
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
          font-size: 14px;
          color: #6c757d;
        }

        .breadcrumb-item {
          color: #6c757d;
        }

        .breadcrumb-item.active {
          color: #212529;
        }

        .breadcrumb-arrow {
          width: 16px;
          height: 16px;
          margin: 0 8px;
        }

        .product-title-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .product-title {
          font-size: 24px;
          font-weight: 600;
          color: #212529;
          margin: 0;
        }

        .header-tabs {
          display: flex;
          gap: 8px;
        }

        .tab-btn {
          padding: 8px 16px;
          border: 1px solid #dee2e6;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .tab-btn.active {
          background: #e3f2fd;
          border-color: #2196f3;
          color: #1976d2;
        }

        .content {
          display: flex;
          gap: 24px;
          padding: 24px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .left-section {
          flex: 2;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .right-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .section {
          background: white;
          padding: 24px;
          border-radius: 8px;
          border: 1px solid #e9ecef;
        }

        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #212529;
          margin: 0 0 20px 0;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-row {
          display: flex;
          gap: 20px;
        }

        .form-row .form-group {
          flex: 1;
        }

        .label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 500;
          color: #495057;
          margin-bottom: 8px;
        }

        .info-icon {
          width: 16px;
          height: 16px;
          color: #6c757d;
        }

        .input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ced4da;
          border-radius: 6px;
          font-size: 14px;
          background: white;
        }

        .input:focus {
          outline: none;
          border-color: #2196f3;
          box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
        }

        .input-with-unit {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .unit-select {
          padding: 12px;
          border: 1px solid #ced4da;
          border-radius: 6px;
          font-size: 14px;
          background: white;
          min-width: 60px;
        }

        .help-text {
          font-size: 12px;
          color: #6c757d;
          margin-top: 6px;
          margin-bottom: 0;
        }

        .editor-toolbar {
          display: flex;
          gap: 4px;
          padding: 8px;
          border: 1px solid #ced4da;
          border-bottom: none;
          border-radius: 6px 6px 0 0;
          background: #f8f9fa;
        }

        .toolbar-btn {
          padding: 6px 8px;
          border: none;
          background: none;
          border-radius: 4px;
          cursor: pointer;
          color: #495057;
        }

        .toolbar-btn:hover {
          background: #e9ecef;
        }

        .editor-content {
          border: 1px solid #ced4da;
          border-top: none;
          border-radius: 0 0 6px 6px;
          padding: 16px;
          min-height: 200px;
          background: white;
        }

        .highlight {
          color: #2196f3;
        }

        .specifications {
          margin-top: 16px;
        }

        .specifications h4 {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .specifications ul {
          margin: 0;
          padding-left: 20px;
        }

        .specifications li {
          margin-bottom: 4px;
          font-size: 14px;
        }

        .media-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .add-media-btn {
          padding: 8px 16px;
          background: #2196f3;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
        }

        .media-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .media-item {
          position: relative;
          aspect-ratio: 3/4;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          border: 2px solid transparent;
        }

        .media-item.selected {
          border-color: #2196f3;
        }

        .media-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .media-overlay {
          position: absolute;
          top: 8px;
          right: 8px;
          display: flex;
          gap: 4px;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .media-item:hover .media-overlay {
          opacity: 1;
        }

        .media-btn {
          padding: 6px;
          background: rgba(0, 0, 0, 0.6);
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .media-btn.delete {
          background: rgba(220, 53, 69, 0.8);
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          position: relative;
          max-width: 90vw;
          max-height: 90vh;
          background: white;
          border-radius: 8px;
          overflow: hidden;
        }

        .modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          padding: 8px;
          background: rgba(0, 0, 0, 0.6);
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          z-index: 1001;
        }

        .modal-actions {
          position: absolute;
          bottom: 16px;
          right: 16px;
          display: flex;
          gap: 8px;
          z-index: 1001;
        }

        .modal-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .modal-btn.delete {
          background: #dc3545;
          color: white;
        }

        .modal-btn.discard {
          background: #6c757d;
          color: white;
        }

        .modal-btn.save {
          background: #2196f3;
          color: white;
        }

        .modal-image {
          width: 100%;
          height: auto;
          display: block;
        }

        .price-input {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .currency {
          font-size: 14px;
          color: #6c757d;
          font-weight: 500;
        }

        .pricing-options {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 16px;
        }

        .pricing-option {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
        }

        .option-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .option-dot.compare {
          background: #2196f3;
        }

        .option-dot.bulk {
          background: #ff9800;
        }

        .option-text {
          color: #495057;
        }

        .availability-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
        }

        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 44px;
          height: 24px;
          margin-left: auto;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: .4s;
          border-radius: 24px;
        }

        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }

        input:checked + .toggle-slider {
          background-color: #2196f3;
        }

        input:checked + .toggle-slider:before {
          transform: translateX(20px);
        }

        .collection-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: #e3f2fd;
          border: 1px solid #2196f3;
          border-radius: 16px;
          font-size: 14px;
          color: #1976d2;
          margin-bottom: 8px;
        }

        .tag-remove {
          background: none;
          border: none;
          color: #1976d2;
          cursor: pointer;
          font-size: 16px;
          padding: 0;
        }

        .customize-btn {
          padding: 12px 24px;
          background: #2c3e50;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
          justify-content: center;
        }

        .customize-btn:hover {
          background: #34495e;
        }

        @media (max-width: 768px) {
          .content {
            flex-direction: column;
            padding: 16px;
          }

          .form-row {
            flex-direction: column;
          }

          .product-title-section {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .media-grid {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          }
        }
      `}</style>
    </div>
  );
};

export default ProductDetailPage;