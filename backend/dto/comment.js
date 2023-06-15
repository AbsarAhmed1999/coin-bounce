class CommentDto {
  constructor(comment) {
    this.id = comment.id;
    this.createdAt = comment.createdAt;
    this.content = comment.content;
    this.authorUserName = comment.author.username;
  }
}

module.exports = CommentDto;
