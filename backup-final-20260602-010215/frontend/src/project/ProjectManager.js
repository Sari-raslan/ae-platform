export class ProjectManager {
  save(projectData) {
    const blob = new Blob([JSON.stringify(projectData, null, 2)], {
      type: "application/json"
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "UniversalArrangerProject.uaosproject.json";
    a.click();

    URL.revokeObjectURL(url);
  }

  async load(file) {
    const text = await file.text();
    return JSON.parse(text);
  }
}

export const projectManager = new ProjectManager();
