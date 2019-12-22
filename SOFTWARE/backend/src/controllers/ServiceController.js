const Posto = require('../models/Posto');
const queueService = require('../Queue/queueService');

module.exports = {
  async index(req, res) {
    const posto = req.body;
    const PostoToGo = await Posto.findOne({ name: posto.posto });
    let respo;

    if (PostoToGo) {
      const name  = PostoToGo.name;

      queueService.enqueue(name);

      const response = { ok: 'ok' };
      respo = res.json(response);
    } else {
      console.log('Posto não existe');
      respo = res.status(400).json({ error: 'Posto not exists' });
    }
    return respo;
  },
};
