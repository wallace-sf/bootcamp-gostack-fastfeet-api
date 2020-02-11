import { setHours, isBefore, isAfter, setMinutes, setSeconds } from 'date-fns';

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
     * Check if time is between 8 am and 18 pm
     */

    const now = new Date(); // Schedule in UTC
    const [start, end] = [
      setSeconds(setMinutes(setHours(now, 8), 0), 0),
      setSeconds(setMinutes(setHours(now, 18), 0), 0),
    ]; // UTC Adjustment

    const isInInterval = isBefore(now, end) && isAfter(now, start);

    if (!isInInterval) {
      return res.status(400).json({
        error: 'The delivery receipt time must be between 8 am and 6 pm ',
      });
    }

    /**
     * Check if check in is done
     */

    if (deliveryExists.start_date) {
      return res.status(400).json({ error: 'You have already checked in' });
    }

    await deliveryExists.update({ start_date: now });

    return res.json(deliveryExists);
  }
}

export default new DeliveryCheckInController();
