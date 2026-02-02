import React, { useRef, useEffect } from 'react';
import {
    View,
    Modal,
    Animated,
    TouchableOpacity,
    StyleSheet,
    Platform,
    Easing
} from 'react-native';
import {
    AlertCircle,
    Trash2,
    MapPin,
    Wifi,
    Clock
} from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { spacing } from '@/theme/spacing';
import { ColorTheme } from '@/theme/colors';
import { FilterOption } from './FilterOption';

interface BookingFilterModalProps {
    visible: boolean;
    onClose: () => void;
    activeFilter: string;
    setActiveFilter: (filter: any) => void;
    theme: ColorTheme;
    isDark: boolean;
    styles: any;
    insets: { bottom: number };
}

export const BookingFilterModal = ({
    visible,
    onClose,
    activeFilter,
    setActiveFilter,
    theme,
    isDark,
    styles,
    insets
}: BookingFilterModalProps) => {
    const modalAnim = useRef(new Animated.Value(0)).current;
    const [innerVisible, setInnerVisible] = React.useState(visible);

    useEffect(() => {
        if (visible) {
            setInnerVisible(true);
            Animated.timing(modalAnim, {
                toValue: 1,
                duration: 400,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(modalAnim, {
                toValue: 0,
                duration: 300,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                useNativeDriver: true,
            }).start(({ finished }) => {
                if (finished) {
                    setInnerVisible(false);
                }
            });
        }
    }, [visible]);

    if (!innerVisible && (modalAnim as any)._value === 0) return null;

    return (
        <Modal
            visible={innerVisible}
            transparent
            statusBarTranslucent={true}
            onRequestClose={onClose}
            animationType="none"
        >
            <Animated.View
                style={[
                    styles.modalBackdrop,
                    {
                        opacity: modalAnim,
                        backgroundColor: 'rgba(0,0,0,0.5)'
                    }
                ]}
            >
                <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={onClose}
                    activeOpacity={1}
                />
                <Animated.View
                    style={[
                        styles.summaryContainer,
                        {
                            transform: [{
                                translateY: modalAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [600, 0]
                                })
                            }],
                            width: '100%',
                            minHeight: '35%'
                        }
                    ]}
                >
                    <View
                        style={[
                            styles.modalContent,
                            {
                                paddingBottom: Math.max(insets.bottom, spacing.l),
                                paddingHorizontal: spacing.l,
                                paddingTop: spacing.m
                            }
                        ]}
                    >
                        <View style={{ width: 32, height: 4, borderRadius: 2, backgroundColor: theme.border.default, alignSelf: 'center', marginBottom: spacing.m, opacity: 0.3 }} />

                        <View style={{ marginBottom: spacing.m }}>
                            <Text variant="bodyLarge" weight="bold">Filter Appointments</Text>
                            <Text variant="bodySmall" color={theme.text.tertiary} style={{ marginTop: 2 }}>Refine your appointment list</Text>
                        </View>

                        <View style={{ marginBottom: spacing.m }}>
                            <Text style={[styles.modalHeaderText, { fontSize: 10, marginBottom: spacing.xs, letterSpacing: 2 }]}>
                                Status
                            </Text>
                            <View style={{ gap: spacing.xs }}>
                                <FilterOption
                                    label="Emergency"
                                    value="emergency"
                                    activeFilter={activeFilter}
                                    icon={<AlertCircle size={16} />}
                                    theme={theme}
                                    styles={styles}
                                    setActiveFilter={setActiveFilter}
                                    setShowFilterModal={(show) => !show && onClose()}
                                    color={theme.status.error}
                                />
                                <FilterOption
                                    label="Cancelled"
                                    value="cancelled"
                                    activeFilter={activeFilter}
                                    icon={<Trash2 size={16} />}
                                    theme={theme}
                                    styles={styles}
                                    setActiveFilter={setActiveFilter}
                                    setShowFilterModal={(show) => !show && onClose()}
                                    color={isDark ? theme.text.tertiary : '#64748b'}
                                />
                                <FilterOption
                                    label="Pending"
                                    value="pending"
                                    activeFilter={activeFilter}
                                    icon={<Clock size={16} />}
                                    theme={theme}
                                    styles={styles}
                                    setActiveFilter={setActiveFilter}
                                    setShowFilterModal={(show) => !show && onClose()}
                                    color={theme.palette.warning[500]}
                                />
                            </View>
                        </View>

                        <View style={{ marginBottom: spacing.xs }}>
                            <Text style={[styles.modalHeaderText, { fontSize: 10, marginBottom: spacing.xs, letterSpacing: 2 }]}>
                                Mode
                            </Text>
                            <View style={{ gap: spacing.xs }}>
                                <FilterOption
                                    label="In-Person"
                                    value="in-person"
                                    activeFilter={activeFilter}
                                    icon={<MapPin size={16} />}
                                    theme={theme}
                                    styles={styles}
                                    setActiveFilter={setActiveFilter}
                                    setShowFilterModal={(show) => !show && onClose()}
                                    color={theme.palette.primary[500]}
                                />
                                <FilterOption
                                    label="Online"
                                    value="online"
                                    activeFilter={activeFilter}
                                    icon={<Wifi size={16} />}
                                    theme={theme}
                                    styles={styles}
                                    setActiveFilter={setActiveFilter}
                                    setShowFilterModal={(show) => !show && onClose()}
                                    color="#0EA5E9"
                                />
                            </View>
                        </View>
                    </View>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
};
