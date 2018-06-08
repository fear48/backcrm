import History from "../models/historyModel";

export default {
  getAllHistory: (req, res, next) => {
    History.find()
      .then(response => {
        res.send(response);
      })
      .catch(err => {
        next({ status: 500, message: err.message });
      });
  },
  addNewHistory: (req, res, next) => {
    History(req.body)
      .save()
      .then(response => {
        res.send(response);
      })
      .catch(err => {
        next({ status: 500, message: err.message });
      });
  },
  getHistoryById: (req, res, next) => {
    const { id } = req.params;
    History.findOne({ _id: id })
      .then(response => {
        res.send(response);
      })
      .catch(err => {
        next({ status: 403, message: err.message });
      });
  },
  changeHistoryInfo: (req, res, next) => {
    const { id } = req.params;
    History.findByIdAndUpdate(id, req.body)
      .then(response => History.find({}))
      .then(response => {
        res.send(response);
      })
      .catch(err => {
        next({ status: 403, message: err.message });
      });
  },
  changeHistoryInfoByEventId: (req, res, next) => {
    const { id } = req.params;
    console.log(id, req.params);
    History.findOneAndUpdate({
      eventId: id
    }, req.body)
      .then(response => History.find({}))
      .then(response => {
        res.send(response);
      })
      .catch(err => {
        next({ status: 403, message: err.message });
      });
  },
  deleteHistory: (req, res, next) => {
    const { id } = req.params;
    History.findByIdAndRemove(id)
      .then(response => {
        res.send(response);
      })
      .catch(err => {
        next({ status: 403, message: err.message });
      });
  }
};
