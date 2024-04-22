const { comments } = require('./data');

// TODO: pageSize 설정 .env or property 로 이동 (임시 : 10)
const pageSize = 10;
let sequenceId = 4;  // 시작 ID

// { commentsId, contents, createdAt, ownerId, postsId, isVisible }
const save = (comment) => {
  // commentsId 가 없는 경우 (insert)
  if (!comment.commentsId) {
    comment.commentsId = sequenceId;
    comments.push(comment);
    sequenceId++;
    return;
  }

  // commentsId 가 있는 경우 (update)
  const commentsId = comment.postsId;
  const index = comments.findIndex(_comment =>
    _comment.postsId === commentsId &&
    _comment.isVisible,
  );

  if (index !== -1) {
    comments[index] = comment;
    return;
  }
  throw new Error('존재하지 않는 댓글 - 서버 (로직) 오류');
};

// 실제로 삭제하지 않고 isVisible 만 false
const deleteById = (commentsId) => {
  const index = comments.findIndex((comment) =>
    comment.postsId === commentsId &&
    comment.isVisible,
  );

  if (index !== -1) {  // 해당 게시글을 안보이게 변경
    comments[index].isVisible = false;
    return;
  }
  throw new Error('존재하지 않는 댓글 - 서버 (로직) 오류');
};

const findById = (commentsId) => {
  return comments.find((comment) =>
    comment.id === commentsId &&
    comment.isVisible,
  );
};

// TODO: 네이밍 맘에 안듬 + 로직을 분리해야할 듯?
// slice & desc 임시
const findAllByPostsIdOrderByIdDesc = (postsId, page) => {
  const visibleComments = comments.filter((comment) =>
    comment.postsId === postsId && comment.isVisible,
  );

  const totalComments = visibleComments.length;

  const startIndex = Math.max(totalComments - (page * pageSize), 0);
  const endIndex = Math.min(totalComments - ((page - 1) * pageSize), totalComments);

  let result = {
    hasNext: false,
    nextPage: null,
    data: null,
  };

  if (endIndex > 0) {
    const sliceComments = visibleComments.slice(startIndex, endIndex);
    const commentsSliceDesc = sliceComments.reverse();
    if (startIndex !== 0) {
      result.hasNext = true;
      result.nextPage = page + 1;
    }
    result.data = commentsSliceDesc;
    return result;
  }
  return result;  // data 가 null
};

module.exports = {
  save,
  deleteById,
  findById,
  findAllByPostsIdOrderByIdDesc,
};
