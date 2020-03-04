import * as Yup from 'yup';

import Delivery from '../models/Delivery';
import File from '../models/File';

class DeliveryCheckOutController {
  async store(req, res) {
    const schema = Yup.object().shape({
      signature_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails' });
    }

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

    /**
     * Check if signature_id exists
     */

    const file = await File.findByPk(req.body.signature_id);

    if (!file) {
      return res.status(400).json({ error: 'Signature id does not exist' });
    }

    await deliveryExists.update({ end_date: new Date() });

    return res.json(deliveryExists);
  }
}

export default new DeliveryCheckOutController();
