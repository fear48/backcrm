const config = {
  secret: "super",
  database: "mongodb://genuris:200000@ds147534.mlab.com:47534/obs",
  refresh_token: "1/SKhRUiHpY-IvstY3MVxPFe62cIYWgMRiBz3MmE3UldMu-zyDQnGI06gQwfurqWMK",
  client_id: "1036675074126-glr8qbdfkbd5pc263cdeh9cr37u5hvn1.apps.googleusercontent.com",
  client_secret: "lR-90PcT_oTBWZtI10gvS_Gm",
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
