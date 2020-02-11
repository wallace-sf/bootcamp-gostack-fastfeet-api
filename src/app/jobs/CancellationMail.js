import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'CancellationMail';
  }

  async handle({ data }) {
    const { problem } = data;

    await Mail.sendMail({
      to: `${problem.deliveryman.name} <${problem.deliveryman.email}>`,
      subject: 'Entrega cancelada',
      template: 'cancellation',
      context: {
        id: problem.id,
        product: problem.product,
        recipient: problem.recipient,
        deliveryman: problem.deliveryman,
      },
    });
  }
}

export default new CancellationMail();
