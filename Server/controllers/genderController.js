import db from "../models/index.js";
const Gender = db.Gender;

const createGender = async (req, res) => {
  try {
    const gender = await Gender.create(req.body);
    res.status(201).json(gender);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllGender = async (req, res) => {
  try {
    const genders = await Gender.findAll();
    console.log('Genders retrieved:', genders);
    res.status(200).json(genders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  createGender,
  getAllGender
};
