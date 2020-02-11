import DeliveryProblem from '../models/DeliveryProblems';
import Delivery from '../models/Delivery';

class DeliveryProblemsByIDController {
  async index(req, res) {
    const { deliveryId: delivery_id } = req.params;
    const { page = 1 } = req.query;

    const deliveryExists = await Delivery.findByPk(delivery_id);

    if (!deliveryExists) {
      return res.status(400).json({ error: 'Delivery id does not exist' });
    }

    const deliveries = await DeliveryProblem.findAll({
      where: { delivery_id },
      attributes: ['id', 'description', 'delivery_id'],
      limit: 20,
      offset: (page - 1) * 20,
    });

    return res.json(deliveries);
  }
}

export default new DeliveryProblemsByIDController();
