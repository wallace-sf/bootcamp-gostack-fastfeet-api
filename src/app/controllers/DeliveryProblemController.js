import * as Yup from 'yup';
import Sequelize, { Op } from 'sequelize';

import DeliveryProblem from '../models/DeliveryProblems';
import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';
import CancellationMail from '../jobs/CancellationMail';
import Queue from '../../lib/Queue';

class DeliveryProblemController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const deliveriesProblem = await DeliveryProblem.findAll({
      order: [['id', 'ASC']],
      limit: 20,
      offset: (page - 1) * 20,
    });

    return res.json(deliveriesProblem);
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

  async delete(req, res) {
    const { deliveryProblemId } = req.params;

    const deliveryProblemExists = await DeliveryProblem.findByPk(
      deliveryProblemId
    );

    if (!deliveryProblemExists) {
      return res
        .status(400)
        .json({ error: 'Delivery problem id does not exist' });
    }

    const deliveryId = deliveryProblemExists.delivery_id;

    const delivery = await Delivery.findByPk(deliveryId, {
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'email'],
        },
        {
          model: Recipient,
          as: 'recipient',
        },
      ],
    });

    delivery.canceled_at = new Date();
    delivery.save();

    const { id, product, recipient, deliveryman } = delivery;

    await Queue.add(CancellationMail.key, {
      problem: {
        id,
        product,
        recipient,
        deliveryman,
      },
    });

    return res.send();
  }
}

export default new DeliveryProblemController();
