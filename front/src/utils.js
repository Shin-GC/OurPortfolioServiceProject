import axios from "axios";

// Date를 YYYY-MM-DD의 문자열로 바꾸는 함수입니다.
export const dateToString = (date) => {
  return (
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    date.getDate().toString().padStart(2, "0")
  );
};

// 학교 정보를 가져오기 위해 open api로 요청을 보낼 api를 만드는 함수입니다.
export function getEducationApi(word) {
  const apiKey = process.env.REACT_APP_API_KEY;
  const target = process.env.REACT_APP_TARGET;
  return axios.create({
    baseURL: "http://www.career.go.kr/cnet/openapi/getOpenApi",
    params: {
      apiKey,
      svcType: "api",
      svcCode: "SCHOOL",
      contentType: "json",
      gubun: target,
      perPage: "3",
      searchSchulNm: word,
    },
  });
}
