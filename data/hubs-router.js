const express = require('express');

const Hubs = require('./db.js');

const router = express.Router();

// endpoints beginning with /api/posts go here

router.post('/', (req, res) => {
  const postInfo = req.body;
  if(postInfo.title && postInfo.contents) {
    Hubs.insert(postInfo)
      .then(info => {
        res.status(201).json(info);
      })
      .catch(err => {
        res.status(500).json({ error: "There was an error while saving the post to the database" });
      });
  } else {
    res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
  };
});

router.post('/:id/comments', (req, res) => {
  const comment = req.body;

  Hubs.insertComment(comment)
  .then(comment => {
    if(comment) {
      res.status(201).json({ comment });
    } else {
      res.status(404).json({ message: "The post with the specified ID does not exist." });
    }
  })
  .catch(err => {
    res.status(500).json({ error: "There was an error while saving the comment to the database" });
  });


  if(comment.text) {
    if(comment.post_id) {

      Hubs.insertComment(comment)
      .then(comment => {
        res.status(201).json({ comment });
      })
      .catch(err => {
        res.status(500).json({ error: "There was an error while saving the comment to the database" });
      });

    } else {
      res.status(404).json({ message: "The post with the specified ID does not exist." });
    }

  } else {
    res.status(400).json({ errorMessage: "Please provide text for the comment." });
  }

  
});

router.get('/', (req, res) => {
  Hubs.find()
    .then(data => {
      res.status(200).json({ data });
    })
    .catch(err => {
      res.status(500).json({ error: "There was an error while saving the comment to the database" });
    });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;

  Hubs.findById(id)
    .then(post => {
      if(post.length > 0) {
        res.status(200).json({ post });
      } else {
        res.status(404).json({ message: "The post with the specified ID does not exist." });
      };
    })
    .catch(err => {
      res.status(500).json({ error: "The post information could not be retrieved." })
    });
});

router.get('/:id/comments', (req, res) => {
  const { id } = req.params;

  Hubs.findPostComments(id)
    .then(comments => {
      if(comments.length > 0) {
        res.status(200).json({ comments });
      } else {
        res.status(404).json({ message: "The post with the specified ID does not exist." });
      };
    })
    .catch(err => {
      res.status(500).json({ error: "The comments information could not be retrieved." });
    });
});


router.delete('/:id', (req, res) => {
  const { id } = req.params;

  Hubs.remove(id)
    .then(deletedComment => {
      if(deletedComment) {
        res.status(204).json({ deletedComment });
      } else {
        res.status(404).json({ message: "The post with the specified ID does not exist." })
      }
    })
    .catch(err => {
      res.status(500).json({ error: "The post could not be removed" })
    });
});

router.put('/:id', (req, res) => {
  const changes = req.body;
  const { id } = req.params;

  if(changes.title && changes.contents) {
    Hubs.update(id, changes)
      .then(post => {
        if (post) {
          res.status(200).json({ changes })
        } else {
          res.status(404).json({ message: "The post with the specified ID does not exist." })
        }
      })
      .catch(err => {
        res.status(500).json({ error: "The post information could not be modified." })
      });
  } else {
    res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
  };
  
});

module.exports = router;