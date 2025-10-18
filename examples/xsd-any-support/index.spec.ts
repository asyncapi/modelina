import { generate } from './index';

describe('XSD xs:any support example', () => {
  it('should generate TypeScript models with any types for xs:any elements', async () => {
    // Capture console output
    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (...args: any[]) => {
      logs.push(args.join(' '));
    };

    await generate();

    // Restore console.log
    console.log = originalLog;

    const output = logs.join('\n');
    
    // Check that models were generated
    expect(output).toContain('export class FlexibleType');
    expect(output).toContain('export class TypeWithRequiredAny');
    expect(output).toContain('export class TypeWithChoiceAny');
    
    // Check that xs:any is mapped to any type
    expect(output).toContain('any');
    
    // Snapshot test for full output
    expect(output).toMatchSnapshot();
  });
});

