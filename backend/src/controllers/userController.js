export const authMe = async (req, res) => {
    try {
        const user = req.user;
        console.log('authMe called with user:', req.user);
        return res.status(200).json({ message: 'User info fetched successfully', username: req.user.username});
    } catch (error) {
        console.error('Error occurred while fetching user info:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}