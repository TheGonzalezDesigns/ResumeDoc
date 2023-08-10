import fs from 'fs';
import path from 'path';
import os from 'os';

export class Document {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = this.normalizePath(filePath);
  }

  private normalizePath(filePath: string): string {
      if (filePath.startsWith("~")) {
          filePath = path.join(os.homedir(), filePath.slice(1));
      }
      return path.normalize(filePath);
  }

  public load(): string {
    return fs.readFileSync(this.filePath, 'utf-8');
  }

  public save(content: string): void {
    fs.writeFileSync(this.filePath, content, { encoding: 'utf-8' });
  }
}

