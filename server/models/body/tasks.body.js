export const taskBody = (req) => {
    const task = {
        name: req.body.name,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        assignee: req.body.assignee,
        projectName: req.body.projectName,
        projectDescription: req.body.projectDescription,
        priority: req.body.priority,
        files: req.body.files,
    }

    return task;
}