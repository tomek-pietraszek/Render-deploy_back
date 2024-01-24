import mongoose from "mongoose";
import createError from "http-errors";

export const isValidId = (req) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw createError(`Invalid ID in ${req.originalUrl}`);
  }
};

export const isIdRegistered = async (req, resource) => {
  const documentInDb = await resource.findById(req.params.id);

  if (!documentInDb) {
    throw createError(404, "Document is not registered in DB");
  }
};

export const routeNotFound = (req, res, next) => {
  throw createError(404, "Route was not found");
};

export const globalErrorHandler = (err, req, res, next) => {
  res.status(err.status || 500).json({
    statusCode: err.status,
    message: err.message,
    stack: err.stack,
  });
};
