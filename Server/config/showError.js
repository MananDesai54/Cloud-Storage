module.exports = (res, error) => {
  console.log(error.message);
  res.status(500).json({
    message: "Server error",
  });
};
