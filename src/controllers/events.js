const { response } = require("express");
const Events = require("../models/Event");
const myEvents = async (req, res = response)  => {

  const events = await Events.find().populate('user', 'name');

  return res.json({
    ok: true,
    events
  });
}

const createEvent = async (req, res = response) => {

  const { title, start, end, notes } = req.body;
  try {

    const event = new Events({
      title,
      start,
      end,
      notes,
      user: req.uid
    });
    const savedEvent = await event.save();
    return res.json({
      ok: true,
      event: savedEvent
    }).status(201);
  } catch (error) {
    return res.json({
      ok: false,
      msg: 'Error al crear el evento'
    }).status(500)
  }
}

const update = async (req, res = response) => {

  const eventId = req.params.id;
  const { title, start, end, notes } = req.body;

  try {
    const event = await Events.findById(eventId);
    console.log(event);
    if (!event) {
      return res.json({
        ok: false,
        msg: 'Evento no encontrado'
      }).status(404)
    }
    if (event.user.toString() !== req.uid) {
      return res.json({
        ok: false,
        msg: 'No tienes permisos para actualizar este evento'
      }).status(401)
    }

    const newEvent = {
      ...req.body,
      user: req.uid
    }
    const updatedEvent = await Events.findByIdAndUpdate(eventId, newEvent, { new: true });

    return res.json({
      ok: true,
      event: updatedEvent,
      msg: 'updated'
    })
  } catch (error) {
    return res.json({
      ok: false,
      msg: 'Error al actualizar el evento'
    }).status(500)
  }
}

const deleteEvent = async (req, res = response) => {

  const eventId = req.params.id;
  const event = await Events.findById(eventId);
  if (!event) {
    return res.json({
      ok: false,
      msg: 'Evento no encontrado'
    }).status(404)
  }
  if (event.user.toString() !== req.uid) {
    return res.json({
      ok: false,
      msg: 'No tienes permisos para eliminar este evento'
    }).status(401)
  }
  try {
    await Events.findByIdAndDelete(eventId);
    return res.json({
      ok: true,
      msg: 'Evento eliminado'
    })
  } catch (error) {
    return res.json({
      ok: false,
      msg: 'Error al eliminar el evento'
    }).status(500)
  }
}

module.exports = {
  update,
  deleteEvent,
  createEvent,
  myEvents
}