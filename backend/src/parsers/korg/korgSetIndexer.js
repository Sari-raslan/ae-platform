import fs from 'fs';
import path from 'path';

/**
 * Deep Korg SET File Indexer
 * Provides Korg file classification, buffer extraction, and deep indexing
 */

export class KorgSetIndexer {
  constructor(options = {}) {
    this.options = {
      maxBufferSize: options.maxBufferSize || 1024 * 1024 * 10, // 10MB
      debug: options.debug || false,
      ...options
    };
    this.index = {
      files: [],
      metadata: {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        totalFiles: 0,
        totalSize: 0
      },
      statistics: {
        byType: {},
        byExtension: {}
      }
    };
  }

  /**
   * Classifies Korg files by type and structure
   */
  classifyFile(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const fileName = path.basename(filePath);
    const stat = fs.statSync(filePath);

    const classification = {
      path: filePath,
      name: fileName,
      extension: ext,
      size: stat.size,
      isDirectory: stat.isDirectory(),
      modified: stat.mtime.toISOString(),
      type: this._determineFileType(filePath, ext, fileName),
      isKorgFormat: this._isKorgFormat(filePath),
      buffer: null
    };

    return classification;
  }

  /**
   * Determines file type based on extension and content signature
   */
  _determineFileType(filePath, ext, fileName) {
    const typeMap = {
      '.SET': 'Korg SET',
      '.BIN': 'Binary',
      '.SYX': 'MIDI SysEx',
      '.MID': 'MIDI File',
      '.WAV': 'Audio',
      '.JSON': 'JSON Metadata',
      '.TXT': 'Text',
      '.CSV': 'CSV Data'
    };

    if (typeMap[ext]) {
      return typeMap[ext];
    }

    // Check for Korg signature in filename
    if (fileName.includes('SAR') || fileName.includes('SET')) {
      return 'Korg Format';
    }

    return 'Unknown';
  }

  /**
   * Verifies if file matches Korg format
   */
  _isKorgFormat(filePath) {
    try {
      const buffer = fs.readFileSync(filePath, { flag: 'r' });
      // Check for Korg header signatures
      const hexStart = buffer.slice(0, 4).toString('hex');
      
      // Korg SET files often start with specific magic bytes
      // This is a placeholder for actual Korg format detection
      return buffer.length > 0 && !isNullBuffer(buffer);
    } catch (e) {
      if (this.options.debug) {
        console.error(`Error reading file for Korg format check: ${filePath}`, e.message);
      }
      return false;
    }
  }

  /**
   * Extracts buffer data from file with size constraints
   */
  extractBuffer(filePath, maxSize = null) {
    try {
      const stat = fs.statSync(filePath);
      const sizeToRead = Math.min(stat.size, maxSize || this.options.maxBufferSize);
      
      const buffer = fs.readFileSync(filePath);
      
      const extraction = {
        success: true,
        filePath,
        size: stat.size,
        extracted: buffer.length,
        buffer: buffer,
        bufferPreview: buffer.slice(0, 256).toString('hex'),
        checksum: this._calculateChecksum(buffer),
        timestamp: new Date().toISOString()
      };

      return extraction;
    } catch (e) {
      if (this.options.debug) {
        console.error(`Error extracting buffer from ${filePath}:`, e.message);
      }
      return {
        success: false,
        filePath,
        error: e.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Deep indexing of Korg SET files
   */
  async indexDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) {
      throw new Error(`Directory not found: ${dirPath}`);
    }

    const stats = fs.statSync(dirPath);
    if (!stats.isDirectory()) {
      throw new Error(`Path is not a directory: ${dirPath}`);
    }

    this.index.metadata.sourceDirectory = dirPath;
    this.index.metadata.scanStarted = new Date().toISOString();

    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        await this._indexSubdirectory(fullPath);
      } else {
        this._indexFile(fullPath);
      }
    }

    this.index.metadata.scanCompleted = new Date().toISOString();
    this._updateStatistics();

    return this.index;
  }

  /**
   * Recursively indexes subdirectories
   */
  async _indexSubdirectory(dirPath) {
    try {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
          await this._indexSubdirectory(fullPath);
        } else {
          this._indexFile(fullPath);
        }
      }
    } catch (e) {
      if (this.options.debug) {
        console.error(`Error indexing subdirectory ${dirPath}:`, e.message);
      }
    }
  }

  /**
   * Indexes individual file
   */
  _indexFile(filePath) {
    try {
      const classification = this.classifyFile(filePath);
      
      // Extract buffer for Korg files
      if (classification.isKorgFormat) {
        const extraction = this.extractBuffer(filePath);
        classification.buffer = extraction.success ? {
          size: extraction.extracted,
          preview: extraction.bufferPreview,
          checksum: extraction.checksum
        } : null;
      }

      this.index.files.push(classification);
      this.index.metadata.totalSize += classification.size;
      this.index.metadata.totalFiles++;

    } catch (e) {
      if (this.options.debug) {
        console.error(`Error indexing file ${filePath}:`, e.message);
      }
    }
  }

  /**
   * Calculates simple checksum for buffer
   */
  _calculateChecksum(buffer) {
    let sum = 0;
    for (let i = 0; i < buffer.length; i++) {
      sum = (sum + buffer[i]) & 0xFFFFFFFF;
    }
    return sum.toString(16);
  }

  /**
   * Updates statistics in index
   */
  _updateStatistics() {
    this.index.files.forEach(file => {
      const ext = file.extension || 'unknown';
      const type = file.type || 'unknown';

      this.index.statistics.byExtension[ext] = (this.index.statistics.byExtension[ext] || 0) + 1;
      this.index.statistics.byType[type] = (this.index.statistics.byType[type] || 0) + 1;
    });
  }

  /**
   * Returns the current index
   */
  getIndex() {
    return this.index;
  }

  /**
   * Exports index to JSON
   */
  toJSON() {
    return JSON.stringify(this.index, null, 2);
  }

  /**
   * Exports index to file
   */
  async exportToFile(outputPath) {
    try {
      const jsonData = this.toJSON();
      fs.writeFileSync(outputPath, jsonData, 'utf-8');
      return {
        success: true,
        path: outputPath,
        size: jsonData.length,
        timestamp: new Date().toISOString()
      };
    } catch (e) {
      return {
        success: false,
        error: e.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

/**
 * Helper function to check if buffer is null/empty
 */
function isNullBuffer(buffer) {
  return buffer.length === 0 || buffer.every(byte => byte === 0);
}

export default KorgSetIndexer;
