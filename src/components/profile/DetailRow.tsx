import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { CountUpText } from '@/components/ui/CountUpText';
import { ColorTheme } from '@/theme/colors';

interface DetailRowProps {
    label: string;
    value: string;
    theme: ColorTheme;
    styles: any;
    icon?: any;
}

export const DetailRow = React.memo(({ label, value, theme, styles, icon: Icon }: DetailRowProps) => (
    <View style={styles.detailRow}>
        {Icon && (
            <View style={styles.detailIconContainer}>
                <Icon size={16} color={theme.palette.primary[500]} />
            </View>
        )}
        <View style={styles.detailTextContainer}>
            <Text variant="caption" color={theme.text.tertiary} style={styles.detailLabel}>{label}</Text>
            {(() => {
                const valStr = value?.toString() || '';
                const numericStr = valStr.replace(/[^0-9.]/g, '');
                const numericVal = parseFloat(numericStr);

                const isLikelyCountable = !isNaN(numericVal) &&
                    !label.toLowerCase().includes('date') &&
                    !label.toLowerCase().includes('id') &&
                    !label.toLowerCase().includes('phone') &&
                    !label.toLowerCase().includes('contact') &&
                    !label.toLowerCase().includes('address') &&
                    !valStr.includes('.') &&
                    numericStr.length > 0;

                if (isLikelyCountable) {
                    const suffix = valStr.includes('%') ? '%' : valStr.toLowerCase().includes('years') ? ' Years' : '';
                    const prefix = valStr.includes('₹') ? '₹' : valStr.includes('$') ? '$' : '';

                    return (
                        <CountUpText
                            value={numericVal}
                            suffix={suffix}
                            prefix={prefix}
                            style={[styles.detailValue, { color: theme.text.primary }]}
                        />
                    );
                }
                return (
                    <Text variant="bodyMedium" weight="medium" color={theme.text.primary} style={styles.detailValue}>
                        {value}
                    </Text>
                );
            })()}
        </View>
    </View>
));
