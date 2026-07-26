import Conversation from "../models/Conversation.js";
import Friend from "../models/Friend.js";

const pair = (a,b) => {a <b ? [a,b] : [b,a]};

export const checkFriendship = async (req, res, next) => {
    try {
        const me = req.user._id.toString();
        const memberId = req.body?.memberId ?? [];
        const recipientId = req.body?.recipientId ?? null;

        if(!recipientId && memberId.length === 0){
            return res.status(400).json({message: "Require recipientId or memberId"})
        }

        // check friendship in a direct conversation
        if(recipientId){
            const [userA, userB] = pair(me,recipientId);

            const isFriend = Friend.findOne({userA, userB});
            if(!isFriend){
                return res.status(403).json({message: "You two are not friend"})
            }

            return next();
        }

        // check friendship in a group conversation
        const friendChecks = memberId.map(async (memberId) => {
            const [userA, userB] = pair(me, memberId);
            const friend = await Friend.findOne({userA, userB});
            return friend ? null : memberId;
        })
        const results = await Promise.all(friendChecks);
        const notFriends = results.filter(Boolean);
        if(notFriends.length > 0){
            return res.status(403).json({message: "You can only add friends to group", notFriends});
        }

        next();
    } catch (error) {
        console.error("Error when checkFriendship", error);
        return res.status(500).json({message: "Internal server error"})
    }
}