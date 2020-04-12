import Sequelize, { Model } from 'sequelize';

class Delivery extends Model {
  static init(sequelize) {
    super.init(
      {
        product: Sequelize.STRING,
        canceled_at: Sequelize.DATE,
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        status: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', async delivery => {
      delivery.status = 'pending';
    });

    this.addHook('beforeUpdate', async delivery => {
      const { canceled_at, start_date, end_date } = delivery;

      if (canceled_at) {
        delivery.status = 'canceled';
        return;
      }

      if (end_date) {
        delivery.status = 'delivered';
        return;
      }

      if (start_date) {
        delivery.status = 'checkedIn';
      }
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Recipient, {
      foreignKey: 'recipient_id',
      as: 'recipient',
    });
    this.belongsTo(models.Deliveryman, {
      foreignKey: 'deliveryman_id',
      as: 'deliveryman',
    });
    this.belongsTo(models.File, {
      foreignKey: 'signature_id',
      as: 'signature',
    });
  }
}

export default Delivery;
