import { exec } from "child_process";
import path from "path";

// Enum for notification type
enum NotificationType {
  Neutral = "neutral",
  Error = "error",
  Success = "success",
}

/**
 * Sends a notification to the user.
 *
 * @param {string} message - The message to be displayed in the notification.
 * @param {NotificationType} [notification=NotificationType.Neutral] - The type of the notification.
 */
export const notify = (
  message: string,
  notification: NotificationType = NotificationType.Neutral
): void => {
  const iconPath: string = path.resolve(
    `./assets/icons/notification/${notification}/icon.png`
  );
  console[
    `${
      notification === NotificationType.Error
        ? "error"
        : notification === NotificationType.Success
        ? "info"
        : "log"
    }`
  ](`Notification: ${message}`);

  exec(
    `notify-send -i "${iconPath}" "ResumeDoc" "${message}"`,
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
export const success = (message: string): void => {
  notify(message, NotificationType.Success);
};

/**
 * Sends an error notification to the user.
 *
 * @param {string} message - The message to be displayed in the notification.
 */
export const err = (message: string): void => {
  notify(message, NotificationType.Error);
};
