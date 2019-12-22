const agv = require('../models/agv');
const queueTCP = require('../Queue/queueTCP');

const CMD_config = 0x02;
const CMD_END = 0xEE;

module.exports = {
  async index(req, res) {
    let agvs = [];
    let i;

    const agvFind = await agv.find({});

    for (i = 0; i < agvFind.length; i += 1) {
      agvs.push({
        '_id': agvFind[i]._id,
        'name': agvFind[i].name,
        'active': agvFind[i].active,
        'proporcional': agvFind[i].proporcional,
        'derivativo': agvFind[i].derivativo,
        'integrativo': agvFind[i].integrativo,
      });

      let name;
      switch(agvs[i].name){
        case 'AGV 1':
          name = 0x00;
        break;

        case 'AGV 2':
          name = 0x01;
        break;

        case 'AGV 3':
          name = 0x02;
        break;
        default:
          name = 0x00;
          break;
      }

      Buffer.alloc(6);
      Buffer.allocUnsafe(6);
      queueTCP.enqueue(Buffer.from([CMD_config, name, agvs[i].proporcional, agvs[i].derivativo, agvs[i].integrativo, CMD_END]));
    }
    return res.json(agvs);
  },

  async store(req, res) {
    const newagv = req.body;

    const agvExists = await agv.findOne({ name: newagv.name });

    if (agvExists) {
      console.log('já existe');
      return res.json(agvExists);
    }

    const agvNew = await agv.create({
      name: newagv.name,
      active: newagv.active,
      proporcional: newagv.proporcional,
      derivativo: newagv.derivativo,
      integrativo: newagv.integrativo,
    });

    return res.json(agvNew);
  },

  async config(req, res) {
    const configAGV = req.body;

    const agvConfig = await agv.findOne({ name: configAGV.name });
    let response;

    if (agvConfig) {
      agvConfig.proporcional = configAGV.proporcional;
      agvConfig.derivativo = configAGV.derivativo;
      agvConfig.integrativo = configAGV.integrativo;
      agvConfig.active = configAGV.active;
      await agvConfig.save();
      response = res.json(agvConfig);
    } else {
      console.log('AGV não existe');
      response = res.status(400).json({ error: 'AGV not exists' });
    }
    return response;
  },

  async deleteAGV(req, res) {
    const deleteAGV = req.body;
    const agvDeletado = await agv.findOne({ name: deleteAGV.name });
    let response;

    if (agvDeletado) {
      await agv.findOneAndDelete({ name: deleteAGV.name });
      response = res.json(agvDeletado);
    } else {
      console.log('AGV não existe');
      response = res.status(400).json({ error: 'AGV not exists' });
    }
    return response;
  },
};
