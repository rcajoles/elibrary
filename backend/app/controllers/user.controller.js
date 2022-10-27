const read = (req, res) => {
  res.status(200).send("Admin Content.");
};

const create = (req, res) => {
  res.status(200).send("Admin Content.");
};

const update = (req, res) => {
  res.status(200).send("Admin Content.");
};

const deleteRecord = (req, res) => {
  res.status(200).send("Admin Content.");
};

const controller = {
  read,
  create,
  update,
  deleteRecord
};

module.exports = controller;
