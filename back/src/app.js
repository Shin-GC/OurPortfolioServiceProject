import cors from "cors";
import express from "express";
import { userAuthRouter } from "./routers/userRouter.js";
import { educationRouter } from "./routers/educationRouter.js";
import { awardRouter } from "./routers/awardRouter.js";
import { certificateRouter } from "./routers/certificateRouter.js";
import { projectRouter } from "./routers/projectRouter.js";
import { careerRouter } from "./routers/careerRouter.js";
import { techRouter } from "./routers/techRouter.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import { multerRouter } from "./routers/multerRouter.js";
import morgan from "morgan";
const app = express();
// app.use(morgan);
// CORS 에러 방지
app.use(cors());
app.use(morgan("tiny"));
// express 기본 제공 middleware
// express.json(): POST 등의 요청과 함께 오는 json형태의 데이터를 인식하고 핸들링할 수 있게 함.
// express.urlencoded: 주로 Form submit 에 의해 만들어지는 URL-Encoded 형태의 데이터를 인식하고 핸들링할 수 있게 함.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("uploads"));
// 기본 페이지
app.get("/", (req, res) => {
  res.send("express 백엔드 서버 동작");
});

// router, service 구현 (userAuthRouter는 맨 위에 있어야 함.)
app.use(userAuthRouter);
app.use(certificateRouter);
app.use(educationRouter);
app.use(awardRouter);
app.use(projectRouter);
app.use(careerRouter);
app.use(techRouter);
app.use(multerRouter);
// 순서 중요 (router 에서 next() 시 아래의 에러 핸들링  middleware로 전달됨)
app.use(errorMiddleware);

export { app };
