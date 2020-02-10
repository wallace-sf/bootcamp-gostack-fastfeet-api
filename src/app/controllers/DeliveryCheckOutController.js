import Delivery from '../models/Delivery';

class DeliveryCheckOutController {
  async store(req, res) {
    /**
     * Check if delivery exists
     */

    const deliveryExists = await Delivery.findByPk(req.params.deliveryId);

    if (!deliveryExists) {
      return res.status(400).json({ error: 'Delivery id does not exist' });
    }

    /**
     * Check if check in is done
     */

    if (!deliveryExists.start_date) {
      return res
        .status(400)
        .json({ error: "You can't check out without check in" });
    }

    /**
     * Check if check out is done
     */

    if (deliveryExists.end_date) {
      return res.status(400).json({ error: 'You have already checked out' });
    }

    await deliveryExists.update({ end_date: new Date() });

    return res.json(deliveryExists);
  }
}

export default new DeliveryCheckOutController();
