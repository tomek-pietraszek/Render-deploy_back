const successHandler = (res, status, data) => {
  const response = {
    results: data.length,
    success: true,
    status,
    data,
  };
  res.status(status).json(response);
};

export default successHandler;
