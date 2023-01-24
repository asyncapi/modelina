import { IndentationTypes } from '../../src/helpers';
import { TestRenderer } from '../TestUtils/TestRenderers';

describe('AbstractRenderer', () => {
  let renderer: TestRenderer;
  beforeEach(() => {
    renderer = new TestRenderer();
  });

  test('renderLine function should render string with new line', () => {
    const content = renderer.renderLine('Test');
    expect(content).toEqual('Test\n');
  });

  test('renderBlock function should render multiple lines', () => {
    const content = renderer.renderBlock(['Test1', 'Test2']);
    expect(content).toEqual('Test1\nTest2');
  });

  describe('indent()', () => {
    test('should render text with indentation', () => {
      const content = renderer.indent('Test');
      expect(content).toEqual('  Test');
    });
    test('should render indentation  with options', () => {
      const content = renderer.indent('Test', 4, IndentationTypes.SPACES);
      expect(content).toEqual('    Test');
    });
  });

  describe('runSelfPreset()', () => {
    test('should call correct preset', async () => {
      const presetCallback = jest.fn();
      const tempRenderer = new TestRenderer([
        [
          {
            self: presetCallback as never
          } as never,
          {} as never
        ] as never
      ]);
      await tempRenderer.runSelfPreset();
      expect(presetCallback).toHaveBeenCalled();
    });
    test('should not call incorrect preset', async () => {
      const presetCallback = jest.fn();

      const tempRenderer = new TestRenderer([
        [
          {
            none_self: presetCallback as never
          } as never,
          {} as never
        ] as never
      ]);
      await tempRenderer.runSelfPreset();
      expect(presetCallback).not.toHaveBeenCalled();
    });
  });
  describe('runAdditionalContentPreset()', () => {
    test('should call correct preset', async () => {
      const presetCallback = jest.fn();
      const tempRenderer = new TestRenderer([
        [
          {
            additionalContent: presetCallback as never
          } as never,
          {} as never
        ] as never
      ]);
      await tempRenderer.runAdditionalContentPreset();
      expect(presetCallback).toHaveBeenCalled();
    });
    test('should not call incorrect preset', async () => {
      const presetCallback = jest.fn();

      const tempRenderer = new TestRenderer([
        [
          {
            none_additionalContent: presetCallback as never
          } as never,
          {} as never
        ] as never
      ]);
      await tempRenderer.runAdditionalContentPreset();
      expect(presetCallback).not.toHaveBeenCalled();
    });
  });

  describe('runPreset()', () => {
    test('should use string', async () => {
      const preset1Callback = jest.fn();
      const tempRenderer = new TestRenderer([
        [
          {
            test: preset1Callback.mockReturnValue('value') as never
          } as never,
          {} as never
        ] as never
      ]);
      const content = await tempRenderer.runPreset('test');
      expect(content).toEqual('value');
      expect(preset1Callback).toHaveBeenCalled();
    });
    test('should not render non-string values', async () => {
      const preset1Callback = jest.fn();
      const tempRenderer = new TestRenderer([
        [
          {
            test: preset1Callback.mockReturnValue(213) as never
          } as never,
          {} as never
        ] as never
      ]);
      const content = await tempRenderer.runPreset('test');
      expect(content).toEqual('');
      expect(preset1Callback).toHaveBeenCalled();
    });
    test('should overwrite previous preset', async () => {
      const preset1Callback = jest.fn();
      const preset2Callback = jest.fn();
      const tempRenderer = new TestRenderer([
        [
          {
            test: preset1Callback.mockReturnValue('value') as never
          } as never,
          {} as never
        ] as never,
        [
          {
            test: preset2Callback.mockReturnValue('value2') as never
          } as never,
          {} as never
        ] as never
      ]);
      const content = await tempRenderer.runPreset('test');
      expect(content).toEqual('value2');
      expect(preset1Callback).toHaveBeenCalled();
      expect(preset2Callback).toHaveBeenCalled();
    });

    test('should not use previous preset if undefined returned', async () => {
      const preset1Callback = jest.fn();
      const preset2Callback = jest.fn();
      const tempRenderer = new TestRenderer([
        [
          {
            test: preset1Callback.mockReturnValue('value') as never
          } as never,
          {} as never
        ] as never,
        [
          {
            test: preset2Callback.mockReturnValue(undefined) as never
          } as never,
          {} as never
        ] as never
      ]);
      const content = await tempRenderer.runPreset('test');
      expect(content).toEqual('');
      expect(preset1Callback).toHaveBeenCalled();
      expect(preset2Callback).toHaveBeenCalled();
    });
    test('should not use previous preset if null returned', async () => {
      const preset1Callback = jest.fn();
      const preset2Callback = jest.fn();
      const tempRenderer = new TestRenderer([
        [
          {
            test: preset1Callback.mockReturnValue('value') as never
          } as never,
          {} as never
        ] as never,
        [
          {
            test: preset2Callback.mockReturnValue(null) as never
          } as never,
          {} as never
        ] as never
      ]);
      const content = await tempRenderer.runPreset('test');
      expect(content).toEqual('');
      expect(preset1Callback).toHaveBeenCalled();
      expect(preset2Callback).toHaveBeenCalled();
    });
    test('should not use previous preset if empty string returned', async () => {
      const preset1Callback = jest.fn();
      const preset2Callback = jest.fn();
      const tempRenderer = new TestRenderer([
        [
          {
            test: preset1Callback.mockReturnValue('value') as never
          } as never,
          {} as never
        ] as never,
        [
          {
            test: preset2Callback.mockReturnValue('') as never
          } as never,
          {} as never
        ] as never
      ]);
      const content = await tempRenderer.runPreset('test');
      expect(content).toEqual('');
      expect(preset1Callback).toHaveBeenCalled();
      expect(preset2Callback).toHaveBeenCalled();
    });
    test('should default to empty string with no presets', async () => {
      const tempRenderer = new TestRenderer([]);
      const content = await tempRenderer.runPreset('test');
      expect(content).toEqual('');
    });
  });
});
