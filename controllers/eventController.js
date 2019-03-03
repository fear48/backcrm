import Event from "../models/eventModel";
import Room from "../models/roomModel";
import Nodemailer from "nodemailer";
import moment from "moment";
import axios from "axios";
import querystring from 'querystring';

let transporter = Nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'obscurcrm@gmail.com',
    pass: 'obscurpassadmin'
  }
});

const api_id = "B1578DE4-D57E-90F1-F08C-C68800DB8273";

const findRoom = (id) => {
  console.log(id, "ID");
   Room.findOne({ _id: id }).then((res) => {
    if(res){
      console.log(res.roomName, "GETTED ROOM");
      return res.roomName;
    }else{
      return false;
    }
  }).catch((err) => {
    console.log(err);
    //next({ status: 403, message: err.message });
  });
};

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
        let start = params.startDate.replace(/ /g, "");
        let end = params.endDate.replace(/ /g, "");
        let number = params.phoneNumber.replace(/\D/g, "");
        let msg = querystring.stringify(`Уважаемый ${title}, Ваша бронь была успешно добавлена! Фотостудия Obscur`);
        let mailOptions = {
          from: 'OBSCUR <obscurcrm@gmail.com>',
          to: 'mail@obscur.pro, '+ params.email,
          subject: 'Новая запись была добавлена',
          html: '<p><b>'+ params.title +'</b></br>Номер телефона: '+ params.phoneNumber +'</br>Зал: '+ params.roomId +'</br>Начало: '+ params.startDate +'</br>Конец: '+ params.endDate +'</br>Статус оплаты: '+ params.paid +' </p>'
        };
        console.log(`https://sms.ru/sms/send?api_id=${api_id}&to=${number}&msg=${msg}&json=1`);
        

        return axios({
          method: "POST",
          url: `https://sms.ru/sms/send?api_id=${api_id}&to=${number}&msg=${msg}&json=1`
        }).then(res => {
          console.log(res);
          transporter.sendMail(mailOptions, function(err, info){
            if(err){
              console.log(err, 'error');
            }else{
              console.log(info, 'success');
            }
          });
        }).catch(err => {
          console.log(err);
          next({ status: 500, message: err.message });
        });

        
        
      })
      .catch(err => {
        next({ status: 500, message: err.message });
      });
  },
  getEventById: (req, res, next) => {
    const { id } = req.params;
    Event.findOne({ _id: id })
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
    const { grimId } = req.body;

    if(grimId !== null && grimId !== undefined && grimId){
      console.log(req.body, "GRIM NOT NULL");

       Event.findOneAndUpdate({ _id: grimId }, {$set:{paid:true, cancelled: false}}, {
         new: true
       }).then((result) => {
        console.log(result, "FIND WITH GRIM AND SAVED");
        //res.send(result);
      }).catch((err) => {
        next({ status: 403, message: err.message });
      });
      Event.findByIdAndUpdate(id, req.body)
        .then(response => Event.find({}))
        .then(response => {
          res.send(response);
        })
        .catch(err => {
          next({ status: 403, message: err.message });
        });
    }else{
      console.log('grim not found');
       Event.findOneAndUpdate({ grimId: id }, req.body, {new: true}).then((res) => {
        console.log(res, 'res found AND SAVED');
      }).catch(err => {
        next({ status: 403, message: err.message });
      });
      Event.findByIdAndUpdate(id, req.body)
        .then(response => Event.find({}))
        .then(response => {
          res.send(response);
        })
        .catch(err => {
          next({ status: 403, message: err.message });
        });
    }
    
  },

  getEventsByDate: (req, res, next) => {
    let { startDate, endDate } = req.body;
    // startDate = startDate.setHours(0, 0, 0);
    // endDate = startDate;
    // endDate = endDate.setDate(startDate.getDate() + 2)
    // console.log(startDate, endDate);

    Event.find({ startDate: { $gt: startDate }, endDate: { $lt: endDate }, cancelled: false})
      .lean().then(async (response) => {
        const items = [];
        for(let item of response){
          let room = await Room.findOne({ _id: item.roomId }).lean();
          if(room !== null){
            console.log(room,'123');
            items.push({
              ...item,
              roomName: room.roomName,
              roomColor: room.color
            });
          }else{
            items.push(item);
          }
        }
        res.send(items);

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
