import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '@/store/slices/authSlice';
import { AppDispatch, RootState } from '@/store';
import { useRouter } from 'expo-router';
// import { showToast } from '@/utils/toast'; // We will add this later

export const useAuth = () => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { isLoading, error, user } = useSelector((state: RootState) => state.auth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const validate = () => {
        let isValid = true;
        if (!email) {
            setEmailError('Email is required');
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError('Invalid email format');
            isValid = false;
        } else {
            setEmailError('');
        }

        if (!password) {
            setPasswordError('Password is required');
            isValid = false;
        } else {
            setPasswordError('');
        }
        return isValid;
    };

    const handleLogin = async () => {
        if (!validate()) {
            throw new Error('Please fix the errors above');
        }

        try {
            const result = await dispatch(loginUser({ username: email, password })).unwrap();
            if (result) {
                // Navigate based on role or to home
                router.replace('/(tabs)');
            }
        } catch (err) {
            throw err;
        }
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        emailError,
        passwordError,
        isLoading,
        error,
        handleLogin,
    };
};
