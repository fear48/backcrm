const config = {
  secret: "super",
  database: "mongodb://develop:examplepass@ds055742.mlab.com:55742/backendcrm",
  values: {
    paymentExpiresAt: 1,
    prepaidPercent: 50,
    salePercent: 50
  }
};

export const changeConfig = (field, value) => {
  if (value && config.values[field]) {
    config.values[field] = value
  } else {
    throw Error("Wrong request")
  }
}

export default config
