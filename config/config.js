const config = {
  secret: "super",
  database: "mongodb://genuris:200000@ds147534.mlab.com:47534/obs",
  refresh_token: "1/HUPvBNYfId9fOhXzIcIktkd50OYxm2gK9N6Yuq7WqAY",
  client_id: "1060645180748-vtske2lgdjkfpjkrq5qv5b7m0uq48ts5.apps.googleusercontent.com",
  client_secret: "R-6URaXLbRjVx_AGQFTtu4Ln",
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
