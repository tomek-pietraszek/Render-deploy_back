import successHandler from "../middlewares/successHandler.js";
import Record from "../models/recordModel.js";
import ApiQueryHandler from "../utilities/apiQueryHandler.js";

export const getAllRecords = async (req, res, next) => {
  try {
    /* 
    ?   To manage queries in your application, uncomment the following code block and delete the line of code after.
    !    NOTE: you need to have the apiQueryHandler.js file in your utilities folder
  */
    /* 
      let apiQuery = new ApiQueryHandler(Record, req.query)
        .filterDocs()
        .sortDocs()
        .limitFields()
        .paginateDocs();
        
        const records = await apiQuery.model;
 */

    const records = await Record.find();
    successHandler(res, 200, records);
  } catch (error) {
    next(error);
  }
};

export const getRecordById = async (req, res, next) => {
  try {
    const record = await Record.findById(req.params.id);
    successHandler(res, 200, record);
  } catch (error) {
    next(error);
  }
};
