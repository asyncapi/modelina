import { RustRenderer } from '../RustRenderer';
import { PackagePresetType } from '../RustPreset';
import { ConstrainedMetaModel, MetaModel } from '../../../models';
import { RustOptions } from '../RustGenerator';
import { FormatHelpers } from '../../../helpers';
import { defaultModelNameConstraints } from '../constrainer/ModelNameConstrainer';
/**
 * Renderer for Rust's supporting files
 *
 * @extends RustRenderer
 */
export class PackageRenderer extends RustRenderer<ConstrainedMetaModel> {
  public defaultSelf(): string {
    return '';
  }
}

export const RUST_DEFAULT_PACKAGE_PRESET: PackagePresetType<RustOptions> = {
  self({ renderer }) {
    return renderer.defaultSelf();
  },

  lib({ inputModel, renderer, options }) {
    const modelNames: string[] = Object.values(inputModel.models).map(
      (m: MetaModel) => m.name
    );
    const imports = renderer.renderBlock(
      modelNames
        .map((modelName) => {
          let mod = defaultModelNameConstraints()({ modelName, options });
          mod = FormatHelpers.snakeCase(mod);
          return `
pub mod ${mod};
pub use self::${mod}::*;`;
        })
        .flat()
    );

    return `#[macro_use]
extern crate serde;
extern crate serde_json;
${imports}`;
  },

  manifest({ packageOptions }) {
    const {
      packageName,
      packageVersion,
      homepage,
      authors,
      repository,
      description,
      license,
      edition
    } = packageOptions;
    const authorsString = authors.map((a: string) => `"${a}"`).join(',');
    return `[package]
name = "${packageName}"
version = "${packageVersion}"
authors = [${authorsString}]
homepage = "${homepage}"
repository = "${repository}"
license = "${license}"
description = "${description}"
edition = "${edition}"

[dependencies]
serde = { version = "1", features = ["derive"] }
serde_json = { version="1", optional = true }

[dev-dependencies]

[features]
default = ["json"]
json = ["dep:serde_json"]`;
  }
};
