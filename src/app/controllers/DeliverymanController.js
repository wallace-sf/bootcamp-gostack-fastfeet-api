import { Op } from 'sequelize';
import * as Yup from 'yup';

import Deliveryman from '../models/Deliveryman';
import Delivery from '../models/Delivery';
import File from '../models/File';

class DeliverymanController {
  async index(req, res) {
    const { page = 1, q } = req.query;

    const deliverymen = await Deliveryman.findAll({
      where: {
        name: {
          [Op.iLike]: `%${q || ''}%`,
        },
      },
      attributes: ['id', 'name', 'email', 'avatar_id'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
      limit: 20,
      offset: (page - 1) * 20,
    });

    return res.json(deliverymen);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const deliverymanExists = await Deliveryman.findOne({
      where: { email: req.body.email },
    });

    if (deliverymanExists) {
      return res
        .status(400)
        .json({ error: 'Deliveryman email already exists' });
    }

    const { name, email } = await Deliveryman.create(req.body);

    return res.json({ name, email });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    /**
     * Check if deliveryman exists
     */

    const deliverymanExists = await Deliveryman.findByPk(req.params.id);

    if (!deliverymanExists) {
      return res.status(400).json({ error: 'Deliveryman id does not exist' });
    }

    const { id, name, email, avatar_id } = await deliverymanExists.update(
      req.body
    );

    return res.json({ id, name, email, avatar_id });
  }

  async delete(req, res) {
    const deliverymanExists = await Deliveryman.findByPk(req.params.id);

    if (!deliverymanExists) {
      return res.status(400).json({ error: 'Deliveryman id does not exist' });
    }

    const deliveries = await Delivery.findOne({
      where: {
        deliveryman_id: deliverymanExists.id,
      },
    });

    if (deliveries) {
      return res.status(400).json({
        error: 'There are deliveries registered for this delivery man',
      });
    }

    await deliverymanExists.destroy();

    return res.send();
  }
}

export default new DeliverymanController();
