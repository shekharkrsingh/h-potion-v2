import { StyleSheet, Platform } from 'react-native';
import { ColorTheme } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';

export const createStyles = (theme: ColorTheme, isDark: boolean) => StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    overlay: {
        flex: 1,
        backgroundColor: isDark ? 'rgba(10, 10, 15, 0.4)' : 'rgba(255, 255, 255, 0.1)',
    },
    scrollView: {
        paddingHorizontal: spacing.l,
        paddingBottom: 120, // Space for FAB
    },
    header: {
        paddingTop: spacing.xl,
        paddingBottom: spacing.m,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitleContainer: {
        flex: 1,
        paddingRight: spacing.s,
    },
    iconContainer: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.03)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.s,
    },
    halfField: {
        flex: 1,
    },
    badgeContainer: {
        position: 'absolute',
        right: 16,
        top: '50%',
        marginTop: -10,
    },
    verificationBadge: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: theme.palette.primary[500],
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        borderRadius: radius.xl,
        padding: spacing.l,
        borderWidth: 1,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: isDark ? 0.3 : 0.1,
                shadowRadius: 12,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    divider: {
        height: 1,
        backgroundColor: theme.border.subtle,
        marginVertical: spacing.l,
        opacity: 0.5,
    },
    accordionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.l,
        borderRadius: radius.l,
        marginTop: spacing.l,
        borderWidth: 1,
        borderColor: theme.border.subtle,
    },
    footerContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: spacing.l,
        paddingBottom: Platform.OS === 'ios' ? spacing.xl + 10 : spacing.xl,
    },
    fabButton: {
        height: 56,
        borderRadius: 28,
        overflow: 'hidden',
    },
    gradientButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.xl,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.m,
        paddingVertical: spacing.s,
        borderRadius: radius.full,
        borderWidth: 1,
        marginRight: spacing.xs,
        marginBottom: spacing.xs,
    },
    dateTimeButton: {
        flex: 1,
        padding: spacing.m,
        borderRadius: radius.m,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    quickTimeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.s,
        marginTop: spacing.m,
    },
    emergencyCard: {
        marginTop: spacing.l,
        borderWidth: 1,
        borderColor: '#ef4444',
        backgroundColor: isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
    },
    headerEmergencyTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#ef4444',
        letterSpacing: -0.5,
    },
    reasonChipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.s,
        marginBottom: spacing.m,
    },
    medicalChipsContainer: {
        flexDirection: 'row',
        gap: spacing.s,
        marginTop: spacing.xs,
        marginBottom: spacing.m,
    },
    notesInput: {
        height: 250,
        textAlignVertical: 'top',
        paddingTop: spacing.s,
    },
    // Summary Modal Styles
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'flex-end',
    },
    summaryContainer: {
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        backgroundColor: isDark ? theme.background.card : '#FFF',
        overflow: 'hidden',
    },
    summaryContentWrapper: {
        padding: spacing.l,
        paddingBottom: Platform.OS === 'ios' ? 40 : spacing.l,
        minHeight: '40%',
    },
    summaryContent: {
        marginTop: spacing.l,
        gap: spacing.m,
    },
    summaryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.s,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    summaryIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.m,
    },
    summaryLabel: {
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 2,
    },
    summaryFooter: {
        marginTop: spacing.xl,
        gap: spacing.m,
    },
    modalContent: {
        width: '100%',
    },
    modalDragHandle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: theme.border.subtle,
        alignSelf: 'center',
        marginBottom: spacing.m,
        opacity: 0.5,
    },
    switchTrack: {
        width: 50,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        backgroundColor: theme.border.subtle,
        padding: 2,
    },
    switchTrackActive: {
        backgroundColor: '#ef4444',
    },
    switchThumb: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#FFF',
        alignSelf: 'flex-start',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 2,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    switchThumbActive: {
        alignSelf: 'flex-end',
    },
    patientDetailsHeader: {
        marginBottom: spacing.m,
    },
    sectionRow: {
        flexDirection: 'row',
        gap: spacing.m,
    },
    emergencyToggleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    emergencyIconLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    charCount: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 4,
    },
    // Extracted
    backdropTouchable: {
        flex: 1,
    },
    summaryHeaderContainer: {
        paddingHorizontal: spacing.l,
    },
    summaryImageStyle: {
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
    },
    warningBanner: {
        flexDirection: 'row',
        padding: spacing.l,
        borderRadius: radius.l,
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.4)',
        backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.05)',
        marginBottom: spacing.l,
        alignItems: 'center',
        gap: spacing.m,
    },
    warningIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    doctorBanner: {
        flexDirection: 'row',
        padding: spacing.m,
        borderRadius: radius.l,
        borderWidth: 1,
        borderColor: 'rgba(14, 165, 233, 0.4)',
        backgroundColor: isDark ? 'rgba(14, 165, 233, 0.15)' : 'rgba(14, 165, 233, 0.05)',
        marginBottom: spacing.l,
        alignItems: 'center',
        gap: spacing.m,
    },
    doctorIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(14, 165, 233, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    }
});
