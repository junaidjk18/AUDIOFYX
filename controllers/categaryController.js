const category = require("../models/category");

// add category

const addCategory = async (req, res) => {
  try {
    if (req.query.inp) {
      const catecheck = await category.findOne({
        name: { $regex: new RegExp("^" + req.query.inp + "$", "i") },
      });
      if (catecheck) {
        res.send({ inp: true });
      } else {
        res.send({ inp: false });
      }
    } else if (req.query.name && req.query.radio) {
      const addCategory = new category({
        name: req.query.name,
        is_listed: req.query.radio,
      });

      addCategory.save();

      res.send({ true: true });
    }
  } catch (error) {
    console.log(error.message);
  }
};

// edit categor

const editCategory = async (req, res) => {
  try {
    const cateId = req.query.id;
    const newName = req.query.value.trim();
    //checking existing one

    const datacheck = await category.findOne({
      name: { $regex: new RegExp("^" + newName + "$", "i") },
    });
    if (datacheck) {
      res.send({ error: "Category already exist" });
    } else {
      const updatedcate = await category.findByIdAndUpdate(
        { _id: cateId },
        { $set: { name: newName } }
      );
      updatedcate.save();
      res.send(true);
    }
  } catch (error) {
    console.log(error);
  }
};

// category action

const categaryAction = async (req, res) => {
  try {
    const cateId = req.query.id;

    const listed = await category.findOne({ _id: cateId });

    listed.is_listed = !listed.is_listed;

    listed.save();

    res.send({ set: true });
  } catch (error) {
    console.log(error.message);
  }
};

// load category




module.exports = {
  addCategory,
  editCategory,
  categaryAction
};