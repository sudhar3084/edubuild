import jwt from 'jsonwebtoken';

const optionalAuth = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.userId = decoded.id;
            req.userRole = decoded.role;
        }
    } catch (error) {
        // If token is invalid, we just ignore it and proceed as unauthenticated
        // But getting here with a token means it was malformed or expired
        console.warn("Optional auth token failed validation:", error.message);
    }
    next();
};

export default optionalAuth;
