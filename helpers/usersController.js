exports.mapDbResponse = (dbData) => {
  return dbData.map(result => ({
    id: result.id,
    name: result.name,
    email: result.email,
    phone: result.phone,
    website: result.website,
    company: {
      name: result.companyName,
      bs: result.companyBs,
      catchPhrase: result.companyCatchPhrase
    }
  }));
};
