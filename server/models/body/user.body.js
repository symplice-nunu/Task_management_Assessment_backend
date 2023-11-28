export const createUser = (req) => {
    const user = {
        name: req.body.name,
        phone: req.body.phone,
        password: req.body.password,
    }

    return user;
}

export const loginUser = (req) => {
    const user = {
        phone: req.body.phone,
        password: req.body.password,
    }

    return user;
}

export const otp = (req) => {
    const otp = {
        phone: req.body.phone,
    }

    return otp;
}

export const recoverPassword = (req) => {
    const recover = {
        phone: req.body.phone,
        newPassword: req.body.newPassword,
    }

    return recover;
}
