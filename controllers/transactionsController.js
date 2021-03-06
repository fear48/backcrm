import Transaction from "../models/transactionModel";
import User from "../models/userModel";
import Category from "../models/categoryModel";
import Event from '../models/eventModel';
import Client from '../models/clientModel';
import History from '../models/historyModel';
import Nodemailer from "nodemailer";

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


export default {
  getAllTransactions: (req, res, next) => {
    Transaction.find()
      .then(response => {
        res.send(response);
      })
      .catch(err => {
        next({ status: 500, message: err.message });
      });
  },
  addNewTransaction: (req, res, next) => {
    const { uid, category } = req.body;
    if(uid){
      User.findById(uid).then(({ name, surname, phoneNumber }) => {
        if (category) {
          Category.findOne({ _id: category })
            .then(cate =>
              Transaction({
                ...req.body,
                categoryName: cate.name,
                name: `${name} ${surname}`,
                phoneNumber
              }).save()
            )
            .then(() => Transaction.find({}))
            .then(response => {
              let msg = "Спасибо!+Ваша+бронь+была+успешно+оплачена";
              let number = params.phoneNumber.replace(/\D/g, "");
              res.send(response);

              axios({
                method: "POST",
                url: `https://sms.ru/sms/send?api_id=${api_id}&to=${number}&msg=${msg}&json=1`
              }).then(res => {
                console.log(res);

              }).catch(err => {
                console.log(err);
                next({ status: 500, message: err.message });
              });
            })
            .catch(err => {
              next({ status: 500, message: err.message });
            })
        } else {
          Transaction({
            ...req.body,
            categoryName: 'Бронирование',
            name: `${name} ${surname}`,
            phoneNumber
          }).save()
            .then(() => Transaction.find({}))
            .then(response => {
              res.send(response);
              let msg = "Спасибо!+Ваша+бронь+была+успешно+оплачена";
              let number = params.phoneNumber.replace(/\D/g, "");

              axios({
                method: "POST",
                url: `https://sms.ru/sms/send?api_id=${api_id}&to=${number}&msg=${msg}&json=1`
              }).then(res => {
                console.log(res);
              }).catch(err => {
                console.log(err);
                next({ status: 500, message: err.message });
              });
            })
            .catch(err => {
              next({ status: 500, message: err.message });
            })
        }
      })
    }else{
      Transaction({
        ...req.body,
        categoryName: 'Бронирование'
      }).save()
        .then(() => Transaction.find({}))
        .then(response => {
          res.send(response);
        })
        .catch(err => {
          next({ status: 500, message: err.message });
        })
    }
  },
  getTransactioById: (req, res, next) => {
    const { id } = req.params;
    Transaction.findOne({ _id: id })
      .then(response => {
        res.send(response);
      })
      .catch(err => {
        next({ status: 403, message: err.message });
      });
  },
  changeTransactionInfo: (req, res, next) => {
    const { id } = req.params;
    const { uid, category } = req.body
    if (uid && category) {
      User.findById(uid).then(({ name, surname, phoneNumber }) =>
        Category.findOne({ _id: category })
          .then(cate =>
            Transaction
              .findOneAndUpdate({ _id: id }, {
                ...req.body,
                categoryName: cate.name,
                name: `${name} ${surname}`,
                phoneNumber
              })
          )
          .then(() => Transaction.find({}))
          .then(response => { res.send(response) })
          .catch(err => {
            next({ status: 403, message: err.message });
          })
      )
    } else if (uid) {
      User.findById(uid).then(({ name, surname, phoneNumber }) =>
        Transaction
          .findOneAndUpdate({ _id: id }, {
            ...req.body,
            name: `${name} ${surname}`,
            phoneNumber
          })
          .then(() => Transaction.find({}))
          .then(response => { res.send(response) })
          .catch(err => {
            next({ status: 403, message: err.message });
          })
      )
    } else if (category) {
      Category.findOne({ _id: category })
        .then(cate =>
          Transaction
            .findOneAndUpdate({ _id: id }, {
              ...req.body,
              categoryName: cate.name,
            })
        )
        .then(() => Transaction.find({}))
        .then(response => { res.send(response) })
        .catch(err => {
          next({ status: 403, message: err.message });
        });
    } else {
      Transaction.findOneAndUpdate({ _id: id }, req.body)
        .then(response => { res.send(response) })
        .catch(err => {
          next({ status: 403, message: err.message });
        });
    }
  },
  deleteTransaction: (req, res, next) => {
    const { id } = req.params;
    Transaction.findByIdAndRemove(id)
      .then(() => Transaction.find({}))
      .then(response => {
        res.send(response);
      })
      .catch(err => {
        next({ status: 403, message: err.message });
      });
  },
  getUserTransaction: (req, res, next) => {
    const { userId } = req.params;
    Transaction.find({ uid: userId })
      .then(response => {
        res.send(response);
      })
      .catch(err => {
        next({ status: 403, message: err.message });
      });
  },
  yandex: (req, res, next) => {
    const { label, withdraw_amount, amount } = req.body;
    console.log(req.body);
    let name, phoneNumber;
    res.status(200).send();
    Event.findOneAndUpdate({ _id: label }, { paid: true, cancelled: false })
      .then(response => {
        let mailOptions = {
          from: 'OBSCUR <obscurcrm@gmail.com>',
          to: 'mail@obscur.pro, '+ response.email,
          subject: 'Бронирование успешно оплачено',
          html: '<p><b>'+ response.title +'</b></br>Номер телефона: '+ response.phoneNumber +'</br>Зал: '+ response.roomId +'</br>Начало: '+ response.startDate.toLocaleString() +'</br>Конец: '+ response.endDate.toLocaleString() +'</br>Статус оплаты: Оплачено, </br>Сумма: '+ response.sum +' рублей</p>'
        };
        transporter.sendMail(mailOptions, function(err, info){
          if(err){
            console.log(err, 'error');
          }
        });
        console.log(response._id);
        
        History.findOneAndUpdate({ eventId: response._id }, { payStatus: 2 }).then(function(res){
          console.log(res, 'FINDANDupdate');
          // History({
          //   payStatus: 2
          // }).save();
        });

          return Transaction({
            name: response.title,
            phoneNumber: response.phoneNumber,
            sum: amount,
            categoryName: 'Бронирование',
            type: 1,
            payType: 0,
            date: new Date()
          }).save();
        }
      )
      .then((response) => {
        name = response.name;
        phoneNumber = response.phoneNumber;
        console.log(response, 'afterTransactionSaved');
        return Client.find({ phoneNumber: response.phoneNumber })
      })
      .then(response => {
        console.log("Transactions Accepted")
        if (response.length === 0) {
          console.log("Client saved");
          return Client({ name, phoneNumber }).save()
        }
      })
      .catch(err => {
        console.log(err.message);
        next({ status: 403, message: err.message })
      })
  }
};
