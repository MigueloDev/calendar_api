const { Router } = require("express");
const { check } = require("express-validator");
const { createEvent, myEvents, update, deleteEvent } = require('../controllers/events');
const { validateJsonWebToken } = require("../middlewares/validateJsonWebToken");
const { validateFields } = require("../middlewares/validateFields");
const { isValid } = require("date-fns")
const router = Router();
/*
  /api/events
*/

const isValidDate = (value) => {
  if (!value) return false;
  console.log(isValid(value));
  return isValid(value);
}

router.use(validateJsonWebToken);

router.get("/", myEvents);

router.post(
  "/create",
  [
    check("title", "El título es obligatorio").not().isEmpty(),
    check("start", "La fecha de inicio es obligatoria").custom(isValidDate),
    check("end", "La fecha de finalización es obligatoria").custom(isValidDate),
    validateFields,
  ],
  createEvent
);

router.get("/:id",createEvent);

router.put("/:id",update);

router.delete("/:id", deleteEvent);



module.exports = router;