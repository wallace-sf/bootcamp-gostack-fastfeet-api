import Mail from '../../lib/Mail';

class DeliveryMail {
  get key() {
    return 'DeliveryMail';
  }

  async handle({ data }) {
    const { delivery } = data;

    await Mail.sendMail({
      to: `${delivery.deliveryman.name} <${delivery.deliveryman.email}>`,
      subject: 'Nova encomenda',
      template: 'delivery',
      context: {
        deliveryman: delivery.deliveryman.name,
        product: delivery.product,
        recipient: delivery.recipient,
      },
    });
  }
}

export default new DeliveryMail();
