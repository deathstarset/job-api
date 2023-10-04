const notFound = (req, res) => {
  console.log("Hello world");
  res.status(404).send("Route does not exist");
};

module.exports = notFound;
