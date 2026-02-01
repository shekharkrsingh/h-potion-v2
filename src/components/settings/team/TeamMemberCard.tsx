import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Crown, Shield, Mail, Calendar, MoreVertical } from 'lucide-react-native';
import { Collaborator } from '@/services/teamService';
import { ColorTheme } from '@/theme/colors';
import { FadeInView } from '@/components/ui/FadeInView';
import { formatDate } from '@/utils/date';
import { createStyles } from '@/styles/screens/MyTeamScreen.styles';

interface TeamMemberCardProps {
    item: Collaborator;
    index: number;
    theme: ColorTheme;
    onAction: (id: string, name: string) => void;
}

export const TeamMemberCard = React.memo(({ item, index, theme, onAction }: TeamMemberCardProps) => {
    const styles = React.useMemo(() => createStyles(theme), [theme]);

    const itemStatus = item.status?.toUpperCase();
    const isActive = itemStatus === 'ACTIVE' || itemStatus === 'ACTIVATED';
    const badgeColor = isActive ? theme.status.success : theme.palette.neutral[500];
    const badgeBg = isActive ? theme.status.successBg : theme.background.subtle;
    const actualActionId = item.id || item.collaboratorId;
    const itemId = item.id || item.collaboratorId || `collab-${index}`;

    return (
        <FadeInView key={itemId} delay={index * 50}>
            <View style={styles.card}>
                <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                        {item.profilePicture ? (
                            <View style={{ width: '100%', height: '100%', borderRadius: 25, backgroundColor: theme.palette.primary[100] }} />
                        ) : (
                            <Text style={styles.avatarText}>
                                {item.firstName?.[0]}{item.lastName?.[0]}
                            </Text>
                        )}
                    </View>
                </View>

                <View style={styles.cardContent}>
                    <View style={styles.headerRow}>
                        <Text style={styles.name} numberOfLines={1}>{item.firstName} {item.lastName}</Text>
                    </View>

                    <View style={[styles.subtextRow, { marginBottom: 4 }]}>
                        {item.role === 'OWNER' ? (
                            <Crown size={12} color={theme.palette.warning[500]} />
                        ) : (
                            <Shield size={12} color={theme.text.tertiary} />
                        )}
                        <Text style={styles.subtext}>{item.role || 'Member'}</Text>
                        <View style={{ width: 8 }} />
                        <View style={[styles.statusBadge, { backgroundColor: badgeBg, borderColor: badgeColor }]}>
                            <Text style={[styles.statusText, { color: badgeColor }]}>
                                {isActive ? 'Active' : (itemStatus || 'Inactive')}
                            </Text>
                        </View>
                        {(item.createdAt || item.joinedAt) && (
                            <>
                                <View style={{ width: 8 }} />
                                <Calendar size={12} color={theme.text.tertiary} />
                                <Text style={styles.subtext}>{formatDate(item.createdAt || item.joinedAt)}</Text>
                            </>
                        )}
                    </View>

                    <View style={styles.subtextRow}>
                        <Mail size={12} color={theme.text.tertiary} />
                        <Text style={styles.subtext} numberOfLines={1}>{item.email}</Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.actionButton}
                    activeOpacity={0.6}
                    onPress={() => actualActionId && onAction(actualActionId, item.firstName)}
                >
                    <MoreVertical size={20} color={theme.text.tertiary} />
                </TouchableOpacity>
            </View>
        </FadeInView>
    );
});
