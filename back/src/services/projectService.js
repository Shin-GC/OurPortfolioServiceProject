import { Project } from "../db/index.js"; // from을 폴더(db) 로 설정 시, 디폴트로 index.js 로부터 import함.
import { v4 as uuidv4 } from "uuid";
import { updateHandler } from "../utils/utils.js";

class ProjectService {
  static async addProject({ user, title, description, from, to }) {
    // 랜덤 id 부여
    const id = uuidv4();

    const newProject = { id, user, title, description, from, to };

    const createdNewProject = await Project.create({ newProject: newProject });
    createdNewProject.errorMessage = null;

    return createdNewProject;
  }

  static async getProject({ id }) {
    // 유효한 id인지 확인
    const project = await Project.findById({id});

    if (project === null) {
      const error = new Error("존재하지 않는 프로젝트입니다.");
      error.status = 401;
      throw error;
    }

    return project;
  }

  static async getProjects({ user }) {
    const projects = await Project.findByUser({ user });

    if (projects === null) {
      const error = new Error("프로젝트가 없습니다.");
      error.status = 401;
      throw error;
    }

    return projects;
  }

  static async setProject({ id, toUpdate }) {
    // project id를 이용해 프로젝트를 가져옴
    let project = await Project.findById({ id });

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (project === null) {
      const error = new Error("존재하지 않는 프로젝트입니다.");
      error.status = 401;
      throw error;
    }

    // null인 field는 제외하고, 남은 field만 객체에 담음
    const fieldToUpdate = updateHandler(toUpdate);
    project = await Project.update({ id, fieldToUpdate });

    return project;
  }

  static async deleteProject({ id }) {
    // project id를 이용해 프로젝트를 가져옴
    let project = await Project.findById({ id });

    if (project === null) {
      const error = new Error("존재하지 않는 프로젝트입니다.");
      error.status = 404;
      throw error;
    }

    await Project.delete({ id });
  }
}

export { ProjectService };
