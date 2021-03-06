import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import * as Api from "../../api";
import { DispatchContext } from "../../App";
import {
  Avatar,
  Button,
  TextField,
  Card,
  Container,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Snackbar,
  Alert,
  Stack,
} from "@mui/material";

import AlertError from "../utils/AlertError";

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useContext(DispatchContext);

  const [email, setEmail] = useState(""); //useState로 email 상태를 생성함.
  const [password, setPassword] = useState(""); //useState로 password 상태를 생성함.
  const [errorMessage, setErrorMessage] = useState(null); // 에러 메세지를 저장합니다.
  const [isOpenDialog, setIsOpenDialog] = useState(false); // 비밀번호 찾기 창 띄우기 여부를 저장합니다.
  const [sendMailSucc, setSendMailSucc] = useState(false); // 메일 전송 성공 여부를 저장합니다.
  const [isEmailValid, setIsEmailValid] = useState(false); // 이메일이 유효한 값인지 boolean 값으로 저장합니다.
  const [isPasswordValid, setIsPasswordValid] = useState(false); // 비밀번호가 유효한 값인지 boolean 값으로 저장합니다.
  const [isFormValid, setIsFormVaild] = useState(false); // 폼이 유효한 값인지 boolean 값으로 저장합니다.

  // 이메일이 abc@example.com 형태인지 regex를 이용해 확인함.
  const validateEmail = (email) => {
    const reg_email =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return reg_email.test(email.toLowerCase());
  };

  // 위 2개 조건이 모두 동시에 만족되는지 여부를 확인함.
  useEffect(() => {
    setIsFormVaild(isEmailValid && isPasswordValid);
  }, [isEmailValid, isPasswordValid]);

  // 폼이 모두 유효한 값이면 에러메세지 없앰
  useEffect(() => {
    if (isFormValid) {
      setErrorMessage(null);
    }
  }, [isFormValid]);

  // 이메일 유효한지 확인
  useEffect(() => {
    setIsEmailValid(validateEmail(email));
  }, [email]);

  // 비밀번호 유효한지 확인
  useEffect(() => {
    setIsPasswordValid(password.length >= 4);
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // "users/login" 엔드포인트로 post요청함.
      const res = await Api.post("users/login", {
        email,
        password,
      });

      // 유저 정보는 response의 data임.
      const user = res.data.user;

      // JWT 토큰은 유저 정보의 token임.
      const jwtToken = user.token;
      // sessionStorage에 "userToken"이라는 키로 JWT 토큰을 저장함.
      sessionStorage.setItem("userToken", jwtToken);
      // dispatch 함수를 이용해 로그인 성공 상태로 만듦.
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: user,
      });

      // 기본 페이지로 이동함.
      navigate("/", { replace: true });
    } catch (err) {
      setErrorMessage(err.response.data.error.message);
    }
  };

  const guestLoginBtnClick = async (e) => {
    try {
      // "users/login" 엔드포인트로 post요청함.
      const res = await Api.post("users/login", {
        email: process.env.REACT_APP_GUEST_ID,
        password: process.env.REACT_APP_GUEST_PW,
      });

      // 유저 정보는 response의 data임.
      const user = res.data.user;

      // JWT 토큰은 유저 정보의 token임.
      const jwtToken = user.token;
      // sessionStorage에 "userToken"이라는 키로 JWT 토큰을 저장함.
      sessionStorage.setItem("userToken", jwtToken);
      // dispatch 함수를 이용해 로그인 성공 상태로 만듦.
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: user,
      });

      // 기본 페이지로 이동함.
      navigate("/", { replace: true });
    } catch (err) {
      setErrorMessage(err.response.data.error.message);
    }
  };

  // 입력받은 Email로 임시 비밀번호를 보내는 함수입니다.
  const sendMailHandler = async (e) => {
    try {
      await Api.post("users/password", {
        email,
      });

      setSendMailSucc(true);
      setIsOpenDialog(false);
    } catch (err) {
      setErrorMessage(err.response.data.error.message);
    }
  };

  const emailInputChecker = () => {
    if (!isEmailValid) {
      // 에러 메세지 출력
      setErrorMessage("이메일 형식이 올바르지 않습니다.");
    } else {
      setErrorMessage(null);
    }
  };
  const passwordInputChecker = () => {
    if (!isPasswordValid) {
      // 에러 메세지 출력
      setErrorMessage("비밀번호는 4글자 이상입니다.");
    } else {
      setErrorMessage(null);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Card
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "white",
          padding: 2,
          borderRadius: 2,
          fontFamily: "Elice Digital Baeum",
        }}
      >
        <Avatar
          src="/logo.png"
          variant="square"
          alt="logo"
          sx={{ width: 128, height: 128, mb: 0 }}
        />
        <Typography
          sx={{
            fontFamily: "Elice Digital Baeum",
            fontSize: "22px",
            fontWeight: 600,
          }}
        >
          로그인
        </Typography>

        <TextField
          margin="normal"
          name="email"
          label="이메일 주소"
          fullWidth
          autoComplete="email"
          required
          value={email}
          onBlur={emailInputChecker}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          margin="normal"
          name="password"
          label="비밀번호"
          type="password"
          fullWidth
          autoComplete="current-password"
          required
          value={password}
          onBlur={passwordInputChecker}
          onChange={(e) => setPassword(e.target.value)}
        />

        {errorMessage && <AlertError message={errorMessage} />}

        <Button
          type="submit"
          name="LOGIN"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 1 }}
          disabled={!isFormValid}
          onClick={handleSubmit}
        >
          로그인
        </Button>
        <Button
          type="submit"
          name="GUEST"
          fullWidth
          variant="contained"
          color="secondary"
          sx={{ mb: 2 }}
          onClick={guestLoginBtnClick}
        >
          게스트계정으로 살펴보기
        </Button>
        <Grid container>
          <Grid item xs>
            <Button variant="text" onClick={() => setIsOpenDialog(true)}>
              비밀번호 찾기
            </Button>
          </Grid>
          <Grid item>
            <Button variant="text" onClick={() => navigate("/register")}>
              회원가입
            </Button>
          </Grid>
        </Grid>
      </Card>

      {isOpenDialog && (
        <Dialog open={isOpenDialog} onClose={() => setIsOpenDialog(false)}>
          <DialogTitle>비밀번호 찾기</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              아이디를 입력하세요
            </DialogContentText>
            <TextField
              margin="normal"
              name="email"
              label="아이디"
              required
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errorMessage && (
              <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                open={!sendMailSucc}
                autoHideDuration={6000}
                onClose={() => {
                  setSendMailSucc(false);
                  setErrorMessage(null);
                }}
              >
                <Alert severity="error" sx={{ width: "100%" }}>
                  존재하지 않는 사용자입니다. 다시 한 번 확인해 주세요!
                </Alert>
              </Snackbar>
            )}
          </DialogContent>
          <DialogActions sx={{ mt: 2, justifyContent: "center" }}>
            <Stack direction="row" spacing={2}>
              <Button onClick={() => setIsOpenDialog(false)} color="error">
                취소
              </Button>
              <Button onClick={sendMailHandler}>보내기</Button>
            </Stack>
          </DialogActions>
        </Dialog>
      )}

      {sendMailSucc && (
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={sendMailSucc}
          autoHideDuration={6000}
          onClose={() => setSendMailSucc(false)}
        >
          <Alert severity="success" sx={{ width: "100%" }}>
            메일이 성공적으로 발송되었습니다! 메일함으로 가 새 비밀번호를
            확인하세요!
          </Alert>
        </Snackbar>
      )}
    </Container>
  );
};

export default LoginForm;
