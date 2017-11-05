const config = {
  secret: "super",
  database: "mongodb://develop:examplepass@ds055742.mlab.com:55742/backendcrm",
  refresh_token: "1/kDxLnpCwt6-DCoTJQEoBa-FAXlnfdnQ-G_H510KSU2E",
  client_id: "929440583804-ji2d98at7p118g7u4qdio5fvggs21cqs.apps.googleusercontent.com",
  client_secret: "FRc34LoP2iaisTy3SJ4Ssu2N",
  values: {
    paymentExpiresAt: 1,
    prepaidPercent: 50,
    salePercent: 50,
    access_token: null
  }
};

export const changeConfig = (field, value) => {
  if (value && config.values[field] !== undefined) {
    config.values[field] = value
  } else {
    throw Error("Wrong request")
  }
}

export default config