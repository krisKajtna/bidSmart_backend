export default () => ({
    database: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET,
});
