import Friend from '../models/Friend.js'
import FriendRequest from '../models/FriendRequest.js';
import User from '../models/User.js';


export const sendFriendRequest = async (req, res) => {
    try {
        const {to, message} = req.body;
        const from = req.user._id;

        if (from === to){
            return res.status(400).json({message: "Cannot send friend request to yourself "});
        }

        const userExists = await User.exists({_id: to})
        if (!userExists){
            return res.status(404).json({message: "User not exist"});
        }

        let userA = from.toString();
        let userB = to.toString();
        if (userA > userB){
            [userA, userB] = [userB, userA];
        }
        const [alreadyFriend, existingRequest] = await Promise.all([
            Friend.findOne({userA, userB}),
            FriendRequest.findOne({
                $or: [
                    {from, to},
                    {from: to, to: from}
                ]
            })
        ])

        if (alreadyFriend){
            return res.status(400).json({message: "Two of you are friend already"})
        }
        if (existingRequest){
            return res.status(400).json({message: "A friend request already existed"})
        }

        const request = await FriendRequest.create({
            from,
            to,
            message
        });

        return res.status(201).json({message: "Successfully send friend request", request});
    } catch (error) {
        console.error('Error sending friend request', error);
        return res.status(500).json({message: 'Internal server error'});
    }
}

export const acceptFriendRequeset = async (req, res) => {
    try {
        const {requestId} = req.params;
        const userId = req.user._id;

        const request = await FriendRequest.findById(requestId);

        if (!request){
            return res.status(404).json({message: "Cannot find friend request"});
        }

        if (request.to.toString() !== userId.toString()){
            return res.status(403).json({message: "You do not have authority to accept this request"})
        }

        const friend = await Friend.create({
            userA: request.from,
            userB: request.to
        })

        await FriendRequest.findByIdAndDelete(requestId)

        const from = await User.findById(request.from).select("_id displayName avatarUrl").lean();

        return res.status(200).json({
            message: "Successfully accept friend request",
            newFriend: {
                _id: from?._id,
                displayName: from?.displayName,
                avataUrl: from?.avatarUrl
            }
        });
    } catch (error) {
        console.error('Error accepting friend request', error);
        return res.status(500).json({message: 'Internal server error'})
    }
}

export const declineFriendRequest = async (req, res) => {
    try {
        const {requestId} = req.params;
        const userId = req.user._id;

        const request = await FriendRequest.findById(requestId);

        if (!request){
            return res.status(404).json({message: "Cannot find friend request"});
        }
        if (request.to.toString() !== userId.toString()){
            return res.status(403).json({message: "You do not have authority to decline this friend request"});
        }

        await FriendRequest.findByIdAndDelete(requestId);
        return res.sendStatus(204);
    } catch (error) {
        console.error('Error declining friend request', error);
        return res.status(500).json({message: 'Internal server error'})
    }
}

export const getAllFriends = async (req, res) => {
    try {
        const userId = req.user._id;

        const friendships = await Friend.find({
            $or: [
                {userA: userId},
                {userB: userId}
            ]
        }).populate("userA", "_id displayName avatarUrl")
        .populate("userB", "_id displayName avatarUrl")
        .lean();

        if(!friendships.length){
            return res.status(200).json({friends: []})
        }

        const friends = friendships.map((f) => 
            f.userA._id.toString() === userId.toString()? f.userB : f.userA
        );

        return res.status(200).json({friends});
    } catch (error) {
        console.error('Error getting list of friends', error);
        return res.status(500).json({message: 'Internal server error'})
    }
}

export const getFriendRequests = async (req, res) => {
    try {
        const userId = req.user._id;

        const populateFields = "_id username displayName avatarUrl";

        const [sent, received] = await Promise.all([
            FriendRequest.find({from: userId}).populate("to", populateFields),
            FriendRequest.find({to: userId}).populate("from", populateFields)
        ]);

        return res.status(200).json({sent, received});

    } catch (error) {
        console.error('Error getting friend request', error);
        return res.status(500).json({message: 'Internal server error'})
    }
};