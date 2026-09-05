import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import { Navigate, Outlet } from "react-router";
import { useEffect, useState } from "react";

const ProtectedRoute = () => {
    const { accessToken, loading } = useAuthStore();
    const [starting, setStarting] = useState(true);

    const init = async () => {
        const state = useAuthStore.getState();

        if (!state.accessToken) {
            await state.refresh();
        }

        const latestState = useAuthStore.getState();
        if (latestState.accessToken && !latestState.user) {
            await latestState.fetchMe();
        }

        if (useAuthStore.getState().accessToken && useAuthStore.getState().user) {
            await useChatStore.getState().fetchConversation();
        }

        setStarting(false);
    };

    useEffect(() => {
        init();
    }, []);

    if (starting || loading) {
        return <div className="flex h-screen item-center justify-center">Page is loading</div>;
    }

    if (!accessToken) {
        return <Navigate to="/signin" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;