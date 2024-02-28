import { expect, test } from '@oclif/test';

describe('config', () => {
  describe('config:versions', () => {
    test
      .stderr()
      .stdout()
      .command(['config:versions'])
      .it('should show versions of AsyncAPI tools used', (ctx, done) => {
        expect(ctx.stdout).to.contain('@asyncapi/cli/');
        expect(ctx.stdout).to.contain('├@asyncapi/');
        expect(ctx.stdout).to.contain('└@asyncapi/');
        expect(ctx.stderr).to.equal('');
        done();
      });

    test
      .stderr()
      .stdout()
      .command(['config:versions'])
      .it('should show address of repository of AsyncAPI CLI', (ctx, done) => {
        expect(ctx.stdout).to.contain('https://github.com/asyncapi/cli');
        expect(ctx.stderr).to.equal('');
        done();
      });
  });
});
