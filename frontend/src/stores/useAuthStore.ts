import { create } from 'zustand';
import { toast } from 'sonner';
import { authService } from '@/services/authService';
import type { AuthState } from '@/types/store';

export const useAuthStore = create<AuthState>((set, get) => ({
    accessToken: null,
    user: null,
    loading: false,

    clearState: () => {
        set({accessToken: null, user: null, loading: false,});
    },

    setAccessToken: (accessToken) => {
        set({accessToken});
    },

    signUp: async (username, password, email, firstName, lastName) => {
        try {
            set({ loading: true });
            await authService.signUp(username, password, email, firstName, lastName);
            toast.success('Sign up successfully! You will be moved to sign in page shortly.');
        } catch (error) {
            console.error(error);
            toast.error('Sign up unsuccessful!');
        } finally {
            set({ loading: false });
        }
    },

    signIn: async (username, password) => {
        try {
            set({ loading: true });
            const { accessToken } = await authService.signIn(username, password);
            get().setAccessToken(accessToken);
            await get().fetchMe();
            toast.success('Sign in successfully! Welcome back to Moji 🎉');
        } catch (error) {
            console.error(error);
            toast.error('Sign in unsuccessful!');
        } finally {
            set({ loading: false });
        }
    },

    signOut: async () => {
        try {
            get().clearState();
            await authService.signOut();
            toast.success('Sign out successful!');
        } catch (error) {
            console.error(error);
            toast.error('Sign out unsuccessful!');
        }
    },

    fetchMe: async () => {
        try {
            set({loading: true});
            const user = await authService.fetchMe();
            set({user});
        } catch (error) {
            console.error(error);
            set({user: null, accessToken: null})
            toast.error("Error occured when fetching user's data. Please try again!")
        } finally{
            set({loading:false});
        }
    },

    refresh: async () => {
        try {
            set({loading: true});
            
            const {user, fetchMe, setAccessToken} = get();
            const {accessToken} = await authService.refresh();

            setAccessToken(accessToken);

            if (!user){
                await fetchMe;
            }
        } catch (error) {
            console.error(error);
            get().clearState();
        } finally{
            set({loading: false});
        }
    }
}));