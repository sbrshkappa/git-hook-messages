import * as fs from 'fs';
import { ConfigLoader } from '../config';

// Mock fs module
jest.mock('fs');

describe('ConfigLoader', () => {
  const mockFs = fs as jest.Mocked<typeof fs>;
  const mockCwd = '/mocked/path';
  const jsonPath = `${mockCwd}/.git-messagesrc`;
  const yamlPath = `${mockCwd}/.git-messagesrc.yaml`;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(process, 'cwd').mockReturnValue(mockCwd);
  });

  describe('loadConfig', () => {
    it('should load JSON config file', () => {
      const mockConfig = {
        hooks: {
          preCommit: ['Test message']
        }
      };

      // Simulate .git-messagesrc as the first found config file
      mockFs.existsSync.mockImplementation((file) => file === jsonPath);
      mockFs.readFileSync.mockReturnValue(JSON.stringify(mockConfig));

      const result = ConfigLoader.loadConfig();

      expect(result).toEqual(mockConfig);
      expect(mockFs.existsSync).toHaveBeenCalledWith(jsonPath);
    });

    it('should load YAML config file', () => {
      const mockConfig = {
        hooks: {
          preCommit: ['Test message']
        }
      };

      // Simulate .git-messagesrc.yaml as the first found config file
      mockFs.existsSync.mockImplementation((file) => file === yamlPath);
      mockFs.readFileSync.mockReturnValue(`
hooks:
  preCommit:
    - Test message
      `);

      const result = ConfigLoader.loadConfig();

      expect(result).toEqual(mockConfig);
      expect(mockFs.existsSync).toHaveBeenCalledWith(yamlPath);
    });

    it('should return null when no config file exists', () => {
      mockFs.existsSync.mockReturnValue(false);

      const result = ConfigLoader.loadConfig();

      expect(result).toBeNull();
    });

    it('should handle invalid JSON gracefully', () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue('invalid json');

      const result = ConfigLoader.loadConfig();

      expect(result).toBeNull();
    });
  });

  describe('getHookMessages', () => {
    it('should return messages for a specific hook', () => {
      const mockConfig = {
        hooks: {
          preCommit: ['Message 1', 'Message 2'],
          prePush: ['Push message']
        }
      };

      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(JSON.stringify(mockConfig));

      const messages = ConfigLoader.getHookMessages('preCommit');

      expect(messages).toEqual(['Message 1', 'Message 2']);
    });

    it('should return empty array for non-existent hook', () => {
      const mockConfig = {
        hooks: {
          preCommit: ['Message 1']
        }
      };

      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(JSON.stringify(mockConfig));

      const messages = ConfigLoader.getHookMessages('nonExistent');

      expect(messages).toEqual([]);
    });

    it('should return empty array when no config exists', () => {
      mockFs.existsSync.mockReturnValue(false);

      const messages = ConfigLoader.getHookMessages('preCommit');

      expect(messages).toEqual([]);
    });
  });
}); 