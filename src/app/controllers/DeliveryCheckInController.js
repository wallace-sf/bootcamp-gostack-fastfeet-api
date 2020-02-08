import Delivery from '../models/Delivery';

class DeliveryCheckInController {
  async store(req, res) {
    /**
     * Check if delivery exists
     */

    const deliveryExists = await Delivery.findByPk(req.params.deliveryId);

    if (!deliveryExists) {
      return res.status(400).json({ error: 'Delivery id does not exist' });
    }

    /**
     * Check if time is between 08 and 18h
     */

    return res.json({});
  }
}

export default new DeliveryCheckInController();
