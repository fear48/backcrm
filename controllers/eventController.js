import Event from "../models/eventModel";
import Nodemailer from "nodemailer";

let transporter = Nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'hlopyannikov@gmail.com',
    pass: 'Jackpot3527272pw'
  }
});

export default {
  getAllEvents: (req, res, next) => {
    Event.find()
      .then(response => {
        res.send(response);
      })
      .catch(err => {
        next({ status: 403, message: err.message });
      });
  },
  addNewEvent: (req, res, next) => {
    const params = req.body;

    Event(req.body)
      .save()
      .then(response => {
        res.send(response);
        let mailOptions = {
          from: 'OBSCUR <hlopyannikov@gmail.com>',
          to: 'mail@obscur.pro',
          subject: 'Новая запись была добавлена',
          html: '<p>Номер телефона: '+ params.phoneNumber +'</br>Зал: '+ params.roomId +'</br>Начало: '+ params.startDate +'</br>Конец: '+ params.endDate +'</br>Статус оплаты: '+ params.paid +' </p>'
        };
        transporter.sendMail(mailOptions, function(err, info){
          if(err){
            console.log(err);
          }else{
            console.log(info);
          }
        });
      })
      .catch(err => {
        next({ status: 500, message: err.message });
      });
  },
  getEventById: (req, res, next) => {
    const { id } = req.params;
    Event.findOne(id)
      .then(response => {
        res.send(response);
      })
      .catch(err => {
        next({ status: 403, message: err.message });
      });
  },
  deleteEventById: (req, res, next) => {
    const { id } = req.params;
    Event.findByIdAndRemove(id)
      .then(response => {
        res.send(response);
      })
      .catch(err => {
        next({ status: 403, message: err.message });
      });
  },
  changeEventInfo: (req, res, next) => {
    const { id } = req.params;
    Event.findByIdAndUpdate(id, req.body)
      .then(response => Event.find({}))
      .then(response => {
        res.send(response);
      })
      .catch(err => {
        next({ status: 403, message: err.message });
      });
  },
  cheakDates: (req, res, next) => {
    const { startDate, endDate, roomId } = req.body;
    console.log(req.body);
    if (startDate < endDate) {
      Event.find({ endDate: { $gt: startDate }, startDate: { $lt: endDate }, cancelled: false, roomId: roomId})
        .then(response => {
          res.send(response[0]);
        })
        .catch(err => {
          next({ status: 403, message: err.message });
        });
    } else {
      next({ status: 403, message: "Wrong dates" });
    }
  }
};
