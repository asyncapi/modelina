import { AvroSchemaParser } from '@asyncapi/avro-schema-parser';
import { OpenAPISchemaParser } from '@asyncapi/openapi-schema-parser';
import { Parser, convertToOldAPI } from '@asyncapi/parser/cjs';
import { RamlDTSchemaParser } from '@asyncapi/raml-dt-schema-parser';
import { Flags } from '@oclif/core';
import { ProtoBuffSchemaParser } from '@asyncapi/protobuf-schema-parser';
import { getDiagnosticSeverity } from '@stoplight/spectral-core';
import { OutputFormat } from '@stoplight/spectral-cli/dist/services/config';
import { html, json, junit, pretty, stylish, teamcity, text } from '@stoplight/spectral-formatters';

import type { Diagnostic } from '@asyncapi/parser/cjs';
import type Command from './base';
import type { Specification } from './models/SpecificationFile';

export type SeveritytKind = 'error' | 'warn' | 'info' | 'hint';

export { convertToOldAPI };

const parser = new Parser({
  __unstable: {
    resolver: {
      cache: false,
    }
  }
});

parser.registerSchemaParser(AvroSchemaParser());
parser.registerSchemaParser(OpenAPISchemaParser());
parser.registerSchemaParser(RamlDTSchemaParser());
parser.registerSchemaParser(ProtoBuffSchemaParser());

export interface ValidationFlagsOptions {
  logDiagnostics?: boolean;
}

export function validationFlags({ logDiagnostics = true }: ValidationFlagsOptions = {}) {
  return {
    'log-diagnostics': Flags.boolean({
      description: 'log validation diagnostics or not',
      default: logDiagnostics,
      allowNo: true,
    }),
    'diagnostics-format': Flags.enum({
      description: 'format to use for validation diagnostics',
      options: Object.values(OutputFormat),
      default: OutputFormat.STYLISH,
    }),
    'fail-severity': Flags.enum<SeveritytKind>({
      description: 'diagnostics of this level or above will trigger a failure exit code',
      options: ['error', 'warn', 'info', 'hint'],
      default: 'error',
    }),
  };
}

interface ValidateOptions {
  'log-diagnostics'?: boolean;
  'diagnostics-format'?: `${OutputFormat}`;
  'fail-severity'?: SeveritytKind;
}

export async function validate(command: Command, specFile: Specification, options: ValidateOptions = {}) {
  const diagnostics = await parser.validate(specFile.text(), { source: specFile.getSource() });
  return logDiagnostics(diagnostics, command, specFile, options);
}

export async function parse(command: Command, specFile: Specification, options: ValidateOptions = {}) {
  const { document, diagnostics } = await parser.parse(specFile.text(), { source: specFile.getSource() });
  const status = logDiagnostics(diagnostics, command, specFile, options);
  return { document, diagnostics, status };
}

function logDiagnostics(diagnostics: Diagnostic[], command: Command, specFile: Specification, options: ValidateOptions = {}): 'valid' | 'invalid' {
  const logDiagnostics = options['log-diagnostics'];
  const failSeverity = options['fail-severity'] ?? 'error';
  const diagnosticsFormat = options['diagnostics-format'] ?? 'stylish';

  const sourceString = specFile.toSourceString();
  if (diagnostics.length) {
    if (hasFailSeverity(diagnostics, failSeverity)) {
      if (logDiagnostics) {
        command.logToStderr(`\n${sourceString} and/or referenced documents have governance issues.`);
        command.logToStderr(formatOutput(diagnostics, diagnosticsFormat, failSeverity));
      }
      return 'invalid';
    }

    if (logDiagnostics) {
      command.log(`\n${sourceString} is valid but has (itself and/or referenced documents) governance issues.`);
      command.log(formatOutput(diagnostics, diagnosticsFormat, failSeverity));
    }
  } else if (logDiagnostics) {
    command.log(`\n${sourceString} is valid! ${sourceString} and referenced documents don't have governance issues.`);
  }

  return 'valid';
}

export function formatOutput(diagnostics: Diagnostic[], format: `${OutputFormat}`, failSeverity: SeveritytKind) {
  const options = { failSeverity: getDiagnosticSeverity(failSeverity) };
  switch (format) {
  case 'stylish': return stylish(diagnostics, options);
  case 'json': return json(diagnostics, options);
  case 'junit': return junit(diagnostics, options);
  case 'html': return html(diagnostics, options);
  case 'text': return text(diagnostics, options);
  case 'teamcity': return teamcity(diagnostics, options);
  case 'pretty': return pretty(diagnostics, options);
  default: return stylish(diagnostics, options);
  }
}

function hasFailSeverity(diagnostics: Diagnostic[], failSeverity: SeveritytKind) {
  const diagnosticSeverity = getDiagnosticSeverity(failSeverity);
  return diagnostics.some(diagnostic => diagnostic.severity <= diagnosticSeverity);
}
