import Transaction from "../models/transactionModel";
import User from "../models/userModel";
import Category from "../models/categoryModel";
import Event from '../models/eventModel';
import Client from '../models/clientModel';

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
            res.send(response);
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
          })
          .catch(err => {
            next({ status: 500, message: err.message });
          })
      }
    })
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
    const { label, withdraw_amount } = req.body;
    let name, phoneNumber;
    res.status(200).send();
    Event.findOneAndUpdate({ _id: label }, { paid: true })
      .then(response =>
        Transaction({
          name: response.title,
          phoneNumber: response.phoneNumber,
          uid: '5996f78dd515bf21602c44c1',
          sum: withdraw_amount,
          type: 1,
          payType: 0
        }).save()
      )
      .then((response) => {
        name = response.name;
        phoneNumber = response.phoneNumber;

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
