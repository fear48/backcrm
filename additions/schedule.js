import Agenda from "agenda";

import config from '../config/config'
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

export default agenda;
