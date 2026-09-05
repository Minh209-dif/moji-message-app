import api from "@/lib/axios";

export const friendService = {
    async searchByUsername(username: string) {
        const res = await api.get(`/users/search?username=${username}`);
        return res.data.user;
    },

    async sendFriendRequest(to: string, message?: string) {
        const res = await api.post("/friends/requests", {to, message});
        return res.data.message;
    },

    async getAllRiendRequest () {
        try {
            const res = await api.get("/friends/requests");
            const {sent, received} = res.data;
            return {sent, received};
        } catch (error) {
            console.error("Error sending getAllFriendRequest: ", error);
        }
    },

    async acceptRequest(requestId: string) {
        try {
            const res = await api.post(`/friends/requests/${requestId}/accept`);
            return res.data.requestAcceptedBy;
        } catch (error) {
            console.error("Error send accept request: ", error);
        }
    },

    async declineRequest(requestId: string) {
        try {
            await api.post(`/friends/request/${requestId}/decline`);
        } catch (error) {
            console.error("Error sending declineRequest: ", error);
        }
    },

    async getFriendList() {
        const res = await api.get("/friends");
        return res.data.friends;
    }
}