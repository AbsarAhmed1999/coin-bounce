const Joi = require("joi");
const Comment = require("../models/comment");
const CommentDto = require("../dto/comment");
const mongodbIdPattern = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/;
const commentController = {
  async create(req, res, next) {
    const createCommentSchema = Joi.object({
      content: Joi.string().required(),
      author: Joi.string().regex(mongodbIdPattern).required(),
      blog: Joi.string().regex(mongodbIdPattern).required(),
    });
    const { error } = createCommentSchema.validate(req.body);
    const { content, author, blog } = req.body;

    try {
      const newComment = new Comment({
        content,
        author,
        blog,
      });
      await newComment.save();
    } catch (e) {
      return next(e);
    }
    return res.status(201).json({ message: "comment created" });
  },
  async getById(req, res, next) {
    const getByIdSchema = Joi.object({
      id: Joi.string().regex(mongodbIdPattern).required(),
    });

    const { error } = getByIdSchema.validate(req.params);

    if (error) {
      return next(error);
    }
    const { id } = req.params;
    let comments;
    try {
      comments = await Comment.find({ blog: id }).populate("author");
    } catch (e) {
      return next(e);
    }
    let commentsDto = [];
    for (let i = 0; i < comments.length; i++) {
      const obj = new CommentDto(comments[i]);
      commentsDto.push(obj);
    }
    return res.status(200).json({ data: commentsDto });
  },
};
module.exports = commentController;
