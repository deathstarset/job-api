const notFound = (req, res) => {
  console.log("this is comming from not found");
  res.status(404).send("Route does not exist");
};

module.exports = notFound;
