import webpush from 'web-push';

// Configure web push
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || 'mailto:admin@grasshoppers.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

export interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: Record<string, any>;
}

export const sendPushNotification = async (
  subscription: PushSubscription,
  payload: PushNotificationPayload
): Promise<boolean> => {
  try {
    if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
      console.warn('Push notifications not configured. Skipping push send.');
      return false;
    }

    const notification = {
      title: payload.title,
      body: payload.body,
      icon: payload.icon || '/logo.png',
      badge: payload.badge || '/badge.png',
      tag: payload.tag || 'notification',
      data: payload.data || {},
    };

    await webpush.sendNotification(subscription, JSON.stringify(notification));
    console.log('Push notification sent successfully');
    return true;
  } catch (error: any) {
    console.error('Error sending push notification:', error.message);
    return false;
  }
};

export const sendBulkPushNotifications = async (
  subscriptions: PushSubscription[],
  payload: PushNotificationPayload
): Promise<{ success: number; failed: number }> => {
  let success = 0;
  let failed = 0;

  await Promise.all(
    subscriptions.map(async (subscription) => {
      const result = await sendPushNotification(subscription, payload);
      if (result) success++;
      else failed++;
    })
  );

  return { success, failed };
};
