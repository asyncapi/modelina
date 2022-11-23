import { IndentationTypes } from "../helpers";
import { Preset, Presets, ProcessorOptions } from "../models";
/**
 * The core generator options, regardless of which generator is taken to use, these options will always be present.
 */
export interface CommonOptions<P extends Preset = Preset> {
  /**
   * Which type of indentation settings should the models use
   */
  indentation: {
    type: IndentationTypes;
    size: number;
  };
  /**
   * The default preset is the one always called first. 
   * 
   * Typically this is hardcoded for each renderer, which is the bare minimal rendering.
   */
  defaultPreset?: P;
  /**
   * Custom set of presets that is layered ontop of the default one to progressively add more features to the models.
   */
  presets?: Presets<P>;
  processorOptions?: ProcessorOptions;
}

export const defaultOptions: CommonOptions = {
  indentation: {
    type: IndentationTypes.SPACES,
    size: 2,
  }
};

/**
 * The option for rendering complete models that include dependencies, etc.
 */
export interface CommonCompleteOptions extends CommonOptions { }

export const defaultCommonCompleteOptions: CommonCompleteOptions = {
  ...defaultOptions
};

export interface CommonFileOptions extends CommonCompleteOptions {
  /**
   * Verify that the files is completely written before returning, this can happen if the file system is swamped with write requests. 
   */
  ensureFilesWritten: boolean;
  /**
   * Write the models to a specific output directory. Default to current directory.
   */
  outputDirectory: string
}

export const defaultCommonFileOptions: CommonFileOptions = {
  ...defaultCommonCompleteOptions,
  ensureFilesWritten: false,
  outputDirectory: './'
};