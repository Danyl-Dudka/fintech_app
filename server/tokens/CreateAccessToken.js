import jwt from 'jsonwebtoken';

export function createAccessToken(user) {
    return jwt.sign(
        {userId: user._id},
        process.env.JWT_ACCESS_SECRET,
        {expiresIn: '1h'}
    )
}