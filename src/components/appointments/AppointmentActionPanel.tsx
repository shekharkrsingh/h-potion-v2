import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import {
    Edit2,
    MapPin,
    CheckCircle2,
    DollarSign,
    CreditCard,
    Zap,
    XCircle,
    RotateCcw
} from 'lucide-react-native';
import { useTheme } from '@/theme/ThemeContext';
import { Text } from '@/components/ui/Text';
import { useDialog } from '@/context/DialogContext';
import {
    canMarkAvailable,
    canMarkUnavailable,
    canMarkPaid,
    canMarkUnpaid,
    canMarkTreated,
    canMarkUntreated,
    canCancel,
    canEdit,
    canMarkEmergency,
    canReactivate,
    ActionValidation
} from '@/utils/bookingActionHelpers';
import { Appointment } from '@/store/slices/appointmentSlice';
import { haptics } from '@/utils/haptics';
import { shadows } from '@/theme/shadows';
import { radius } from '@/theme/radius';

interface AppointmentActionPanelProps {
    appointment: Appointment;
    onEdit: () => void;
    onToggleAvailability: (val: boolean) => void;
    onTogglePayment: () => void;
    onToggleTreated: () => void;
    onToggleEmergency: () => void;
    onCancel: () => void;
    onReactivate: () => void;
}

export const AppointmentActionPanel: React.FC<AppointmentActionPanelProps> = ({
    appointment,
    onEdit,
    onToggleAvailability,
    onTogglePayment,
    onToggleTreated,
    onToggleEmergency,
    onCancel,
    onReactivate,
}) => {
    const { theme, isDark } = useTheme();
    const { showDialog, hideDialog } = useDialog();

    const handleAction = (
        validationFn: (appt: Appointment) => ActionValidation,
        actionFn: () => void,
        title: string,
        variant: 'default' | 'destructive' = 'default'
    ) => {
        const validation = validationFn(appointment);
        if (!validation.allowed) {
            haptics.error();
            showDialog({
                title: 'Action Not Allowed',
                description: validation.message,
                variant: 'danger',
                primaryAction: { label: 'OK', onPress: hideDialog }
            });
            return;
        }

        if (validation.needsConfirmation) {
            haptics.selection();
            showDialog({
                title,
                description: validation.message || 'Are you sure you want to proceed?',
                variant: variant === 'destructive' ? 'danger' : 'default',
                primaryAction: {
                    label: 'Confirm',
                    onPress: () => {
                        hideDialog();
                        haptics.impact();
                        actionFn();
                    }
                },
                secondaryAction: {
                    label: 'Cancel',
                    onPress: hideDialog
                }
            });
        } else {
            haptics.impact();
            actionFn();
        }
    };

    const actions = useMemo(() => [
        // EDIT
        {
            id: 'edit',
            label: 'Edit',
            subLabel: 'Details',
            icon: Edit2,

            // Aesthetic: Neutral/Primary flow
            activeTint: theme.palette.primary[50],
            activeBorder: theme.palette.primary[200],
            activeText: theme.palette.primary[700],

            onPress: () => handleAction(canEdit, onEdit, 'Edit Appointment'),
            isActive: false,
            isDestructive: false,
            isDisabled: appointment.treated || appointment.status === 'CANCELLED' || appointment.status === 'MISSED'
        },
        // ARRIVED
        {
            id: 'arrived',
            label: appointment.availableAtClinic ? 'Arrived' : 'Mark Arrived',
            subLabel: appointment.availableAtClinic ? 'Checked In' : 'Waiting',
            icon: MapPin,

            // Aesthetic: Blue (Info/Primary)
            activeTint: isDark ? theme.palette.primary[900] : theme.palette.primary[50],
            activeBorder: isDark ? theme.palette.primary[700] : theme.palette.primary[200],
            activeText: isDark ? theme.palette.primary[300] : theme.palette.primary[700],

            onPress: () => handleAction(
                appointment.availableAtClinic ? canMarkUnavailable : canMarkAvailable,
                () => onToggleAvailability(!appointment.availableAtClinic),
                appointment.availableAtClinic ? 'Undo Arrival' : 'Confirm Arrival'
            ),
            isActive: appointment.availableAtClinic,
            isDestructive: false
        },
        // TREATED
        {
            id: 'treated',
            label: appointment.treated ? 'Treated' : 'Mark Treated',
            subLabel: appointment.treated ? 'Completed' : 'Finish Visit',
            icon: CheckCircle2,

            // Aesthetic: Green (Secondary)
            activeTint: isDark ? theme.palette.secondary[900] : theme.palette.secondary[50], // Soft Mint
            activeBorder: isDark ? theme.palette.secondary[800] : theme.palette.secondary[200],
            activeText: isDark ? theme.palette.secondary[300] : theme.palette.secondary[700], // Deep Green

            onPress: () => handleAction(
                appointment.treated ? canMarkUntreated : canMarkTreated,
                onToggleTreated,
                appointment.treated ? 'Reopen Appointment' : 'Complete Appointment'
            ),
            isActive: appointment.treated,
            isDestructive: false
        },
        // PAID
        {
            id: 'paid',
            label: appointment.paymentStatus ? 'Paid' : 'Mark Paid',
            subLabel: appointment.paymentStatus ? 'Received' : 'Collect',
            icon: appointment.paymentStatus ? DollarSign : CreditCard,

            // Aesthetic: Amber/Orange (Warning)
            activeTint: isDark ? (theme.palette.warning[900] || '#451a03') : theme.palette.warning[50],
            activeBorder: isDark ? theme.palette.warning[700] : theme.palette.warning[500], // 800/200 don't exist
            activeText: isDark ? theme.palette.warning[500] : theme.palette.warning[700], // 400 doesn't exist

            onPress: () => handleAction(
                appointment.paymentStatus ? canMarkUnpaid : canMarkPaid,
                onTogglePayment,
                appointment.paymentStatus ? 'Undo Payment' : 'Confirm Payment'
            ),
            isActive: appointment.paymentStatus,
            isDestructive: false
        },
        // EMERGENCY
        {
            id: 'emergency',
            label: 'Emergency',
            subLabel: appointment.isEmergency ? 'Critical' : 'Priority',
            icon: Zap,

            // Aesthetic: Red (Error)
            activeTint: isDark ? theme.palette.error[900] : theme.palette.error[50],
            activeBorder: isDark ? theme.palette.error[900] : theme.palette.error[500], // 200 doesn't exist
            activeText: isDark ? theme.palette.error[500] : theme.palette.error[600], // 400 doesn't exist

            onPress: () => handleAction(canMarkEmergency, onToggleEmergency, 'Toggle Emergency Status', 'destructive'),
            isActive: appointment.isEmergency,
            isDestructive: true
        },
        // CANCEL / REACTIVATE
        (appointment.status === 'CANCELLED' || appointment.status === 'MISSED') ? {
            id: 'reactivate',
            label: 'Reactivate',
            subLabel: 'Booking',
            icon: RotateCcw,

            // Aesthetic: Success (Green)
            activeTint: isDark ? theme.palette.secondary[900] : theme.palette.secondary[50],
            activeBorder: isDark ? theme.palette.secondary[800] : theme.palette.secondary[200],
            activeText: isDark ? theme.palette.secondary[300] : theme.palette.secondary[700],

            onPress: () => handleAction(canReactivate, onReactivate, 'Reactivate Appointment'),
            isActive: false,
            isDestructive: false
        } : {
            id: 'cancel',
            label: 'Cancel',
            subLabel: 'Booking',
            icon: XCircle,

            // Aesthetic: Neutral/Gray (Destructive but inactive usually)
            activeTint: theme.palette.neutral[100],
            activeBorder: theme.palette.neutral[300],
            activeText: theme.palette.neutral[600],

            onPress: () => handleAction(canCancel, onCancel, 'Cancel Appointment', 'destructive'),
            isActive: false,
            isDestructive: true,
            isDisabled: appointment.treated
        },
    ], [appointment, theme, isDark, onEdit, onToggleAvailability, onTogglePayment, onToggleTreated, onToggleEmergency, onCancel, onReactivate]);

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text variant="h4" color={theme.text.primary}>Quick Actions</Text>
                {/* Removed duplicate Zap icon */}
            </View>

            <View style={styles.grid}>
                {actions.map((action) => {
                    const Icon = action.icon;
                    const isActive = action.isActive;
                    const isDisabled = (action as any).isDisabled;

                    // --- Aesthetic Logic ---
                    // Default State (Inactive): White/Dark Card + Neutral Border
                    let bgColor = theme.background.card;
                    let borderColor = theme.border.subtle; // Very subtle border
                    let titleColor = theme.text.primary;
                    let subColor = theme.text.tertiary;
                    let iconColor = theme.icon.default;

                    // Active State: Colored Tint + Colored Border + Colored Text
                    if (isActive) {
                        bgColor = action.activeTint;
                        borderColor = action.activeBorder;
                        titleColor = action.activeText;
                        subColor = action.activeText; // Match sublabel for premium monochrome look
                        iconColor = action.activeText;
                    }

                    // Specific override for "Cancel" (Destructive, inactive)
                    if (action.id === 'cancel') {
                        // Keep it clean but show red icon
                        iconColor = theme.status.error;
                    }

                    // Specific override for "Reactivate" (Success, inactive)
                    if (action.id === 'reactivate') {
                        iconColor = theme.status.success;
                    }

                    return (
                        <TouchableOpacity
                            key={action.id}
                            style={[
                                styles.actionButton,
                                {
                                    backgroundColor: bgColor,
                                    borderColor: borderColor,
                                    opacity: isDisabled ? 0.4 : 1,
                                }
                            ]}
                            onPress={action.onPress}
                            activeOpacity={0.7}
                            disabled={isDisabled}
                        >
                            <View style={styles.contentContainer}>
                                <View style={[
                                    styles.iconWrapper,
                                    // If Active: Transparent wrapper (icon floats on tinted card)
                                    // If Inactive: Subtle light background to anchor icon
                                    { backgroundColor: isActive ? 'transparent' : (isDark ? 'rgba(255,255,255,0.03)' : theme.palette.neutral[50]) }
                                ]}>
                                    <Icon size={20} color={iconColor} strokeWidth={2.5} />
                                </View>
                                <View style={styles.textContainer}>
                                    <Text
                                        style={[styles.label, { color: titleColor }]}
                                        numberOfLines={1}
                                    >
                                        {action.label}
                                    </Text>
                                    <Text
                                        style={[styles.subLabel, { color: subColor, opacity: isActive ? 0.8 : 1 }]}
                                        numberOfLines={1}
                                    >
                                        {action.subLabel}
                                    </Text>
                                </View>
                            </View>

                            {/* Active Checkmark (Subtle Aesthetic Detail) */}
                            {isActive && (
                                <View style={[styles.activeIndicator, { backgroundColor: action.activeText }]} />
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16, // More breathing room
        paddingHorizontal: 4,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    actionButton: {
        width: '48%',
        borderRadius: radius.l, // Soft rounded corners (16px usually)
        borderWidth: 1,
        // Refined shadow: very subtle, nearly flat
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03, // Minimal shadow
        shadowRadius: 4,
        elevation: 1,
    },
    contentContainer: {
        padding: 14, // Generous padding
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconWrapper: {
        width: 40,
        height: 40,
        borderRadius: radius.m, // 12px
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    label: {
        fontSize: 14,
        fontWeight: '600', // Semi-bold, not heavy
        marginBottom: 2,
        letterSpacing: -0.2, // Tighter tracking for modern look
    },
    subLabel: {
        fontSize: 11,
        fontWeight: '500',
    },
    activeIndicator: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 6,
        height: 6,
        borderRadius: 3,
        opacity: 0.5,
    }
});
