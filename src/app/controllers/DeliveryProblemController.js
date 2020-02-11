import * as Yup from 'yup';

import DeliveryProblem from '../models/DeliveryProblems';
import Delivery from '../models/Delivery';

class DeliveryProblemController {
  async index(req, res) {
    const id = await DeliveryProblem.findAll({
      where: { delivery_id: req.params.id },
      attributes: ['id'],
    });

    const deliveries = await Delivery.findAll({
      where: { id },
      attributes: [
        'id',
        'product',
        'recipient_id',
        'deliveryman_id',
        'signature_id',
        'start_date',
        'end_date',
        'canceled_at',
      ],
    });

    return res.json(deliveries);
  }

  async show(req, res) {
    const { deliveryId: delivery_id } = req.params;

    const deliveryExists = await Delivery.findByPk(delivery_id);

    if (!deliveryExists) {
      return res.status(400).json({ error: 'Delivery id does not exist' });
    }

    const deliveries = await DeliveryProblem.findAll({
      where: { delivery_id },
      attributes: ['id', 'description', 'delivery_id'],
    });

    return res.json(deliveries);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails' });
    }

    /**
     * Check if delivery exists
     */

    const { deliveryId: delivery_id } = req.params;
    const { description } = req.body;

    const deliveryExists = await Delivery.findByPk(delivery_id);

    if (!deliveryExists) {
      return res.status(400).json({ error: 'Delivery id does not exist' });
    }

    const { id } = await DeliveryProblem.create({ delivery_id, description });

    return res.json({ id, delivery_id, description });
  }
}

export default new DeliveryProblemController();
