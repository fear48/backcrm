import Event from "../models/eventModel";

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
    Event(req.body)
      .save()
      .then(response => {
        res.send(response);
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
    const { startDate, endDate } = req.body;
    if (startDate < endDate) {
      Event.find({ endDate: { $gte: startDate }, startDate: { $lte: endDate } })
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
