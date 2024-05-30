/**
 * 커서 기반의 페이징 응답을 위한 유틸 클래스
 * @param listOfData 페이징 처리할 데이터 List
 * @param viewMaxNum 응답으로 보여줄 최대 List 개수
 * @param cursorKey cursor 로 사용할 Key
 * @returns {{hasNext: boolean, nextCursor: null | number, data}}
 */
const sliceResponse = (listOfData, viewMaxNum, cursorKey) => {
  let hasNext = false;
  let nextCursor = null;

  if (listOfData.length > viewMaxNum) {
    hasNext = true;
    const popLastData = listOfData.pop();
    nextCursor = popLastData[cursorKey];
  }

  return {
    hasNext,
    nextCursor,
    data: listOfData,
  };
};

module.exports = {
  sliceResponse,
};
