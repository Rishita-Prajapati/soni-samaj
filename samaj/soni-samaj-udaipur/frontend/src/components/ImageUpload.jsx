import React, { useState } from 'react';

const ImageUpload = ({ onImageSelect, currentImage, label = "Upload Image" }) => {
  const [preview, setPreview] = useState(currentImage || null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (file) => {
    // Validate file type and extension
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/svg+xml', 'image/tiff'];
    const validExtensions = /\.(jpg|jpeg|png|gif|webp|bmp|svg|tiff|tif)$/i;
    
    if (!file) {
      alert('Please select a file');
      return;
    }
    
    if (!validImageTypes.includes(file.type) || !validExtensions.test(file.name)) {
      alert('Please select a valid image file (JPG, JPEG, PNG, GIF, WEBP, BMP, SVG, TIFF)');
      return;
    }
    
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);
    
    // Pass file to parent
    onImageSelect(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeImage = () => {
    setPreview(null);
    onImageSelect(null);
  };

  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
        {label}
      </label>
      
      <div
        style={{
          border: `2px dashed ${dragOver ? '#10b981' : '#e5e7eb'}`,
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'center',
          backgroundColor: dragOver ? '#f0fdf4' : '#fafafa',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById('imageInput').click()}
      >
        {preview ? (
          <div style={{ position: 'relative' }}>
            <img
              src={preview}
              alt="Preview"
              style={{
                maxWidth: '200px',
                maxHeight: '200px',
                borderRadius: '8px',
                objectFit: 'cover'
              }}
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeImage();
              }}
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              ×
            </button>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📷</div>
            <p style={{ margin: '0 0 8px 0', color: '#6b7280' }}>
              Click to upload or drag and drop
            </p>
            <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>
              JPG, JPEG, PNG, GIF, WEBP, BMP, SVG, TIFF up to 5MB
            </p>
          </div>
        )}
      </div>

      <input
        id="imageInput"
        type="file"
        accept=".jpg,.jpeg,.png,.gif,.webp,.bmp,.svg,.tiff,.tif,image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default ImageUpload;