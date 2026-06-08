import React, { useEffect, useRef } from 'react';
import { TextInput, TextStyle, StyleProp } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import { createStyles } from '@/styles/components/ui/CountUpText.styles';

interface CountUpTextProps {
    value: number;
    suffix?: string;
    prefix?: string;
    duration?: number;
    style?: StyleProp<TextStyle>;
    trigger?: any;
}

export const CountUpText: React.FC<CountUpTextProps> = ({
    value,
    suffix = '',
    prefix = '',
    duration = 1000,
    style,
    trigger,
}) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const inputRef = useRef<TextInput>(null);
    const startTime = useRef<number | null>(null);
    const reqId = useRef<number | null>(null);

    const targetValue = typeof value === 'number' ? value : 0;

    useEffect(() => {
        startTime.current = null;

        const updateText = (text: string) => {
            if (inputRef.current) {
                if (typeof inputRef.current.setNativeProps === 'function') {
                    inputRef.current.setNativeProps({ text });
                } else {
                    // Web compatibility: direct DOM value manipulation
                    (inputRef.current as any).value = text;
                }
            }
        };

        updateText(`${prefix}0${suffix}`);

        if (targetValue <= 0) return;

        const animate = (timestamp: number) => {
            if (!startTime.current) startTime.current = timestamp;
            const progress = timestamp - startTime.current;
            const percent = Math.min(progress / duration, 1);

            const ease = percent * percent * percent;

            const nextVal = Math.floor(ease * targetValue);

            updateText(`${prefix}${nextVal}${suffix}`);

            if (percent < 1) {
                reqId.current = requestAnimationFrame(animate);
            } else {
                updateText(`${prefix}${targetValue}${suffix}`);
            }
        };

        reqId.current = requestAnimationFrame(animate);

        return () => {
            if (reqId.current) cancelAnimationFrame(reqId.current);
        };
    }, [targetValue, duration, suffix, prefix, trigger]);

    return (
        <TextInput
            ref={inputRef}
            editable={false}
            style={[styles.text, style]}
            defaultValue={`${prefix}0${suffix}`}
        />
    );
};
