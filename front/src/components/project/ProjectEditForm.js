import React, { useState } from "react";
import { Box, TextField, Stack, Button } from "@mui/material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import * as Api from "../../api";
import { dateToString } from "../../utils";

function ProjectEditForm({ project, setProjects, setClickEditBtn }) {
  const [title, setTitle] = useState(project.title); // 프로젝트 제목을 저장할 상태입니다.
  const [description, setDescription] = useState(project.description); // 프로젝트 상세내역을 저장할 상태입니다.
  const [startDate, setStartDate] = useState(new Date(project.from)); // 프로젝트 시작일(Date type)을 저장할 상태입니다.
  const [dueDate, setDueDate] = useState(new Date(project.to)); // 프로젝트 마감일(Date type)을 저장할 상태입니다.

  // submit event handler 입니다.
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Date type의 시작일, 마감일 상태를 YYYY-MM-DD의 문자열로 바꿉니다.
    const from = dateToString(startDate);
    const to = dateToString(dueDate);

    // 프로젝트 수정을 위해 프로젝트 제목, 상세내역, 시작일, 마감일을 객체로 저장합니다.
    const dataToSubmit = {
      title,
      description,
      from,
      to,
    };

    // projects/프로젝트id 로 PUT 요청을 보내 해당 프로젝트의 내용을 수정합니다.
    await Api.put(`projects/${project.id}`, dataToSubmit);

    // project-lists/유저id로 GET 요청을 보내 업데이트 사항이 반영된 프로젝트를 새로 저장합니다.
    const res = await Api.get("project-lists", project.user.id);
    setProjects(res.data.projects);

    // 프로젝트 편집 후 EditForm을 닫아줍니다.
    setClickEditBtn(false);
  };

  return (
    <Box component="form" onSubmit={onSubmitHandler} sx={{ mt: 1 }}>
      <Stack spacing={2}>
        <TextField
          required
          label="프로젝트 제목"
          onChange={(e) => setTitle(e.target.value)}
          defaultValue={title}
        />
        <TextField
          required
          label="상세내역"
          onChange={(e) => setDescription(e.target.value)}
          defaultValue={description}
        />
      </Stack>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <DesktopDatePicker
            label="from"
            inputFormat={"yyyy-MM-dd"}
            mask={"____-__-__"}
            value={startDate}
            maxDate={dueDate}
            onChange={(date) => setStartDate(date)}
            renderInput={(params) => <TextField {...params} />}
          />
          <DesktopDatePicker
            label="to"
            inputFormat={"yyyy-MM-dd"}
            mask={"____-__-__"}
            value={dueDate}
            minDate={startDate}
            onChange={(date) => setDueDate(date)}
            renderInput={(params) => <TextField {...params} />}
          />
        </Stack>
      </LocalizationProvider>
      <Stack
        direction="row"
        spacing={2}
        sx={{ mt: 2, justifyContent: "center" }}
      >
        <Button variant="contained" type="submit" sx={ButtonStyle.confirm} disableElevation disableRipple>
          확인
        </Button>{" "}
        <Button
          type="reset"
          onClick={() => setClickEditBtn(false)}
          variant="outlined"
          sx={ButtonStyle.cancel}
        >
          취소
        </Button>{" "}
      </Stack>
    </Box>
  );
}

export default ProjectEditForm;

const ButtonStyle = {
  confirm : { bgcolor: '#D0CE7C', color: '#31311C',
':hover': {
  bgcolor: '#b1b068',
  color: 'white',
}
},
  cancel: { border: 'solid 1px #db3f2b', color: '#db3f2b', 
':hover': {
  bgcolor: '#bd3421',
  color: 'white',
  border: '0px'
}
},
}