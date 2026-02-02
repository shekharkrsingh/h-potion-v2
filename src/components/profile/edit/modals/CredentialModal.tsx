import React from 'react';
import { View, TouchableOpacity, TextInput } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Trash2, Plus } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/theme/ThemeContext';
import { createEditComponentStyles } from '@/styles/components/EditComponents.styles';

interface CredentialModalProps {
    type: 'education' | 'awards';
    items: string[];
    onUpdateItems: (items: string[]) => void;
    onSave: () => void;
    onClose: () => void;
    loading?: boolean;
}

export const CredentialModal: React.FC<CredentialModalProps> = ({
    type,
    items,
    onUpdateItems,
    onSave,
    onClose,
    loading
}) => {
    const { theme } = useTheme();
    const styles = React.useMemo(() => createEditComponentStyles(theme), [theme]);
    const [newItem, setNewItem] = React.useState('');

    const addItem = () => {
        if (newItem.trim()) {
            onUpdateItems([...items, newItem.trim()]);
            setNewItem('');
        }
    };

    const removeItem = (index: number) => {
        onUpdateItems(items.filter((_, i) => i !== index));
    };

    return (
        <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            enableOnAndroid={true}
            extraScrollHeight={100}
            enableAutomaticScroll={true}
        >
            <View style={styles.inputContainer}>
                <Text style={styles.label}>
                    {type === 'education' ? 'Educational Background' : 'Achievements & Awards'}
                </Text>

                <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
                    <TextInput
                        style={[styles.premiumInput, { flex: 1 }]}
                        placeholder={`Add new ${type === 'education' ? 'qualification' : 'award'}...`}
                        placeholderTextColor={theme.text.tertiary}
                        value={newItem}
                        onChangeText={setNewItem}
                    />
                    <TouchableOpacity
                        style={[styles.editProfileButton, { position: 'relative', borderBottomWidth: 0 }]}
                        onPress={addItem}
                    >
                        <Plus size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>

                {items.map((item, index) => (
                    <View key={index} style={[styles.premiumInput, { flexDirection: 'row', alignItems: 'center', marginBottom: 8 }]}>
                        <Text style={{ flex: 1 }}>{item}</Text>
                        <TouchableOpacity onPress={() => removeItem(index)}>
                            <Trash2 size={16} color={theme.status.error} />
                        </TouchableOpacity>
                    </View>
                ))}
            </View>

            <View style={{ marginTop: 20, gap: 12 }}>
                <Button title="Save Changes" onPress={onSave} isLoading={loading} fullWidth />
                <Button title="Cancel" variant="outline" onPress={onClose} fullWidth />
            </View>
        </KeyboardAwareScrollView>
    );
};
