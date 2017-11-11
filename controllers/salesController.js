import Sale from "../models/salesModel";
import Room from "../models/roomModel";

export default {
  getAllSales: (req, res, next) => {
    Sale.find({})
      .then(response => {
        res.send(response);
      })
      .catch(err => {
        next({ status: 403, message: err.message });
      });
  },
  addNewSale: (req, res, next) => {
    const { roomId } = req.body;
    Room.findOne({ _id: roomId })
      .then(({ roomName }) => {
        Sale({ ...req.body, roomName })
          .save()
          .then(response => {
            res.send(response);
          });
      })
      .catch(err => {
        next({ status: 403, message: err.message });
      });
  },
  changeSaleInfo: (req, res, next) => {
    const { id } = req.params;
    if (req.body.roomId) {
      Room.findOne({ _id: req.body.roomId })
        .then(({ roomName }) =>
          Sale.findOneAndUpdate({ _id: id }, { ...req.body, roomName })
        )
        .then(response => {
          res.send(response);
        })
        .catch(err => {
          next({ status: 403, message: err.message });
        });
    } else {
      Sale.findOneAndUpdate({ _id: id }, req.body)
        .then(response => {
          res.send(response);
        })
        .catch(err => {
          next({ status: 403, message: err.message });
        });
    }
  },
  deleteSale: (req, res, next) => {
    const { id } = req.params;
    Sale.findByIdAndRemove(id)
      .then(() => Sale.find({}))
      .then(response => {
        res.send(response);
      })
      .catch(err => {
        next({ status: 403, message: err.message });
      });
  },
  cheakDates: (req, res, next) => {
    const { startDate, endDate } = req.body;
    if (startDate < endDate) {
      Sale.find({ endDate: { $gt: startDate }, startDate: { $lt: endDate } })
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
