import * as Yup from 'yup';

import Recipient from '../models/Recipient';

class RecipientsController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const recipients = await Recipient.findAll({
      limit: 20,
      offset: (page - 1) * 20,
    });

    return res.json(recipients);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.string().required(),
      complement: Yup.string(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      zip_code: Yup.string()
        .required()
        .min(8),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const recipient = await Recipient.create(req.body);

    const {
      name,
      street,
      number,
      complement,
      state,
      city,
      zip_code,
    } = recipient;

    return res.json({
      name,
      street,
      number,
      complement,
      state,
      city,
      zip_code,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      street: Yup.string(),
      number: Yup.number(),
      complement: Yup.string(),
      state: Yup.string(),
      city: Yup.string(),
      zip_code: Yup.string().min(8),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Recipient id not provided' });
    }

    const recipient = await Recipient.findByPk(id);

    const {
      name,
      street,
      number,
      complement,
      state,
      city,
      zip_code,
    } = await recipient.update(req.body);

    return res.json({
      name,
      street,
      number,
      complement,
      state,
      city,
      zip_code,
    });
  }

  async delete(req, res) {
    const recipientExists = await Recipient.findByPk(req.params.id);

    // if (!recipientExists) {
    //   return res.status(400).json({ error: 'Recipient id does not exist' });
    // }

    await recipientExists.destroy();

    return res.json(recipientExists);
  }
}

export default new RecipientsController();
