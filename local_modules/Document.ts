import fs from 'fs';
import path from 'path';

export class Document {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = this.normalizePath(filePath);
    this.checkIfFileExists();
  }

  private normalizePath(filePath: string): string {
    return path.normalize(filePath);
  }

  private checkIfFileExists(): void {
    if (!fs.existsSync(this.filePath)) {
      throw new Error(`File not found: ${this.filePath}`);
    }
  }

  public readFile(): string {
    return fs.readFileSync(this.filePath, 'utf-8');
  }

  public writeFile(content: string): void {
    fs.writeFileSync(this.filePath, content, { encoding: 'utf-8' });
  }
}

