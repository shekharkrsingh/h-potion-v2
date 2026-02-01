import { View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/ThemeContext';
import { spacing } from '@/theme/spacing';

export default function Home() {
    const router = useRouter();
    const { theme, toggleTheme, setThemeMode, isDark } = useTheme();

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: spacing.xl, justifyContent: 'center', backgroundColor: theme.background.default }}>
            <Text variant="h1" align="center" style={{ marginBottom: spacing.xl }}>H-Potion v2 Dev</Text>

            <View style={{ gap: spacing.m, marginBottom: spacing.xl }}>
                <Text variant="h3" align="center">Theme: {isDark ? 'Dark' : 'Light'}</Text>
                <View style={{ flexDirection: 'row', gap: spacing.s, justifyContent: 'center' }}>
                    <Button title="Toggle" onPress={toggleTheme} size="sm" variant="outline" />
                    <Button title="System" onPress={() => setThemeMode('system')} size="sm" variant="ghost" />
                </View>
            </View>

            <View style={{ gap: spacing.m }}>
                <Button title="Go to Login" onPress={() => router.push('/(auth)/login')} />
                <Button title="Go to Signup" onPress={() => router.push('/(auth)/signup')} variant="secondary" />
            </View>
        </ScrollView>
    );
}
