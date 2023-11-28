import Hapi from '@hapi/joi';

export const validateSignUp = (user) => {
    const schema = Hapi.object().keys({
        name: Hapi.string().min(2).required(),
        phone: Hapi.string().min(10).max(10).required(),
        password: Hapi.string().min(8).required(),
    })

    return schema.validate(user);
}

export const validateLogin = (user) => {
    const schema = Hapi.object().keys({
        phone: Hapi.string().min(10).max(10).required(),
        password: Hapi.string().required(),
    })

    return schema.validate(user);
}

export const validateForgot = (user) => {
    const schema = Hapi.object().keys({
        phone: Hapi.string().min(10).max(10).required(),
    })

    return schema.validate(user);
}

export const validateNewPassword = (user) => {
    const schema = Hapi.object().keys({
        newPassword: Hapi.string().min(8).required(),
        phone: Hapi.string().min(10).required(),
    })

    return schema.validate(user);
}

