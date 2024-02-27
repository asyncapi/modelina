import ModelinaCommand from '../../base';
export default class Models extends ModelinaCommand {
    static description: string;
    static args: ({
        name: string;
        description: string;
        options: string[];
        required: boolean;
    } | {
        name: string;
        description: string;
        required: boolean;
        options?: undefined;
    })[];
    static flags: {
        help: import("@oclif/core/lib/interfaces").BooleanFlag<void>;
        output: import("@oclif/core/lib/interfaces").OptionFlag<string | undefined>;
        /**
         * TypeScript specific options
         */
        tsModelType: import("@oclif/core/lib/interfaces").OptionFlag<string>;
        tsEnumType: import("@oclif/core/lib/interfaces").OptionFlag<string>;
        tsModuleSystem: import("@oclif/core/lib/interfaces").OptionFlag<string>;
        tsIncludeComments: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
        tsExportType: import("@oclif/core/lib/interfaces").OptionFlag<string>;
        tsJsonBinPack: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
        tsMarshalling: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
        tsExampleInstance: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
        /**
         * Go and Java specific package name to use for the generated models
         */
        packageName: import("@oclif/core/lib/interfaces").OptionFlag<string | undefined>;
        /**
         * Java specific options
         */
        javaIncludeComments: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
        javaJackson: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
        javaConstraints: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
        /**
         * C++ and C# and PHP specific namespace to use for the generated models
         */
        namespace: import("@oclif/core/lib/interfaces").OptionFlag<string | undefined>;
        /**
         * C# specific options
         */
        csharpAutoImplement: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
        csharpNewtonsoft: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
        csharpArrayType: import("@oclif/core/lib/interfaces").OptionFlag<string>;
        csharpHashcode: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
        csharpEqual: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
        csharpSystemJson: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
    };
    run(): Promise<void>;
}
