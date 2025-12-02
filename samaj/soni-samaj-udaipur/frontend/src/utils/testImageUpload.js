// Test image upload functionality
import imageUploadService from '../services/imageUploadService';

export const testImageUpload = async () => {
  try {
    // Create a test file
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(0, 0, 100, 100);
    
    // Convert canvas to blob
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    const testFile = new File([blob], 'test-image.png', { type: 'image/png' });
    
    console.log('Testing image upload with file:', testFile);
    
    // Test upload
    const result = await imageUploadService.uploadImage(testFile, 'profiles', 'test');
    
    console.log('Upload result:', result);
    
    if (result.success) {
      console.log('✅ Image upload test successful!');
      console.log('URL:', result.url);
      return result;
    } else {
      console.error('❌ Image upload test failed:', result.error);
      return null;
    }
  } catch (error) {
    console.error('❌ Image upload test error:', error);
    return null;
  }
};

export default testImageUpload;