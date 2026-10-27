import { expect } from 'chai';
import { buildGoGenerator, GoOclifFlags } from '../../src/helpers/go';

describe('Go CLI helper', () => {
  it('exposes opt-in flags for pointer and date-time mappings', () => {
    expect(GoOclifFlags).to.have.property('goUsePointersForOptionalFields');
    expect(GoOclifFlags).to.have.property('goUseTimeForDateTime');
  });

  it('keeps Go type options disabled when flags are omitted', () => {
    expect(() => buildGoGenerator({ packageName: 'events' })).not.to.throw();
  });

  it('passes Go type options to the file generator', () => {
    const { fileGenerator } = buildGoGenerator({
      packageName: 'events',
      goIncludeComments: false,
      goIncludeTags: false,
      goUsePointersForOptionalFields: true,
      goUseTimeForDateTime: true,
    });

    expect(fileGenerator.options).to.include({
      usePointersForOptionalFields: true,
      useTimeForDateTime: true,
    });
  });
});
