import {expect, test} from '@oclif/test';

describe('hooks', () => {
  test
    .stdout()
    .hook('command_not_found', {id: 'help'})
    .do(output => expect(output.stdout).to.contain('help command not found.'))
    .it('shows a message');
});

