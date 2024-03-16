const router = require('express').Router();
const { User, Task } = require('../../models');
const helpers = require('../../utils/helpers');

// GET single task that is being edited
router.get('/:id', async (req, res) => {
  try {
    const taskData = await Task.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    const task = taskData.get({ plain: true });

    res.render('editTask', {
      ...task,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// PUT update a single selected task
router.put('/:id', async (req, res) => {
  try {
    const taskData = await Task.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (!taskData) {
      res.status(404).json({ message: 'No task found with this id!' });
      return;
    }

    res.status(200).json(taskData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE a single selected task
router.delete('/:id', async (req, res) => {
  try {
    const taskData = await Task.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!taskData) {
      res.status(404).json({ message: 'No task found with this id!' });
      return;
    }

    res.status(200).json(taskData);
    res.redirect('/mainPage.js'); // redirect to mainPage.js
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;