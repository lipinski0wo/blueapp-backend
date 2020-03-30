const { mapDbResponse } = require('./mapDbResponse');

describe('mapDbResponse', () => {
  it('should correctly map data', async () => {
    const rawDbData = {
      id: 'id',
      name: 'name',
      email: 'email',
      phone: 'phone',
      website: 'website',
      companyName: 'name',
      companyBs: 'bs',
      companyCatchPhrase: 'catch phrase'
    };
    const result = mapDbResponse([rawDbData]);
    expect(result).toEqual([{
      company: { bs: 'bs', catchPhrase: 'catch phrase', name: 'name' },
      email: 'email',
      id: 'id',
      name: 'name',
      phone: 'phone',
      website: 'website'
    }]);
  });
});
