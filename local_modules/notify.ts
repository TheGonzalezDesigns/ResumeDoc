import { exec } from "child_process";
import path from "path";
import os from "os";

export const notify = (message: string): void => {
  const iconPath = path.join(os.homedir(), "Pictures/ApplicationIcons/icon");
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
