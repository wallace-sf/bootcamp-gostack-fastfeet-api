import * as Yup from 'yup';

import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';
import File from '../models/File';

class DeliveryController {
  async index(req, res) {
    const deliveries = await Delivery.findAll({
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
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'name',
            'street',
            'number',
            'complement',
            'state',
            'city',
            'zip_code',
          ],
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'email', 'avatar_id'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['name', 'path', 'url'],
            },
          ],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    return res.json(deliveries);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string().required(),
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      signature_id: Yup.number(),
      start_date: Yup.date(),
      end_date: Yup.date(),
      canceled_at: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    /**
     * Check if recipient_id exists
     */

    const recipient = await Recipient.findByPk(req.body.recipient_id);

    if (!recipient) {
      return res.status(402).json({ error: 'Recipient id does not exist' });
    }

    /**
     * Check if deliveryman_id exists
     */

    const deliveryman = await Deliveryman.findByPk(req.body.deliveryman_id);

    if (!deliveryman) {
      return res.status(402).json({ error: 'Deliveryman id does not exist' });
    }

    const { product, recipient_id, deliveryman_id } = await Delivery.create(
      req.body
    );

    return res.json({
      product,
      recipient_id,
      deliveryman_id,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string(),
      recipient_id: Yup.number(),
      deliveryman_id: Yup.number(),
      signature_id: Yup.number(),
      canceled_at: Yup.date(),
      start_date: Yup.date(),
      end_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    /**
     * Check if delivery exists
     */

    const deliveryExists = await Delivery.findByPk(req.params.id);

    if (!deliveryExists) {
      return res.status(400).json({ error: 'Delivery id does not exist' });
    }

    /**
     * Check if recipient_id exists
     */

    const recipient = await Recipient.findByPk(req.body.recipient_id);

    if (!recipient) {
      return res.status(402).json({ error: 'Recipient id does not exist' });
    }

    /**
     * Check if deliveryman_id exists
     */

    const deliveryman = await Deliveryman.findByPk(req.body.deliveryman_id);

    if (!deliveryman) {
      return res.status(402).json({ error: 'Deliveryman id does not exist' });
    }

    const {
      id,
      product,
      recipient_id,
      deliveryman_id,
      signature_id,
      canceled_at,
      start_date,
      end_date,
    } = await deliveryExists.update(req.body);

    return res.json({
      id,
      product,
      recipient_id,
      deliveryman_id,
      signature_id,
      canceled_at,
      start_date,
      end_date,
    });
  }

  async delete(req, res) {
    const deliveryExists = await Delivery.findByPk(req.params.id);

    if (!deliveryExists) {
      return res.status(400).json({ error: 'Delivery id does not exist' });
    }

    await deliveryExists.destroy();

    return res.send();
  }
}

export default new DeliveryController();
