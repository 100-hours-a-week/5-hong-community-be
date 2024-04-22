// 일단은 in-memory DB
const { posts } = require('./data');

// TODO: pageSize 설정 .env or property 로 이동 (임시 : 5)
const pageSize = 5;
let sequenceId = 10; // 시작 ID

// { postsId, title, contents, createdAt, thumbnail, commentsCount,
// hitsCount, likesCount, ownerId, isVisible }
const save = post => {
  // postsId 가 없는 경우 (insert)
  if (!post.postsId) {
    post.postsId = sequenceId;
    posts.push(post);
    sequenceId++;
    return;
  }

  // postsId 가 있는 경우 (update)
  const postsId = post.postsId;
  const index = posts.findIndex(
    _post => _post.postsId === postsId && _post.isVisible,
  );

  if (index !== -1) {
    posts[index] = post;
    return;
  }
  throw new Error('존재하지 않는 게시글 - 서버 (로직) 오류');
};

// 실제로 삭제하지 않고 isVisible 만 false
const deleteById = postsId => {
  const index = posts.findIndex(
    post => post.postsId === postsId && post.isVisible,
  );

  if (index !== -1) {
    // 해당 게시글을 안보이게 변경
    posts[index].isVisible = false;
    return;
  }
  throw new Error('존재하지 않는 게시글 - 서버 (로직) 오류');
};

// TODO: 네이밍 맘에 안듬 + 로직을 분리해야할 듯?
// slice & desc 임시
const findAllOrderByIdDesc = page => {
  const visiblePosts = posts.filter(post => post.isVisible);

  const totalPosts = visiblePosts.length;

  const startIndex = Math.max(totalPosts - page * pageSize, 0);
  const endIndex = Math.min(totalPosts - (page - 1) * pageSize, totalPosts);

  let result = {
    hasNext: false,
    nextPage: null,
    data: null,
  };

  if (endIndex > 0) {
    const slicedPosts = visiblePosts.slice(startIndex, endIndex);
    const postsSliceDesc = slicedPosts.reverse();
    if (startIndex !== 0) {
      result.hasNext = true;
      result.nextPage = page + 1;
    }
    result.data = postsSliceDesc;
    return result;
  }
  return result; // data 가 null
};

const findById = postsId => {
  return posts.find(post => post.postsId === postsId && post.isVisible);
};

module.exports = {
  save,
  deleteById,
  findAllOrderByIdDesc,
  findById,
};
