import { exec } from "child_process";
import path from "path";

// Enum for notification type
enum notification_type {
  neutral = "neutral",
  error = "error",
  success = "success",
}

/**
 * Sends a notification to the user.
 *
 * @param {string} message - The message to be displayed in the notification.
 * @param {notification_type} [notification=notification_type.neutral] - The type of the notification.
 */
export const notify = (
  message: string,
  notification: notification_type = notification_type.neutral
): void => {
  const icon_path: string = path.resolve(
    `./assets/icons/notification/${notification}/icon.png`
  );
  exec(
    `notify-send -i "${icon_path}" "ResumeDoc" "${message}"`,
    (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    }
  );
};

/**
 * Sends a success notification to the user.
 *
 * @param {string} message - The message to be displayed in the notification.
 */
export const success = (message: string) =>
  notify(message, notification_type.success);

/**
 * Sends an error notification to the user.
 *
 * @param {string} message - The message to be displayed in the notification.
 */
export const err = (message: string) =>
  notify(message, notification_type.error);
