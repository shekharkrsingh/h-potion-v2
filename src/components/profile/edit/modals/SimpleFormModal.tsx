import React, { useState, useMemo, memo } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/theme/ThemeContext';
import { createEditComponentStyles } from '@/styles/components/EditComponents.styles';
import { AlertCircle } from 'lucide-react-native';
import { FadeInView } from '@/components/ui/FadeInView';
import { VerificationBadge } from '@/components/ui/VerificationBadge';

interface FieldConfig {
    key: string;
    label: string;
    placeholder?: string;
    multiline?: boolean;
    keyboardType?: 'default' | 'numeric' | 'phone-pad' | 'email-address';
    validate?: (value: string) => string | null;
    maxLength?: number;
}

interface SimpleFormModalProps {
    fields: FieldConfig[];
    data: Record<string, any>;
    onUpdate: (key: string, value: any) => void;
    onSave: () => void;
    onClose: () => void;
    title: string;
    loading?: boolean;
    subtitle?: string;
    icon?: any;
    iconColor?: string;
}



// Memoized Form Row to prevent flickering
const FormRow = memo(({
    field,
    value,
    error,
    onChange,
    theme,
    styles
}: {
    field: FieldConfig;
    value: string;
    error: string | null;
    onChange: (val: string) => void;
    theme: any;
    styles: any;
}) => {
    const isDirty = value.length > 0;
    // Calculate validity based on dirty state and validate function
    const isValid = useMemo(() => {
        if (!isDirty) return false;
        return field.validate ? field.validate(value) === null : true;
    }, [isDirty, field, value]);

    return (
        <View style={styles.inputContainer}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.label}>{field.label}</Text>
            </View>

            <View style={{ justifyContent: 'center' }}>
                <TextInput
                    style={[
                        styles.premiumInput,
                        field.multiline && { height: 120, textAlignVertical: 'top' },
                        error ? { borderColor: theme.status.error } : (isValid ? { borderColor: theme.palette.primary[500] } : {}),
                        { paddingRight: isValid ? 40 : 16 }
                    ]}
                    value={value}
                    onChangeText={onChange}
                    placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                    placeholderTextColor={theme.text.tertiary}
                    multiline={field.multiline}
                    keyboardType={field.keyboardType || 'default'}
                    maxLength={field.maxLength}
                />

                {/* Badge placed absolutely to avoid layout shifts */}
                <VerificationBadge
                    visible={!!isValid}
                    color={theme.palette.primary[500]}
                    style={{ position: 'absolute', right: 12, top: field.multiline ? 12 : undefined }}
                />
                {error && (
                    <View style={{ position: 'absolute', right: 12 }}>
                        <AlertCircle size={20} color={theme.status.error} />
                    </View>
                )}
            </View>

            {
                error && (
                    <Text style={[styles.errorText, { color: theme.status.error, fontSize: 12, marginTop: 4, marginLeft: 4 }]}>
                        {error}
                    </Text>
                )
            }
        </View >
    );
});

export const SimpleFormModal: React.FC<SimpleFormModalProps> = ({
    fields,
    data,
    onUpdate,
    onSave,
    onClose,
    title,
    loading,
    subtitle,
    icon: Icon,
    iconColor
}) => {
    const { theme } = useTheme();
    const styles = useMemo(() => createEditComponentStyles(theme), [theme]);
    const [errors, setErrors] = useState<Record<string, string | null>>({});

    const handleTextChange = (key: string, val: string, validate?: (v: string) => string | null) => {
        onUpdate(key, val);
        if (validate) {
            const error = validate(val);
            setErrors(prev => ({ ...prev, [key]: error }));
        }
    };

    const hasErrors = Object.values(errors).some(err => err !== null);
    const allFieldsValid = fields.every(f => !f.validate || (f.validate(data[f.key]?.toString() || '') === null));

    return (
        <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            enableOnAndroid={true}
            extraScrollHeight={100}
            enableAutomaticScroll={true}
        >
            {Icon && (
                <View style={{ alignItems: 'center', marginBottom: 24, marginTop: 8 }}>
                    <View style={{
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        backgroundColor: iconColor ? `${iconColor}10` : `${theme.palette.primary[500]}10`,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 16
                    }}>
                        <Icon size={28} color={iconColor || theme.palette.primary[500]} />
                    </View>
                    <Text style={{ fontSize: 14, color: theme.text.tertiary, textAlign: 'center', paddingHorizontal: 20 }}>
                        {subtitle}
                    </Text>
                </View>
            )}

            {fields.map((field) => (
                <FormRow
                    key={field.key}
                    field={field}
                    value={data[field.key]?.toString() || ''}
                    error={errors[field.key] || null}
                    onChange={(val) => handleTextChange(field.key, val, field.validate)}
                    theme={theme}
                    styles={styles}
                />
            ))}

            <View style={{ marginTop: 20, gap: 12 }}>
                <Button
                    title={`Save ${title}`}
                    onPress={onSave}
                    isLoading={loading}
                    disabled={hasErrors || !allFieldsValid}
                    fullWidth
                    style={{ backgroundColor: theme.palette.primary[500] }}
                />
                <Button title="Cancel" variant="outline" onPress={onClose} fullWidth />
            </View>
        </KeyboardAwareScrollView>
    );
};
