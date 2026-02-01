import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Shield, Mail, Clock, XCircle } from 'lucide-react-native';
import { Invitation } from '@/services/teamService';
import { ColorTheme } from '@/theme/colors';
import { FadeInView } from '@/components/ui/FadeInView';
import { formatDate } from '@/utils/date';
import { createStyles } from '@/styles/screens/MyTeamScreen.styles';

interface InvitationCardProps {
    item: Invitation;
    index: number;
    theme: ColorTheme;
    onRevoke: (id: string) => void;
}

export const InvitationCard = React.memo(({ item, index, theme, onRevoke }: InvitationCardProps) => {
    const styles = React.useMemo(() => createStyles(theme), [theme]);

    const itemStatus = item.status?.toUpperCase() || 'INVITED';
    const isExpired = itemStatus === 'EXPIRED';
    const isRevoked = itemStatus === 'REVOKED';

    const badgeColor = isExpired || isRevoked ? theme.status.error : theme.status.warning;
    const badgeBg = isExpired || isRevoked ? theme.status.errorBg : theme.status.warningBg;

    const actualActionId = item.id || item.invitationId;
    const itemId = item.id || item.invitationId || `inv-${index}`;
    const displayName = item.firstName ? `${item.firstName} ${item.lastName || ''}`.trim() : item.email;

    return (
        <FadeInView key={itemId} delay={index * 50}>
            <View style={[styles.card, (isExpired || isRevoked) && { opacity: 0.7 }]}>
                <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                        <Mail size={22} color={theme.palette.primary[500]} />
                    </View>
                </View>

                <View style={styles.cardContent}>
                    <View style={styles.headerRow}>
                        <Text style={styles.name} numberOfLines={1}>{displayName}</Text>
                    </View>

                    <View style={[styles.subtextRow, { marginBottom: 4 }]}>
                        <View style={[styles.statusBadge, { backgroundColor: badgeBg, borderColor: badgeColor }]}>
                            <Text style={[styles.statusText, { color: badgeColor }]}>{itemStatus}</Text>
                        </View>
                        {item.role && (
                            <>
                                <View style={{ width: 8 }} />
                                <Shield size={12} color={theme.text.tertiary} />
                                <Text style={styles.subtext}>{item.role}</Text>
                            </>
                        )}
                    </View>

                    <View style={styles.subtextRow}>
                        <Clock size={12} color={theme.text.tertiary} />
                        <Text style={styles.subtext}>Sent: {formatDate(item.createdAt || item.sentAt)}</Text>
                        {item.expiresAt && (
                            <>
                                <View style={{ width: 8 }} />
                                <XCircle size={12} color={theme.text.tertiary} />
                                <Text style={styles.subtext}>Exp: {formatDate(item.expiresAt)}</Text>
                            </>
                        )}
                    </View>
                    {item.firstName && (
                        <View style={[styles.subtextRow, { marginTop: 2 }]}>
                            <Mail size={12} color={theme.text.tertiary} />
                            <Text style={styles.subtext} numberOfLines={1}>{item.email}</Text>
                        </View>
                    )}
                </View>

                <TouchableOpacity
                    style={styles.actionButton}
                    activeOpacity={0.6}
                    onPress={() => actualActionId && onRevoke(actualActionId)}
                >
                    <XCircle size={20} color={theme.status.error} />
                </TouchableOpacity>
            </View>
        </FadeInView>
    );
});
