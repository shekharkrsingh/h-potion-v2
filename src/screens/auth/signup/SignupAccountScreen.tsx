import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { View, Alert } from 'react-native';
import { RootState } from '@/store';
import { updateSignupData } from '@/store/slices/authSlice';
import { AuthStepLayout } from '@/components/shared/AuthStepLayout';
import { Input } from '@/components/ui/Input';
import { useTheme } from '@/theme/ThemeContext';
import { User } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { AuthFooter } from '@/components/auth/AuthFooter';
import { AuthLogo } from '@/components/auth/AuthLogo';
import { createStyles } from '@/styles/auth/signup-account.styles';
import { VerificationBadge } from '@/components/ui/VerificationBadge';

export default function SignupAccountScreen() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const signupData = useSelector((state: RootState) => state.auth.signupData);

    const [firstName, setFirstName] = useState(signupData.firstName || '');
    const [lastName, setLastName] = useState(signupData.lastName || '');

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!firstName) newErrors.firstName = 'First name is required';
        if (!lastName) newErrors.lastName = 'Last name is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validate()) {
            dispatch(updateSignupData({ firstName, lastName }));
            router.push('/(auth)/signup/credentials');
        }
    };

    return (
        <AuthStepLayout
            title="Clinical Registration"
            subtitle="Begin your professional onboarding to the H-Potion medical ecosystem."
            primaryButtonTitle="Next: Essential Details"
            onPrimaryPress={handleNext}
            onBack={() => router.back()}
            primaryButtonDisabled={!firstName || !lastName}
            onHelp={() => Alert.alert('Help', 'Need assistance? Contact support@hpotion.com')}
            footer={<AuthFooter mode="signup" />}
            /* socialLogins={<SocialLoginButtons />} [TEMP DISABLED] */
            logo={<AuthLogo />}
        >
            <View style={styles.container}>
                <View>
                    <Input
                        label="First Name"
                        placeholder="John"
                        value={firstName}
                        onChangeText={setFirstName}
                        error={errors.firstName}
                        leftIcon={<User size={20} color={theme.text.tertiary} />}
                    />
                    <VerificationBadge visible={firstName.length > 1} style={{ top: 42 }} />
                </View>

                <View>
                    <Input
                        label="Last Name"
                        placeholder="Doe"
                        value={lastName}
                        onChangeText={setLastName}
                        error={errors.lastName}
                        leftIcon={<User size={20} color={theme.text.tertiary} />}
                    />
                    <VerificationBadge visible={lastName.length > 1} style={{ top: 42 }} />
                </View>
            </View>
        </AuthStepLayout>
    );
}
