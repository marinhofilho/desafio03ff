import * as Yup from 'yup';
import Deliverymen from '../models/Deliverymen';
import Order from '../models/Order';

class DeliverymenController {
  async store(req, res) {
    const { name } = req.body;

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      avatar_id: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const DeliverymenExists = await Deliverymen.findOne({
      where: { name },
    });

    if (DeliverymenExists) {
      return res.status(400).json({ error: 'Deliverymen already exists!' });
    }

    const deliverymen = await Deliverymen.create(req.body);

    return res.json(deliverymen);
  }

  async index(req, res) {
    const deliverymen = await Deliverymen.findAll({
      include: [
        {
          model: Order,
          as: 'orders',
        },
      ],
    });
    return res.json(deliverymen);
  }

  async indexOne(req, res) {
    const { id } = req.params;
    const deliverymen = await Deliverymen.findOne({
      where: { id },
      include: [
        {
          model: Order,
          as: 'order',
        },
      ],
    });

    if (!deliverymen) {
      return res.status(400).json({ error: 'Deliverymen not found' });
    }
    return res.json(deliverymen);
  }

  async update(req, res) {
    const { id } = req.params;
    const { name } = req.body;
    const deliverymen = await Deliverymen.findByPk(id);
    if (!deliverymen) {
      return res.status(400).json({ error: 'Deliverymen not found' });
    }

    if (name !== deliverymen.name) {
      const deliverymenExists = await Deliverymen.findOne({
        where: { name },
      });

      if (deliverymenExists) {
        return res.status(400).json({ error: 'Deliverymen already exists!' });
      }
    }
    const { avatar_id, email } = await deliverymen.update(req.body);

    return res.json({
      name,
      avatar_id,
      email,
    });
  }

  async delete(req, res) {
    const { id } = req.params;
    const deliverymen = await Deliverymen.findByPk(id);
    if (!deliverymen) {
      return res.status(400).json({ error: 'Deliverymen not found' });
    }
    deliverymen.destroy();

    return res.json({ message: `${deliverymen.name} was deleted ` });
  }
}
export default new DeliverymenController();