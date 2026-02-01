import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/ThemeContext';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { typography } from '@/theme/typography';
import { getGlassStyle } from '@/styles/common';
import { CountUpText } from '@/components/ui/CountUpText';

interface ProfileCompletionTrackerProps {
    profile: any;
    isCollaborator?: boolean;
}

export const ProfileCompletionTracker: React.FC<ProfileCompletionTrackerProps> = ({ profile, isCollaborator }) => {
    const { theme } = useTheme();
    const progressAnim = React.useRef(new Animated.Value(0)).current;

    const completion = React.useMemo(() => {
        if (!profile) return 0;
        let weights: { [key: string]: number };

        if (isCollaborator) {
            weights = {
                firstName: 25,
                lastName: 25,
                profilePicture: 25,
                coverImage: 25,
            };
        } else {
            weights = {
                firstName: 5,
                lastName: 5,
                bio: 10,
                profilePicture: 15,
                coverImage: 10,
                phoneNumber: 5,
                email: 5,
                specialization: 10,
                yearsOfExperience: 10,
                clinicName: 10,
                clinicAddress: 10,
                education: 5,
            };
        }

        let completedPoints = 0;
        if (isCollaborator) {
            if (profile.firstName) completedPoints += weights.firstName;
            if (profile.lastName) completedPoints += weights.lastName;
            if (profile.profilePicture) completedPoints += weights.profilePicture;
            if (profile.coverImage) completedPoints += weights.coverImage;
        } else {
            if (profile.firstName) completedPoints += weights.firstName;
            if (profile.lastName) completedPoints += weights.lastName;
            if (profile.bio) completedPoints += weights.bio;
            if (profile.profilePicture) completedPoints += weights.profilePicture;
            if (profile.coverImage) completedPoints += weights.coverImage;
            if (profile.phoneNumber) completedPoints += weights.phoneNumber;
            if (profile.email) completedPoints += weights.email;
            if (profile.specialization) completedPoints += weights.specialization;
            if (profile.yearsOfExperience) completedPoints += weights.yearsOfExperience;
            if (profile.clinicName) completedPoints += weights.clinicName;
            if (profile.clinicAddress) completedPoints += weights.clinicAddress;
            if (profile.education?.length > 0) completedPoints += weights.education;
        }
        return Math.min(completedPoints, 100);
    }, [profile, isCollaborator]);

    React.useEffect(() => {
        Animated.spring(progressAnim, {
            toValue: completion,
            useNativeDriver: false,
            tension: 20,
            friction: 7,
        }).start();
    }, [completion]);

    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%'],
    });

    return (
        <View style={styles.container}>
            <View style={[styles.card, getGlassStyle(theme)]}>
                <View style={styles.header}>
                    <Text style={styles.title}>Profile Completion</Text>
                    <CountUpText
                        value={completion}
                        suffix="%"
                        style={[styles.percentage, { color: theme.palette.primary[500], fontSize: 18, fontWeight: '700' }]}
                    />
                </View>

                <View style={[styles.progressBackground, { backgroundColor: theme.background.subtle }]}>
                    <Animated.View
                        style={[
                            styles.progressBar,
                            {
                                width: progressWidth,
                                backgroundColor: theme.palette.primary[500]
                            }
                        ]}
                    />
                </View>

                {completion < 100 && (
                    <Text style={styles.tip}>
                        Tip: Complete your profile to build more trust with patients.
                    </Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: spacing.l,
        marginTop: spacing.m,
        marginBottom: spacing.s,
    },
    card: {
        padding: spacing.l,
        borderRadius: radius.xl,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.s,
    },
    title: {
        fontSize: 14,
        fontFamily: typography.fontFamily.bold,
    },
    percentage: {
        fontSize: 16,
        fontFamily: typography.fontFamily.bold,
    },
    progressBackground: {
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        borderRadius: 4,
    },
    tip: {
        fontSize: 12,
        color: 'rgba(100, 116, 139, 0.7)',
        marginTop: spacing.s,
        fontStyle: 'italic',
    }
});
