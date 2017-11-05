import Agenda from 'agenda';
import axios from 'axios';
import querystring from 'querystring';

import config, { changeConfig } from '../config/config'
import Event from '../models/eventModel'

const { database } = config;
const agenda = new Agenda({ db: { address: database } })


agenda.define('delete old events', (job, done) => {
  let prevLength;
  const { values: { paymentExpiresAt } } = config;
  const date = new Date();
  date.setHours(date.getHours() - paymentExpiresAt)
  Event.find({ createdAt: { $lte: date }, paid: false, cancelled: true })
    .then(({ length }) => prevLength = length);
  Event.update({ createdAt: { $lte: date }, paid: false, cancelled: false }, { cancelled: true }, done)
  Event.find({ createdAt: { $lte: date }, paid: false, cancelled: true })
    .then(response => {
      console.log("Updated: ", response.length - prevLength);
    });
  console.log('Agenda "delete old events" completed: ', date.toLocaleTimeString())
});

agenda.define("get new token", (job, done) => {
  const reqConfig = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }

  const data = {
    refresh_token: config.refresh_token,
    client_id: config.client_id,
    client_secret: config.client_secret,
    grant_type: "refresh_token"
  };

  axios.post('https://www.googleapis.com/oauth2/v4/token', querystring.stringify(data), reqConfig)
    .then(({ data: { access_token } }) => {
      changeConfig("access_token", access_token);
      console.log('Token getted: ', config.values.access_token, new Date().toLocaleTimeString());
      done()
    })
    .catch(err => console.log(err));
})

export default agenda;
