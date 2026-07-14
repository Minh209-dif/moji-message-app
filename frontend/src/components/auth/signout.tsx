import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/useAuthStore';
import { useNavigate } from 'react-router';

const SignoutButton = () =>{
    const { signOut } = useAuthStore();
    const navigate = useNavigate();
    const handleSignout = async () => {
        try {
            await signOut();
            navigate('/signin');
        } catch (error) {
            console.error(error);
        }
    }


    return (<Button onClick={handleSignout}>Sign out</Button>)
}

export default SignoutButton;