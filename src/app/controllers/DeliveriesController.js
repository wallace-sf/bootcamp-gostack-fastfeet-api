import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';

class DeliveriesController {
  async index(req, res) {
    /**
     * Check if deliveryman exists
     */

    const deliverymanExists = await Deliveryman.findByPk(req.params.id);

    if (!deliverymanExists) {
      return res.status(400).json({ error: 'Deliveryman id does not exist' });
    }

    const { deliveryman_id } = deliverymanExists;

    const deliveries = await Delivery.findAll({
      where: { deliveryman_id, end_date: null, canceled_at: null },
    });

    return res.json(deliveries);
  }
}

export default new DeliveriesController();
