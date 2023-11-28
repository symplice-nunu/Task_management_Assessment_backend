import Hapi from '@hapi/joi';

export const validateTasks = (user) => {
    const schema = Hapi.object().keys({
        name: Hapi.string().required(),
        startDate: Hapi.date().required(),
        endDate: Hapi.date().required(),
        assignee: Hapi.array().required(),
        projectName: Hapi.string().required(),
        projectDescription: Hapi.string().required(),
        priority: Hapi.string().required(),
        files: Hapi.array(),
    })

    return schema.validate(user);
}