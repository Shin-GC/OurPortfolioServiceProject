import React, { useState, useEffect } from "react";
import * as Api from "../../api";

//mui
import { Button, Container, Card, CardContent, Typography, Avatar } from "@mui/material";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";
import EditIcon from "@mui/icons-material/Edit";
import GitHubIcon from "@mui/icons-material/GitHub";
import InstagramIcon from "@mui/icons-material/Instagram";
import WysiwygIcon from "@mui/icons-material/Wysiwyg";
import AlertError from "../utils/AlertError";

import { defaultImage, getImageBaseUrl } from "../../utils";

function UserCard({
  user,
  setUser,
  setIsEditing,
  isEditable,
  portfolioOwnerId,
}) {
  const [clickHeart, setClickHeart] = useState(false); // 좋아요 boolean 값을 서버로 부터 받아와 저장합니다
  const [heartCount, setHeartCount] = useState(0); //좋아요 count를 서버로 부터 받아와 저장합니다
  const [errorMessage, setErrorMessage] = useState(null); // 에러 메세지를 저장합니다.
  const imageBaseUrl = getImageBaseUrl(); // 이미지의 baseUrl을 저장합니다.

  // 포트폴리오 주인이 바뀔때 마다 갱신
  useEffect(() => {
    Api.get("users", portfolioOwnerId).then((res) => {
      const userResult = res.data.user;
      setHeartCount(userResult.like.count);
      setClickHeart(userResult.isLikedByThisUser);
    });
  }, [portfolioOwnerId]);

  const onHeartHandler = async () => {
    try {
      await Api.post(`users/${user.id}/likes`);

      const res = await Api.get("users", portfolioOwnerId);
      setUser(res.data.user);
      setHeartCount(res.data.user.like.count);
      setClickHeart(res.data.user.isLikedByThisUser);
    } catch (err) {
      setErrorMessage(err.response.data.error.message);
    }
  };

  // AlertError 창을 닫는 함수
  const errorClose = () => {
    setErrorMessage(null);
  }

  //  visible 기능에 따른 부가 컴포넌트 생성
  const TypographyEmail = () => {
    if (user?.permission?.email === false) {
      return <Typography />;
    } else {
      return (
        <Typography
          className="text-muted"
          sx={{
            fontFamily: "Elice Digital Baeum",
            fontSize: "13px",
            fontWeight: 500,
            mb: '12px'
          }}
        >
          {user?.email}
        </Typography>
      );
    }
  };
  const TypographyDescription = () => {
    if (user?.permission?.description === false) {
      return <Typography />;
    } else {
      return <Typography sx={{
        fontFamily: "Elice Digital Baeum",
        fontSize: "16px",
        fontWeight: 500,
      }}>{user?.description}</Typography>;
    }
  };

  return (
    <>
      <Card sx={{ marginBottom: "20px" }}>
        <CardContent align="center">
          <Container style={{ marginBottom: "25px" }}>
            <Avatar
              alt="Remy Sharp"
              src={
                user &&
                (user.profile !== defaultImage
                  ? imageBaseUrl + user.profile
                  : user.profile)
              }
              sx={{
                width: 180,
                height: 180,
                marginTop: "15px",
                marginBottom: "15px",
                border: "3px double #9999A1",
              }}
            />
            <Typography
              sx={{
                fontFamily: "Elice Digital Baeum",
                fontSize: "23px",
                fontWeight: 500,
              }}
            >
              {user?.name}
            </Typography>
            <TypographyEmail />
            <TypographyDescription />
          </Container>
          <Container className="text-muted" style={{ fontSize: "12px" }}>
            <Button
              startIcon={clickHeart ? <Favorite /> : <FavoriteBorder />}
              onClick={onHeartHandler}
              style={
                clickHeart
                  ? { color: "red", minWidth: "0", paddingRight: "0" }
                  : { color: "grey", minWidth: "0", paddingRight: "0" }
              }
            />
            <Typography
              sx={{
                fontFamily: "Elice Digital Baeum",
                fontSize: "13px",
                fontWeight: 500,
                display: "inline", 
                m: '0'
              }}
            >
              {heartCount}명이 좋아합니다
            </Typography>
          </Container>
          <Container
            sx={{ marginBottom: "10px" }}
            style={{ paddingRight: "0" }}
          >
            {user?.sns?.github && (<Button
              style={{ color: "black", minWidth: "0", padding: "0" }}
              size="large"
              startIcon={<GitHubIcon />}
              href={user?.sns?.github}
              target="_blank"
            />)}
            {user?.sns?.instagram && (<Button
              style={{ color: "black", minWidth: "0", padding: "0" }}
              size="large"
              startIcon={<InstagramIcon />}
              href={user?.sns?.instagram}
              target="_blank"
            />)}
            {user?.sns?.blog && (<Button
              style={{ color: "black", minWidth: "0", padding: "0" }}
              size="large"
              startIcon={<WysiwygIcon />}
              href={user?.sns?.blog}
              target="_blank"
            />)}
          </Container>
          <Container sx={{ paddingBottom: "0" }}>
            {isEditable && (
              <Button
                onClick={() => setIsEditing(true)}
                startIcon={<EditIcon />}
                sx={{
                  fontFamily: "Elice Digital Baeum",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#C7A27C",
                }}
              >
                {" "}
                편집
              </Button>
            )}
          </Container>
            { errorMessage && <AlertError  message={errorMessage} onClose={errorClose} /> } 
        </CardContent>
      </Card>
    </>
  );
}

export default UserCard;
