import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, FlatList, ActivityIndicator, Modal } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { switchActiveDoctor, AssociatedDoctor } from '@/store/slices/activeDoctorSlice';
import { useTheme } from '@/theme/ThemeContext';
import { Text } from '@/components/ui/Text';
import { BaseEditModal } from '@/components/profile/edit/modals/BaseEditModal';
import { ChevronDown, Check, User, Building, Landmark } from 'lucide-react-native';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { typography } from '@/theme/typography';
import { getFullImageUrl } from '@/utils/formatters';
import { haptics } from '@/utils/haptics';
import { getGlassStyle } from '@/styles/common';
import { ScalePress } from '@/components/ui/ScalePress';
import { ShineView } from '@/components/ui/ShineView';
import { Skeleton } from '@/components/ui/Skeleton';

interface DoctorSwitcherProps {
    /** Whether to show the built-in card trigger. Default: true */
    showTrigger?: boolean;
    /** External visibility control for the modal. Used when showTrigger is false. */
    externalVisible?: boolean;
    /** Callback when the modal is closed in externally-controlled mode. */
    onExternalClose?: () => void;
}

export const DoctorSwitcher: React.FC<DoctorSwitcherProps> = ({
    showTrigger = true,
    externalVisible,
    onExternalClose,
}) => {
    const { theme } = useTheme();
    const dispatch = useDispatch<AppDispatch>();
    const [internalVisible, setInternalVisible] = useState(false);

    // Determine modal visibility: external control takes precedence when trigger is hidden
    const isModalVisible = showTrigger ? internalVisible : (externalVisible ?? false);
    const closeModal = showTrigger
        ? () => setInternalVisible(false)
        : () => onExternalClose?.();

    const { doctors, activeDoctorId, isSwitching, isLoading, hasLoaded } = useSelector(
        (state: RootState) => state.activeDoctor
    );

    const activeDoctor = doctors.find(d => d.doctorId === activeDoctorId);

    const handleSelectDoctor = async (doctor: AssociatedDoctor) => {
        if (doctor.doctorId === activeDoctorId) {
            closeModal();
            return;
        }
        haptics.impact();
        closeModal();
        try {
            await dispatch(switchActiveDoctor(doctor.doctorId)).unwrap();
        } catch (error) {
            console.error('Failed to switch active doctor:', error);
        }
    };

    const shouldShowSkeleton = !hasLoaded && doctors.length === 0;

    if (shouldShowSkeleton && showTrigger) {
        return (
            <View style={[styles.card, getGlassStyle(theme)]}>
                <View style={styles.leftContent}>
                    <Skeleton width={42} height={42} borderRadius={radius.m} style={{ marginRight: spacing.m }} />
                    <View style={styles.textContainer}>
                        <Skeleton width={80} height={10} style={{ marginBottom: 6 }} />
                        <Skeleton width={120} height={16} style={{ marginBottom: 4 }} />
                        <Skeleton width={100} height={12} />
                    </View>
                </View>
                <Skeleton width={60} height={26} borderRadius={radius.m} />
            </View>
        );
    }

    if (doctors.length <= 1 && !activeDoctor) {
        return null; // Don't show switcher if not associated with any doctor or only 1 doctor
    }

    const renderDoctorItem = ({ item }: { item: AssociatedDoctor }) => {
        const isSelected = item.doctorId === activeDoctorId;
        const imageUrl = getFullImageUrl(item.profilePicture);

        return (
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleSelectDoctor(item)}
                style={[
                    styles.doctorItem,
                    {
                        backgroundColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.03)' : theme.background.neutral,
                        borderColor: isSelected ? theme.palette.primary[500] : 'transparent',
                    }
                ]}
            >
                <View style={styles.doctorInfoRow}>
                    <View style={styles.avatarContainer}>
                        {item.profilePicture ? (
                            <Image source={{ uri: imageUrl }} style={styles.avatar} />
                        ) : (
                            <View style={[styles.defaultAvatar, { backgroundColor: theme.border.subtle }]}>
                                <User size={20} color={theme.icon.default} />
                            </View>
                        )}
                    </View>

                    <View style={styles.doctorDetails}>
                        <Text style={[styles.doctorName, { color: theme.text.primary }]} weight="bold">
                            {item.doctorName}
                        </Text>
                        <Text style={[styles.doctorSpecialty, { color: theme.text.secondary }]}>
                            {item.specialization || 'General Practitioner'}
                        </Text>
                        {item.clinicName && (
                            <View style={styles.clinicRow}>
                                <Building size={12} color={theme.text.tertiary} style={{ marginRight: 4 }} />
                                <Text style={[styles.clinicText, { color: theme.text.tertiary }]}>
                                    {item.clinicName}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                {isSelected && (
                    <View style={[styles.checkmarkCircle, { backgroundColor: theme.palette.primary[500] }]}>
                        <Check size={14} color="#FFF" />
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <View style={showTrigger ? styles.container : undefined}>
            {showTrigger && (
                <ShineView style={{ borderRadius: radius.l }} delay={2000}>
                    <ScalePress
                        activeOpacity={0.9}
                        onPress={() => {
                            haptics.impact();
                            setInternalVisible(true);
                        }}
                        style={[
                            styles.card,
                            getGlassStyle(theme)
                        ]}
                    >
                        <View style={styles.leftContent}>
                            <View style={[styles.iconContainer, { backgroundColor: theme.mode === 'dark' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.08)' }]}>
                                <Building size={20} color={theme.palette.primary[500]} />
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={[styles.label, { color: theme.text.tertiary }]} variant="caption" weight="bold">
                                    Managing Clinic
                                </Text>
                                <Text style={[styles.doctorNameText, { color: theme.text.primary }]} weight="bold">
                                    {activeDoctor ? activeDoctor.doctorName : 'Select Doctor'}
                                </Text>
                                {activeDoctor?.clinicName && (
                                    <Text style={[styles.clinicNameText, { color: theme.text.secondary }]} variant="caption" numberOfLines={1}>
                                        {activeDoctor.clinicName}
                                    </Text>
                                )}
                            </View>
                        </View>
                        <View style={[styles.switchBadge, { backgroundColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)' }]}>
                            <Text style={{ color: theme.palette.primary[500], fontSize: 12 }} weight="bold">Switch</Text>
                            <ChevronDown size={14} color={theme.palette.primary[500]} style={{ marginLeft: 2 }} />
                        </View>
                    </ScalePress>
                </ShineView>
            )}

            {/* Doctor list modal */}
            <BaseEditModal
                visible={isModalVisible}
                title="Select Doctor to Manage"
                onClose={closeModal}
            >
                <FlatList
                    data={doctors}
                    keyExtractor={item => item.doctorId}
                    renderItem={renderDoctorItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            </BaseEditModal>

            {/* Global switching indicator */}
            <Modal transparent visible={isSwitching} animationType="fade">
                <View style={styles.overlayContainer}>
                    <View style={[styles.loadingBox, { backgroundColor: theme.background.default }]}>
                        <ActivityIndicator size="large" color={theme.palette.primary[500]} />
                        <Text style={[styles.loadingText, { color: theme.text.primary }]} weight="semibold">
                            Switching Clinic Context...
                        </Text>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: spacing.s,
    },
    card: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.m,
        borderRadius: radius.l,
    },
    leftContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 42,
        height: 42,
        borderRadius: radius.m,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.m,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        marginRight: spacing.s,
    },
    label: {
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 2,
    },
    doctorNameText: {
        fontSize: 15,
        marginBottom: 1,
    },
    clinicNameText: {
        fontSize: 12,
        opacity: 0.9,
    },
    switchBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.s,
        paddingVertical: 6,
        borderRadius: radius.m,
    },
    listContent: {
        paddingBottom: spacing.m,
    },
    doctorItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.m,
        borderRadius: radius.l,
        borderWidth: 1,
        marginBottom: spacing.s,
    },
    doctorInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatarContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        overflow: 'hidden',
        marginRight: spacing.m,
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    defaultAvatar: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    doctorDetails: {
        flex: 1,
    },
    doctorName: {
        fontSize: 15,
        marginBottom: 2,
    },
    doctorSpecialty: {
        fontSize: 13,
        marginBottom: 4,
    },
    clinicRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    clinicText: {
        fontSize: 12,
    },
    checkmarkCircle: {
        width: 22,
        height: 22,
        borderRadius: 11,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: spacing.s,
    },
    overlayContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingBox: {
        padding: spacing.xl,
        borderRadius: radius.xl,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    loadingText: {
        marginTop: spacing.m,
        fontSize: 15,
    },
});
