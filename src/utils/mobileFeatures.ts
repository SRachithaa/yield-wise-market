import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';

// Camera functionality for soil/crop photos
export const takeCropPhoto = async () => {
  if (!Capacitor.isNativePlatform()) {
    console.log('Camera demo mode - would open camera on mobile device');
    // Return a demo response for web testing
    return 'demo-photo-path.jpg';
  }

  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
    });

    return image.webPath;
  } catch (error) {
    console.error('Error taking photo:', error);
    return null;
  }
};

// GPS functionality for farm location and logistics
export const getCurrentLocation = async () => {
  if (!Capacitor.isNativePlatform()) {
    console.log('GPS demo mode - would get real location on mobile device');
    // Return demo coordinates for web testing (Bangalore, India - farming region)
    return {
      latitude: 12.9716,
      longitude: 77.5946,
      accuracy: 10
    };
  }

  try {
    const coordinates = await Geolocation.getCurrentPosition();
    return {
      latitude: coordinates.coords.latitude,
      longitude: coordinates.coords.longitude,
      accuracy: coordinates.coords.accuracy,
    };
  } catch (error) {
    console.error('Error getting location:', error);
    return null;
  }
};

// Push notifications for price alerts and updates
export const initializePushNotifications = async () => {
  if (!Capacitor.isNativePlatform()) {
    console.log('Push notifications demo mode - would enable real notifications on mobile device');
    return;
  }

  try {
    // Request permission
    const permission = await PushNotifications.requestPermissions();
    
    if (permission.receive === 'granted') {
      // Register for push notifications
      await PushNotifications.register();

      // Listen for registration
      PushNotifications.addListener('registration', (token) => {
        console.log('Push registration success, token: ' + token.value);
        // Send token to your server for targeted notifications
      });

      // Listen for push notifications
      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Push received: ', notification);
        // Handle received notification (price alerts, weather warnings, etc.)
      });

      // Handle notification tap
      PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        console.log('Push action performed: ', notification);
        // Navigate to relevant screen (marketplace, weather, etc.)
      });
    }
  } catch (error) {
    console.error('Error initializing push notifications:', error);
  }
};

// Send price alert notification
export const sendPriceAlert = (cropName: string, price: number, change: number) => {
  if (Capacitor.isNativePlatform()) {
    // This would typically be handled by your backend
    console.log(`Price Alert: ${cropName} is now ₹${price}/kg (${change > 0 ? '+' : ''}${change}%)`);
  }
};

// Send weather warning
export const sendWeatherWarning = (warning: string, location: string) => {
  if (Capacitor.isNativePlatform()) {
    console.log(`Weather Warning for ${location}: ${warning}`);
  }
};