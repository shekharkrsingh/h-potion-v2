import { StyleSheet } from 'react-native';
import { ColorTheme } from '@/theme/colors';

export const createStyles = (theme: ColorTheme) => StyleSheet.create({
    container: {
        overflow: 'hidden',
    },
    shineWrapper: {
        position: 'absolute',
        top: -100,
        bottom: -100,
        width: 100,
    },
    shine: {
        flex: 1,
    },
});
