const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors/index");

const getAllJobs = async (req, res) => {
  const createdBy = req.user.userID;
  const jobs = await Job.find({ createdBy }).sort("createdAt");
  res.status(StatusCodes.OK).json({ data: jobs });
};
const getJob = async (req, res) => {
  const { jobID } = req.params;
  const createdBy = req.user.userID;
  const job = await Job.findOne({ _id: jobID, createdBy });
  if (!job) {
    throw new NotFoundError(`there is no job with the id ${jobID}`);
  }

  res.status(StatusCodes.OK).json({ job });
};
const createJob = async (req, res) => {
  req.body.createdBy = req.user.userID;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ data: job });
};
const updateJob = async (req, res) => {
  const { jobID } = req.params;
  const createdBy = req.user.userID;
  const { company, position } = req.body;
  if (company === "" || position === "") {
    throw new BadRequestError("company or position must be provided");
  }
  const job = await Job.findOneAndUpdate(
    { _id: jobID, createdBy },
    { company, position },
    { new: true, runValidators: true }
  );
  res.status(StatusCodes.OK).json({ job });
};
const deleteJob = async (req, res) => {
  const { jobID } = req.params;
  const createdBy = req.user.userID;
  const job = await Job.findOneAndDelete({ _id: jobID, createdBy });
  if (!job) {
    throw new NotFoundError(`there is no job with the id ${jobID}`);
  }
  res.status(StatusCodes.OK).send();
};

module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob };
