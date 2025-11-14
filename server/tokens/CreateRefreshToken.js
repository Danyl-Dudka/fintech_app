import jwt from 'jsonwebtoken'
export function createRefreshToken(user) {
    return jwt.sign(
        {userId: user._id},
        process.env.JWT_REFRESH_SECRET,
        {expiresIn: '30d'}
    )
}